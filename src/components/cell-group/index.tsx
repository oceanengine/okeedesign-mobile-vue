import { createNamespace, createBrandName } from '../../utils';
import { inherit } from '../../utils/functional';
import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

export type CellGroupProps = {
  title?: string;
  border: boolean;
};

const [createComponent, bem] = createNamespace('cell-group');

function CellGroup(
  // @ts-ignore
  h: CreateElement,
  props: CellGroupProps,
  slots: DefaultSlots,
  ctx: RenderContext<CellGroupProps>,
) {
  const brandName = createBrandName();
  const Group = (
    <div
      class={[bem(), { [`${brandName}hairline--top-bottom`]: props.border }]}
      {...inherit(ctx, true)}
    >
      {slots.default && slots.default()}
    </div>
  );

  if (props.title) {
    return (
      <div>
        <div class={bem('title')}>{props.title}</div>
        {Group}
      </div>
    );
  }

  return Group;
}

CellGroup.props = {
  title: String,
  border: {
    type: Boolean,
    default: true,
  },
};

export default createComponent<CellGroupProps>(CellGroup);
