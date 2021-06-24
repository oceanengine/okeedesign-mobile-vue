import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

import { createNamespace, createBrandName } from '../../utils';
import { emit, inherit } from '../../utils/functional';
import { value2DomUnit } from '../../utils/dom/unit';

export type LoadingType = 'default' | 'circle';

export type LoadingProps = {
  type: LoadingType;
  text?: string;
  size?: string | number;
  vertical?: boolean;
};

export type LoadingEvents = {
  onClick?(event: Event): void;
};

const [createComponent, bem] = createNamespace('loading');

function Loading(
  // @ts-ignore
  h: CreateElement,
  props: LoadingProps,
  slots: DefaultSlots,
  ctx: RenderContext<LoadingProps>,
) {
  const brandName = createBrandName();

  function onClick(event: Event) {
    emit(ctx, 'click', event);
  }

  const { type, text, vertical, size } = props;

  const style: { [key: string]: string | string } = {};

  if (size) {
    style.width = value2DomUnit(size);
    style.height = value2DomUnit(size);
  }

  const message = slots.default ? slots.default() : text;

  return (
    <div class={bem({ vertical })} onclick={onClick} {...inherit(ctx)}>
      <i
        class={[bem('icon'), `${brandName}loading-circle`]}
        style={style}
        domPropsInnerHTML={require(`!html-loader!./icon/${type}.svg`)}
      />
      {message && <div class={bem('text')}>{message}</div>}
    </div>
  );
}

Loading.props = {
  type: {
    type: String,
    default: 'default',
  },
  text: String,
  size: [String, Number],
  vertical: Boolean,
};

export default createComponent<LoadingProps, LoadingEvents>(Loading);
