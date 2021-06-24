import { createNamespace } from '../../utils';
import { date2Array, array2Date, getMonthDate } from '../../utils/format/date';
import Picker from '../picker';

type DatetimePickerType = 'date' | 'time' | 'datetime';

export interface DatetimePickerProps {
  value: Date | string;
  type: DatetimePickerType;
  minDate: Date;
  maxDate: Date;
  title: string;
  showToolbar: boolean;
  confirmButtonText: string;
  cancelButtonText: string;
}

export interface DatetimePickerEvents {
  onChange(time: any): void;
  onInput(time: any): void;
  onConfirm(event: any): void;
  onCancel(event: any): void;
}

const [createComponent, bem, t] = createNamespace('datetime-picker');
const types: DatetimePickerType[] = ['date', 'time', 'datetime'];

const DEFAULT_YEAR_LIMIT = 20;

export default createComponent<DatetimePickerProps, DatetimePickerEvents>({
  props: {
    type: {
      type: String,
      default: types[0],
      validator: value => {
        return types.indexOf(value) > -1;
      },
    },
    value: [Date, String],
    minDate: {
      type: Date,
      default() {
        const date = new Date();
        date.setFullYear(date.getFullYear() - DEFAULT_YEAR_LIMIT);
        date.setMonth(0);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        return date;
      },
    },
    maxDate: {
      type: Date,
      default() {
        const date = new Date();
        date.setFullYear(date.getFullYear() + DEFAULT_YEAR_LIMIT);
        date.setMonth(11);
        date.setDate(getMonthDate(date));
        date.setHours(23);
        date.setMinutes(59);
        return date;
      },
    },
    title: String,
    showToolbar: {
      type: Boolean,
      default: true,
    },
    confirmButtonText: String,
    cancelButtonText: String,
  },

  computed: {
    isTime() {
      return this.type === types[1];
    },

    innerValue() {
      return this.isTime ? this.time2Array(this.value) : date2Array(this.value, this.type);
    },

    valueArray() {
      return date2Array(this.value, 'datetime');
    },

    minDateArray() {
      return this.boundaryArray(this.valueArray, date2Array(this.minDate, 'datetime'), [
        this.minDate.getFullYear(),
        1,
        1,
        0,
        0,
      ]);
    },

    maxDateArray() {
      return this.boundaryArray(this.valueArray, date2Array(this.maxDate, 'datetime'), [
        this.maxDate.getFullYear(),
        12,
        getMonthDate(this.value),
        23,
        59,
      ]);
    },

    options() {
      if (this.isTime) return [this.getTimeRanges(0, 23, ''), this.getTimeRanges(0, 59, '')];

      const { minDateArray, maxDateArray } = this;

      const result = [
        this.getRanges(minDateArray[0], maxDateArray[0], t('year')),
        this.getRanges(minDateArray[1], maxDateArray[1], t('month')),
        this.getRanges(minDateArray[2], maxDateArray[2], t('day')),
        this.getTimeRanges(minDateArray[3], maxDateArray[3], t('hour')),
        this.getTimeRanges(minDateArray[4], maxDateArray[4], t('minute')),
      ];

      return this.type === types[0] ? result.slice(0, 3) : result;
    },
  },

  methods: {
    checkValue(this: any) {
      /**
       * 校验传入数据类型
       */
      const { isTime, value, minDate, maxDate } = this;

      if (isTime) {
        if (typeof value !== 'string') {
          console.warn('时分选择器传入 value 类型应该是 String 类型');
          return false;
        }
        if (value.indexOf(':') === -1) {
          const date = new Date();
          this.$emit(
            'input',
            `${this.time2Str(date.getHours())}:${this.time2Str(date.getMinutes())}`,
          );
          this.$emit(
            'change',
            `${this.time2Str(date.getHours())}:${this.time2Str(date.getMinutes())}`,
          );
          return false;
        }
      } else {
        if (typeof value === 'string') {
          console.warn('年月日选择器传入 value 类型应该是 Date 类型');
          return false;
        }
        if (value.getTime() < minDate.getTime()) {
          console.warn('value 值不能小于 minDate');
          this.$emit('input', minDate);
          this.$emit('change', minDate);
          return false;
        }
        if (value.getTime() > maxDate.getTime()) {
          console.warn('value 值不能大于 maxDate');
          this.$emit('input', maxDate);
          this.$emit('change', maxDate);
          return false;
        }
      }

      return true;
    },

    boundaryArray(this: any, valueArray, dateArray, arr) {
      let i = 0;
      let endLog = false;

      do {
        if (valueArray[i] === dateArray[i]) {
          i++;
          if (arr[i] !== undefined) {
            arr[i] = dateArray[i];
          } else {
            endLog = true;
          }
        } else {
          endLog = true;
        }
      } while (!endLog);

      return arr;
    },

    time2Array(value) {
      /**
       * value 格式： 19:01
       */
      const values = value.split(':');
      return [+values[0], +values[1]];
    },

    array2Time(this: any, array) {
      return `${this.time2Str(array[0])}:${this.time2Str(array[1])}`;
    },

    time2Str(number) {
      return number < 10 ? `0${number}` : String(number);
    },

    getRanges(min, max, tail = '') {
      const result = [];
      for (let i = min; i <= max; i++) {
        result.push({
          label: i + tail,
          value: i,
        });
      }
      return result;
    },

    getTimeRanges(min, max, tail) {
      const result = [];
      let str = '';
      for (let i = min; i <= max; i++) {
        str = i < 10 ? `0${i}${tail}` : `${i}${tail}`;
        result.push({
          label: str,
          value: i,
        });
      }
      return result;
    },

    checkMin(arr, min) {
      let i = 0;
      let endLog = false;

      do {
        if (arr[i] <= min[i]) {
          arr[i] = min[i];
          i++;
        } else {
          endLog = true;
        }
      } while (!endLog);
    },

    checkMax(arr, max) {
      let i = 0;
      let endLog = false;

      do {
        if (arr[i] >= max[i]) {
          arr[i] = max[i];
          i++;
        } else {
          endLog = true;
        }
      } while (!endLog);
    },

    onChange(this: any, val) {
      if (this.isTime) {
        this.$emit('input', this.array2Time(val));
        this.$emit('change', this.array2Time(val));
      } else {
        this.checkMin(val, this.minDateArray);
        this.checkMax(val, this.maxDateArray);

        const copyValue = new Date(this.value.getTime());

        this.$emit('input', array2Date(val, copyValue));
        this.$emit('change', array2Date(val, copyValue));
      }
    },

    onConfirm(this: any, event) {
      this.$emit('confirm', event);
    },

    onCancel(this: any, event) {
      this.$emit('cancel', event);
    },
  },

  render(this: any) {
    return (
      this.checkValue() && (
        <Picker
          class={bem()}
          title={this.title === undefined ? t('title') : this.title}
          showToolbar={this.showToolbar}
          confirmButtonText={this.confirmButtonText}
          cancelButtonText={this.cancelButtonText}
          options={this.options}
          value={this.innerValue}
          onChange={this.onChange}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
        />
      )
    );
  },
});
