import { createNamespace, createBrandName, isDef, value2DomUnit, value2Number } from '../../utils';
import { scrollLeftTo } from './utils';
import { ParentMixin } from '../../mixins/relation';
import { BindEventMixin } from '../../mixins/bind-event';
import Title from './Title';
import Content from './Content';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

const [createComponent, bem] = createNamespace('tabs');

export type TabType = 'line' | 'card';
export type TabSize = 'normal' | 'large';

const type: TabType[] = ['line', 'card'];
const size: TabSize[] = ['normal', 'large'];

export interface TabsProps {
  color: string;
  animated: boolean;
  swipeable: boolean;
  touchable: boolean;
  background: string;
  lineColor: string;
  lineWidth: number | string;
  lineHeight: number | string;
  titleActiveColor: string;
  titleInactiveColor: string;
  contentColor: string;
  value: number | string;
  active: number | string;
  type: string;
  size: string;
  gutter: number | string;
  safeAreaInset: number | string;
  flex: boolean;
  duration: number;
  border: boolean;
  ellipsis: boolean;
  lazyRender: boolean;
  swipeThreshold: number;
}

export interface TabsEvents {
  onClick(name: string | number, title: string): void;
  onChange(name: string | number, title: string): void;
  onDisabled(name: string | number, title: string): void;
}

export type TabsScopedSlots = DefaultSlots & {
  title?: ScopedSlot;
  'nav-left'?: ScopedSlot;
  'nav-right'?: ScopedSlot;
};

