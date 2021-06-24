import Vue, { PropType } from 'vue';
import { CombinedVueInstance, ExtendedVue } from 'vue/types/vue';
import { GetContainer } from './popup/type';

function getElement(selector: string | GetContainer): Element | null {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }

  return selector();
}

interface PortalMixinOptions {
  afterPortal?: () => void;
}

export interface PortalMixinProps {
  getContainer?: string | GetContainer;
  appendToBody?: boolean;
}

export interface PortalMixinMethods {
  portal(): void;
}

export type PortalMixinInstance = CombinedVueInstance<
  Vue,
  {},
  PortalMixinMethods,
  {},
  PortalMixinProps
>;

export type PortalMixinExtended = ExtendedVue<Vue, {}, PortalMixinMethods, {}, PortalMixinProps>;

export function PortalMixin({ afterPortal }: PortalMixinOptions): PortalMixinExtended {
  return Vue.extend<{}, PortalMixinMethods, {}, PortalMixinProps>({
    props: {
      /* eslint-disable */
      getContainer: [String, Function] as PropType<string | GetContainer>,
      // whether append to dom-body
      appendToBody: Boolean,
    },

    watch: {
      getContainer() {
        this.portal();
      },
    },

    mounted() {
      if (this.getContainer || this.appendToBody) {
        this.portal();
      }
    },

    methods: {
      portal() {
        const { getContainer } = this;

        let container;
        if (getContainer) {
          container = getElement(getContainer);
        } else if (this.appendToBody) {
          container = getElement('body');
        } else if (this.$parent) {
          container = this.$parent.$el;
        }

        if (container && container !== this.$el.parentNode) {
          container.appendChild(this.$el);
        }

        if (afterPortal) {
          afterPortal.call(this);
        }
      },
    },
  });
}
