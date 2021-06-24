import { DefaultSlots, ScopedSlot } from '../../utils/types';
import { createNamespace } from '../../utils';
import { ChildrenMixin } from '../../mixins/relation';
import Icon from '../icon';

export type StepStatus = 'waiting' | 'inprogress' | 'error' | 'finished';

export type StepProps = {
  title: string;
  inProgress?: boolean;
  status?: StepStatus;
};

export type StepEvents = {};

export type StepScopedSlots = DefaultSlots & {
  title: ScopedSlot;
  icon: ScopedSlot;
};

const [createComponent, bem] = createNamespace('step');

const Step = {
  props: {
    title: {
      type: String,
      default: '',
      required: true,
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: '',
    },
  },
  mixins: [ChildrenMixin('bytedSteps')],
  computed: {
    active() {
      return this.parent.current === this.index + 1;
    },
    showSplit() {
      return !this.isLast;
    },
  },
  render(this: any) {
    const { title, inProgress, active, index } = this;
    let { status } = this;
    const { direction, labelDirection, size, children: sibling } = this.parent;

    function getInProgressIndex() {
      const inProgreePoint = sibling.find(item => item.inProgress);
      if (inProgreePoint) {
        return sibling.indexOf(inProgreePoint);
      }
      return 0;
    }

    const inProgressIndex = getInProgressIndex();

    function StepIcon() {
      if (status === 'finished') return <Icon class={bem('icon')} name="check-one" />;
      return <span class={bem('icon-number')}>{index + 1}</span>;
    }

    if (!status) {
      if (inProgressIndex > index) {
        status = 'finished';
      } else if (inProgress) {
        status = 'inProgress';
      } else {
        status = 'waiting';
      }
    }

    const onClick = () => {
      if (inProgressIndex < index && status === 'waiting') {
        return;
      }
      this.parent.$emit('change', this.index + 1);
    };

    const classes = [bem([direction, size, status, { active }])];

    if (direction === 'horizontal' && labelDirection === 'vertical') {
      return (
        <div class={classes} onClick={onClick}>
          <div class={bem('head')}>
            {this.slots.icon ? this.slots.icon() : StepIcon()}
            {this.showSplit && <div class={bem('split-panel')} />}
          </div>
          <span class={bem('title')}>{this.slots.title ? this.slots.title() : title}</span>
        </div>
      );
    }

    return (
      <div class={classes} onClick={onClick}>
        <div class={bem('head')}>
          {this.slots.icon ? this.slots.icon() : StepIcon()}
          <span class={bem('title')}>{this.slots.title ? this.slots.title() : title}</span>
        </div>
        {this.showSplit && <div class={bem('split-panel')} />}
      </div>
    );
  },
};
export default createComponent<StepProps, StepEvents, StepScopedSlots>(Step);
