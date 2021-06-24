import { createNamespace } from '../../utils';
import { TouchMixin } from '../../mixins/touch';
import { preventDefault } from '../../utils/dom/event';

export interface SliderProps {
  value: number;
  disabled: boolean;
  activeColor: string;
  inactiveColor: string;
  min: number;
  max: number;
  step: number;
  steps: any[];
}

export interface SliderEvents {
  onChange(value: any): void;
  onInput(value: any): void;
  onDragStart(): void;
  onDragEnd(): void;
}

const [createComponent, bem] = createNamespace('slider');

export default createComponent<SliderProps, SliderEvents>({
  mixins: [TouchMixin],
  props: {
    value: {
      type: Number,
      default: 0,
    },
    disabled: Boolean,
    activeColor: String,
    inactiveColor: String,
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    steps: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    range() {
      return this.max - this.min;
    },
    style() {
      return {
        background: this.inactiveColor,
      };
    },
    customSteps() {
      return this.steps.length;
    },
    valueStep() {
      return (this.max - this.min) / (this.steps.length - 1);
    },
    valueIndex() {
      const index = this.steps.indexOf(this.value);
      return index < 0 ? 0 : index;
    },
    valuePercent() {
      return this.customSteps
        ? (this.valueIndex / (this.steps.length - 1)) * 100
        : ((this.value - this.min) * 100) / this.range;
    },
    barStyle() {
      return {
        width: `${this.valuePercent}%`,
        background: this.activeColor,
      };
    },
  },

  methods: {
    format(this: any, value) {
      return this.customSteps
        ? this.valuePercent
        : Math.round(Math.max(this.min, Math.min(value, this.max)) / this.step) * this.step;
    },

    onTouchStart(this: any, event) {
      if (this.disabled) {
        return;
      }

      this.touchStart(event);
      this.startValue = this.format(this.value);

      this.dragStatus = 'start';
    },

    computeIndex(this: any, value) {
      return Math.round(Math.max(this.min, Math.min(value, this.max)) / this.valueStep);
    },

    computeValue(this: any) {
      const rect = this.$el.getBoundingClientRect();
      const delta = this.vertical ? this.deltaY : this.deltaX;
      const total = this.vertical ? rect.height : rect.width;
      const diff = (delta / total) * this.range;

      if (this.customSteps) {
        return this.steps[this.computeIndex(this.startValue + diff)];
      } else {
        return this.startValue + diff;
      }
    },

    onTouchMove(this: any, event) {
      if (this.disabled) {
        return;
      }

      if (this.dragStatus === 'start') {
        this.$emit('drag-start');
      }

      preventDefault(event, true);
      this.touchMove(event);
      this.dragStatus = 'draging';

      this.newValue = this.computeValue();

      this.updateValue(this.newValue);
    },

    onTouchEnd(this: any) {
      if (this.disabled) {
        return;
      }

      if (this.dragStatus === 'draging') {
        this.updateValue(this.newValue, true);
        this.$emit('drag-end');
      }

      this.dragStatus = '';
    },

    onClick(this: any, event) {
      event.stopPropagation();

      if (this.disabled) return;

      const rect = this.$el.getBoundingClientRect();
      const delta = this.vertical ? event.clientY - rect.top : event.clientX - rect.left;
      const total = this.vertical ? rect.height : rect.width;
      let value = (delta / total) * this.range + this.min;

      if (this.customSteps) {
        value = this.steps[this.computeIndex(value)];
      }

      this.updateValue(value, true);
    },

    updateValue(this: any, value, end) {
      value = this.customSteps ? value : this.format(value);

      this.$emit('input', value);

      if (end) {
        this.$emit('change', value);
      }
    },
  },

  render(this: any) {
    return (
      <div class={bem({ disabled: this.disabled })} style={this.style} onClick={this.onClick}>
        <div class={bem('bar')} style={this.barStyle}>
          <div
            class={bem('bar__wrapper')}
            onTouchstart={this.onTouchStart}
            onTouchmove={this.onTouchMove}
            onTouchend={this.onTouchEnd}
            onTouchcancel={this.onTouchEnd}
          >
            <div class={bem('button')} />
          </div>
        </div>
      </div>
    );
  },
});
