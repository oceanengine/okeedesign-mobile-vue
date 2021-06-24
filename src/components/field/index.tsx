import { preventDefault } from '../../utils/dom/event';
import { resetScroll } from '../../utils/dom/reset-scroll';
import { createNamespace, isDef } from '../../utils';
import { getStringLen } from '../../utils/format/string';

import { DefaultSlots } from '../../utils/types';
import { ScopedSlot } from 'vue/types/vnode';

type FieldTypes = 'text' | 'number' | 'textarea';
type FieldSize = 'normal' | 'large';

export interface FieldProps {
  value: string | number;
  type: FieldTypes;
  size: FieldSize;
  placeholder: string;
  border: boolean;
  resetScroll: boolean;
  disabled: boolean;
  readonly: boolean;
  clearable: boolean;
  label: string;
  labelBlock: boolean;
  unit: string;
  errorText: string;
  byte: number;
  getLength: any;
  minlength: number;
  maxlength: number;
}

export interface FieldEvents {
  onBlur(event: any): void;
  onInput(value: any): void;
  onClick(event: any): void;
  onClear(event: any): void;
  onFocus(event: any): void;
}

export interface FieldScopedSlots extends DefaultSlots {
  label: ScopedSlot;
}

const [createComponent, bem, t] = createNamespace('field');

const type: FieldTypes[] = ['text', 'number', 'textarea'];
const size: FieldSize[] = ['normal', 'large'];

