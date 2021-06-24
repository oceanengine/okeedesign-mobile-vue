import { createNamespace, createBrandName } from '../../utils';
import { PopupMixin } from '../../mixins/popup';

const [createComponent, bem] = createNamespace('popup');

import { DefaultSlots } from '../../utils/types';

import { PopupMixinProps } from '../../mixins/popup/type';

type Position = 'center' | 'top' | 'bottom' | 'left' | 'right';

const positions: Position[] = ['center', 'top', 'bottom', 'left', 'right'];

export type PopupProps = PopupMixinProps & {
  position: Position;
  duration: number;
  overlay: boolean;
  closeOnClickOverlay: boolean;
};

export interface PopupEvents {
  onClick(event: any): void;
  onOpened(event: any): void;
  onClosed(event: any): void;
  onOpen(event: any): void;
  onClose(event: any): void;
}

export interface PopupScopedSlots extends DefaultSlots {}

export default createComponent<PopupProps, PopupEvents, PopupScopedSlots>({
  mixins: [PopupMixin],

  props: {
    position: {
      type: String,
      default: 'center',
      validator: value => {
        return positions.indexOf(value) !== -1;
      },
    },
    duration: {
      type: Number,
      default: -1,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
  },

  beforeCreate(this: any) {
    const createEmitter = eventName => event => this.$emit(eventName, event);

    this.onClick = createEmitter('click');
    this.onOpened = createEmitter('opened');
    this.onClosed = createEmitter('closed');
  },

  render(this: any) {
    if (!this.shouldRender) {
      return;
    }

    const brandName = createBrandName();

    const { position, duration } = this;

    const transitionName =
      position === 'center' ? `${brandName}fade` : `${brandName}popup-slide-${position}`;

    const style = {} as Record<string, any>;
    if (duration >= 0) {
      style.transitionDuration = `${duration}s`;
    }

    return (
      <transition name={transitionName} onAfterEnter={this.onOpened} onAfterLeave={this.onClosed}>
        <div
          vShow={this.value}
          style={style}
          class={bem({ [position]: position })}
          onClick={this.onClick}
        >
          {this.slots()}
        </div>
      </transition>
    );
  },
});
