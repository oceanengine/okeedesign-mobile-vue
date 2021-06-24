import { createNamespace, createBrandName, isDef } from '../../utils';
import { inherit } from '../../utils/functional';
import { preventDefault } from '../../utils/dom/event';

// Types
import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

export type OverlayProps = {
  show?: boolean;
  zIndex?: number | string;
  duration: number | string | null;
  className?: any;
  customStyle?: any;
};

export type OverlayEvents = {
  click(event: Event): void;
};

const [createComponent, bem] = createNamespace('overlay');

function preventTouchMove(event: TouchEvent) {
  preventDefault(event, true);
}

function Overlay(
  // @ts-ignore
  h: CreateElement,
  props: OverlayProps,
  _slots: DefaultSlots,
  ctx: RenderContext<OverlayProps>,
) {
  const brandName = createBrandName();
  const style: { [key: string]: any } = {
    zIndex: props.zIndex,
    ...props.customStyle,
  };

  if (isDef(props.duration)) {
    style.transitionDuration = `${props.duration}s`;
  }

  return (
    <transition name={`${brandName}fade`}>
      <div
        vShow={props.show}
        style={style}
        class={[bem(), props.className]}
        onTouchmove={preventTouchMove}
        {...inherit(ctx, true)}
      />
    </transition>
  );
}

Overlay.props = {
  show: Boolean,
  duration: [Number, String],
  className: null as any,
  customStyle: null as any,
  zIndex: {
    type: [Number, String],
    default: 1,
  },
};

export default createComponent<OverlayProps, OverlayEvents>(Overlay);
