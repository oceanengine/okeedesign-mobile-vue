import { DefaultSlots } from '../../utils/types';

import { createNamespace } from '../../utils';
import { ParentMixin } from '../../mixins/relation';

export type StepsDirection = 'horizontal' | 'vertical';
export type StepSize = 'lg' | 'md' | 'sm';

export type StepsProps = {
  size?: StepSize;
  current: string;
  direction: StepsDirection;
  labelDirection: StepsDirection;
};

export type StepsEvents = {
  onChange: (val: number) => void;
};

export interface StepsScopedSlots extends DefaultSlots {}

const [createComponent, bem] = createNamespace('steps');

const Steps = {
  props: {
    current: {
      type: Number,
      required: true,
    },
    direction: {
      type: String,
      default: 'horizontal',
    },
    labelDirection: {
      type: String,
      default: 'horizontal',
    },
    size: {
      type: String,
      default: 'md',
    },
  },
  mixins: [ParentMixin('bytedSteps')],
  render(this: any) {
    const { direction, labelDirection } = this;
    return <div class={bem([direction, `label-${labelDirection}`])}>{this.$slots.default}</div>;
  },
};

export default createComponent<StepsProps, StepsEvents, StepsScopedSlots>(Steps);
