import { createNamespace } from '../../utils';

const [createComponent, bem] = createNamespace('col');

export type ColProps = {
  span: number | string;
  offset: number | string;
};

export default createComponent<ColProps>({
  props: {
    span: [Number, String],
    offset: [Number, String],
  },

  computed: {
    gap() {
      return this.$parent && this.$parent.gap ? this.$parent.gap : '';
    },
    style() {
      return this.gap ? { paddingLeft: this.gap, paddingRight: this.gap } : {};
    },
  },

  render(this: any) {
    const { span, offset } = this;
    return (
      <div class={bem({ [span]: span, [`offset-${offset}`]: offset })} style={this.style}>
        {this.slots()}
      </div>
    );
  },
});
