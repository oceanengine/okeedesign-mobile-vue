import { createNamespace } from '../../utils';
import { range } from '../../utils/format/number';
import { preventDefault } from '../../utils/dom/event';
import { TouchMixin } from '../../mixins/touch';
import { ClickOutsideMixin } from '../../mixins/click-outside';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

const [createComponent, bem] = createNamespace('swipe-cell');
const THRESHOLD = 0.15;

export interface SwipeCellProps {
  onClose: any;
  disabled: boolean;
  leftWidth: number;
  rightWidth: number;
  async: boolean;
  name: number | string;
}

export interface SwipeCellEvents {
  onClick(): void;
  onClose: any;
}

export type SwipeCellScopedSlots = DefaultSlots & {
  left?: ScopedSlot;
  right?: ScopedSlot;
};

export default createComponent<SwipeCellProps, SwipeCellEvents, SwipeCellScopedSlots>({
  mixins: [
    TouchMixin,
    ClickOutsideMixin({
      event: 'touchstart',
      method: 'onClick',
    }),
  ],

  props: {
    onClose: Function,
    disabled: Boolean,
    leftWidth: Number,
    rightWidth: Number,
    async: Boolean,
    name: {
      type: [Number, String],
      default: '',
    },
  },

  data() {
    return {
      offset: 0,
      dragging: false,
    };
  },

  computed: {
    computedLeftWidth() {
      return this.leftWidth || this.getWidthByRef('left');
    },

    computedRightWidth() {
      return this.rightWidth || this.getWidthByRef('right');
    },
  },

  methods: {
    getWidthByRef(this: any, ref) {
      if (this.$refs[ref]) {
        const rect = this.$refs[ref].getBoundingClientRect();
        return rect.width;
      }

      return 0;
    },

    open(this: any, position) {
      const offset = position === 'left' ? this.computedLeftWidth : -this.computedRightWidth;
      this.swipeMove(offset);
      this.resetSwipeStatus();
    },

    close(this: any) {
      this.offset = 0;
    },

    resetSwipeStatus(this: any) {
      this.swiping = false;
      this.opened = true;
    },

    swipeMove(this: any, offset = 0) {
      this.offset = range(offset, -this.computedRightWidth, this.computedLeftWidth);

      if (this.offset) {
        this.swiping = true;
      } else {
        this.opened = false;
      }
    },

    swipeLeaveTransition(this: any, direction) {
      const { offset, computedLeftWidth, computedRightWidth } = this;
      const threshold = this.opened ? 1 - THRESHOLD : THRESHOLD;

      // right
      if (
        direction === 'right' &&
        -offset > computedRightWidth * threshold &&
        computedRightWidth > 0
      ) {
        this.open('right');
        // left
      } else if (
        direction === 'left' &&
        offset > computedLeftWidth * threshold &&
        computedLeftWidth > 0
      ) {
        this.open('left');
        // reset
      } else {
        this.swipeMove(0);
      }
    },

    startDrag(this: any, event) {
      if (this.disabled) {
        return;
      }

      this.dragging = true;
      this.startOffset = this.offset;
      this.touchStart(event);
    },

    onDrag(this: any, event) {
      if (this.disabled) {
        return;
      }

      this.touchMove(event);

      if (this.direction === 'horizontal') {
        preventDefault(event, true);
        this.swipeMove(this.deltaX + this.startOffset);
      }
    },

    endDrag(this: any) {
      if (this.disabled) {
        return;
      }

      this.dragging = false;
      if (this.swiping) {
        this.swipeLeaveTransition(this.offset > 0 ? 'left' : 'right');
      }
    },

    onClick(this: any, position = 'outside') {
      if (position === 'cell') {
        this.$emit('click');
      }

      if (!this.offset) {
        return;
      }
      if (this.async) {
        this.$emit('close', position, this, { name: this.name });
      } else {
        this.swipeMove(0);
      }
    },
  },

  render(this: any) {
    const onClick = (position, stop?) => event => {
      if (stop) {
        event.stopPropagation();
      }
      this.onClick(position);
    };

    const wrapperStyle = {
      transform: `translate3d(${this.offset}px, 0, 0)`,
      transition: this.dragging ? 'none' : '.6s cubic-bezier(0.18, 0.89, 0.32, 1)',
    };

    return (
      <div
        class={bem()}
        onClick={onClick('cell')}
        onTouchstart={this.startDrag}
        onTouchmove={this.onDrag}
        onTouchend={this.endDrag}
        onTouchcancel={this.endDrag}
      >
        <div
          class={bem('wrapper')}
          style={wrapperStyle}
          onTransitionend={() => {
            this.swiping = false;
          }}
        >
          {this.slots('left') && (
            <div ref="left" class={bem('left')} onClick={onClick('left', true)}>
              {this.slots('left')}
            </div>
          )}
          {this.slots()}
          {this.slots('right') && (
            <div ref="right" class={bem('right')} onClick={onClick('right', true)}>
              {this.slots('right')}
            </div>
          )}
        </div>
      </div>
    );
  },
});
