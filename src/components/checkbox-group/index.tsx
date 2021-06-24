import { createNamespace } from '../../utils';
import { ParentMixin } from '../../mixins/relation';

import { DefaultSlots } from '../../utils/types';

type CheckboxGroupTypes = 'default' | 'number' | 'square';
type CheckboxGroupSize = 'small' | 'normal' | 'large';

export interface CheckboxGroupProps {
  max: number;
  value: any[];
  disabled: boolean;
  size: CheckboxGroupSize;
  type: CheckboxGroupTypes;
}

export interface CheckboxGroupEvents {
  onChange(value: boolean): void;
}

export interface CheckboxGroupScopedSlots extends DefaultSlots {}

const [createComponent, bem] = createNamespace('checkbox-group');

const size: CheckboxGroupSize[] = ['small', 'normal', 'large'];
const type: CheckboxGroupTypes[] = ['default', 'number', 'square'];

export default createComponent<CheckboxGroupProps, CheckboxGroupEvents, CheckboxGroupScopedSlots>({
  mixins: [ParentMixin('bytedCheckbox')],

  data() {
    return {
      countArr: [],
    };
  },

  props: {
    max: Number,
    disabled: Boolean,
    value: {
      type: Array,
      default: () => [],
    },
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
