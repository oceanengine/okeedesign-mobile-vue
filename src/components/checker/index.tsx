import { createNamespace } from '../../utils';
import { ParentMixin } from '../../mixins/relation';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

type CheckerInputTypes = 'checkbox' | 'radio';
type CheckerTypes = 'default' | 'primary';
type CheckerSize = 'small' | 'normal' | 'large';

type CheckerValue = string | number;

export interface CheckerProps {
  value: CheckerValue | CheckerValue[];
  inputType: CheckerInputTypes;
  type: CheckerTypes;
  round: boolean;
  size: CheckerSize;
}

export interface CheckerEvents {
  onChange(index: number): void;
}

export type CheckerScopedSlots = DefaultSlots & {
  indicator?: ScopedSlot;
};

const inputTypes: CheckerInputTypes[] = ['checkbox', 'radio'];
const types: CheckerTypes[] = ['default', 'primary'];
const sizes: CheckerSize[] = ['small', 'normal', 'large'];

const [createComponent, bem] = createNamespace('checker');

export default createComponent<CheckerProps, CheckerEvents, CheckerScopedSlots>({
  mixins: [ParentMixin('bytedChecker')],

  data() {
    return {
      typeError: false,
    };
  },
  props: {
    value: {
      type: [Array, String, Number],
      default: [],
    },
    inputType: {
      type: String,
      default: 'checkbox',
      validator: value => {
        return inputTypes.indexOf(value) > -1;
      },
    },
    type: {
      type: String,
      default: 'default',
      validator: value => {
        return types.indexOf(value) > -1;
      },
    },
    round: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'normal',
      validator: value => {
        return sizes.indexOf(value) > -1;
      },
    },
  },

  created() {
    this.checkInputType();
  },

  computed: {
    isRadio() {
      return this.inputType === inputTypes[1];
    },
  },

  watch: {
    value(newVal) {
      this.checkInputType();

      if (this.isRadio) {
        this.$emit('change', newVal);
      }
    },
    inputType() {
      this.checkInputType();
    },
  },

  methods: {
    checkInputType(this: any) {
      /**
       * ?????? input?????? ??? value??? ????????????
       */
      const { value, inputType } = this;

      if (inputType === 'checkbox') {
        this.typeError = !Array.isArray(value);

        if (this.typeError) {
          console.error('Checker: ???inputType???checkbox??????value????????????Array??????');
        }
      } else {
        this.typeError = typeof value !== 'string' && typeof value !== 'number';

        if (this.typeError) {
          console.error('Checker: ???inputType???radio??????value????????????String??????Number??????');
        }
      }
    },
  },

  render(this: any) {
    return <div class={bem()}>{this.slots()}</div>;
  },
});
