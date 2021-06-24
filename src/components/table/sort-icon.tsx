import { CreateElement } from 'vue';
import { createNamespace } from '../../utils';
import { addClass } from '../../utils/create/bem';
import { TableSortType } from './types';

export interface SortIconProps {
  sortType: TableSortType;
  className?: string;
}

const [createComponent, bem] = createNamespace('sort-icon');

// @ts-ignore
function SortIcon(h: CreateElement, props: SortIconProps): JSX.Element {
  const { className = '', sortType } = props;

  return (
    <svg
      class={addClass(bem(), className)}
      width="100%"
      height="100%"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class={bem([{ active: sortType === 'asc' }])}
        d="M3.96569 4C3.60932 4 3.43086 3.56914 3.68284 3.31716L5.71716 1.28284C5.87337 1.12663 6.12663 1.12663 6.28284 1.28284L8.31716 3.31716C8.56914 3.56914 8.39068 4 8.03431 4L3.96569 4Z"
        strokeLinejoin="round"
      />
      <path
        class={bem([{ active: sortType === 'desc' }])}
        d="M8.03431 8C8.39068 8 8.56914 8.43086 8.31716 8.68284L6.28284 10.7172C6.12663 10.8734 5.87337 10.8734 5.71716 10.7172L3.68284 8.68284C3.43086 8.43086 3.60932 8 3.96569 8H8.03431Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default createComponent<SortIconProps>(SortIcon);
