import { createNamespace, createBrandName } from '../../utils';
import { ParentMixin } from '../../mixins/relation';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

type HeaderType = 'default' | 'primary';

export interface HeaderProps {
  text: string;
  type: HeaderType;
  border: boolean;
  leftArrow: boolean;
  fixed: boolean;
  maxZIndex: boolean;
  zIndex: number;
}

export interface HeaderEvents {
  onClickLeft(event: any): void;
  onClickRight(event: any): void;
}

export type HeaderScopedSlots = DefaultSlots & {
  left?: ScopedSlot;
  right?: ScopedSlot;
};

const [createComponent, bem] = createNamespace('header');

const types = ['default', 'primary'];

export default createComponent<HeaderProps, HeaderEvents, HeaderScopedSlots>({
  mixins: [ParentMixin('bytedHeader')],
  props: {
    title: String,
    type: {
      type: String,
      default: types[0],
      validator: value => {
        return types.indexOf(value) !== -1;
      },
    },
    leftArrow: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    fixed: Boolean,
    zIndex: Number,
    maxZIndex: Boolean,
  },
  methods: {
    onLeftClick(this: any, event) {
      this.$emit('click-left', event);
    },
    onRightClick(this: any, event) {
      this.$emit('click-right', event);
    },
  },
  render(this: any) {
    const brandName = createBrandName();
    const { type, leftArrow, border, fixed, zIndex, maxZIndex } = this;

    const leftSlot =
      this.slots('left') ||
      (leftArrow && (
        <i
          class={bem('icon')}
          style={{
            fill: type === 'default' ? '' : '#ffffff',
            width: '1.2rem',
            height: '1.2rem',
          }}
          domPropsInnerHTML={require(`!html-loader!./icon/back.svg`)}
        ></i>
      ));
    const rightSlot = this.slots('right');

    const title = this.slots() || this.title;
    const Title = title && <div class={bem('title')}>{title}</div>;

    const wrapperClass = [];
    if (fixed) {
      wrapperClass.push(`${brandName}header--wrapper`);
    }

    let hasBorder = false;
    const typeIsDefault = type === types[0];
    if (typeIsDefault) {
      hasBorder = border;
    }

    const classes = [
      bem([
        type,
        {
          fixed,
        },
        {
          maxZIndex,
        },
      ]),
      {
        [`${brandName}hairline--bottom`]: hasBorder,
      },
    ];

    const style = zIndex ? `z-index: ${zIndex}` : '';

    const Header = (
      <div class={classes} style={style}>
        {leftSlot ? (
          <div class={bem('left')} onclick={this.onLeftClick}>
            {leftSlot}
          </div>
        ) : (
          <div class={bem('left')}></div>
        )}
        {Title}
        {rightSlot ? (
          <div class={bem('right')} onclick={this.onRightClick}>
            {rightSlot}
          </div>
        ) : (
          <div class={bem('right')}></div>
        )}
      </div>
    );

    return fixed ? <div class={wrapperClass}>{Header}</div> : Header;
  },
});
