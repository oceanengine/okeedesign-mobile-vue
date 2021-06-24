import { createNamespace } from '../../utils';
import { ChildrenMixin } from '../../mixins/relation';

export type HeaderTabProps = {
  title: string;
  name: string | number | boolean;
};

export interface HeaderTabEvents {
  onInput(name: any): void;
  onClick(): void;
  onSetLine(ctx: any): void;
  onTouchstart(): void;
}

const [createComponent, bem] = createNamespace('header-tab');

export default createComponent<HeaderTabProps, HeaderTabEvents>({
  mixins: [ChildrenMixin('bytedHeaderTabs')],
  props: {
    title: {
      type: String,
      default: '',
    },
    name: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  computed: {
    active() {
      return this.parent.value === this.name;
    },
  },
  created() {
    this.$nextTick(() => {
      if (this.active) {
        this.parent.$emit('set-line', this);
      }
    });
  },
  methods: {
    onClick(this: any) {
      this.$emit('click');
    },
    onTouchstart(this: any) {
      this.parent.$emit('input', this.name);
      this.$emit('touchstart');
    },
  },
  render(this: any) {
    const { title, active } = this;
    const Title = this.slots() || title;
    return (
      <div
        class={bem([this.parent.type, { active }])}
        onclick={this.onClick}
        ontouchstart={this.onTouchstart}
      >
        <div class={bem('box')} ref="box">
          {Title}
        </div>
      </div>
    );
  },
});