export default createComponent<FieldProps, FieldEvents, FieldScopedSlots>({
  inheritAttrs: false,

  props: {
    value: [String, Number],
    type: {
      type: String,
      default: type[0],
      validator: value => {
        return type.indexOf(value) !== -1;
      },
    },
    size: {
      type: String,
      default: size[0],
      validator: value => {
        return size.indexOf(value) !== -1;
      },
    },
    placeholder: {
      type: String,
    },
    border: {
      type: Boolean,
      default: true,
    },
    resetScroll: {
      type: Boolean,
      default: true,
    },
    disabled: Boolean,
    readonly: Boolean,
    clearable: Boolean,
    label: String,
    labelBlock: Boolean,
    unit: String,
    errorText: String,
    byte: Number,
    getLength: Function,
    minlength: Number,
    maxlength: Number,
  },

  data() {
    return {
      focused: false,
      inputLength: 0,

      currentValue: '',
      composing: false,
    };
  },

  watch: {
    value(val) {
      this.format(val);
    },
  },

  mounted() {
    this.format(this.value);
  },

  computed: {
    showClear() {
      return (
        this.clearable && this.focused && this.value !== '' && isDef(this.value) && !this.readonly
      );
    },

    listeners() {
      const listeners = {
        ...this.$listeners,
        input: this.onInput,
        focus: this.onFocus,
        blur: this.onBlur,
        compositionstart: this.onCompositionStart,
        compositionupdate: this.onCompositionUpdate,
        compositionend: this.onCompositionEnd,
      };

      delete listeners.click;

      return listeners;
    },
  },

  methods: {
    focus(this: any) {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },

    blur(this: any) {
      if (this.$refs.input) {
        this.$refs.input.blur();
      }
    },

    /**
     * @param {string} val
     */
    format(this: any, val) {
      const { length } = val;
      const { maxlength, byte, getLength } = this;
      this.tempArr = [];
      if (getLength && maxlength) {
        let pre = val;
        let preLength = getLength(pre);
        if (preLength <= maxlength) {
          this.inputLength = preLength;
          this.$emit('input', pre);
          return;
        }
        while (preLength > maxlength) {
          pre = pre.substring(0, pre.length - 1);
          preLength = getLength(pre);
        }
        this.inputLength = preLength;
        this.$emit('input', pre);
        return;
      }

      if (maxlength && byte) {
        if (getStringLen(val) > maxlength * byte) {
          for (let i = 0; i < length; i++) {
            this.tempArr.push(val[i]);
            if (getStringLen(this.tempArr.join('')) >= maxlength * byte - 1) {
              if (
                getStringLen(val[i + 1]) + getStringLen(this.tempArr.join('')) <=
                maxlength * byte
              ) {
                this.tempArr.push(val[i + 1]);
              }
              this.$emit('input', this.tempArr.join(''));
              break;
            }
          }
        }
        this.inputLength = Number((getStringLen(val) / byte).toFixed(0));
        return;
      }

      if (maxlength) {
        for (let i = 0; i < length; i++) {
          this.tempArr.push(val[i]);
          if (i >= maxlength - 1) {
            this.$emit('input', this.tempArr.join(''));
            break;
          }
        }
        this.inputLength = length;
        return;
      }
    },

    onInput(this: any, event) {
      if (this.composing) {
        this.currentValue = event.target.value;
        return;
      }

      this.$emit('input', event.target.value);
    },

    onCompositionStart(this: any) {
      this.composing = true;
    },
    onCompositionUpdate(this: any) {
      this.composing = true;
    },
    onCompositionEnd(this: any) {
      this.composing = false;
      this.$emit('input', this.currentValue);
    },

    onFocus(this: any, event) {
      this.focused = true;
      this.$emit('focus', event);

      if (this.readonly) {
        this.blur();
      }
    },

    onBlur(this: any, event) {
      this.focused = false;
      this.$emit('blur', event);

      if (this.resetScroll) resetScroll();
    },

    onClick(this: any, event) {
      this.$emit('click', event);
    },

    onClear(this: any, event) {
      preventDefault(event);
      this.$emit('input', '');
      this.$emit('clear', event);
    },
  },

  render(this: any) {
    const {
      type,
      size,
      disabled,
      readonly,
      showClear,
      border,
      placeholder,
      minlength,
      maxlength,
      value,
      $attrs,
      listeners,
      onClear,
      onClick,
      inputLength,
      label,
      unit,
      errorText,
      labelBlock,
      $scopedSlots: { label: slotLabel = this.$slots.label, length: slotLength },
    } = this;

    const isTextarea = type === 'textarea';

    const classes = bem([
      size,
      {
        disabled,
        readonly,
        border,
        maxlength,
        input: !isTextarea,
        'label--block': labelBlock,
        textarea: isTextarea,
        'no-border': isTextarea && !border,
        error: Boolean(errorText),
      },
    ]);

    const inputProp = {
      class: [bem('input'), !isTextarea && bem('item')],
      ref: 'input',
      domProps: { value },
      attrs: {
        ...$attrs,
        placeholder: placeholder === undefined ? t('placeholder') : placeholder,
        readonly,
        disabled,
      },
      on: listeners,
    };

    function renderLabel() {
      if (slotLabel || label) {
        return (
          <div
            class={[bem('label', { block: labelBlock }), !labelBlock && !isTextarea && bem('item')]}
          >
            {(typeof slotLabel === 'function' ? slotLabel() : slotLabel) || label}
          </div>
        );
      }
    }

    function renderInput() {
      return isTextarea ? <textarea {...inputProp} /> : <input type={type} {...inputProp} />;
    }

    function renderClear() {
      return (
        showClear && (
          <i
            class={[bem('clear'), bem('item')]}
            onTouchstart={onClear}
            domPropsInnerHTML={require(`!html-loader!../../../svg/close-one.svg`)}
          ></i>
        )
      );
    }

    function renderUnit() {
      return unit && !isTextarea && <div class={[bem('label-right'), bem('item')]}>{unit}</div>;
    }

    function renderWordLimit() {
      if (slotLength || maxlength) {
        return (
          <div class={[bem('word-limit'), !isTextarea && bem('item')]}>
            {slotLength
              ? slotLength({ length: inputLength, minlength, maxlength })
              : `${inputLength}/${maxlength}`}
          </div>
        );
      }
    }

    return (
      <div class={classes} onClick={onClick}>
        <div class={bem('body')}>
          {renderLabel()}
          {renderInput()}
          {renderClear()}
          {renderUnit()}
          {renderWordLimit()}
        </div>
        {errorText && <div class={bem('error-text')}>{errorText}</div>}
      </div>
    );
  },
});
