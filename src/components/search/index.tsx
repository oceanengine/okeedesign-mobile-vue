import { createNamespace, value2DomUnit } from '../../utils';
import { inherit, emit } from '../../utils/functional';
import { preventDefault } from '../../utils/dom/event';
import Field from '../field';

// Types
import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots, ScopedSlot } from '../../utils/types';

const [createComponent, bem] = createNamespace('search');

export type SearchProps = {
  value?: string;
  left: string;
  right?: string;
  clearable: boolean;
  background: string;
  cancelable?: boolean;
  borderRadius: number | string;
};

export type SearchSlots = DefaultSlots & {
  left?: ScopedSlot;
  icon?: ScopedSlot;
  right?: ScopedSlot;
};

export type SearchEvents = {
  onCancel?(): void;
  onInput?(value: string): void;
  onSearch?(value: string): void;
  onKeypress?(event: KeyboardEvent): void;
};

function Search(
  // @ts-ignore
  h: CreateElement,
  props: SearchProps,
  slots: SearchSlots,
  ctx: RenderContext<SearchProps>,
) {
  function Icon() {
    if (slots.icon) {
      return <div class={bem('icon-slot-box')}>{slots.icon()}</div>;
    } else {
      return (
        <i
          class={bem('icon')}
          domPropsInnerHTML={require(`!html-loader!../../../svg/search.svg`)}
        />
      );
    }
  }

  const fieldData = {
    attrs: ctx.data.attrs,
    on: {
      ...ctx.listeners,
      input(value: string) {
        emit(ctx, 'input', value);
      },
      keypress(event: KeyboardEvent) {
        if (event.keyCode === 13) {
          preventDefault(event);
          emit(ctx, 'search', props.value);
        }
        emit(ctx, 'keypress', event);
      },
    },
  };

  const inheritData = inherit(ctx);
  delete inheritData.attrs;

  return (
    <div class={bem()} {...inheritData}>
      {slots.left && <div class={bem('left')}>{slots.left()}</div>}
      <div class={bem('content')} style={{ borderRadius: value2DomUnit(props.borderRadius) }}>
        {Icon()}
        <Field border={false} value={props.value} clearable={props.clearable} {...fieldData} />
      </div>
      {props.cancelable && (
        <div class={bem('action')}>
          <div
            onClick={() => {
              emit(ctx, 'input', '');
              emit(ctx, 'cancel');
            }}
          >
            Cancel
          </div>
        </div>
      )}
      {slots.right && <div class={bem('right')}>{slots.right()}</div>}
    </div>
  );
}

Search.props = {
  value: String,
  cancelable: Boolean,
  borderRadius: [Number, String],
  clearable: {
    type: Boolean,
    default: true,
  },
};

export default createComponent<SearchProps, SearchEvents, SearchSlots>(Search);
