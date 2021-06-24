import { isDef } from '../../utils';
import { TableColumnProps, TableColumnWidthType, TableExpandOptionsType } from './types';

const defaultMinWidth = 0;

export function transformWidth(theWidth: TableColumnWidthType) {
  return typeof theWidth === 'number' ? theWidth : parseFloat(theWidth!);
}

export function computeColumnWidth(
  mergedColumns: (TableColumnProps | TableExpandOptionsType)[],
  totalWidth: number,
): Record<string, number> {
  // table父容器的宽度
  const TableContainerWidth = totalWidth;
  // table 所有列用户自定义宽度总和, 这里需要注意如果minWidth > width 以minWidth为准
  const TableColumnsTotalWidth = mergedColumns.reduce(
    (acc, column) =>
      acc +
      (isDef(column.width) || isDef(column.minWidth)
        ? Math.max(
            isDef(column.width) ? transformWidth(column.width!) : 0,
            isDef(column.minWidth) ? transformWidth(column.minWidth!) : 0,
          )
        : defaultMinWidth),
    0,
  );

  // 判断是否需要自动适配table容器的宽度
  const needResize = TableContainerWidth - TableColumnsTotalWidth > 0;

  if (!needResize) {
    return mergedColumns.reduce((pre, column) => {
      return Object.assign({}, pre, {
        [column.dataProp]:
          isDef(column.width) || isDef(column.minWidth)
            ? Math.max(
                isDef(column.width) ? transformWidth(column.width!) : 0,
                isDef(column.minWidth) ? transformWidth(column.minWidth!) : 0,
              )
            : defaultMinWidth,
      });
    }, {});
  }

  const columnWidthDic: Record<string, number> = {};

  let columnTotalFixedWidth = 0;

  // has width props
  mergedColumns.forEach(column => {
    if (isDef(column.width)) {
      columnWidthDic[column.dataProp] = transformWidth(column.width!);
      columnTotalFixedWidth += columnWidthDic[column.dataProp];
    }
  });

  // 设置了minWidth的列数 未设置的列需要按照内部defaultMinWidth计算
  const unFixedColumns = mergedColumns.filter(column => !isDef(column.width));

  // 剩余需要分配的宽度
  let remainWidth = TableContainerWidth - columnTotalFixedWidth;
  // 模拟将待分配的宽度按照当前所有列进行比例分配，算出每列应当分配的宽度，
  // 如果小于当前列的最小宽度，则以最小宽度为准，最后得出需要调整的column，再按照比例进行分配

  let satifyAllCondition = false;

  while (unFixedColumns.length && !satifyAllCondition) {
    const columnAverageWidth = remainWidth / unFixedColumns.length;

    let longerColumn;
    let longerColumnWidth = 0;

    unFixedColumns.forEach(column => {
      if (isDef(column.minWidth)) {
        const value = transformWidth(column.minWidth!);
        if (value > columnAverageWidth && value >= longerColumnWidth) {
          longerColumnWidth = value;
          longerColumn = column;
        }
      }
    });

    if (longerColumn) {
      remainWidth -= longerColumnWidth;
      unFixedColumns.splice(unFixedColumns.indexOf(longerColumn), 1);
      continue;
    }

    let shorterColumn;
    let shorterColumnWidth = 0;

    unFixedColumns.forEach(column => {
      if (isDef(column.maxWidth)) {
        const value = transformWidth(column.maxWidth!);
        if (value < columnAverageWidth && value <= shorterColumnWidth) {
          shorterColumnWidth = value;
          shorterColumn = column;
        }
      }
    });

    if (shorterColumn) {
      remainWidth -= shorterColumnWidth;
      unFixedColumns.splice(unFixedColumns.indexOf(shorterColumn), 1);
      continue;
    }

    satifyAllCondition = true;
  }

  const columnAverageWidth = Math.floor(remainWidth / unFixedColumns.length);
  unFixedColumns.forEach((column, columnIndex) => {
    if (columnIndex === unFixedColumns.length - 1) {
      columnWidthDic[column.dataProp] = Math.floor(remainWidth);
      return;
    }
    columnWidthDic[column.dataProp] = columnAverageWidth;
    remainWidth -= columnAverageWidth;
  });

  return columnWidthDic;
}
