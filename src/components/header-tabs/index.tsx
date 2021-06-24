import { createNamespace } from '../../utils';
import { ChildrenMixin } from '../../mixins/relation';
import { ParentMixin } from '../../mixins/relation';

export type HeaderTabsProps = {
  value: string | number | boolean;
};

export interface HeaderTabsEvents {
  onChange(value: any): void;
  onSetLine(ctx: any): void;
}

const [createComponent, bem] = createNamespace('header-tabs');

export default createComponent<HeaderTabsProps, HeaderTabsEvents>({
  mixins: [ChildrenMixin('bytedHeader'), ParentMixin('bytedHeaderTabs')],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  data() {
    return {
      type: '',
      lineStyle: {},
    };
  },
  watch: {
    value(newVal) {
      this.$emit('change', newVal);
      this.$emit(
        'set-line',
        this.children.find(child => newVal === child.name),
      );
    },
  },
  created() {
    this.type = this.parent.type;
    this.$on('set-line', child => {
      const domBox = child.$refs.box;
      child.$nextTick(() => {
        const left = child.$el.offsetLeft + (child.$el.offsetWidth - domBox.offsetWidth) / 2;
        this.lineStyle = {
          transform: `translate3d(${left}px, 0, 0)`,
          width: `${domBox.offsetWidth}px`,
        };
      });
    });
  },
  render(this: any) {
    const { type, lineStyle } = this;

    return (
      <div class={bem([type])}>
        <div class={bem('box')}>{this.slots()}</div>
        <div class={bem('line')} style={lineStyle} />
      </div>
    );
  },
});
