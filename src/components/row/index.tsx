import { createNamespace } from '../../utils';
import { value2DomUnit } from '../../utils/dom/unit';

export type RowProps = {
  type: string;
  align: string;
  justify: string;
  gutter: number | string;
};

const [createComponent, bem] = createNamespace('row');

export default createComponent<RowProps>({
  props: {
    type: String,
    align: String,
    justify: String,
    gutter: {
      type: [Number, String],
      default: 0,
    },
  },
  computed: {
    gap() {
      return this.gutter ? value2DomUnit(this.gutter, 0.5) : '';
    },
    style() {
      return this.gap ? { marginLeft: `-${this.gap}`, marginRight: `-${this.gap}` } : {};
    },
  },
  render(this: any) {
    const { align, justify } = this;
    const flex = this.type === 'flex';
    return (
      <div
        style={this.style}
        class={bem({
          flex,
          [`align-${align}`]: flex && align,
          [`justify-${justify}`]: flex && justify,
        })}
      >
        {this.slots()}
      </div>
    );
  },
});
