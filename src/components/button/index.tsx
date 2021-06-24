import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

import { createNamespace, createBrandName } from '../../utils';
import { emit, inherit } from '../../utils/functional';
import Loading from '../loading';

export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'text';

export type ButtonSize = 'large' | 'normal' | 'small' | 'midget' | 'mini' | 'tiny';

export type ButtonProps = {
  type: ButtonType;
  size: ButtonSize;
  text?: string;
  plain?: boolean;
  fade?: boolean;
  round?: boolean;
  square?: boolean;
  hairline?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export type ButtonEvents = {
  onClick?(event: Event): void;
};

const [createComponent, bem] = createNamespace('button');

function Button(
  // @ts-ignore
  h: CreateElement,
  props: ButtonProps,
  slots: DefaultSlots,
  ctx: RenderContext<ButtonProps>,
) {
  const brandName = createBrandName();

  function onClick(event: Event) {
    if (!disabled) {
      emit(ctx, 'click', event);
    }
  }

  function onTouchstart(event: TouchEvent) {
    if (!disabled) {
      emit(ctx, 'touchstart', event);
    }
  }

  const { type, size, round, square, fade, hairline, disabled, loading } = props;
  let { plain } = props;

  if (fade || hairline) plain = true;

  const classes = [
    bem([
      type,
      size,
      {
        plain,
        fade,
        round,
        square,
        hairline,
        disabled,
      },
    ]),
    { [`${brandName}hairline--surround`]: plain },
  ];

  const Content = () => {
    if (loading) {
      return <Loading class={bem('loading')} />;
    }
    return null;
  };

  return (
    <div class={classes} onclick={onClick} onTouchstart={onTouchstart} {...inherit(ctx)}>
      {Content()}
      {slots.default ? slots.default() : props.text}
    </div>
  );
}

Button.props = {
  type: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'normal',
  },
  text: String,
  plain: Boolean,
  fade: Boolean,
  round: Boolean,
  square: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  loading: Boolean,
};

export default createComponent<ButtonProps, ButtonEvents>(Button);
