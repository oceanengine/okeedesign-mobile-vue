import Vue from 'vue';
import { context } from './context';
import { TouchMixin } from '../touch';
import { PortalMixin } from '../portal';
import { openOverlay, closeOverlay, updateOverlay } from './overlay';
import { on, off, preventDefault } from '../../utils/dom/event';
import { getScrollEventTarget } from '../../utils/dom/scroll';
import { createBrandName } from '../../utils';

const EventBus = new Vue();

export function closeAll() {
  EventBus.$emit('close');
}

declare module 'vue' {
  interface VueConstructor {
    closeAllPopups?: () => void;
  }
}

Vue.closeAllPopups = closeAll;
Vue.prototype.$closeAllPopups = closeAll;

export const PopupMixin = {
  mixins: [
    TouchMixin,
    PortalMixin({
      afterPortal() {
        if (this.overlay) {
          updateOverlay();
        }
      },
    }),
  ],

  props: {
    // whether to show popup
    value: Boolean,
    // whether to show overlay
    overlay: Boolean,
    // overlay custom style
    overlayStyle: Object,
    // overlay custom class name
    overlayClass: String,
    // whether to close popup when click overlay
    closeOnClickOverlay: Boolean,
    // prevent body scroll
    lockScroll: {
      type: Boolean,
      default: true,
    },
    // whether to lazy render
    lazyRender: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      inited: this.value,
      opened: false,
    };
  },

  computed: {
    shouldRender() {
      return this.inited || !this.lazyRender;
    },
  },

  watch: {
    value(val) {
      const type = val ? 'open' : 'close';
      this.inited = this.inited || this.value;
      this[type]();
      this.$emit(type);
    },

    overlay() {
      this.renderOverlay();
    },
  },
  created() {
    EventBus.$on('close', this.close);
  },
  mounted() {
    if (this.value) {
      this.open();
    }
  },

  activated() {
    if (this.value) {
      this.open();
    }
  },

  beforeDestroy() {
    this.close();
    EventBus.$off('close', this.close);

    if (this.getContainer || this.appendToBody) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  methods: {
    open() {
      if (this.opened) return;

      const brandName = createBrandName();

      this.opened = true;
      this.renderOverlay();

      if (this.lockScroll) {
        on(document, 'touchstart', this.touchStart);
        on(document, 'touchmove', this.onTouchMove);

        if (!context.lockCount) {
          document.body.classList.add(`${brandName}overflow-hidden`);
        }

        context.lockCount++;
      }
    },

    close(this: any) {
      if (!this.opened) return;

      const brandName = createBrandName();

      if (this.lockScroll) {
        context.lockCount--;
        off(document, 'touchstart', this.touchStart);
        off(document, 'touchmove', this.onTouchMove);

        if (!context.lockCount) {
          document.body.classList.remove(`${brandName}overflow-hidden`);
        }
      }

      this.opened = false;
      closeOverlay(this);

      if (this.value === true) {
        this.$emit('input', false);
      }
    },

    onTouchMove(this: any, event) {
      this.touchMove(event);

      /**
       * 不滚动元素 - 阻止默认行为
       * 含滚动元素 - 阻止事件冒泡
       *
       */
      const direction = this.deltaY > 0 ? '10' : '01';
      const el = getScrollEventTarget(event.target, this.$el);
      const { scrollHeight, offsetHeight, scrollTop } = el as any;
      let status = '11';

      if (scrollTop === 0) {
        status = offsetHeight >= scrollHeight ? '00' : '01';
      } else if (scrollTop + offsetHeight >= scrollHeight) {
        status = '10';
      }

      if (status !== '11' && !(parseInt(status, 2) & parseInt(direction, 2))) {
        preventDefault(event, true);
      }
    },

    renderOverlay() {
      if (!this.value) {
        return;
      }

      if (this.overlay) {
        openOverlay(this, {
          zIndex: context.zIndex++,
          duration: this.duration,
          className: this.overlayClass,
          customStyle: this.overlayStyle,
        });
      } else {
        closeOverlay(this);
      }

      this.updateZIndex();
    },

    updateZIndex() {
      this.$nextTick(() => {
        this.$el.style.zIndex = context.zIndex++;
      });
    },
  },
};
