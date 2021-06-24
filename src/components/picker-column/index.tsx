import { createNamespace } from '../../utils';
import { range } from '../../utils/format/number';
import { preventDefault } from '../../utils/dom/event';

import { TouchMixin } from '../../mixins/touch';

import { DefaultSlots } from '../../utils/types';

type PickerColumnValue = string | number;
type PickerColumnOptions = {
  value: PickerColumnValue;
  label: string;
};

export interface PickerColumnProps {
  value: string | number;
  options: PickerColumnOptions[];
  columnIndex: number;

  transitionDuration?: number;
  swipeDuration?: number;
}

export interface PickerColumnEvents {
  onChange(value: PickerColumnValue, columnIndex: number): void;
  onInput(value: PickerColumnValue, columnIndex: number): void;
}

export interface PickerColumnScopedSlots extends DefaultSlots {}

export const DEFAULT_DURATION = 600;
export const SWIPE_DURATION = 600;

const MULTIPLIER_BASE = 60;
function getSpeedMultiplier(index) {
  let multiplier = MULTIPLIER_BASE;
  let i = 0;

  for (i = 0; i < index; i++) {
    multiplier += 1.25 * (index - 1);
  }

  return Math.ceil(multiplier);
}

// 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

function getElementTranslateY(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform || style.webkitTransform;
  const translateY = transform.slice(7, transform.length - 1).split(', ')[5];

  return Number(translateY);
}

const [createComponent, bem] = createNamespace('picker-column');

export default createComponent<PickerColumnProps, PickerColumnEvents, PickerColumnScopedSlots>({
  mixins: [TouchMixin],

  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      default: [],
    },
    columnIndex: {
      type: Number,
      default: 0,
    },

    transitionDuration: {
      type: Number,
      default: DEFAULT_DURATION,
    },
    swipeDuration: {
      type: Number,
      default: SWIPE_DURATION,
    },
  },

  data() {
    return {
      wrapperName: 'picker-column-wrapper',
      wrapperHeight: 0,
      duration: 0,
      moving: false,
      offset: 0,
      startOffset: 0,
      momentumOffset: 0,
      touchStartTime: 0,
      now: 0,
    };
  },

  computed: {
    currentIndex() {
      let index = 0;

      this.options.some((option, i) => {
        if (this.value === option.value) {
          index = i;
          return true;
        }
      });

      return index;
    },

    count() {
      return this.options.length;
    },

    itemHeight() {
      return this.wrapperHeight / this.count;
    },

    baseOffset() {
      return this.itemHeight * 2;
    },
  },

  watch: {
    options: 'initWrapperHeight',
    value() {
      this.setIndex(this.currentIndex);
    },
  },

  mounted() {
    /**
     * 绑定touch事件
     */
    this.bindTouchEvent(this.$el);

    this.initWrapperHeight();
  },

  methods: {
    initWrapperHeight(this: any) {
      this.$nextTick(() => {
        this.offset = 0;

        const { scrollHeight } = this.$refs[this.wrapperName];

        if (scrollHeight) {
          this.wrapperHeight = scrollHeight;
        }

        this.setIndex(this.currentIndex);
      });
    },

    setIndex(this: any, index, emitChange) {
      /**
       * 滚动到对应位置
       * 并触发chang
       */
      index = range(index, 0, this.count);

      const offset = -index * this.itemHeight;

      const trigger = () => {
        if (emitChange) this.change(index);
      };

      if (this.moving && offset !== this.offset) {
        this.transitionEndTrigger = trigger;
      } else {
        trigger();
      }

      this.offset = offset;
    },

    change(this: any, index) {
      /**
       * 修改value
       */
      const { value } = this.options[index];

      this.$emit('input', value, this.columnIndex);
      this.$emit('change', value, this.columnIndex);
    },

    onTouchStart(this: any, event) {
      this.touchStart(event);

      if (this.moving) {
        const translateY = getElementTranslateY(this.$refs[this.wrapperName]);
        this.offset = Math.min(0, translateY - this.baseOffset);
        this.startOffset = this.offset;
      } else {
        this.startOffset = this.offset;
      }

      this.duration = 0;
      this.touchStartTime = Date.now();
      this.momentumOffset = this.startOffset;
      this.transitionEndTrigger = null;
    },

    onTouchMove(this: any, event) {
      this.touchMove(event);

      if (this.direction === 'vertical') {
        this.moving = true;
        preventDefault(event, true);
      }

      this.offset = range(this.startOffset + this.deltaY, -this.wrapperHeight, this.itemHeight);

      this.now = Date.now();

      if (this.now - this.touchStartTime > MOMENTUM_LIMIT_TIME) {
        this.touchStartTime = this.now;
        this.momentumOffset = this.offset;
      }
    },

    getIndexByOffset(this: any, offset) {
      return range(Math.round(-offset / this.itemHeight), 0, this.count - 1);
    },

    onTouchEnd(this: any) {
      const duration = Date.now() - this.touchStartTime;
      const distance = this.offset - this.momentumOffset;
      const allowMomentum =
        duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

      if (allowMomentum) {
        this.momentum(distance, duration);
      } else {
        const index = this.getIndexByOffset(this.offset);
        this.duration = this.transitionDuration;
        this.setIndex(index, true);

        // compatible with desktop scenario
        // use setTimeout to skip the click event triggered after touchstart
        setTimeout(() => {
          this.moving = false;
        }, 0);
      }
    },

    momentum(this: any, distance, duration) {
      const speed = Math.abs(distance / duration);

      distance =
        this.offset + speed * getSpeedMultiplier(Math.round(speed * 10)) * (distance < 0 ? -1 : 1);

      const index = this.getIndexByOffset(distance);

      this.duration = this.swipeDuration;

      this.setIndex(index, true);
    },

    onClickItem(this: any, index) {
      if (!this.moving) {
        this.duration = this.transitionDuration;
        this.setIndex(index, true);
      }
    },

    genOptions(this: any) {
      return this.options.map((option, index) => {
        return (
          <div
            class={bem('option')}
            onClick={() => {
              this.onClickItem(index);
            }}
          >
            {option.label}
          </div>
        );
      });
    },

    stopMomentum(this: any) {
      this.moving = false;
      this.duration = 0;

      if (this.transitionEndTrigger) {
        this.transitionEndTrigger();
        this.transitionEndTrigger = null;
      }
    },

    onTransitionEnd(this: any) {
      this.stopMomentum();
    },
  },

  render(this: any) {
    const wrapperStyle = {
      transform: `translate3d(0, ${this.offset + this.baseOffset}px, 0)`,
      transitionDuration: `${this.duration}ms`,
      transitionProperty: this.duration ? 'all' : 'none',
    };

    return (
      <div class={bem()}>
        <div
          ref={this.wrapperName}
          style={wrapperStyle}
          class={bem('wrapper')}
          onTransitionend={this.onTransitionEnd}
        >
          {this.genOptions()}
        </div>
      </div>
    );
  },
});
