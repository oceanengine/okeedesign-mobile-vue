import { createNamespace } from '../../utils';
import { ParentMixin } from '../../mixins/relation';

import { type, size, RadioType, RadioSize } from '../radio';

import { DefaultSlots } from '../../utils/types';

export interface RadioGroupProps {
  value: string | number;
  disabled: boolean;
  size: RadioSize;
  type: RadioType;
}

export interface RadioGroupEvents {
  onChange(val: string | number): void;
}

export interface RadioGroupScopedSlots extends DefaultSlots {}

const [createComponent, bem] = createNamespace('radio-group');

export default createComponent<RadioGroupProps, RadioGroupEvents, RadioGroupScopedSlots>({
  mixins: [ParentMixin('bytedRadio')],

  props: {
    value: null,
    disabled: Boolean,
    size: {
      type: String,
      default: size[1],
      validator: value => {
        return size.indexOf(value) !== -1;
      },
    },
    type: {
      type: String,
      default: type[0],
      validator: value => {
        return type.indexOf(value) !== -1;
      },
    },
  },

  watch: {
    value(val) {
      this.$emit('change', val);
    },
  },

  render(this: any) {
    return <div class={bem()}>{this.slots()}</div>;
  },
});
