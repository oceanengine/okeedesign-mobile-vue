import { createNamespace, createBrandName, isDef } from '../../utils';
import { raf, doubleRaf } from '../../utils/dom/raf';
import Cell from '../cell';
import { cellProps, SharedCellProps } from '../cell/shared';
import { ChildrenMixin } from '../../mixins/relation';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

export type CollapseItemProps = SharedCellProps & {
  name: number | string;
  disabled: boolean;
  message: string;
  isLink: boolean;
};

export interface CollapseItemEvents {}

export type CollapseItemScopedSlots = DefaultSlots & {
  title: ScopedSlot;
  icon: ScopedSlot;
  'right-icon': ScopedSlot;
};

const [createComponent, bem] = createNamespace('collapse-item');
const CELL_SLOTS = ['title', 'icon', 'right-icon'];

export default createComponent<CollapseItemProps, CollapseItemEvents, CollapseItemScopedSlots>({
  mixins: [ChildrenMixin('bytedCollapse')],

  props: {
    ...cellProps,
    name: [Number, String],
    disabled: Boolean,
    message: String,
    isLink: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      show: null,
      inited: null,
    };
  },

  computed: {
    currentName() {
      return isDef(this.name) ? this.name : this.index;
    },

    expanded() {
      if (!this.parent) {
        return null;
      }

      const { value } = this.parent;
      return this.parent.accordion
        ? value === this.currentName
        : value.some(name => name === this.currentName);
    },
  },

  created() {
    this.show = this.expanded;
    this.inited = this.expanded;
  },

  watch: {
    expanded(expanded, prev) {
      if (prev === null) {
        return;
      }

      if (expanded) {
        this.show = true;
        this.inited = true;
      }

      const nextTick = expanded ? this.$nextTick : raf;

      nextTick(() => {
        const { content, wrapper } = this.$refs;
        if (!content || !wrapper) {
          return;
        }

        const { offsetHeight } = content;
        if (offsetHeight) {
          const contentHeight = `${offsetHeight}px`;
          wrapper.style.height = expanded ? 0 : contentHeight;

          doubleRaf(() => {
            wrapper.style.height = expanded ? contentHeight : 0;
          });
        } else {
          this.onTransitionEnd();
        }
      });
    },
  },

  methods: {
    onClick(this: any) {
      if (this.disabled) {
        return;
      }

      const { parent } = this;
      const name = parent.accordion && this.currentName === parent.value ? '' : this.currentName;
      this.parent.switch(name, !this.expanded);
    },

    onTransitionEnd(this: any) {
      if (!this.expanded) {
        this.show = false;
      } else {
        this.$refs.wrapper.style.height = '';
      }
    },
  },

  render(this: any) {
    const brandName = createBrandName();
    const { disabled, expanded, message } = this;

    const titleSlots = CELL_SLOTS.reduce((slots, name) => {
      if (this.slots(name)) {
        slots[name] = () => this.slots(name);
      }
      return slots;
    }, {}) as any;

    if (this.slots('value')) {
      titleSlots.default = () => this.slots('value');
    }

    const Title = (
      <Cell
        class={bem('title', { disabled, expanded })}
        onClick={this.onClick}
        scopedSlots={titleSlots}
        {...{ props: this.$props }}
      />
    );

    const Message = this.slots() || (message && <div class={bem('message')}>{message}</div>);

    const Content = this.inited && (
      <div
        vShow={this.show}
        ref="wrapper"
        class={bem('wrapper')}
        onTransitionend={this.onTransitionEnd}
      >
        <div ref="content" class={bem('content')}>
          {Message}
        </div>
      </div>
    );

    return (
      <div class={[bem(), { [`${brandName}hairline--top`]: this.index }]}>
        {Title}
        {Content}
      </div>
    );
  },
});
