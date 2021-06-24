import { createNamespace, createBrandName, isDef } from '../../utils';
import { PopupMixin } from '../../mixins/popup';

const [createComponent, bem] = createNamespace('toast');

import { DefaultSlots } from '../../utils/types';

type ToastTypes = 'text' | 'success' | 'warning' | 'error' | 'loading';

export interface ToastProps {
  icon: string;
  message: number | string;
  forbidClick: boolean;
  type: ToastTypes;
  position: string;
  lockScroll: boolean;
}

export interface ToastEvents {
  onOpened(): void;
  onClosed(): void;
}

export interface ToastScopedSlots extends DefaultSlots {}

const types: ToastTypes[] = ['text', 'success', 'warning', 'error', 'loading'];

export default createComponent<ToastProps, ToastEvents, ToastScopedSlots>({
  mixins: [PopupMixin],

  props: {
    icon: String,
    message: [Number, String],
    forbidClick: Boolean,
    type: {
      type: String,
      default: types[0],
      validator: value => {
        return types.indexOf(value) > -1;
      },
    },
    position: {
      type: String,
      default: 'middle',
    },
    lockScroll: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      clickable: false,
    };
  },

  mounted() {
    this.toggleClickable();
  },

  destroyed() {
    this.toggleClickable();
  },

  watch: {
    value() {
      this.toggleClickable();
    },

    forbidClick() {
      this.toggleClickable();
    },
  },

  methods: {
    toggleClickable(this: any) {
      const brandName = createBrandName();

      const clickable = this.value && this.forbidClick;
      if (this.clickable !== clickable) {
        this.clickable = clickable;
        const action = clickable ? 'add' : 'remove';
        document.body.classList[action](`${brandName}toast--unclickable`);
      }
    },

    onAfterEnter(this: any) {
      this.$emit('opened');
      if (this.onOpened) {
        this.onOpened();
      }
    },

    onAfterLeave(this: any) {
      this.$emit('closed');
    },
  },

  render(this: any) {
    const brandName = createBrandName();

    const { type, icon, message } = this;

    const hasIcon = icon || (types.indexOf(type) > -1 && type !== 'text');

    function ToastIcon() {
      const isLaoding = type === 'loading';
      const fill = isLaoding ? '#0278FF' : '#ffffff';
      if (hasIcon) {
        return (
          <i
            class={[bem('icon'), { [`${brandName}loading-circle`]: isLaoding }]}
            style={{ fill, width: '1.5rem', height: '1.5rem' }}
            domPropsInnerHTML={require(`!html-loader!./icon/${type}.svg`)}
          ></i>
        );
      }
    }

    function Message() {
      if (!isDef(message) || message === '') {
        return;
      }

      return <div class={bem('text')}>{message}</div>;
    }

    return (
      <transition
        name={`${brandName}fade`}
        onAfterEnter={this.onAfterEnter}
        onAfterLeave={this.onAfterLeave}
      >
        <div vShow={this.value} class={[bem([this.position, { text: !hasIcon }])]}>
          {ToastIcon()}
          {Message()}
        </div>
      </transition>
    );
  },
});
