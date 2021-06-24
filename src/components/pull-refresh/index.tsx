import { createNamespace } from '../../utils';
import { preventDefault } from '../../utils/dom/event';
import { TouchMixin } from '../../mixins/touch';
import { getScrollTop, getScrollBottom, getScrollEventTarget } from '../../utils/dom/scroll';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

type PullRefreshType = 'default' | 'primary' | 'circle' | 'white';
type PullRefreshSize = 'normal' | 'large';
type PullRefreshLoadStatus = 'pulling' | 'loosing' | 'loading';
type PullRefreshHeadLoadEndStatus = '' | 'fail' | 'success';

export interface PullRefreshProps {
  value: boolean;
  disabled: boolean;

  type: PullRefreshType;
  size: PullRefreshSize;
  loadEndStatus: PullRefreshHeadLoadEndStatus;
  headDisabled: boolean;
  footDisabled: boolean;

  pullingText: string;
  loosingText: string;
  loadingText: string;
  successText: string;
  failText: string;
  footLoadingText: string;
  footLoadSuccessText: string;
  footLoadFailText: string;
  footLoadEndText: string;

  endDuration: number;
  animationDuration: number;
  headHeight: number;
  headTop: number;
  pullUpHeight: string;
}

export interface PullRefreshEvents {
  onInput(value: boolean): void;
  onPullDown(): void;
  onPullUp(): void;
}

export type PullRefreshScopedSlots = DefaultSlots & {
  icon?: ScopedSlot;
  normal?: ScopedSlot;
  pulling?: ScopedSlot;
  loosing?: ScopedSlot;
  loading?: ScopedSlot;
  success?: ScopedSlot;
  fail?: ScopedSlot;
  footNormal?: ScopedSlot;
  footLoading?: ScopedSlot;
  footLoadSuccess?: ScopedSlot;
  footLoadFail?: ScopedSlot;
  footLoadEnd?: ScopedSlot;
};

const [createComponent, bem] = createNamespace('pull-refresh');
const types: PullRefreshType[] = ['default', 'primary', 'circle', 'white'];
const sizes: PullRefreshSize[] = ['normal', 'large'];
const loadStatus: PullRefreshLoadStatus[] = ['pulling', 'loosing', 'loading'];
const headLoadEndStatus: PullRefreshHeadLoadEndStatus[] = ['', 'fail', 'success'];

