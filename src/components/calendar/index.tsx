import { CreateElement } from 'vue';
import { CombinedVueInstance } from 'vue/types/vue';
import { VNode, ScopedSlotReturnValue } from 'vue/types/vnode';

import { createNamespace } from '../../utils';
import {
  getMonthDate,
  compareDates,
  compareDateFunction,
  getDateRangeArray,
  DayOfWeek,
  DAYS_OF_WEEK,
} from '../../utils/format/date';
import { preventDefault } from '../../utils/dom/event';
import { raf } from '../../utils/dom/raf';
import { clamp } from '../../utils/math';

import { TouchMixinInstance, TouchMixin } from '../../mixins/touch';

declare const h: CreateElement;

const [createComponent, bem, t] = createNamespace('calendar');

// ================================
// Props

export type CalendarSelectMode = 'single' | 'multi' | 'range';
const ALL_CALENDAR_SELECT_MODE: readonly CalendarSelectMode[] = ['single', 'multi', 'range'];

export interface CalendarInfo {
  date: Date;
  year: number;
  month: number;
  day: number;
}

export interface CalendarProps {
  /**
   * The `Date` array to bind, with the event `change` for v-model.
   */
  value: Date[];

  /**
   * Selection mode: single, multi or range
   */
  mode?: CalendarSelectMode;

  /**
   * Set the start time to `00:00:00` and the end time to `23:59:59` while in `range` mode.
   * @default false
   */
  rangeUseStartEnd?: boolean;

  /**
   * The earliest acceptable date.
   */
  min?: Date;
  /**
   * The latest acceptable date.
   */
  max?: Date;

  /**
   * Customize today.
   */
  today?: Date;

  /**
   * Set the first day of week, such as Monday.
   */
  firstDayOfWeek?: DayOfWeek;

  /**
   * The header title text.
   */
  title?: string;

  /**
   * Show title bar or not.
   */
  showTitleBar: boolean;

  /**
   * Show cancel button or not.
   * @default false
   */
  showCancel?: boolean;

  /**
   * Show confirm button or not.
   * @default false
   */
  showConfirm?: boolean;

  /**
   * Config the v-model event `change` behavior.
   * If `true`, the `change` event will only be emitted after click the confirm button,
   * and the cancel and confirm button will always show.
   * @default false
   */
  requireConfirm?: boolean;
}

export interface CalendarPropsInit extends CalendarProps {
  mode: CalendarSelectMode;
  rangeUseStartEnd: boolean;
  today: Date;
  firstDayOfWeek: DayOfWeek;
  title: string;
  showCancel: boolean;
  showConfirm: boolean;
  requireConfirm: boolean;
}

// ================================
// Events

export interface CalendarEvents {
  onChange(value: Date[]): void;
  onConfirm?(value: Date): void;
  onCancel?(): void;
}

// ================================
// Data

export interface MonthBlock {
  year: number;
  month: number;
  height: number;
  translateY: number;
}

function createMonthBlock(date: Date): MonthBlock {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    height: 0,
    translateY: 0,
  };
}

export interface CalendarData {
  queueMonths: MonthBlock[];
  currentIndex: number;
  selected: Date[];
}

// ================================
// Methods

export interface CalendarMethods {
  detectDisabled(date: Date): boolean;

  updateHeight(): void;

  initSelected(): void;
  setSelected(value: Date[]): void;
  select(date: Date): void;
  emitChange(): Date[];

  scroll(distance: number): void;
  scrollEnd(): void;

  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
  onTouchEnd(event: TouchEvent): void;

  onCancel(event?: Event): void;
  onConfirm(event?: Event): void;

  renderMonthBlock(monthOffset: number): VNode;
}

// ================================
// Computed

export interface CalendarComputed {
  daysOfWeek: DayOfWeek[];
  dateRange: Date[];
}

// ================================
// Instance

export interface CalendarScopedSlotsProps {
  selected: Date[];
  setSelected(value: Date[]): void;
  cancel(): void;
  confirm(): void;
}

export interface CalendarScopedSlots {
  headerLeft?(props: CalendarScopedSlotsProps): ScopedSlotReturnValue;
  headerRight?(props: CalendarScopedSlotsProps): ScopedSlotReturnValue;
  bottomFloat?(props: CalendarScopedSlotsProps): ScopedSlotReturnValue;
}

// ================================
// Instance

export interface CalendarDataExtra {
  startTranslateY: number;
  monthBarHeight: number;
  minTime?: number;
  maxTime?: number;
  shouldEmitChange?: boolean;
  $scopedSlots: CalendarScopedSlots;
}

