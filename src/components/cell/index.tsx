import { createNamespace, isDef } from '../../utils';
import { cellProps, SharedCellProps } from './shared';
import { emit, inherit } from '../../utils/functional';

// Types
import { CreateElement, RenderContext } from 'vue/types';
import { ScopedSlot, DefaultSlots } from '../../utils/types';
import { Mods } from '../../utils/create/bem';

export type CellProps = SharedCellProps;

export type CellSlots = DefaultSlots & {
  title?: ScopedSlot;
  label?: ScopedSlot;
  extra?: ScopedSlot;
  'right-icon'?: ScopedSlot;
};
export type CellEvents = {
  onClick?(event: Event): void;
};

const [createComponent, bem] = createNamespace('cell');

function Cell(
  // @ts-ignore
  h: CreateElement,
  props: CellProps,
  slots: CellSlots,
  ctx: RenderContext<CellProps>,
) {
  const { size, title, label, value, isLink, arrowDirection } = props;

  const showTitle = slots.title || isDef(title);
  const showValue = slots.default || isDef(value);
  const showLabel = slots.label || isDef(label);

  const Label = showLabel && (
    <div class={[bem('label'), props.labelClass]}>{slots.label ? slots.label() : label}</div>
  );

  const Title = showTitle && (
    <div class={[bem('title'), props.titleClass]} style={props.titleStyle}>
      {slots.title ? slots.title() : <span>{title}</span>}
      {Label}
    </div>
  );

  const Value = showValue && (
    <div class={[bem('value', { alone: !slots.title && !title }), props.valueClass]}>
      {slots.default ? slots.default() : <span>{value}</span>}
    </div>
  );

  const ArrowDirection = function (arrowDirection = 'right') {
    return (
      <i
        class={bem('right-icon')}
        domPropsInnerHTML={require(`!html-loader!../../../svg/arrow-${arrowDirection}.svg`)}
      ></i>
    );
  };

  const rightIconSlot = slots['right-icon'];
  const RightIcon = rightIconSlot ? rightIconSlot() : isLink && ArrowDirection(arrowDirection);

  function onClick(event: Event) {
    emit(ctx, 'click', event);
  }

  function onTouchstart(event: Event) {
    emit(ctx, 'touchstart', event);
  }

  const classes: Mods = {
    middle: props.middle,
    borderless: !props.border,
    clickable: isLink || props.clickable,
  };

  if (size) {
    classes[size] = size;
  }

  return (
    <div class={bem(classes)} onClick={onClick} onTouchstart={onTouchstart} {...inherit(ctx)}>
      {Title}
      {Value}
      {RightIcon}
      {slots.extra && slots.extra()}
    </div>
  );
}

Cell.props = {
  ...cellProps,
};

export default createComponent<CellProps, CellEvents, CellSlots>(Cell);