export default createComponent<PullRefreshProps, PullRefreshEvents, PullRefreshScopedSlots>({
  mixins: [TouchMixin],

  props: {
    disabled: Boolean,
    headDisabled: Boolean,
    footDisabled: Boolean,
    type: {
      type: String,
      default: types[0],
      validator: value => {
        return types.indexOf(value) > -1;
      },
    },
    size: {
      type: String,
      default: sizes[0],
      validator: value => {
        return sizes.indexOf(value) > -1;
      },
    },
    pullingText: {
      type: String,
      default: '下拉刷新',
    },
    loosingText: {
      type: String,
      default: '释放刷新',
    },
    loadingText: {
      type: String,
      default: '加载中...',
    },
    successText: {
      type: String,
      default: '刷新成功',
    },
    failText: {
      type: String,
      default: '刷新失败',
    },
    footLoadingText: {
      type: String,
      default: '正在加载',
    },
    footLoadSuccessText: {
      type: String,
      default: '加载成功',
    },
    footLoadFailText: {
      type: String,
      default: '加载失败, 请重试',
    },
    footLoadEndText: {
      type: String,
      default: '没有更多啦',
    },
    value: {
      type: Boolean,
      required: true,
    },
    loadEndStatus: {
      type: String,
      default: '',
      validator: value => {
        return headLoadEndStatus.indexOf(value) > -1;
      },
    },
    endDuration: {
      type: Number,
      default: 500,
    },
    animationDuration: {
      type: Number,
      default: 300,
    },
    headHeight: {
      type: Number,
      default: 50,
    },
    headTop: {
      type: Number,
      default: -34,
    },
    pullUpHeight: {
      type: Number,
      default: 35,
    },
  },

  data() {
    return {
      status: 'normal',
      distance: 0,
      duration: 0,
    };
  },

  computed: {
    untouchable() {
      return (
        this.disabled || this.status === 'loading' || headLoadEndStatus.indexOf(this.status) !== -1
      );
    },
  },

  watch: {
    value(loading) {
      this.duration = this.animationDuration;

      if (!loading && this.loadEndStatus === 'success') {
        this.status = 'success';
        setTimeout(() => {
          this.setStatus(0);
        }, this.endDuration);
      } else if (!loading && this.loadEndStatus === 'fail') {
        this.status = 'fail';
        setTimeout(() => {
          this.setStatus(0);
        }, this.endDuration);
      } else {
        this.setStatus(loading ? this.headHeight : 0, loading);
      }
    },
  },

  mounted() {
    this.scrollEl = getScrollEventTarget(this.$el);
  },

  methods: {
    onTouchStart(this: any, event) {
      if (!this.untouchable) {
        if (this.getCeiling() || this.getFloor()) {
          this.duration = 0;
          this.touchStart(event);
        }
      }
    },

    onTouchMove(this: any, event) {
      if (this.untouchable) {
        return;
      }

      if (!this.ceiling && this.getCeiling()) {
        this.touchStart(event);
        this.duration = 0;
        this.startY = event.touches[0].clientY;
        this.deltaY = 0;
      }

      if (!this.floor && this.getFloor()) {
        this.touchStart(event);
        this.duration = 0;
        this.startY = event.touches[0].clientY;
        this.deltaY = 0;
      }

      this.touchMove(event);

      if (this.ceiling && this.deltaY >= 0) {
        if (this.direction === 'vertical') {
          this.setStatus(this.ease(this.deltaY));
          preventDefault(event);
        }
      }

      if (this.floor && this.deltaY < 0) {
        if (this.direction === 'vertical') {
          this.setStatus(this.ease(Math.abs(this.deltaY)));
          preventDefault(event);
        }
      }
    },

    onTouchEnd(this: any) {
      if (!this.untouchable) {
        if (this.ceiling && this.deltaY > 0) {
          this.duration = this.animationDuration;

          if (this.status === 'loosing') {
            this.setStatus(this.headHeight, true);
            this.$emit('input', true);

            this.$nextTick(() => {
              this.$emit('pull-down');
            });
          } else {
            this.setStatus(0);
          }
        }

        if (this.floor && this.deltaY < 0) {
          this.duration = this.animationDuration;

          if (this.status === 'loosing') {
            this.setStatus(this.headHeight, true);
            this.$emit('input', true);

            this.$nextTick(() => {
              this.$emit('pull-up');
            });
          } else {
            this.setStatus(0);
          }
        }
      }
    },

    getCeiling(this: any) {
      if (this.headDisabled) {
        this.ceiling = false;
        return this.ceiling;
      }
      this.ceiling = getScrollTop(this.scrollEl) === 0;
      if (this.ceiling) {
        this.floor = false;
      }
      return this.ceiling;
    },

    getFloor(this: any) {
      if (this.footDisabled) {
        this.floor = false;
        return this.floor;
      }
      this.floor = getScrollBottom(this.scrollEl) < 1;
      if (this.floor) this.ceiling = false;
      return this.floor;
    },

    ease(this: any, distance) {
      const { headHeight } = this;
      return Math.round(
        distance < headHeight
          ? distance
          : distance < headHeight * 2
          ? headHeight + (distance - headHeight) / 2
          : headHeight * 1.5 + (distance - headHeight * 2) / 4,
      );
    },

    setStatus(this: any, distance, isLoading) {
      this.distance = distance;

      const status = isLoading
        ? 'loading'
        : distance === 0
        ? 'normal'
        : distance < this.headHeight
        ? 'pulling'
        : 'loosing';

      if (status !== this.status) {
        this.status = status;
      }
    },
  },

  render(this: any) {
    const { status, type, size, duration, distance, headTop, $slots } = this;

    const style = {
      transition: `${duration}ms`,
      transform: distance ? `translate3d(0,${this.floor ? -distance : distance}px, 0)` : '',
    };

    const headStyle = {
      top: `${headTop}px`,
    };

    const footStyle = {
      bottom: `${headTop}px`,
    };

    function LogoIcon() {
      if ($slots.icon) return $slots.icon;

      if (type === types[0]) return;
      let icon = 'default';
      if (type === types[2] || type === types[3]) {
        icon = 'circle';
      }

      return (
        <i
          class={bem('icon')}
          domPropsInnerHTML={require(`!html-loader!../loading/icon/${icon}.svg`)}
        ></i>
      );
    }

    const Status =
      this.ceiling &&
      (this.slots(status, { distance }) || [
        (loadStatus.indexOf(status) !== -1 || headLoadEndStatus.indexOf(status) !== -1) && (
          <div class={bem('wrp', [type, size, status])}>
            {LogoIcon()}
            <span class={bem('wrp__text')}>{this[`${status}Text`]}</span>
          </div>
        ),
      ]);
    const FootStatus =
      this.floor &&
      (this.slots(status) || [
        (loadStatus.indexOf(status) !== -1 || headLoadEndStatus.indexOf(status) !== -1) && (
          <div class={bem('wrp', [type, size, status])}>
            {LogoIcon()}
            <span class={bem('wrp__text')}>{this[`${status}Text`]}</span>
          </div>
        ),
      ]);

    return (
      <div class={bem()}>
        <div
          class={bem('track')}
          style={style}
          onTouchstart={this.onTouchStart}
          onTouchmove={this.onTouchMove}
          onTouchend={this.onTouchEnd}
          onTouchcancel={this.onTouchEnd}
        >
          <div class={bem('head')} style={headStyle}>
            {Status}
          </div>
          {this.slots()}
          <div class={bem('foot')} style={footStyle}>
            {FootStatus}
          </div>
        </div>
      </div>
    );
  },
});
