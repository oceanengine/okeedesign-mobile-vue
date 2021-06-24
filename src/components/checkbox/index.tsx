import { createNamespace, createBrandName } from '../../utils';
import { stopPropagation } from '../../utils/dom/event';
import { ChildrenMixin } from '../../mixins/relation';
import Icon from '../icon';

import { DefaultSlots } from '../../utils/types';

type CheckboxTypes = 'default' | 'number' | 'square';
type CheckboxSize = 'small' | 'normal' | 'large';

export interface CheckboxProps {
  name: any;
  value: any;
  disabled: boolean;
  labelPosition: string;
  size: CheckboxSize;
  type: CheckboxTypes;
  stopPropagation: boolean;
}

export interface CheckboxEvents {
  onChange(value: boolean): void;
  onInput(value: boolean): void;
}

export interface CheckboxScopedSlots extends DefaultSlots {}

const [createComponent, bem] = createNamespace('checkbox');

const type: CheckboxTypes[] = ['default', 'number', 'square'];
const size: CheckboxSize[] = ['small', 'normal', 'large'];

export default createComponent<CheckboxProps, CheckboxEvents, CheckboxScopedSlots>({
  mixins: [ChildrenMixin('bytedCheckbox')],

  data() {
    return {
      input: null,
    };
  },

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
    checked() {
      return this.parent ? this.parent.value.indexOf(this.value) !== -1 : this.value;
    },

    count() {
      if (this.parent) {
        return this.parent.countArr.indexOf(this.value) + 1;
      }
      return 1;
    },

    isDisabled() {
      return (this.parent && this.parent.disabled) || this.disabled;
    },

    iconName() {
      if (this.typeStr === 'square') {
        return this.checked ? 'square-check-one' : 'square-uncheck';
      }
      return this.checked ? 'check-one' : 'radio-uncheck';
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

  watch: {
    checked(val) {
      if (this.typeStr === type[1] && this.parent) {
        val
          ? this.parent.countArr.push(this.value)
          : this.parent.countArr.splice(this.parent.countArr.indexOf(this.value), 1);
      }
    },
  },

  created() {
    if (this.checked && this.parent) this.parent.countArr.push(this.value);
  },

  methods: {
    onChange(this: any) {
      if (this.isDisabled) {
        return;
      }
      if (this.parent) {
        this.setParentValue(!this.checked);
      } else {
        this.$emit('input', !this.checked);
      }
      this.$emit('change', !this.checked);
    },

    setParentValue(this: any, val) {
      const { parent } = this;
      const parentValue = parent.value.slice();
      if (val && parent.max && parentValue.length >= parent.max) {
        return;
      }

      const newParentValue = [];
      parent.children.forEach(child => {
        if (child._uid !== this._uid) {
          if (child.checked) {
            newParentValue.push(child.value);
          }
        } else if (!this.checked) {
          newParentValue.push(this.value);
        }
      });
      parent.$emit('input', newParentValue);
    },

    onTouchstart(this: any, event) {
      if (this.stopPropagation) {
        stopPropagation(event);
      } else if (event.target === this.$refs[this.inputId]) {
        stopPropagation(event);
      }
    },

    onClick(this: any, event) {
      if (this.stopPropagation) {
        stopPropagation(event);
      } else if (event.target === this.$refs[this.inputId]) {
        stopPropagation(event);
      }
    },

    Icon(this: any) {
      if (this.typeStr === 'number') {
        return this.IconNumber();
      }
      return <Icon class={bem('icon')} name={this.iconName} />;
    },

    IconNumber(this: any) {
      return this.checked ? (
        <span class={bem('icon__number')}>{this.count}</span>
      ) : (
        <Icon class={bem('icon')} name={this.iconName} />
      );
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
        type="checkbox"
        checked={this.checked}
        disabled={this.isDisabled}
        value={this.value}
        onchange={this.onChange}
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
