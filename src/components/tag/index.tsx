// Types
import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

import { createNamespace, createBrandName } from '../../utils';
import { inherit } from '../../utils/functional';

export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type TagSize = 'normal' | 'medium' | 'large';

export type TagProps = {
  type: TagType;
  size: TagSize;
  text?: string;
  plain?: boolean;
  round?: boolean;
  mark?: boolean;
  color?: string;
  textColor?: string;
};

const [createComponent, bem] = createNamespace('tag');

function Tag(
  // @ts-ignore
  h: CreateElement,
  props: TagProps,
  slots: DefaultSlots,
  ctx: RenderContext<TagProps>,
) {
  const brandName = createBrandName();

  const { text, type, size, plain, round, mark, color } = props;

  let style: { [key: string]: string } = {};
  if (color) {
    style = plain ? { color } : { color: '#ffffff', backgroundColor: color };
  }
  if (props.textColor) {
    style.color = props.textColor;
  }

  type Control = { [key: string]: boolean | undefined };
  const control: Control = { plain, round, mark };
  const classes: (Control | string)[] = [control];
  if (size !== 'normal') classes.unshift(size);
  if (type !== 'default') classes.unshift(type);

  return (
    <span
      style={style}
      class={[bem(classes), { [`${brandName}hairline--surround`]: plain }]}
      {...inherit(ctx, true)}
    >
      {text ? text : slots.default && slots.default()}
    </span>
  );
}

Tag.props = {
  text: String,
  type: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'normal',
  },
  plain: Boolean,
  round: Boolean,
  mark: Boolean,
  color: String,
  textColor: String,
};

export default createComponent<TagProps>(Tag);