export default createComponent<TabsProps, TabsEvents, TabsScopedSlots>({
  mixins: [
    ParentMixin('bytedTabs'),
    BindEventMixin(function (bind) {
      bind(window, 'resize', this.setLine, true);
    }),
  ],

  props: {
    color: String,
    animated: Boolean,
    swipeable: Boolean,
    touchable: Boolean,
    background: String,
    lineColor: String,
    lineWidth: [Number, String],
    lineHeight: [Number, String],
    titleActiveColor: String,
    titleInactiveColor: String,
    contentColor: String,
    value: {
      type: [Number, String],
      default: 0,
    },
    active: {
      type: [Number, String],
      default: null,
    },
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
    gutter: {
      type: [Number, String],
      default: 0,
    },
    safeAreaInset: {
      type: [Number, String],
      default: 0,
    },
    flex: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 0.3,
    },
    border: {
      type: Boolean,
      default: true,
    },
    ellipsis: {
      type: Boolean,
      default: true,
    },
    lazyRender: {
      type: Boolean,
      default: true,
    },
    swipeThreshold: {
      type: Number,
      default: 4,
    },
  },

  data(this: any) {
    return {
      positon: '',
      currentIndex: null,
      lineStyle: {
        backgroundColor: this.lineColor,
      },
    };
  },

  computed: {
    scrollable() {
      return this.children.length > this.swipeThreshold || !this.ellipsis;
    },

    navStyle() {
      return {
        borderColor: this.color,
        background: this.background,
        paddingLeft: this.safeArea,
        paddingRight: this.safeArea,
      };
    },

    currentName() {
      const activeTab = this.children[this.currentIndex];

      if (activeTab) {
        return activeTab.computedName;
      }
    },

    gap() {
      if (this.flex) return '';
      return this.gutter ? value2DomUnit(this.gutter, 0.5) : '';
    },

    safeArea() {
      return this.safeAreaInset ? value2DomUnit(this.safeAreaInset) : '';
    },
  },

  watch: {
    value(name) {
      if (name !== this.currentName) {
        this.setCurrentIndexByName(name);
      }
    },

    active(name) {
      if (name !== this.currentName) {
        this.setCurrentIndexByName(name, true);
      }
    },

    color() {
      this.setLine();
    },

    children() {
      this.value
        ? this.setCurrentIndexByName(this.currentName || this.value)
        : this.setCurrentIndexByName(this.currentName || this.active, true);
      this.scrollIntoView();
      this.setLine();
    },

    currentIndex() {
      this.scrollIntoView();
      this.setLine();
    },
  },

  created() {
    if (this.value && isDef(this.active)) {
      console.error('异步用法请单独使用active,或同步用法请单独使用v-model。');
    }
  },

  mounted() {
    this.onShow();
  },

  methods: {
    onShow(this: any) {
      this.$nextTick(() => {
        this.inited = true;
        this.scrollIntoView(true);
      });
    },

    setLine(this: any) {
      const shouldAnimate = this.inited;

      this.$nextTick(() => {
        const { titles } = this.$refs;

        if (!titles || !titles[this.currentIndex] || this.type !== 'line') {
          return;
        }

        const title = titles[this.currentIndex].$el;
        const { lineWidth, lineHeight } = this;
        const width = isDef(lineWidth) ? lineWidth : title.children[0].offsetWidth + 4;
        const left =
          title.offsetLeft + title.children[0].offsetWidth / 2 + title.children[0].offsetLeft;

        const lineStyle = {
          width: value2DomUnit(width),
          backgroundColor: this.lineColor,
          transform: `translate3D(${left - value2Number(width) / 2}px, 0, 0)`,
        } as Record<string, any>;

        if (shouldAnimate) {
          lineStyle.transitionDuration = `${this.duration}s`;
        }

        if (isDef(lineHeight)) {
          const height = value2DomUnit(lineHeight);
          lineStyle.height = height;
        }

        this.lineStyle = lineStyle;
      });
    },

    setCurrentIndexByName(this: any, name, controlled) {
      const matched = this.children.filter(tab => tab.computedName === name);
      const defaultIndex = (this.children[0] || {}).index || 0;
      this.setCurrentIndex(matched.length ? matched[0].index : defaultIndex, controlled);
    },

    setCurrentIndex(this: any, currentIndex, controlled) {
      currentIndex = this.findAvailableTab(currentIndex);

      if (isDef(currentIndex) && currentIndex !== this.currentIndex) {
        const shouldEmitChange = this.currentIndex !== null;
        if (this.active === null || controlled) {
          this.currentIndex = currentIndex;
          if (shouldEmitChange)
            this.$emit('change', this.currentName, this.children[currentIndex].title);
        }
        this.$emit('input', this.currentName);
      }
    },

    findAvailableTab(this: any, index) {
      const diff = index < this.currentIndex ? -1 : 1;

      while (index >= 0 && index < this.children.length) {
        if (!this.children[index].disabled) {
          return index;
        }

        index += diff;
      }
    },

    onClick(this: any, index) {
      const { title, disabled, computedName } = this.children[index];
      if (disabled) {
        this.$emit('disabled', computedName, title);
      } else {
        this.setCurrentIndex(index);
        this.$emit('click', computedName, title);
      }
    },

    scrollIntoView(this: any, immediate) {
      const { titles } = this.$refs;

      if (!this.scrollable || !titles || !titles[this.currentIndex]) {
        return;
      }

      const { nav } = this.$refs;
      const title = titles[this.currentIndex].$el;
      const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2;

      scrollLeftTo(nav, to, immediate ? 0 : this.duration);
    },

    renderTitle(this: any, el, index) {
      this.$nextTick(() => {
        this.$refs.titles[index].renderTitle(el);
      });
    },

    onScroll(this: any, params) {
      this.$emit('scroll', params);
    },
  },

  render(this: any) {
    const brandName = createBrandName();
    const { type, flex, ellipsis, animated, scrollable } = this;
    const Nav = this.children.map((item, index) => {
      return (
        <Title
          ref="titles"
          refInFor
          type={type}
          title={item.title}
          info={this.children[index].info}
          color={this.color}
          gap={this.gap}
          isActive={index === this.currentIndex}
          ellipsis={ellipsis}
          disabled={item.disabled}
          scrollable={scrollable}
          activeColor={this.titleActiveColor}
          inactiveColor={this.titleInactiveColor}
          swipeThreshold={this.swipeThreshold}
          onClick={() => {
            this.onClick(index);
          }}
        />
      );
    });

    const Wrap = (
      <div
        ref="wrap"
        class={[
          bem('wrap', { scrollable }),
          bem({ static: !flex && type !== 'card' }),
          { [`${brandName}hairline--top-bottom`]: type === 'line' && this.border },
        ]}
      >
        <div ref="nav" class={bem('nav', [type])} style={this.navStyle}>
          {this.slots('nav-left')}
          {Nav}
          {type === 'line' && <div class={bem('line')} style={this.lineStyle} />}
          {this.slots('nav-right')}
        </div>
      </div>
    );

    return (
      <div class={bem([type, this.size])}>
        {Wrap}
        <Content
          count={this.children.length}
          animated={animated}
          duration={this.duration}
          swipeable={this.swipeable && !this.touchable && !this.active}
          touchable={this.touchable && !this.swipeable && !this.active}
          currentIndex={this.currentIndex}
          onChange={this.setCurrentIndex}
          contentColor={this.contentColor}
        >
          {this.slots()}
        </Content>
      </div>
    );
  },
});
