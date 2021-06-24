import { createNamespace } from '../../utils';
import { preventDefault } from '../../utils/dom/event';
import { doubleRaf } from '../../utils/dom/raf';
import { range } from '../../utils/format/number';

import { TouchMixin } from '../../mixins/touch';
import { ParentMixin } from '../../mixins/relation';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

const [createComponent, bem] = createNamespace('swipe');

const types = ['default', 'primary'];

export interface SwipeProps {
  value: number;
  type: string;
  autoplay: number;
  loop: boolean;
  duration: number;
  touchable: boolean;
  initialSwipe: number;
  minMove: number;
  indicatorColor: string;
  showIndicators: boolean;
}

export interface SwipeEvents {
  onChange(index: number): void;
}

export type SwipeScopedSlots = DefaultSlots & {
  indicator?: ScopedSlot;
};

export default createComponent<SwipeProps, SwipeEvents, SwipeScopedSlots>({
  model: {
    prop: 'value',
    event: 'change',
  },
  mixins: [TouchMixin, ParentMixin('bytedSwipe')],
  props: {
    value: Number,
    type: {
      type: String,
      default: types[0],
      validator: value => {
        return types.indexOf(value) !== -1;
      },
    },
    autoplay: Number,
    loop: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 400,
    },
    touchable: {
      type: Boolean,
      default: true,
    },
    initialSwipe: {
      type: Number,
      default: 0,
    },
    minMove: {
      type: Number,
      default: 40,
    },
    indicatorColor: String,
    showIndicators: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      timer: 0,
      computedWidth: 0,
      deltaX: 0,
      offset: 0,
      active: 0,
      swiping: false,
    };
  },

  computed: {
    size() {
      return this.computedWidth;
    },
    swipes() {
      return this.children;
    },
    count() {
      return this.swipes.length;
    },
    trackSize() {
      return this.count * this.size;
    },
    trackStyle() {
      return {
        width: `${this.trackSize}px`,
        transitionDuration: `${this.swiping ? 0 : this.duration}ms`,
        transform: `translate3d(${this.offset}px, 0, 0)`,
      };
    },
    delta() {
      return this.deltaX;
    },
    minOffset() {
      return this.size * (1 - this.count);
    },
    isCorrectDirection() {
      return this.direction === 'horizontal';
    },
    activeIndicator() {
      return (this.active + this.count) % this.count;
    },
    indicatorStyle() {
      return {
        backgroundColor: this.indicatorColor,
      };
    },
  },

  watch: {
    value(value) {
      const { activeIndicator } = this;
      if (typeof value === 'number' && value !== activeIndicator) {
        this.setActive(value);
      }
    },
    swipes() {
      this.initialize();
    },
    initialSwipe() {
      this.initialize();
    },
    autoplay(autoplay) {
      if (!autoplay) {
        this.clear();
      } else {
        this.autoPlay();
      }
    },
  },

  methods: {
    initialize(this: any, active = this.value ?? this.initialSwipe) {
      this.clear();

      if (this.$el) {
        this.computedWidth = this.$el.getBoundingClientRect().width;
      }

      this.swiping = true;
      this.active = active;
      this.offset = this.count > 1 ? -this.size * this.active : 0;
      this.swipes.forEach(swipe => {
        swipe.offset = 0;
      });
      this.autoPlay();
    },

    clear(this: any) {
      clearTimeout(this.timer);
    },

    autoPlay(this: any) {
      const { autoplay, count } = this;
      if (autoplay && count > 1) {
        this.clear();
        this.timer = setTimeout(() => {
          this.swiping = true;
          this.resetTouchStatus();
          this.correctPosition();

          doubleRaf(() => {
            this.swiping = false;
            this.move({
              pace: 1,
              emitChange: true,
            });
            this.autoPlay();
          });
        }, autoplay);
      }
    },

    getTargetActive(this: any, pace) {
      const { active, count } = this;

      if (pace) {
        if (this.loop) {
          return range(active + pace, -1, count);
        }
        return range(active + pace, 0, count - 1);
      }

      return active;
    },

    getTargetOffset(this: any, targetActive, offset) {
      let currentPosition = targetActive * this.size;
      if (!this.loop) {
        currentPosition = Math.min(currentPosition, -this.minOffset);
      }

      let targetOffset = Math.round(offset - currentPosition);

      if (!this.loop) {
        targetOffset = range(targetOffset, this.minOffset, 0);
      }

      return targetOffset;
    },

    move(this: any, { pace = 0, offset = 0, emitChange }) {
      const { loop, count, active, swipes, trackSize, minOffset } = this;

      if (count <= 1) {
        return;
      }

      const targetActive = this.getTargetActive(pace);
      const targetOffset = this.getTargetOffset(targetActive, offset);

      // auto move first and last swipe in loop mode
      if (loop) {
        if (swipes[0]) {
          const outRightBound = targetOffset < minOffset;
          swipes[0].offset = outRightBound ? trackSize : 0;
        }

        if (swipes[count - 1]) {
          const outLeftBound = targetOffset > 0;
          swipes[count - 1].offset = outLeftBound ? -trackSize : 0;
        }
      }

      this.active = targetActive;
      this.offset = targetOffset;

      if (emitChange && targetActive !== active) {
        this.$emit('change', this.activeIndicator);
      }
    },

    correctPosition(this: any) {
      if (this.active <= -1) {
        this.move({ pace: this.count });
      }

      if (this.active >= this.count) {
        this.move({ pace: -this.count });
      }
    },

    setActive(this: any, value) {
      this.clear();

      this.resetTouchStatus();
      this.swiping = false;

      this.move({ pace: value - this.activeIndicator, emitChange: true });
      this.correctPosition();

      this.autoPlay();
    },

    previous(this: any) {
      this.setActive(this.active - 1);
    },

    next(this: any) {
      this.setActive(this.active + 1);
    },

    onTouchStart(this: any, event) {
      if (!this.touchable) return;

      this.clear();
      this.swiping = true;
      this.touchStart(event);
      this.correctPosition();
    },

    onTouchMove(this: any, event) {
      if (!this.touchable || !this.swiping) return;

      this.touchMove(event);

      if (this.isCorrectDirection) {
        preventDefault(event, true);
        this.move({ offset: this.delta });
      }
    },

    onTouchEnd(this: any) {
      if (!this.touchable || !this.swiping) return;

      if (this.isCorrectDirection && this.delta) {
        this.move({
          pace: this.offsetX > this.minMove ? (this.delta > 0 ? -1 : 1) : 0,
          emitChange: true,
        });
      }

      this.swiping = false;
      this.autoPlay();
    },
  },

  render(this: any) {
    const { showIndicators, count, type, activeIndicator } = this;

    const Indicator =
      this.slots('indicator') ||
      (showIndicators && count > 1 && (
        <div class={bem('indicators', type)}>
          {Array(...Array(count)).map((_empty, index) => (
            <i
              class={bem('indicator', { active: index === activeIndicator })}
              style={index === activeIndicator ? this.indicatorStyle : null}
            />
          ))}
        </div>
      ));

    return (
      <div class={bem()}>
        <div
          class={bem('track')}
          style={this.trackStyle}
          onTouchstart={this.onTouchStart}
          onTouchmove={this.onTouchMove}
          onTouchend={this.onTouchEnd}
          onTouchcancel={this.onTouchEnd}
        >
          {this.slots()}
        </div>
        {Indicator}
      </div>
    );
  },
});
