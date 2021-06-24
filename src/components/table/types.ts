import { CreateElement } from 'vue/types/umd';
import type { DefaultTextAlignType, RenderContent } from '../../utils/types';

export type TableFixedType = 'left' | 'right';
export type TableCellClassType = string | Array<string>;
export type TableColumnWidthType = number | string;
export type TableSortType = 'asc' | 'desc' | undefined;

export type TableDataPropType = {
  id?: string;
  children?: string;
};

export type TableRenderTdCellType = (
  h: CreateElement,
  params: { rowData: unknown; column: TableColumnProps },
) => RenderContent;

export type TableRenderThCellType = (
  h: CreateElement,
  params: { column: TableColumnProps },
) => RenderContent;

export type BaseTableColumnProps = {
  dataProp: string;
  minWidth?: TableColumnWidthType;
  maxWidth?: TableColumnWidthType;
  width?: TableColumnWidthType;
  cellClass?: TableCellClassType;
  thCellClass?: TableCellClassType;
  tdCellClass?: TableCellClassType;
  fixed?: TableFixedType;
  textAlign?: DefaultTextAlignType;
  resizable?: boolean;
};

export interface TableColumnProps extends BaseTableColumnProps {
  renderCell?: TableRenderTdCellType;
  renderThCell?: TableRenderThCellType;
  sortable?: boolean;
  filterable?: boolean;
  colspan?: number;
  title?: string;
  children?: Array<TableColumnProps>;
}

export type TableDataProps = Record<string, any>;

export interface TableExpandOptionsType extends BaseTableColumnProps {
  contentClass?: TableCellClassType;
  type?: 'expand';
  trigger?: 'icon' | 'row';
  showIconColumn?: boolean;
  renderIcon?: (h: CreateElement, params: { rowData: Record<string, any> }) => RenderContent;
  // 展开的区域内容的自定义渲染函数
  renderContent: (h: CreateElement, params: { rowData: Record<string, any> }) => RenderContent;
}

export type TableCeilingOptionsType = {
  scrollBoundary: HTMLElement | Document;
  top?: number | string;
};
