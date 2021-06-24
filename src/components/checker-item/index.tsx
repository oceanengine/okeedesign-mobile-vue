import { createNamespace, createBrandName } from '../../utils';
import { ChildrenMixin } from '../../mixins/relation';
import { stopPropagation } from '../../utils/dom/event';
import Badge from '../badge';

export interface CheckerItemProps {
  value: string | number;
  label: string;
  name: string;
  info: string | number;
  disabled: boolean;
}

export interface CheckerItemEvents {
  onChange(value: any): void;
  onInput(value: any): void;
  onClick(value: any): void;
  onTouchstart(value: any): void;
}

const [createComponent, bem] = createNamespace('checker-item');

export default createComponent<CheckerItemProps, CheckerItemEvents>({
  mixins: [ChildrenMixin('bytedChecker')],
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    info: {
      type: [String, Number],
      default: '',
    },
    disabled: Boolean,
  },
  computed: {
    isCheckbox() {
      const { inputType } = this.parent;

      return inputType && inputType === 'checkbox';
    },
    checked() {
      const { value } = this.parent;

      return this.isCheckbox ? value.indexOf(this.value) > -1 : value === this.value;
    },
    inputId: function inputId() {
      const brandName = createBrandName();
      return `${brandName}checkbox-input-${this._uid}`;
    },
  },
  methods: {
    getCheckboxValue(this: any) {
      const newParentValue = [];

      this.parent.children.forEach(child => {
        if (child._uid !== this._uid) {
          if (child.checked) {
            newParentValue.push(child.value);
          }
        } else if (!this.checked) {
          newParentValue.push(this.value);
        }
      });

      return newParentValue;
    },

    onChange(this: any) {
      if (!this.disabled) {
        this.parent.$emit('input', this.getCheckboxValue());
        this.parent.$emit('change', this.getCheckboxValue());
      }
    },

    onClick(this: any, event) {
      if (event.target === this.$refs[this.inputId]) {
        stopPropagation(event);
      } else {
        if (this.disabled) return;

        this.$emit('click', event);
        this.parent.$emit('click', event);

        if (!this.isCheckbox && !this.checked) {
          this.parent.$emit('input', this.value);
        }
      }
    },

    onTouchStart(this: any, event) {
      if (event.target === this.$refs[this.inputId]) {
        stopPropagation(event);
      } else {
        if (this.disabled) return;

        this.$emit('touchstart');
      }
    },
  },
  render(this: any) {
    const brandName = createBrandName();
    const { typeError } = this.parent;
    if (typeError) return null;

    const { type, round, size } = this.parent;
    const classes = bem([
      type,
      size,
      {
        round,
        active: this.checked,
        disabled: this.disabled,
      },
      {
        [`${brandName}hairline--surround`]: type !== 'default',
      },
    ]);

    const content = this.slots() || <div class={bem('label')}>{this.label}</div>;

    return (
      <label class={classes} onTouchstart={this.onTouchStart} onClick={this.onClick}>
        {!this.isCheckbox && (
          <input
            type="radio"
            ref={this.inputId}
            name={this.name}
            value={this.value}
            checked={this.checked}
          />
        )}
        {this.isCheckbox && (
          <input
            type="checkbox"
            ref={this.inputId}
            name={this.name}
            value={this.value}
            checked={this.checked}
            onchange={this.onChange}
          />
        )}
        {content}
        {this.isCheckbox && this.checked && type === 'default' && !round && (
          <i
            class={bem('icon')}
            style={{ width: '.8rem', height: '.8rem' }}
            domPropsInnerHTML={require(`!html-loader!./icon/checker.svg`)}
          ></i>
        )}
        {this.info && <Badge class={bem('badge')} value={this.info}></Badge>}
      </label>
    );
  },
});
