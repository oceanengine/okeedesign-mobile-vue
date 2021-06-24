import { createNamespace, isDef } from '../../utils';
import { ChildrenMixin } from '../../mixins/relation';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

export type TabProps = {
  name: number | string;
  title: string;
  info: number | string;
  disabled: boolean;
};

export interface TabScopedSlots extends DefaultSlots {
  title: ScopedSlot;
}

const [createComponent, bem] = createNamespace('tab');

export default createComponent<TabProps, {}, TabScopedSlots>({
  mixins: [ChildrenMixin('bytedTabs')],

  props: {
    name: [Number, String],
    title: String,
    info: {
      type: [String, Number],
      default: '',
    },
    disabled: Boolean,
  },

  data() {
    return {
      inited: false,
    };
  },

  computed: {
    computedName() {
      return isDef(this.name) ? this.name : this.index;
    },

    isActive() {
      return this.computedName === this.parent.currentName;
    },

    touchable() {
      return this.parent.touchable && !this.parent.swipeable && !this.parent.controlled;
    },
  },

  watch: {
    'parent.currentIndex'() {
      this.inited = this.inited || this.isActive;
    },

    title() {
      this.parent.setLine();
    },
  },

  mounted() {
    if (this.slots('title')) {
      this.parent.renderTitle(this.$refs.title, this.index);
    }
  },

  render(this: any) {
    const { slots, isActive } = this;
    const shouldRender = this.inited || !this.parent.lazyRender;
    const Content = [shouldRender ? slots() : null];

    if (slots('title')) {
      Content.push(<div ref="title">{slots('title')}</div>);
    }

    if (this.parent.animated) {
      return (
        <div class={bem('pane-wrapper', { inactive: !isActive })}>
          <div class={bem('pane')}>{Content}</div>
        </div>
      );
    }

    if (this.touchable) {
      return <div class={bem('pane')}>{slots()}</div>;
    }

    return (
      <div vShow={isActive} class={bem('pane')}>
        {Content}
      </div>
    );
  },
});
