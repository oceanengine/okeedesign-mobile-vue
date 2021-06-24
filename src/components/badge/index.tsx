import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

import { createNamespace } from '../../utils';
import { emit, inherit } from '../../utils/functional';

export type BadgeProps = {
  value: number | string;
  max: number;
  isDot: boolean;
};

export type BadgeEvents = {
  onClick?(event: Event): void;
};

const [createComponent, bem] = createNamespace('badge');

function Badge(
  // @ts-ignore
  h: CreateElement,
  props: BadgeProps,
  slots: DefaultSlots,
  ctx: RenderContext<BadgeProps>,
) {
  function onClick(event: Event) {
    emit(ctx, 'click', event);
  }

  const { value, max, isDot } = props;

  let info: number | string = '';

  if (!isDot) {
    info = max && typeof value === 'number' && max < value ? `${max}+` : value;
  }

  return (
    <div {...inherit(ctx)} class={bem()} onclick={onClick}>
      {slots.default ? slots.default() : ''}
      <sup class={bem('info', { 'is-dot': isDot })}>{info}</sup>
    </div>
  );
}

Badge.props = {
  value: {
    type: [Number, String],
    default: '',
  },
  max: {
    type: Number,
    default: 0,
  },
  isDot: {
    type: Boolean,
    default: false,
  },
};

export default createComponent<BadgeProps, BadgeEvents>(Badge);
