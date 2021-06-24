import { VNode } from 'vue';
import { createNamespace, createBrandName } from '../../utils';
import { emit, inherit } from '../../utils/functional';
import Popup from '../popup';
import Loading from '../loading';

import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots, ScopedSlot } from '../../utils/types';

// Types
import { PopupMixinProps } from '../../mixins/popup/type';

export interface ActionSheetItem {
  /**
   * The title of item.
   */
  name: string;

  /**
   * The subtitle of item.
   */
  subname?: string;

  /**
   * If in loading status or not.
   */
  loading?: boolean;

  /**
   * Disabled the item
   */
  disabled?: boolean;

  /**
   * Apply custom CSS class name to item.
   */
  className?: string;

  /**
   * Optional callback when item is clicked.
   */
  callback?: (item: ActionSheetItem) => void;

  /**
   * Customize extra content of item, can overwrite the `$scopedSlot.extra`.
   */
  extra?: (props: ActionSheetExtraSlotProps) => VNode;
}

export type ActionSheetAlign = 'center' | 'left';

export type ActionSheetProps = PopupMixinProps & {
  title?: string;
  actions?: ActionSheetItem[];
  cancelText?: string;
  showClose?: boolean;
  align?: ActionSheetAlign;
  divider?: boolean;

  closeOnClickAction?: boolean;
  safeAreaInsetBottom?: boolean;

  duration: number;
};

export interface ActionSheetExtraSlotProps {
  item: ActionSheetItem;
  index: number;
}

export type ActionSheetScopedSlots = DefaultSlots & {
  extra?: ScopedSlot;
};

const [createComponent, bem] = createNamespace('action-sheet');

function ActionSheet(
  // @ts-ignore
  h: CreateElement,
  props: ActionSheetProps,
  slots: ActionSheetScopedSlots,
  context: RenderContext<ActionSheetProps>,
) {
  const brandName = createBrandName();
  const {
    title,
    actions,
    cancelText,
    showClose,
    align,
    divider,
    closeOnClickAction,
    safeAreaInsetBottom,
    ...popupProps
  } = props;
  const defaultSlot = slots.default;
  const extraSlot = slots.extra;

  function onCancel() {
    emit(context, 'input', false);
    emit(context, 'cancel');
  }

  function Header() {
    if (title) {
      return (
        <div class={[bem('header'), divider && `${brandName}hairline--bottom`]}>
          {title}
          {Close()}
        </div>
      );
    }
  }

  function Close() {
    return (
      !!showClose && (
        <i
          class={[bem('close')]}
          domPropsInnerHTML={require(`!html-loader!./icon/close-big.svg`)}
          onClick={onCancel}
        ></i>
      )
    );
  }

  function Content() {
    if (defaultSlot) {
      return <div class={bem('content')}>{defaultSlot()}</div>;
    }
  }

  function Option(item: ActionSheetItem, index: number) {
    const { name, subname, loading, disabled, className, callback, extra } = item;

    function onClickOption(event: MouseEvent) {
      event.stopPropagation();

      if (disabled || loading) {
        return;
      }

      if (callback) {
        callback(item);
      }

      emit(context, 'select', item, index);

      if (closeOnClickAction) {
        emit(context, 'input', false);
      }
    }

    function OptionContent() {
      if (loading) {
        return <Loading size="1rem"/>;
      }

      return (
        <div class={bem('option-content', [align, { subname }])}>
          <span class={bem('name')}>{name}</span>
          {!!subname && <span class={bem('subname')}>{subname}</span>}
        </div>
      );
    }

    const extraProps: ActionSheetExtraSlotProps = { item, index };
    const extraContent = (!!extra && extra(extraProps)) || (extraSlot && extraSlot(extraProps));

    return (
      <div
        class={[
          bem('item', { disabled: loading || disabled }),
          className,
          divider && `${brandName}hairline--top`,
        ]}
        onClick={onClickOption}
      >
        {OptionContent()}
        {extraContent && <div class={bem('option-extra')}>{extraContent}</div>}
      </div>
    );
  }

  function CancelText() {
    if (cancelText) {
      return (
        <div class={bem('cancel')} onClick={onCancel}>
          <div class={bem('cancel__text')}>{cancelText}</div>
        </div>
      );
    }
  }

  return (
    <Popup
      class={bem({ 'safe-area-inset-bottom': safeAreaInsetBottom })}
      position="bottom"
      value={popupProps.value}
      overlay={popupProps.overlay}
      duration={popupProps.duration}
      lazyRender={popupProps.lazyRender}
      closeOnClickOverlay={popupProps.closeOnClickOverlay}
      {...inherit(context, true)}
    >
      {Header()}
      {!!actions && actions.length > 0 && actions.map(Option)}
      {Content()}
      {CancelText()}
    </Popup>
  );
}

export default createComponent<ActionSheetProps>(ActionSheet);
