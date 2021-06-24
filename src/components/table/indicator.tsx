import { CreateElement } from 'vue';
import { createNamespace } from '../../utils';

export type TableIndicatorShape = 'round';

export interface TableIndicatorProps {
  value: number[];
  shape?: TableIndicatorShape;
  length: number;
}

const [createComponent, bem] = createNamespace('table-indicator');

// @ts-ignore
function TableIndicator(h: CreateElement, props: TableIndicatorProps) {
  const { length, value = [] } = props;

  const Items = () => {
    return Array(length)
      .fill(0)
      .map((_theValue, index) => {
        return <div key={index} class={bem('item', [{ active: value.includes(index) }])}></div>;
      });
  };

  return <div class={bem()}>{Items()}</div>;
}

export default createComponent<TableIndicatorProps>(TableIndicator);
