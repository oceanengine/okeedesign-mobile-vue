import { createNamespace } from '../../utils';
import { TouchMixin } from '../../mixins/touch';

import { DefaultSlots } from '../../utils/types';

const [createComponent, bem] = createNamespace('tabs');
const MIN_SWIPE_DISTANCE = 50;

interface ContentProps {
  count: number;
  duration: number;
  animated: boolean;
  swipeable: boolean;
  touchable: boolean;
  currentIndex: number;
  contentColor: string;
}

interface ContentEvents {
  onChange(index: number): void;
}

interface ContentScopedSlots extends DefaultSlots {}

export default createComponent<ContentProps, ContentEvents, ContentScopedSlots>({
  mixins: [TouchMixin],

  props: {
    count: Number,
    duration: Number,
    animated: Boolean,
    swipeable: Boolean,
    touchable: Boolean,
    currentIndex: Number,
    contentColor: String,
  },

  data() {
    return {
      positionX: 0,
      durationSwipe: 0,
      tabWidth: 0,
      childrenLength: 0,
    };
  },

  computed: {
    style() {
      if (this.animated || this.touchable) {
        return {
          transform: `translate3d(${this.positionX}px, 0, 0)`,
          transitionDuration: `${this.durationSwipe}s`,
        };
      }
    },

    listeners() {
      if (this.swipeable || this.touchable) {
        return {
          touchstart: this.touchStart,
          touchmove: this.onTouchMove,
          touchend: this.onTouchEnd,
          touchcancel: this.onTouchEnd,
        };
      }
    },
  },

  watch: {
    currentIndex: function currentIndex(this: any) {
      this.action();
    },
  },

  mounted() {
    if (this.animated) this.durationSwipe = this.duration;
    this.tabWidth = this.$el.offsetWidth;
    if (this.touchable) this.childrenLength = this.$el.children[0].childNodes.length;
    this.action();
  },

  methods: {
    action(this: any) {
      this.durationSwipe = this.duration;
      setTimeout(() => {
        this.durationSwipe = 0;
      }, this.durationSwipe);
      this.positionX = -1 * this.currentIndex * this.tabWidth;
    },

    onTouchMove(this: any, event) {
      this.touchMove(event);

      if (this.touchable) {
        const { direction, deltaX, tabWidth, currentIndex, childrenLength } = this;

        if (direction === 'horizontal') {
          if (currentIndex === childrenLength - 1 && deltaX < 0) {
            // 到底禁止滑动
            return;
          }

          this.positionX = deltaX - tabWidth * currentIndex;
          this.positionX =
            this.positionX > 0
              ? 0
              : this.positionX < -tabWidth * childrenLength
              ? -tabWidth * childrenLength
              : this.positionX;
          if (event.cancelable) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
    },

    onTouchEnd(this: any) {
      const { direction, deltaX, currentIndex, touchable } = this;

      if (direction === 'horizontal' && this.offsetX >= MIN_SWIPE_DISTANCE) {
        if (deltaX > 0 && currentIndex !== 0) {
          this.$emit('change', currentIndex - 1);
        } else if (deltaX < 0 && currentIndex !== this.count - 1) {
          this.$emit('change', currentIndex + 1);
        }
      } else if (touchable && this.offsetX < MIN_SWIPE_DISTANCE) {
        this.action();
      }
    },

    renderChildren(this: any) {
      if (this.animated || this.touchable) {
        return (
          <div class={bem('track')} style={this.style}>
            {this.slots()}
          </div>
        );
      }

      return this.slots();
    },
  },

  render(this: any) {
    return (
      <div
        class={bem('content', { animated: this.animated, touchable: this.touchable })}
        {...{ on: this.listeners }}
      >
        {this.renderChildren()}
      </div>
    );
  },
});
