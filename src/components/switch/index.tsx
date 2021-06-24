import { CreateElement, RenderContext } from 'vue/types';
import { createNamespace } from '../../utils';
import { DefaultSlots } from '../../utils/types';
import { emit, inherit } from '../../utils/functional';
import Loading from '../loading';

export type SwitchSize = 'normal' | 'large';

export type SwitchProps = {
  size: SwitchSize;
  value: boolean | number;
  disabled?: boolean;
  loading?: boolean;
};

export type SwitchEvents = {
  onChange?(value: boolean): void;
};

const [createComponent, bem] = createNamespace('switch');

function Switch(
  // @ts-ignore
  h: CreateElement,
  props: SwitchProps,
  _slots: DefaultSlots,
  ctx: RenderContext<SwitchProps>,
) {
  const { size, disabled, loading } = props;
  let { value } = props;
  value = Boolean(value);

  function onClick() {
    if (!disabled && !loading) {
      emit(ctx, 'input', !value);
      emit(ctx, 'change', !value);
    }
  }

  return (
    <div
      class={[
        bem({
          checked: value,
          disabled,
        }),
        size,
      ]}
      onClick={onClick}
      {...inherit(ctx)}
    >
      <div class={bem('show')}>
        {loading && (
          <Loading class={bem('loading')} size={size === 'large' ? '0.6rem' : '0.5rem'} />
        )}
      </div>
    </div>
  );
}

Switch.props = {
  size: {
    type: String,
    default: 'normal',
  },
  value: [Boolean, String],
  disabled: Boolean,
  loading: Boolean,
};

export default createComponent<SwitchProps, SwitchEvents>(Switch);
