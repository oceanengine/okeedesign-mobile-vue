import { createNamespace } from '../../utils';
import { ChildrenMixin } from '../../mixins/relation';

const [createComponent, bem] = createNamespace('swipe-item');

export default createComponent({
  mixins: [ChildrenMixin('bytedSwipe')],
  data() {
    return {
      offset: 0,
    };
  },

  render(this: any) {
    const { computedWidth } = this.parent;

    const style = {
      width: computedWidth + 'px',
      transform: `translate3d(${this.offset}px, 0, 0)`,
    };

    return (
      <div class={bem()} style={style}>
        {this.slots()}
      </div>
    );
  },
});
