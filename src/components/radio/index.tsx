import { createNamespace, createBrandName } from '../../utils';
import { stopPropagation } from '../../utils/dom/event';
import { ChildrenMixin } from '../../mixins/relation';
import Icon from '../icon';

import { DefaultSlots } from '../../utils/types';

export type RadioType = 'default' | 'primary' | 'dot' | 'hook' | 'circle';
export type RadioSize = 'small' | 'normal' | 'large';

export interface RadioProps {
  name: string;
  value: string | number;
  disabled: boolean;
  labelPosition: string;
  size: RadioSize;
  type: RadioType;
  stopPropagation: boolean;
}

export interface RadioEvents {
  onInput(event: any): void;
  onChange(event: any): void;
  onTouchstart(event: any): void;
  onClick(event: any): void;
}

export interface RadioScopedSlots extends DefaultSlots {}

const [createComponent, bem] = createNamespace('radio');
// primary 样式同dot，向下兼容处理
export const type: RadioType[] = ['default', 'primary', 'dot', 'hook', 'circle'];
export const size: RadioSize[] = ['small', 'normal', 'large'];

export default createComponent<RadioProps, RadioEvents, RadioScopedSlots>({
  mixins: [ChildrenMixin('bytedRadio')],

  props: {
    name: null,
    value: null,
    disabled: Boolean,
    labelPosition: String,
    size: {
      type: String,
      validator: value => {
        return size.indexOf(value) !== -1;
      },
    },
    type: {
      type: String,
      validator: value => {
        return type.indexOf(value) !== -1;
      },
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    currentValue() {
      return this.parent ? this.parent.value : this.value;
    },

    checked() {
      return this.currentValue === this.value;
    },

    isDisabled() {
      return (this.parent && this.parent.disabled) || this.disabled;
    },

    iconName() {
      return this.checked ? 'radio' : 'radio-uncheck';
    },

    inputId() {
      const brandName = createBrandName();
      return `${brandName}checkbox-input-${this._uid}`;
    },

    sizeStr() {
      return this.size || (this.parent && this.parent.size);
    },

    typeStr() {
      return this.type || (this.parent && this.parent.type);
    },
  },

  methods: {
    onChange(this: any) {
      if (this.isDisabled) {
        return;
      }

      if (this.parent) {
        this.parent.$emit('input', this.value);
      } else {
        this.$emit('input', this.value);
      }
      this.$emit('change', this.value);
    },

    onTouchstart(this: any, event) {
      if (this.stopPropagation) {
        stopPropagation(event);
        this.$emit('touchstart');
      } else if (event.target === this.$refs[this.inputId]) {
        stopPropagation(event);
      } else {
        this.$emit('touchstart');
      }
    },

    onClick(this: any, event) {
      if (this.stopPropagation) {
        stopPropagation(event);
        this.emitClick(event);
      } else if (event.target === this.$refs[this.inputId]) {
        stopPropagation(event);
      } else {
        this.emitClick(event);
      }
    },

    emitClick(this: any, event) {
      if (this.isDisabled) {
        return;
      }

      this.$emit('click', event);
      this.parent.$emit('click', event);

      if (!this.checked) {
        this.parent.$emit('input', this.value);
      }
    },

    Icon(this: any) {
      if (this.typeStr === type[0]) {
        return this.checked ? (
          <Icon class={bem('icon')} name="check-one" />
        ) : (
          <i class={bem('icon')}></i>
        );
      }
      if (this.typeStr === type[1] || this.typeStr === type[2]) {
        return <Icon class={bem('icon')} name={this.iconName} />;
      }
      if (this.typeStr === type[3]) {
        return this.checked ? (
          <Icon class={bem('icon')} name="check" />
        ) : (
          <i class={bem('icon')}></i>
        );
      }
      if (this.typeStr === type[4]) {
        return this.checked ? (
          <Icon class={bem('icon')} name="check-one" />
        ) : (
          <Icon class={bem('icon')} name="radio-uncheck" />
        );
      }
    },
  },

  render(this: any) {
    const labelSlot = this.slots();
    const Label = labelSlot && <span class={bem('label')}>{labelSlot}</span>;
    const Children = [this.Icon()];

    if (this.labelPosition === 'left') {
      Children.unshift(Label);
    } else {
      Children.push(Label);
    }

    const Input = (
      <input
        class={bem('input')}
        ref={this.inputId}
        type="radio"
        disabled={this.isDisabled}
        value={this.value}
        checked={this.checked}
      />
    );

    return (
      <label
        class={bem([
          this.sizeStr,
          this.labelPosition,
          { disabled: this.isDisabled, checked: this.checked },
        ])}
        onTouchstart={this.onTouchstart}
        onClick={this.onClick}
      >
        {Children}
        {Input}
      </label>
    );
  },
});