export type CalendarInstance = CombinedVueInstance<
  TouchMixinInstance,
  CalendarData,
  CalendarMethods,
  CalendarComputed,
  CalendarPropsInit
> &
  CalendarDataExtra;

// ================================
// Component Options

const Calendar = {
  mixins: [TouchMixin],

  data() {
    return {
      // init this queue after create
      queueMonths: null as any,
      currentIndex: 0,
      selected: [],
    };
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Array,
      required: true,
    },
    mode: {
      type: String as () => CalendarSelectMode,
      default: 'range',
      validator: (v: CalendarSelectMode) => ALL_CALENDAR_SELECT_MODE.includes(v),
    },
    rangeUseStartEnd: {
      type: Boolean,
      default: false,
    },
    min: Date,
    max: Date,
    today: {
      type: Date,
      default: () => new Date(),
    },
    firstDayOfWeek: {
      type: String as () => DayOfWeek,
      default: 'sunday',
      validator: value => !!value && DAYS_OF_WEEK.includes(value),
    },
    title: {
      type: String,
    },
    showTitleBar: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: false,
    },
    showConfirm: {
      type: Boolean,
      default: false,
    },
    requireConfirm: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    daysOfWeek(this: CalendarInstance) {
      const { firstDayOfWeek } = this;
      const start = DAYS_OF_WEEK.indexOf(firstDayOfWeek?.toLowerCase() as DayOfWeek);
      if (start > -1) {
        return [...DAYS_OF_WEEK.slice(start), ...DAYS_OF_WEEK.slice(0, start)];
      }
      return [...DAYS_OF_WEEK];
    },

    dateRange(this: CalendarInstance) {
      const {
        mode,
        selected: [start, end],
      } = this;
      if (mode === 'range' && start && end) {
        return getDateRangeArray(start, end);
      }

      return [];
    },
  },

  watch: {
    value: {
      handler(this: CalendarInstance) {
        this.initSelected();
      },
      immediate: true,
    },
    mode(this: CalendarInstance) {
      this.initSelected();
    },
    min: {
      handler(this: CalendarInstance, value?: Date) {
        if (value) {
          this.minTime = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
          return;
        }
        this.minTime = undefined;
      },
      immediate: true,
    },
    max: {
      handler(this: CalendarInstance, value?: Date) {
        if (value) {
          this.maxTime = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
          return;
        }
        this.maxTime = undefined;
      },
      immediate: true,
    },
    queueMonths(this: CalendarInstance, _value: MonthBlock[]) {
      this.$nextTick(() => raf(() => this.updateHeight()));
    },
    selected(this: CalendarInstance) {
      this.emitChange();
    },
  },

  created(this: CalendarInstance) {
    const displayDate = this.value[0] || this.today;
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const date = displayDate.getDate();
    this.queueMonths = [
      createMonthBlock(new Date(year, month, date)),
      createMonthBlock(new Date(year, month + 1, date)),
    ];
    this.startTranslateY = 0;
  },

  mounted(this: CalendarInstance) {
    this.updateHeight();
    this.scroll(0);
    this.monthBarHeight = this.$el.querySelector(`.${bem('month-bar')}`)?.clientHeight ?? 0;
  },

  methods: {
    detectDisabled(this: CalendarInstance, date: Date) {
      const { minTime, maxTime } = this;
      const time = date.getTime();
      if (typeof minTime === 'number' && time < minTime) {
        return true;
      }
      if (typeof maxTime === 'number' && time > maxTime) {
        return true;
      }
      return false;
    },

    updateHeight(this: CalendarInstance) {
      const { queueMonths, $refs } = this;
      queueMonths.forEach(block => {
        const element = $refs[`month-${block.year}-${block.month}`] as HTMLDivElement;
        block.height = element?.clientHeight || 0;
      });
    },

    initSelected(this: CalendarInstance) {
      this.shouldEmitChange = false;
      const { value, mode } = this;
      let selected = value.map(v => new Date(v.getTime()));
      if (mode === 'range' && selected.length > 2) {
        selected = value.slice(0, 2);
      }
      this.selected = selected;
    },

    setSelected(this: CalendarInstance, value) {
      if (!this.requireConfirm) {
        this.shouldEmitChange = true;
      }
      this.selected = value;
    },

    select(this: CalendarInstance, date) {
      const { direction, mode, requireConfirm } = this;

      if (direction !== '') {
        return;
      }

      if (mode !== 'range' && this.selected.some(v => compareDates(v, date))) {
        return;
      }

      const newDate = new Date(date.getTime());

      switch (mode) {
        case 'single':
          if (!requireConfirm) {
            this.shouldEmitChange = true;
          }
          this.selected = [newDate];
          break;

        case 'multi':
          if (!requireConfirm) {
            this.shouldEmitChange = true;
          }
          this.selected.push(newDate);
          this.selected.sort(compareDateFunction);
          break;

        case 'range':
          if (this.selected.length >= 2) {
            this.selected = [newDate];
            return;
          }
          this.selected.push(newDate);
          this.selected.sort(compareDateFunction);
          if (this.selected.length < 2) {
            return;
          }
          if (!requireConfirm) {
            this.shouldEmitChange = true;
          }
          break;
      }
    },

    emitChange(this: CalendarInstance) {
      const { mode, rangeUseStartEnd, selected, shouldEmitChange } = this;

      if (!shouldEmitChange) {
        return [];
      }

      let newSelected: Date[];

      if (mode === 'range') {
        const start = selected[0];
        let end = selected[1];
        if (!start) {
          newSelected = [];
        } else {
          if (!end) {
            end = start;
          }
          if (rangeUseStartEnd) {
            newSelected = [
              new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0),
              new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999),
            ];
          } else {
            newSelected = [new Date(start.getTime()), new Date(end.getTime())];
          }
        }
      } else {
        newSelected = selected.map(d => new Date(d.getTime()));
      }

      this.$emit('change', newSelected);

      return newSelected;
    },

    scroll(this: CalendarInstance, distance) {
      const { queueMonths, currentIndex } = this;
      const wrapHeight = (this.$refs.monthWrap as HTMLDivElement).clientHeight;

      queueMonths.slice(0, currentIndex).reduceRight<number>((height, block) => {
        block.translateY = distance - block.height - height;
        return height + block.height;
      }, 0);
      queueMonths.slice(currentIndex).reduce<number>((height, block) => {
        block.translateY = distance + height;
        return height + block.height;
      }, 0);

      {
        const first = queueMonths[0];
        if (first.height > 0 && first.translateY > 0) {
          const newBlock = createMonthBlock(new Date(first.year, first.month - 1, 1));
          queueMonths.unshift(newBlock);
          this.currentIndex += 1;
        }
      }

      {
        const last = queueMonths[queueMonths.length - 1];
        if (last.height > 0 && last.translateY + last.height < wrapHeight) {
          const newBlock = createMonthBlock(new Date(last.year, last.month + 1, 1));
          newBlock.translateY = last.translateY + last.height;
          queueMonths.push(newBlock);
        }
      }
    },

    scrollEnd(this: CalendarInstance) {
      const wrapHeight = (this.$refs.monthWrap as HTMLDivElement).clientHeight;
      this.queueMonths = this.queueMonths.filter(block => {
        if (block.height === 0) {
          return false;
        }
        if (block.translateY <= -block.height) {
          return false;
        }
        if (block.translateY >= wrapHeight) {
          return false;
        }
        return true;
      });
      const currentIndex = this.queueMonths.findIndex(block => block.translateY >= 0);
      if (currentIndex > -1) {
        this.currentIndex = currentIndex;
        this.startTranslateY = this.queueMonths[currentIndex].translateY;
      }
    },

    onTouchStart(this: CalendarInstance, event) {
      preventDefault(event);
      this.touchStart(event);
      this.updateHeight();
    },

    onTouchMove(this: CalendarInstance, event) {
      preventDefault(event);
      this.touchMove(event);

      const { deltaY, startTranslateY } = this;
      const translateY = startTranslateY + deltaY;
      raf(() => this.scroll(translateY));
    },

    onTouchEnd(this: CalendarInstance, event) {
      preventDefault(event);
      raf(() => this.scrollEnd());
    },

    onCancel(this: CalendarInstance, _event) {
      if (this.direction !== '') {
        return;
      }
      this.initSelected();
      this.$emit('cancel');
    },

    onConfirm(this: CalendarInstance, _event) {
      if (this.direction !== '') {
        return;
      }
      this.shouldEmitChange = true;
      const newSelected = this.emitChange();
      this.$emit('confirm', newSelected);
    },

    renderMonthBlock(this: CalendarInstance, index) {
      const {
        queueMonths: {
          [index]: { year, month, height, translateY },
        },
        mode,
        today,
        daysOfWeek,
        dateRange,
        monthBarHeight,
      } = this;

      const isRangeMode = mode === 'range';
      const key = `month-${year}-${month}`;
      const bar = t('monthBar', { year, month: month + 1 }) || `${year}-${month + 1}`;
      const firstDate = new Date(year, month, 1);
      const firstDay = firstDate.getDay();
      const dateAmount = getMonthDate(firstDate);
      const lastDate = new Date(year, month, dateAmount);
      const dates = getDateRangeArray(firstDate, lastDate);
      const placeholder = daysOfWeek.indexOf(DAYS_OF_WEEK[firstDay]);

      const style =
        (height > 0 && {
          transform: `translateY(${translateY}px)`,
        }) ||
        undefined;
      const barStyle =
        (height > 0 &&
          translateY < 0 &&
          translateY > -height && {
            transform: `translateY(${clamp(-translateY, 0, height - monthBarHeight)}px)`,
          }) ||
        undefined;

      return (
        <div key={key} ref={key} class={bem('month', `${index}`)} style={style}>
          <div key="bar" class={bem('month-bar', { pin: !!barStyle })} style={barStyle}>
            {bar}
          </div>
          <div key="wrap" class={bem('date-wrap')}>
            {placeholder > 0 && (
              <div key="placeholder" class={bem('date-placeholder', `${placeholder}`)}></div>
            )}
            {dates.map(item => {
              const date = item.getDate();
              const day = item.getDay();
              const selected = this.selected.some(v => compareDates(v, item));
              const inRange =
                isRangeMode && !selected && dateRange.some(v => compareDates(v, item));
              const disabled = this.detectDisabled(item);
              const select = () => {
                if (!disabled) {
                  this.select(item);
                }
              };
              return (
                <div key={date} class={bem('cell')}>
                  <button
                    class={bem('date', {
                      rest: day === 0 || day === 6,
                      today: compareDates(item, today),
                      selected,
                      'in-range': inRange,
                      disabled,
                    })}
                    disabled={disabled}
                    onClick={select}
                    onTouchend={select}
                    onTouchcancel={select}
                  >
                    {date}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },

  render(this: CalendarInstance) {
    const {
      queueMonths,
      selected,
      daysOfWeek,
      title = t('title'),
      showTitleBar,
      showCancel,
      showConfirm,
      requireConfirm,
      $scopedSlots: {
        headerLeft = _props =>
          (requireConfirm || showCancel) && (
            <button class={bem('button')} onClick={this.onCancel}>
              {t('cancel')}
            </button>
          ),
        headerRight = _props =>
          (requireConfirm || showConfirm) && (
            <button class={bem('button')} onClick={this.onConfirm}>
              {t('confirm')}
            </button>
          ),
        bottomFloat = _props => h(),
      },
    } = this;

    const classes = bem();

    const scopedSlotsProps: CalendarScopedSlotsProps = {
      selected,
      setSelected: value => this.setSelected(value),
      cancel: () => this.onCancel(),
      confirm: () => this.onConfirm(),
    };

    return (
      <div class={classes}>
        <header key="header" class={bem('header')}>
          {showTitleBar && (
            <div key="title-bar" class={bem('title-bar')}>
              <div class={bem('title')}>{title}</div>
              <div class={bem('header-left')}>{headerLeft(scopedSlotsProps)}</div>
              <div class={bem('header-right')}>{headerRight(scopedSlotsProps)}</div>
            </div>
          )}

          <div key="week" class={bem('week')}>
            {daysOfWeek.map(key => (
              <div key={key} class={bem('day', { rest: key === 'saturday' || key === 'sunday' })}>
                {t(key)}
              </div>
            ))}
          </div>
        </header>

        <div
          key="body"
          class={bem('body')}
          onTouchstart={this.onTouchStart}
          onTouchmove={this.onTouchMove}
          onTouchend={this.onTouchEnd}
          onTouchcancel={this.onTouchEnd}
        >
          <div ref="monthWrap" class={bem('month-wrap')}>
            {queueMonths.map((_m, i) => this.renderMonthBlock(i))}
          </div>
        </div>

        <div key="bottom-float" class={bem('bottom-float')}>
          {bottomFloat(scopedSlotsProps)}
        </div>

        {/* <div key="debug" style="z-index:10;position:absolute;top:0;left:0;right:0">
          {queueMonths.map((block, index) => (
            <div>
              {(index === this.currentIndex && '[-] ') || '[ ] '}
              {block.year}-{block.month + 1}-{block.height}-{block.translateY}
            </div>
          ))}
          <div>Selected: {this.selected.map(v => v.toLocaleDateString()).join(', ')}</div>
        </div> */}
      </div>
    );
  },
};

export default createComponent<CalendarProps, CalendarEvents>(Calendar);
