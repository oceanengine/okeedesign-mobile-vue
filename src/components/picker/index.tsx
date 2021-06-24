import { createNamespace, createBrandName } from '../../utils';
import { BORDER_BOTTOM, BORDER_TOP_BOTTOM } from '../../utils/const';

import Button from '../button';
import PickerColumn, { DEFAULT_DURATION, SWIPE_DURATION } from '../picker-column';
import type { PickerColumnProps } from '../picker-column';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

type PickerValue = string | number;
type PickerOption = {
  value: PickerValue;
  label: string;
};

export interface PickerProps
  extends Pick<PickerColumnProps, 'transitionDuration' | 'swipeDuration'> {
  value: PickerValue | PickerValue[];
  options: PickerOption[];
  showToolbar: boolean;
  title: string;
  cancelButtonText: string;
  confirmButtonText: string;
  showCancelButton: boolean;
}

export interface PickerEvents {
  onChange(index: PickerValue): void;
  onInput(index: PickerValue): void;
  onCancel(event: any): void;
  onConfirm(event: any): void;
}

export interface PickerScopedSlots extends DefaultSlots {
  title: ScopedSlot;
  left: ScopedSlot;
  right: ScopedSlot;
}

const [createComponent, bem, t] = createNamespace('picker');

export default createComponent<PickerProps, PickerEvents, PickerScopedSlots>({
  props: {
    value: {
      type: [String, Number, Array],
    },
    options: {
      type: Array,
      default: [],
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    title: String,
    cancelButtonText: String,
    confirmButtonText: String,
    showCancelButton: {
      type: Boolean,
      default: true,
    },

    transitionDuration: {
      type: Number,
      default: DEFAULT_DURATION,
    },
    swipeDuration: {
      type: Number,
      default: SWIPE_DURATION,
    },
  },

  data() {
    const brandName = createBrandName();
    return {
      maxButtonWidth: 0,
      pickerToolbarButtonCancel: `${brandName}picker-toolbar-button-cancel`,
      pickerToolbarButtonConfirm: `${brandName}picker-toolbar-button-confirm`,
    };
  },

  watch: {
    cancelButtonText() {
      this.setMaxButtonWidth();
    },
    confirmButtonText() {
      this.setMaxButtonWidth();
    },
  },

  mounted() {
    this.setMaxButtonWidth();
  },

  computed: {
    multipleColumns() {
      /**
       * 多级判断
       */
      return Array.isArray(this.options[0]);
    },
    isCascader() {
      /**
       * 级联判断
       */
      return this.multipleColumns ? false : this.checkArrayChildren(this.options);
    },
    values() {
      /**
       * 多列选择项选中值
       */
      return this.multipleColumns || this.isCascader ? this.value : [this.value];
    },
    columns() {
      /**
       * 多列选择项
       */
      const { multipleColumns, isCascader, options, values } = this;

      if (multipleColumns) {
        return options;
      }

      if (isCascader) {
        const columns = [];

        this.setCascaderColumns(columns, options, values, 0);

        return columns;
      }

      return [options];
    },
  },

  methods: {
    setMaxButtonWidth(this: any) {
      /**
       * 计算按钮的最大宽度
       */
      this.$nextTick(() => {
        this.maxButtonWidth = Math.max(
          this.getDomWidth(this.pickerToolbarButtonCancel),
          this.getDomWidth(this.pickerToolbarButtonConfirm),
        );
      });
    },
    getDomWidth(this: any, refName) {
      const DOM = this.$refs[refName];
      return DOM && DOM.scrollWidth ? DOM.scrollWidth : 0;
    },
    checkValue(this: any) {
      /**
       * 校验传入数据类型
       */
      const { multipleColumns, isCascader, value } = this;

      if (multipleColumns) {
        if (!Array.isArray(value)) {
          console.warn('选择器为多级时value值必须为Array');
          return false;
        }
        if (value.length !== this.options.length) {
          console.warn('选择器为多级时value数组长度必须等于options数组长度');
          return false;
        }
      } else if (isCascader) {
        if (!Array.isArray(value)) {
          console.warn('选择器为级联时value值必须为Array');
          return false;
        }
      } else if (Array.isArray(value)) {
        console.warn('单级选择器value不能为Array');
        return false;
      }

      return true;
    },

    checkArrayChildren(arr) {
      /**
       * 校验数组中是否包含children
       */
      return arr.some(i => typeof i === 'object' && Array.isArray(i.children) && i.children.length);
    },

    setCascaderColumns(this: any, columns, options, values, index) {
      /**
       * 设置联动多列选择项数据
       */
      const value = values[index];

      if (value !== undefined) {
        let children = [];

        options.some(option => {
          if (option.value === value) {
            columns.push(options);

            const chd = option.children;

            if (Array.isArray(chd) && chd.length) {
              children = chd;
            }

            return true;
          }
        });

        if (children.length > 0) {
          this.setCascaderColumns(columns, children, values, ++index);
        }
      }
    },

    onColumnChange(this: any, v, index) {
      if (this.multipleColumns) {
        const value = this.values.slice();
        value[index] = v;

        this.$emit('input', value);
        this.$emit('change', value);
        return;
      }

      if (this.isCascader) {
        const value = [];
        for (let i = 0; i < index; i++) {
          value.push(this.values[i]);
        }
        value[index] = v;

        let children = [];
        this.columns[index].some(column => {
          if (column.value === v && Array.isArray(column.children) && column.children.length) {
            children = column.children.slice();
            return true;
          }
        });

        if (children.length) {
          this.setCascaderValue(children, value, ++index);
        }

        this.$emit('input', value);
        this.$emit('change', value);
        return;
      }

      this.$emit('input', v);
      this.$emit('change', v);
    },

    setCascaderValue(this: any, column, valueArr, index) {
      if (column && column[0]) {
        const { value, children } = column[0];

        if (value !== undefined && value !== null) {
          valueArr[index] = value;
        }

        if (Array.isArray(children) && children.length) {
          this.setCascaderValue(children, valueArr, ++index);
        }
      }
    },

    cancel(this: any, event) {
      this.$emit('cancel', event);
    },

    confirm(this: any, event) {
      this.$emit('confirm', event);
    },

    genToolbar(this: any) {
      if (this.showToolbar) {
        const {
          title,
          maxButtonWidth,
          cancelButtonText,
          confirmButtonText,
          pickerToolbarButtonCancel,
          pickerToolbarButtonConfirm,
        } = this;

        const titleStyle = maxButtonWidth
          ? { 'max-width': `calc(100% - ${maxButtonWidth * 2}px)` }
          : {};

        return (
          <div class={[bem('toolbar'), BORDER_BOTTOM]}>
            {this.slots('left') ? (
              <Button
                ref={pickerToolbarButtonCancel}
                class={bem('button', 'cancel')}
                type="text"
                size="large"
                onClick={this.cancel}
              >
                {this.slots('left')}
              </Button>
            ) : (
              this.showCancelButton && (
                <Button
                  ref={pickerToolbarButtonCancel}
                  class={bem('button', 'cancel')}
                  type="text"
                  size="large"
                  text={cancelButtonText || t('cancel')}
                  onClick={this.cancel}
                />
              )
            )}
            <div class={bem('title')} style={titleStyle}>
              {this.slots('title') || title}
            </div>
            {this.slots('right') ? (
              <Button
                ref={pickerToolbarButtonConfirm}
                class={bem('button', 'right')}
                type="text"
                size="large"
                onClick={this.confirm}
              >
                {this.slots('right')}
              </Button>
            ) : (
              <Button
                ref={pickerToolbarButtonConfirm}
                class={bem('button', 'right')}
                type="text"
                size="large"
                text={confirmButtonText || t('confirm')}
                onClick={this.confirm}
              />
            )}
          </div>
        );
      }
    },

    genColumns(this: any) {
      return this.columns.map((options, columnIndex) => (
        <PickerColumn
          value={this.values[columnIndex]}
          transitionDuration={this.transitionDuration}
          swipeDuration={this.swipeDuration}
          options={options}
          onChange={this.onColumnChange}
          columnIndex={columnIndex}
        />
      ));
    },
  },

  render(this: any) {
    return (
      this.checkValue() && (
        <div class={bem()}>
          {this.genToolbar()}
          <div class={bem('columns')}>
            {this.genColumns()}
            <div class={bem('mask')} />
            <div class={[bem('indicator'), BORDER_TOP_BOTTOM]} />
          </div>
        </div>
      )
    );
  },
});
