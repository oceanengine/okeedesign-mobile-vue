import { createNamespace } from '../../utils';

const [createComponent, bem] = createNamespace('notice-bar');

import { DefaultSlots, ScopedSlot } from '../../utils/types';

type NoticeBarType = 'warning' | 'primary' | 'success' | 'danger';

export interface NoticeBarProps {
  text: string;
  ellipsis: number;
  isLink: boolean;
  showClose: boolean;
  type: NoticeBarType;
}

export interface NoticeBarEvents {
  onClick(event: any): void;
  onClose(event: any): void;
}

export type NoticeBarScopedSlots = DefaultSlots & {
  left?: ScopedSlot;
  right?: ScopedSlot;
};

const types: NoticeBarType[] = ['warning', 'primary', 'success', 'danger'];

export default createComponent<NoticeBarProps, NoticeBarEvents, NoticeBarScopedSlots>({
  props: {
    text: String,
    ellipsis: Number,
    isLink: Boolean,
    showClose: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: types[0],
      validator: value => {
        return types.indexOf(value) > -1;
      },
    },
  },

  data() {
    return {
      showNoticeBar: true,
    };
  },

  computed: {
    hasRight() {
      return this.showClose || this.isLink;
    },
  },

  methods: {
    onClick(this: any, event) {
      this.$emit('click', event);
    },

    onClose(this: any, event) {
      this.showNoticeBar = false;
      this.$emit('close', event);
    },
  },

  render(this: any) {
    const { slots, type, showClose, isLink, ellipsis, onClick, onClose } = this;
    const barStyle = {
      '-webkit-line-clamp': ellipsis,
    };

    function IconSlot(slot) {
      const svgs = ['attention', 'info', 'check-one', 'close-one'];
      if (slot) {
        return <div class={[bem('left')]}>{slot}</div>;
      }
      return (
        <i
          class={[bem('left', ['icon'])]}
          domPropsInnerHTML={require(`!html-loader!../../../svg/${svgs[types.indexOf(type)]}.svg`)}
        ></i>
      );
    }

    function LeftSlot() {
      const slot = slots('left');
      return IconSlot(slot);
    }

    function RightSlot() {
      const slot = slots('right');

      if (slot) {
        return <div class={bem('right')}>{slot}</div>;
      }

      if (showClose) {
        return (
          <i
            class={bem('right', ['icon'])}
            onClick={onClose}
            domPropsInnerHTML={require(`!html-loader!./icon/close.svg`)}
          ></i>
        );
      } else if (isLink) {
        return (
          <i
            class={bem('right', ['icon'])}
            domPropsInnerHTML={require(`!html-loader!../../../svg/arrow-right.svg`)}
          ></i>
        );
      }
      return '';
    }

    return (
      <div vShow={this.showNoticeBar} class={bem('', type)} onClick={onClick}>
        {LeftSlot()}
        <div class={bem('content', [{ right: this.hasRight }])} style={barStyle}>
          {slots() || this.text}
        </div>
        {RightSlot()}
      </div>
    );
  },
});
