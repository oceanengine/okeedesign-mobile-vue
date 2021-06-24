import { createNamespace, createBrandName } from '../../utils';
import { PopupMixin } from '../../mixins/popup';
import Button from '../button';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

const [createComponent, bem, t] = createNamespace('dialog');

type DialogSize = 'small' | 'normal' | 'large';

export interface DialogProps {
  title: string;
  message: string;
  className: null;
  callback: any;
  beforeClose: any;
  size: DialogSize[];
  cancelButtonText: string;
  confirmButtonText: string;
  showCancelButton: boolean;
  showConfirmButton: boolean;
  overlay: boolean;
  closeOnClickOverlay: boolean;
  appendToBody: boolean;
  actions: any[];
}

export interface DialogEvents {
  onChange(index: number): void;
}

export type DialogScopedSlots = DefaultSlots & {
  indicator?: ScopedSlot;
};

const size = ['small', 'normal', 'large'];

export default createComponent<DialogProps, DialogEvents, DialogScopedSlots>({
  mixins: [PopupMixin],

  props: {
    title: String,
    message: String,
    className: null,
    callback: Function,
    beforeClose: Function,
    size: {
      type: String,
      default: size[1],
    },
    cancelButtonText: String,
    confirmButtonText: String,
    showCancelButton: Boolean,
    showConfirmButton: {
      type: Boolean,
      default: true,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      loading: {
        confirm: false,
        cancel: false,
      },
    };
  },

  methods: {
    onClickOverlay(this: any) {
      this.handleAction('overlay');
    },

    handleAction(this: any, action) {
      this.$emit(action);

      if (this.beforeClose) {
        this.loading[action] = true;
        this.beforeClose(action, state => {
          if (state !== false) {
            this.onClose(action);
          }
          this.loading[action] = false;
        });
      } else {
        this.onClose(action);
      }
    },

    onClose(this: any, action) {
      this.close();

      if (this.callback) {
        this.callback(action);
      }
    },
  },

  render(this: any) {
    if (!this.shouldRender) {
      return;
    }

    const brandName = createBrandName();
    const { message } = this;
    const messageSlot = this.slots();
    const hasContent = Boolean(messageSlot || message);

    const title = this.slots('title') || this.title;
    const Title = title && <div class={bem('header', { 'has-content': hasContent })}>{title}</div>;

    const Content = hasContent && (
      <div class={bem('content')}>
        {messageSlot || (
          <div domPropsInnerHTML={message} class={bem('message', { 'has-title': title })} />
        )}
      </div>
    );

    const hasButton = this.showCancelButton || this.showConfirmButton;
    const hasButtons = this.showCancelButton && this.showConfirmButton;

    const ButtonGroup = hasButton && (
      <div class={[bem('footer'), `${brandName}hairline--top`]}>
        {this.showCancelButton && (
          <Button
            class={bem('cancel')}
            loading={this.loading.cancel}
            text={this.cancelButtonText || t('cancel')}
            onClick={() => {
              this.handleAction('cancel');
            }}
          />
        )}
        {this.showConfirmButton && (
          <Button
            class={[bem('confirm'), { [`${brandName}hairline--left`]: hasButtons }]}
            loading={this.loading.confirm}
            text={this.confirmButtonText || t('confirm')}
            onClick={() => {
              this.handleAction('confirm');
            }}
          />
        )}
      </div>
    );

    const Actions = this.actions && this.actions.length > 0 && (
      <div class={bem('actions')}>
        {this.actions.map(item => {
          return (
            <Button
              class={[bem('action'), `${brandName}hairline--top`]}
              text={item.name}
              onClick={() => {
                this.close();
                this.actionCallback && this.actionCallback(item);
              }}
            />
          );
        })}
      </div>
    );

    return (
      <transition name={`${brandName}dialog-bounce`}>
        <div
          role="dialog"
          vShow={this.value}
          aria-labelledby={this.title || message}
          class={[bem([this.size]), this.className]}
        >
          {Title}
          {Content}
          {ButtonGroup}
          {Actions}
        </div>
      </transition>
    );
  },
});
