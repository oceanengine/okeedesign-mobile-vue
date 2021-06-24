import { createNamespace, value2DomUnit } from '../../utils';
import { inherit } from '../../utils/functional';

import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

export type IconProps = {
  name: string;
  fill?: string;
  size?: string | number;
};

export type IconEvents = {
  onClick?(event: Event): void;
};

const [createComponent, bem] = createNamespace('icon');

function Icon(
  // @ts-ignore
  h: CreateElement,
  props: IconProps,
  slots: DefaultSlots,
  ctx: RenderContext<IconProps>,
) {
  const defaultSlots = slots.default && slots.default();
  if (defaultSlots) {
    return (
      <i
        class={bem()}
        style={{
          fill: props.fill,
          width: value2DomUnit(props.size),
          height: value2DomUnit(props.size),
        }}
        {...inherit(ctx, true)}
      >
        {defaultSlots}
      </i>
    );
  }
  if (props.name === 'square-uncheck' || props.name === 'radio-uncheck') {
    return (
      <i
        class={bem([props.name])}
        style={{
          fill: props.fill,
          width: value2DomUnit(props.size),
          height: value2DomUnit(props.size),
        }}
        {...inherit(ctx, true)}
      />
    );
  }
  return (
    <i
      class={bem([props.name])}
      style={{
        fill: props.fill,
        width: value2DomUnit(props.size),
        height: value2DomUnit(props.size),
      }}
      domPropsInnerHTML={require(`!html-loader!./icon/${props.name}.svg`)}
      {...inherit(ctx, true)}
    />
  );
}

Icon.props = {
  name: String,
  size: [Number, String],
  fill: String,
};

export default createComponent<IconProps, IconEvents>(Icon);
