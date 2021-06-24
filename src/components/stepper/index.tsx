import { createNamespace, createBrandName } from '../../utils';

type StepperSize = 'small' | 'normal' | 'large';

export interface StepperProps {
  size: StepperSize;
  value: number;
  disabled: boolean;
  min: number;
  max: number;
  step: number;
}

export interface StepperEvents {
  onChange(value: number): void;
  onInput(value: number): void;
}

export interface StepperProps {
  size: StepperSize;
  value: number;
  disabled: boolean;
  min: number;
  max: number;
  step: number;
}

export interface StepperEvents {
  onChange(value: number): void;
  onInput(value: number): void;
}

const [createComponent, bem] = createNamespace('stepper');

export const size: StepperSize[] = ['small', 'normal', 'large'];

export default createComponent<StepperProps, StepperEvents>({
  props: {
    size: {
      type: String,
      default: 'normal',
      validator: value => {
        return size.indexOf(value) !== -1;
      },
    },
    value: {
      type: Number,
      default: 1,
      validator: value => {
        return value >= 0;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: 0,
      validator: value => {
        return value >= 0;
      },
    },
    max: {
      type: Number,
      validator: value => {
        return value >= 0;
      },
    },
    step: {
      type: Number,
      default: 1,
      validator: value => {
        return value >= 1;
      },
    },
  },
  computed: {
    isIncreaseDisabled() {
      if (this.disabled) {
        return true;
      }

      if (this.max) {
        return this.max <= this.value;
      }

      return false;
    },
    isDecreaseDisabled() {
      return this.disabled ? true : this.min >= this.value;
    },
  },
  methods: {
    increaseSvg(this: any) {
      /**
       * 减少按钮
       */
      const brandName = createBrandName();
      const increaseSvgClasses = [
        bem('insvg', this.$props.size),
        {
          [`${brandName}stepper__disable`]: this.isIncreaseDisabled,
        },
      ];
      return (
        <svg class={increaseSvgClasses} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M26.06 10a2 2 0 00-4 0l-.01 12H10a2 2 0 100 4h12.04l-.02 12a2 2 0 004 0l.02-12H38a2 2 0 100-4H26.05l.01-12z"
          />
        </svg>
      );
    },
    decreaseSvg(this: any) {
      /**
       * 增加按钮
       */
      const brandName = createBrandName();
      const decreaseSvgClasses = [
        bem('desvg', this.size),
        {
          [`${brandName}stepper__disable`]: this.isDecreaseDisabled,
        },
      ];
      return (
        <svg class={decreaseSvgClasses} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.5 24c0-1.1.9-2 2-2h28a2 2 0 110 4h-28a2 2 0 01-2-2z"
          />
        </svg>
      );
    },
    renderInput(this: any) {
      /**
       * 隐藏输入框
       */
      return <input class={bem('input')} type="number" value={this.value} />;
    },
    decrease(this: any) {
      /**
       * 减少
       */
      if (this.isDecreaseDisabled) return;

      const newValue = Math.max(this.value - this.step, this.min);

      this.$emit('input', newValue);
      this.$emit('change', newValue);
    },
    increase(this: any) {
      /**
       * 增加
       */
      if (this.isIncreaseDisabled) return;

      let newValue = this.value + this.step;

      if (this.max) {
        newValue = Math.min(newValue, this.max);
      }

      this.$emit('input', newValue);
      this.$emit('change', newValue);
    },
  },
  render(this: any) {
    const brandName = createBrandName();
    const increaseClasses = [
      bem('increase'),
      bem('crease', this.size),
      {
        [`${brandName}stepper__crease--disabled`]: this.isIncreaseDisabled,
      },
    ];

    const decreaseClasses = [
      bem('decrease'),
      bem('crease', this.size),
      {
        [`${brandName}stepper__crease--disabled`]: this.isDecreaseDisabled,
      },
    ];

    const showNumberClasses = [
      bem('number', this.size),
      {
        [`${brandName}stepper__number--disabled`]: this.disabled,
      },
    ];

    return (
      <div class={bem()}>
        <div class={decreaseClasses} onClick={this.decrease}>
          {this.decreaseSvg()}
        </div>
        <div class={showNumberClasses}>
          {this.renderInput()}
          {this.value}
        </div>
        <div class={increaseClasses} onClick={this.increase}>
          {this.increaseSvg()}
        </div>
      </div>
    );
  },
});
