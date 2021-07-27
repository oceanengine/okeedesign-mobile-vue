import {
  BaseTableColumnProps,
  TableCeilingOptionsType,
  TableColumnProps,
  TableDataProps,
  TableDataPropType,
  TableExpandOptionsType,
  TableSortType,
} from './types';
import { off, on, preventDefault } from '../../utils/dom/event';
import SortIcon from './sort-icon';
import Icon from '../icon';
import EmptyContent, { emptyContentProps, EmptyContentProps } from './empty-content';
import TableIndicator from './indicator';
import { computeColumnWidth, transformWidth } from './algorithm';
import { createNamespace, isDef } from '../../utils';
import { addClass } from '../../utils/create/bem';
import { DefaultSlots } from '../../utils/types';
import { TouchMixin } from '../../mixins/touch';
import type { JSX, CSSProperties } from '../../../types/jsx';

const [createComponent] = createNamespace('table');

export interface TableProps extends EmptyContentProps {
  columns: TableColumnProps[];
  data: TableDataProps[];

  dataPropsMapping?: TableDataPropType;

  height?: string | number;

  sortDataProp?: string;
  sortType?: TableSortType;

  expanded?: string[];
  expandOptions?: TableExpandOptionsType;

  ceilingOptions?: TableCeilingOptionsType;

  loading?: boolean;

  swipeable?: boolean;

  showIndicator?: boolean;
}

export interface TableEvents {
  onSortChange?: (column: TableColumnProps, sortDataProp: string, sortType: TableSortType) => void;
  onFilterChange?: (column: TableColumnProps, filterDataProp: string) => void;
  onExpandChange?: (expandRowData: TableDataProps, newExpanded: string[]) => void;
}

export interface TableScopedSlots extends DefaultSlots {}

type StickyOffset = Record<'left' | 'right' | 'width', number>;

type ColumnStickyOffset = Record<string, StickyOffset>;

const [, bem] = createNamespace('table-wrapper');
const [, trackBem] = createNamespace('table-track');
const [, tableBem] = createNamespace('table');
const [, theadBem] = createNamespace('thead');
const [, tbodyBem] = createNamespace('tbody');
const [, tfootBem] = createNamespace('tfoot');
const [, trBem] = createNamespace('tr');
const [, thBem] = createNamespace('th');
const [, tdBem] = createNamespace('td');

const DEFAULT_EXPAND_COLUMN_WIDTH = 40;

const SPEED_LIMIT = 0.2;

export default createComponent<TableProps, TableEvents, TableScopedSlots>({
  props: {
    ...emptyContentProps,
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    dataPropsMapping: {
      type: Object,
      default() {
        return {
          id: 'id',
          children: 'children',
        };
      },
    },
    height: {
      type: [Number, String],
    },
    sortDataProp: {
      type: String,
    },
    sortType: {
      type: String,
    },
    expanded: {
      type: Array,
    },
    expandOptions: {
      type: Object,
    },
    ceilingOptions: {
      type: Object,
    },
    loading: {
      type: Boolean,
    },
    swipeable: {
      type: Boolean,
    },
    showIndicator: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      columnStickyOffset: {},
      columnComputedWidth: {},

      showShadowLeft: false,
      showShadowRight: false,

      leftFixedBoundaryColumnIndex: -1,
      rightFixedBoundaryColumnIndex: -1,

      indicatorValue: [],

      moving: false,
      touchMoving: false,
      touchHorizontalMoving: false,

      transformIndex: 0,
      touchDistance: 0,
      transformGap: 0,

      columnTransformOffset: 0,
      rightColumnTransformOffset: 0,
    };
  },

  mixins: [TouchMixin],
  created() {
    const { columns } = this;

    const firstColumnUnFixed = columns.find(column => {
      return column.fixed !== 'left';
    });
    this.transformIndex = firstColumnUnFixed ? columns.indexOf(firstColumnUnFixed) : 0;
  },

  mounted() {
    this.$watch(
      () => {
        return [this.column, this.expandOptions, this.columnComputedWidth];
      },
      () => {
        requestAnimationFrame(() => {
          if (this.$refs.tableFakeTr) {
            const { expandOptions, columns } = this;
            // TODO
            // 通过不可见行，获取到每列的 offsetLeft
            // 当前先通过 thead 来获取
            const fakeTdList = this.$refs.tableFakeTr.querySelectorAll('td');

            const newColumnStickyOffset: ColumnStickyOffset = {};

            const fakeTrWidth = this.$refs.tableFakeTr.offsetWidth;

            const syntheticColumns = (
              (expandOptions ? [expandOptions] : []) as BaseTableColumnProps[]
            ).concat(columns);

            syntheticColumns.forEach((column, index) => {
              if (fakeTdList[index]) {
                const tdOffsetLeft = fakeTdList[index].offsetLeft;
                const tdOffsetWidth = fakeTdList[index].offsetWidth;
                newColumnStickyOffset[column.dataProp] = {
                  left: tdOffsetLeft,
                  right: fakeTrWidth - tdOffsetLeft - tdOffsetWidth,
                  width: tdOffsetWidth,
                };
              }
            });

            this.columnStickyOffset = newColumnStickyOffset;

            // calc shadow position
            let newLeftFixedBoundaryColumnIndex = -1;
            let newRightFixedBoundaryColumnIndex = -1;

            columns.forEach((column, index) => {
              if (column.fixed === 'left') {
                newLeftFixedBoundaryColumnIndex = index;
              }
              if (newRightFixedBoundaryColumnIndex === -1 && column.fixed === 'right') {
                newRightFixedBoundaryColumnIndex = index;
              }
            });

            if (newLeftFixedBoundaryColumnIndex < columns.length - 1) {
              this.leftFixedBoundaryColumnIndex = newLeftFixedBoundaryColumnIndex;
            }

            if (newRightFixedBoundaryColumnIndex !== 0) {
              this.rightFixedBoundaryColumnIndex = newRightFixedBoundaryColumnIndex;
            }
          }

          if (this.swipeable) {
            // transform shadow
            this.onContainerTransform();
          } else if (this.$refs.track) {
            // scroll shadow
            this.onContainerScroll(this.$refs.track);
          }
        });
      },
      {
        immediate: true,
      },
    );

    this.$watch(
      () => {
        return [this.columns, this.expandOptions];
      },
      () => {
        if (this.$refs.wrapper) {
          const { columns } = this;
          this.columnComputedWidth = computeColumnWidth(
            ([] as (TableColumnProps | TableExpandOptionsType)[])
              .concat(
                this.expandOptions
                  ? Object.assign(
                      {
                        width: DEFAULT_EXPAND_COLUMN_WIDTH,
                      },
                      this.expandOptions,
                    )
                  : [],
              )
              .concat(columns),
            this.$refs.wrapper.offsetWidth,
          );
        }
      },
    );

    this.$watch(
      () => {
        return [this.ceilingOptions, this.swipeable];
      },
      () => {
        const { ceilingOptions, swipeable } = this;
        let scrollBoundary: TableCeilingOptionsType['scrollBoundary'] = this.$refs.track;
        if (ceilingOptions) {
          scrollBoundary = ceilingOptions.scrollBoundary;
        }

        const onScroll = (): void => {
          this.onContainerScroll(scrollBoundary);
        };

        if (!swipeable) {
          if (scrollBoundary === document) {
            on(scrollBoundary, 'scroll', onScroll);
          } else if (scrollBoundary) {
            on(scrollBoundary as HTMLElement, 'scroll', onScroll);
          }
        }

        return () => {
          if (!swipeable) {
            if (scrollBoundary === document) {
              off(scrollBoundary, 'scroll', onScroll);
            } else if (scrollBoundary) {
              off(scrollBoundary as HTMLElement, 'scroll', onScroll);
            }
          }
        };
      },
      {
        immediate: true,
      },
    );

    this.$watch(
      () => {
        const { columns, columnStickyOffset, columnTransformOffset, leftFixedBoundaryColumnIndex } =
          this;
        return [columns, columnStickyOffset, columnTransformOffset, leftFixedBoundaryColumnIndex];
      },
      () => {
        const value: number[] = [];

        if (!this.$refs.wrapper) {
          return;
        }

        const { leftFixedBoundaryColumnIndex, columnStickyOffset, columns, columnTransformOffset } =
          this;

        const wrapperWidth = this.$refs.wrapper.offsetWidth;

        let boundaryOffsetLeft = 0;

        if (leftFixedBoundaryColumnIndex !== -1) {
          const boundaryOffset = columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
          if (boundaryOffset) {
            boundaryOffsetLeft = boundaryOffset.left + boundaryOffset.width;
          }
        }

        columns.forEach((column, index) => {
          if (column.fixed) {
            value.push(index);
            return;
          }
          const columnOffset = columnStickyOffset[column.dataProp];

          if (!columnOffset) return;

          if (
            columnOffset.left + columnTransformOffset < wrapperWidth &&
            columnOffset.left + columnOffset.width + columnTransformOffset > boundaryOffsetLeft
          ) {
            value.push(index);
          }
        });

        this.indicatorValue = value;
      },
      {
        immediate: true,
      },
    );

    this.$watch(
      () => {
        const {
          columnStickyOffset,
          columns,
          transformIndex,
          leftFixedBoundaryColumnIndex,
          touchDistance,
        } = this;
        return [
          columnStickyOffset,
          columns,
          transformIndex,
          leftFixedBoundaryColumnIndex,
          touchDistance,
        ];
      },
      () => {
        const {
          columnStickyOffset,
          columns,
          transformIndex,
          leftFixedBoundaryColumnIndex,
          touchDistance,
        } = this;

        const columnOffset = columnStickyOffset[columns[transformIndex].dataProp];

        if (columnOffset) {
          let computedTransformOffset: number;
          if (leftFixedBoundaryColumnIndex !== -1) {
            const boundaryOffset =
              columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
            computedTransformOffset =
              -(columnOffset.left - boundaryOffset.left - boundaryOffset.width) + touchDistance;
          } else {
            computedTransformOffset = -columnOffset.left + touchDistance;
          }

          const wrapperWidth = this.$refs.wrapper.offsetWidth;
          const scrollWidth = this.$refs.table.offsetWidth;

          this.columnTransformOffset = Math.max(
            computedTransformOffset,
            -(scrollWidth - wrapperWidth),
          );
          return;
        }

        this.columnTransformOffset = touchDistance;
      },
      {
        immediate: true,
      },
    );

    this.$watch(
      'columnTransformOffset',
      () => {
        if (this.$refs.wrapper && this.$refs.table) {
          const wrapperWidth = this.$refs.wrapper.offsetWidth;
          const scrollWidth = this.$refs.table.offsetWidth;

          this.rightColumnTransformOffset = scrollWidth - wrapperWidth + this.columnTransformOffset;
          return;
        }
        this.rightColumnTransformOffset = 0;
      },
      {
        immediate: true,
      },
    );

    this.bindTouchEvent(this.$refs.wrapper);
  },

  render(this: any) {
    const { data, swipeable, touchHorizontalMoving, ceilingOptions, height } = this;

    const isEmpty = !data.length;

    const classModify: Record<string, boolean> = {
      swipeable,
      'swipeable-touching': touchHorizontalMoving,
      empty: isEmpty,
    };
    if (ceilingOptions) {
      classModify['ceiling'] = true;
    }

    const className = bem([{ empty: isEmpty }]);
    const style: CSSProperties = {};
    if (!data.length && !!height) {
      style.height = typeof height === 'number' ? `${height}px` : height;
    }
    return (
      <div ref="wrapper" class={className} style={style}>
        {this.TalbeSwipeableHeader}
        <div ref="track" class={trackBem([classModify])} style={this.tableStyle}>
          {this.renderTable()}
        </div>
        {this.TableEmtpyBody}
      </div>
    );
  },

  methods: {
    onContainerScroll(this: any, container: HTMLElement | Document) {
      const { showShadowLeft, showShadowRight } = this;
      const scrollingElement =
        container === document ? document.documentElement : (container as HTMLElement);
      if (
        (scrollingElement.scrollLeft > 0 && !showShadowLeft) ||
        (scrollingElement.scrollLeft === 0 && showShadowLeft)
      ) {
        this.showShadowLeft = !showShadowLeft;
      }

      if (
        (scrollingElement.scrollLeft + scrollingElement.offsetWidth <
          scrollingElement.scrollWidth &&
          !showShadowRight) ||
        (scrollingElement.scrollLeft + scrollingElement.offsetWidth >=
          scrollingElement.scrollWidth &&
          showShadowRight)
      ) {
        this.showShadowRight = !showShadowRight;
      }
    },

    computeTransitionDistance(
      this: any,
      lastTransformIndex: number,
      newTransformIndex: number,
    ): number {
      const { columnStickyOffset, columns, leftFixedBoundaryColumnIndex } = this;

      const lastColumnOffset = columnStickyOffset[columns[lastTransformIndex].dataProp];

      const newColumnOffset = columnStickyOffset[columns[newTransformIndex].dataProp];

      if (lastColumnOffset && newColumnOffset) {
        let lastComputedTransformOffset: number;
        let newComputedTransformOffset: number;

        const wrapperWidth = this.$refs.wrapper.offsetWidth;
        const scrollWidth = this.$refs.table.offsetWidth;

        if (leftFixedBoundaryColumnIndex !== -1) {
          const boundaryOffset = columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
          lastComputedTransformOffset = -(
            lastColumnOffset.left -
            boundaryOffset.left -
            boundaryOffset.width
          );
          newComputedTransformOffset = -(
            newColumnOffset.left -
            boundaryOffset.left -
            boundaryOffset.width
          );
        } else {
          lastComputedTransformOffset = -lastColumnOffset.left;
          newComputedTransformOffset = -newColumnOffset.left;
        }

        return (
          Math.max(newComputedTransformOffset, -(scrollWidth - wrapperWidth)) -
          Math.max(lastComputedTransformOffset, -(scrollWidth - wrapperWidth))
        );
      }
      return 0;
    },

    onContainerTransform(this: any) {
      const { columnTransformOffset, showShadowLeft, showShadowRight } = this;

      if (
        (columnTransformOffset < 0 && !showShadowLeft) ||
        (columnTransformOffset === 0 && showShadowLeft)
      ) {
        this.showShadowLeft = !showShadowLeft;
      }

      if (this.$refs.wrapper && this.$refs.table) {
        if (
          (this.$refs.wrapper.offsetWidth - columnTransformOffset < this.$refs.table.offsetWidth &&
            !showShadowRight) ||
          (this.$refs.wrapper.offsetWidth - columnTransformOffset >= this.$refs.table.offsetWidth &&
            showShadowRight)
        ) {
          this.showShadowRight = !showShadowRight;
        }
      }
    },

    onTouchStart(this: any, event) {
      if (!this.swipeable) {
        return;
      }

      this.touchStart(event);

      const { moving } = this;
      // TODO
      // need to gurantee touches is accessible
      if (moving) {
        return;
      }

      if (event.touches.length === 1) {
        this.touchMoving = true;
      }
    },
    onTouchMove(this: any, event) {
      if (!this.swipeable) {
        return;
      }

      this.touchMove(event);

      const {
        touchMoving,
        touchHorizontalMoving,
        columnStickyOffset,
        columns,
        transformIndex,
        leftFixedBoundaryColumnIndex,
        transformGap,
      } = this;

      // TODO
      // need to gurantee states is not empty
      if (touchMoving) {
        const { deltaX, direction } = this;

        if (direction === 'horizontal') {
          preventDefault(event as Event);

          !touchHorizontalMoving && (this.touchHorizontalMoving = true);

          const columnOffsetLeft = columnStickyOffset[columns[transformIndex].dataProp].left;

          const boundaryOffset =
            leftFixedBoundaryColumnIndex !== -1 &&
            columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];

          const boundaryOffsetLeft = boundaryOffset
            ? boundaryOffset.left + boundaryOffset.width
            : 0;

          const wrapperWidth = this.$refs.wrapper.offsetWidth;
          const scrollWidth = this.$refs.table.offsetWidth;

          const truncDistance = Math.min(
            columnOffsetLeft - boundaryOffsetLeft,
            Math.max(
              deltaX + transformGap,
              -(scrollWidth - wrapperWidth - (columnOffsetLeft - boundaryOffsetLeft)),
            ),
          );

          this.touchDistance = truncDistance;
        }
      }
    },
    onTouchEnd(this: any) {
      if (!this.swipeable) {
        return;
      }

      const {
        touchMoving,
        columnStickyOffset,
        columns,
        transformIndex,
        leftFixedBoundaryColumnIndex,
        touchDistance,
      } = this;

      if (touchMoving) {
        this.touchMoving = false;
        this.touchHorizontalMoving = false;
        this.moving = true;
        this.touchDistance = 0;

        // compute speed
        let touchSpeed = 0;
        const { speedX } = this;
        if (Math.abs(speedX) > SPEED_LIMIT) {
          touchSpeed = speedX;
        }

        const columnOffsetLeft = columnStickyOffset[columns[transformIndex].dataProp].left;

        const wrapperWidth = this.$refs.wrapper.offsetWidth;
        const scrollWidth = this.$refs.table.offsetWidth;

        const boundaryOffset =
          leftFixedBoundaryColumnIndex !== -1 &&
          columnStickyOffset[columns[leftFixedBoundaryColumnIndex].dataProp];
        const boundaryOffsetLeft = boundaryOffset ? boundaryOffset.left + boundaryOffset.width : 0;

        // distance from right edge of table
        const orgEdgeDistance =
          scrollWidth - wrapperWidth - (columnOffsetLeft - boundaryOffsetLeft) + touchDistance;
        const hitEdge = orgEdgeDistance <= 0;

        // determine transform index
        let newTransformIndex = transformIndex;
        columns.some((column, columnIndex) => {
          const { left, width } = columnStickyOffset[column.dataProp];
          const distanceFromCurrentColumn = left - columnOffsetLeft;

          // swipe to left
          if (
            columnIndex > transformIndex &&
            touchDistance < 0 &&
            touchDistance + distanceFromCurrentColumn > 0
          ) {
            if (touchDistance + distanceFromCurrentColumn - width / 2 > 0) {
              newTransformIndex = columnIndex;
            } else {
              newTransformIndex = columnIndex + 1;
            }
            if (hitEdge) {
              newTransformIndex = columnIndex + 1;
            }
            if (touchSpeed < 0) {
              newTransformIndex = columnIndex + 1;
            } else if (touchSpeed > 0) {
              newTransformIndex = columnIndex;
            }
            return true;
          }

          // swipe to right or swipe visible first column
          if (
            columnIndex <= transformIndex &&
            touchDistance + distanceFromCurrentColumn + width > 0
          ) {
            if (touchDistance + distanceFromCurrentColumn + width / 2 > 0) {
              newTransformIndex = columnIndex;
            } else {
              newTransformIndex = columnIndex + 1;
            }
            if (hitEdge) {
              newTransformIndex = columnIndex + 1;
            }
            if (touchSpeed < 0) {
              newTransformIndex = columnIndex + 1;
            } else if (touchSpeed > 0) {
              newTransformIndex = columnIndex;
            }
            return true;
          }
          return false;
        });

        newTransformIndex = Math.min(newTransformIndex, columns.length - 1);
        this.transformIndex = newTransformIndex;

        const finalColumnOffsetLeft = columnStickyOffset[columns[newTransformIndex].dataProp].left;

        // current transformed column has no space to swipe entirely
        // set the gap to its supposed to be
        const finalEdgeDistance =
          scrollWidth - wrapperWidth - (finalColumnOffsetLeft - boundaryOffsetLeft);

        if (finalEdgeDistance >= 0) {
          this.transformGap = 0;
        } else {
          this.transformGap = -finalEdgeDistance;
        }

        // handle condition transiton not triggered
        // not trigger transition
        const estimatedTouchDistance = this.computeTransitionDistance(
          transformIndex,
          newTransformIndex,
        );

        if (
          estimatedTouchDistance === touchDistance ||
          // exception condition: translate from right edge and finally landing on right edge
          touchDistance === this.transformGap
        ) {
          this.onTransitionEnd();
        }
      }
    },

    onTransitionEnd(this: any) {
      if (this.moving) {
        this.onContainerTransform();
        this.moving = false;
      }
    },

    appendTransitionToLeftFixedCell(this: any, style: CSSProperties) {
      const { swipeable, columnTransformOffset, moving } = this;
      if (!swipeable) {
        return;
      }
      style['transform'] = `translate3d(${-columnTransformOffset}px, 0, 0)`;
      if (moving) {
        style['transitionDuration'] = '0.3s';
      }
    },

    appendTransitionToRightFixedCell(this: any, style: CSSProperties) {
      const { swipeable, rightColumnTransformOffset, moving } = this;
      if (!swipeable) {
        return;
      }
      style['transform'] = `translate3d(${-rightColumnTransformOffset}px, 0, 0)`;
      if (moving) {
        style['transitionDuration'] = '0.3s';
      }
    },

    appendTransitionToFixedCell(this: any, style: CSSProperties, fixedDirection: 'right' | 'left') {
      if (fixedDirection === 'left') {
        this.appendTransitionToLeftFixedCell(style);
      } else {
        this.appendTransitionToRightFixedCell(style);
      }
    },

    appendTransitionToTable(this: any, style: CSSProperties) {
      const { swipeable, columnTransformOffset, moving } = this;
      if (!swipeable) {
        return;
      }
      style['transform'] = `translate3d(${columnTransformOffset}px, 0, 0)`;
      if (moving) {
        style['transitionDuration'] = '0.3s';
      }
    },

    renderTable(this: any) {
      const tableStyle: CSSProperties = {};
      // unfixed column transform
      this.appendTransitionToTable(tableStyle);
      return (
        <table
          ref="table"
          class={tableBem()}
          style={tableStyle}
          onTransitionend={this.onTransitionEnd}
        >
          {this.ColumnGroup}
          {this.TableHeader}
          {this.TableBody}
          {this.TableFooter}
        </table>
      );
    },
  },

  computed: {
    tableStyle() {
      const { height } = this;

      if (!height) {
        return {};
      }
      return {
        maxHeight: typeof height === 'number' ? `${height}px` : height,
      };
    },

    TableHeader(this: any) {
      const {
        columns,
        height,
        showShadowLeft,
        showShadowRight,
        leftFixedBoundaryColumnIndex,
        rightFixedBoundaryColumnIndex,
        sortDataProp,
        sortType,
        swipeable,
        ceilingOptions,
        expandOptions,
        columnStickyOffset,
      } = this;

      const isSticky = !!height || ceilingOptions;

      const renderExpandTh = () => {
        const thStyle: CSSProperties = {};
        const thClassModifiers: Record<string, any> = {
          sticky: isSticky,
        };
        if (isSticky) {
          let stickyTop = (ceilingOptions && ceilingOptions.top) || 0;
          stickyTop = typeof stickyTop === 'number' ? `${stickyTop}px` : stickyTop;
          thStyle.top = stickyTop;
        }

        if (expandOptions!.fixed) {
          thClassModifiers[`sticky-${expandOptions!.fixed}`] = true;
          if (swipeable) {
            // unfixed column transform
            this.appendTransitionToFixedCell(thStyle, expandOptions!.fixed);
          } else {
            thStyle[expandOptions!.fixed] = `${
              columnStickyOffset[expandOptions!.dataProp]?.[expandOptions!.fixed] || 0
            }px`;
          }
        }

        let className = thBem([thClassModifiers]);

        if (expandOptions!.cellClass) {
          className = addClass(className, expandOptions!.cellClass);
        }

        if (expandOptions!.thCellClass) {
          className = addClass(className, expandOptions!.thCellClass);
        }

        return <th key={expandOptions!.dataProp} class={className} style={thStyle}></th>;
      };

      const tableHeaderContent = columns.map((column, columnIndex) => {
        const { sortable, filterable, dataProp } = column;
        const thStyle: CSSProperties = {};
        const thClassModifiers: Record<string, any> = {
          sticky: isSticky,
        };

        if (isSticky) {
          let stickyTop = (ceilingOptions && ceilingOptions.top) || 0;
          stickyTop = typeof stickyTop === 'number' ? `${stickyTop}px` : stickyTop;
          thStyle.top = stickyTop;
        }

        if (column.fixed) {
          thClassModifiers[`sticky-${column.fixed}`] = true;

          if (swipeable) {
            // unfixed column transform
            this.appendTransitionToFixedCell(thStyle, column.fixed);
          } else {
            thStyle[column.fixed] = `${columnStickyOffset[column.dataProp]?.[column.fixed] || 0}px`;
          }

          if (
            (showShadowLeft &&
              column.fixed === 'left' &&
              columnIndex === leftFixedBoundaryColumnIndex) ||
            (showShadowRight &&
              column.fixed === 'right' &&
              columnIndex === rightFixedBoundaryColumnIndex)
          ) {
            thClassModifiers[`sticky-${column.fixed}-shadow`] = true;
          }
        }

        const renderSortIcon = (): JSX.Element => {
          const onSortIconClick = (): void => {
            let newSortType: TableSortType;
            const newDataProp = column.dataProp;
            if (this.lastSortDataProp === newDataProp && sortType) {
              newSortType = sortType === 'asc' ? 'desc' : 'asc';
            } else {
              newSortType = 'desc';
            }
            this.lastSortDataProp = newDataProp;
            this.$emit('sort-change', column, newDataProp, newSortType);
          };

          return (
            <div class={thBem('sort-icon')} onClick={onSortIconClick}>
              {sortDataProp === dataProp ? (
                <SortIcon sortType={sortType} />
              ) : (
                <SortIcon sortType={undefined} />
              )}
            </div>
          );
        };

        const renderFilterIcon = (): JSX.Element => {
          const onFilterIconClick = (): void => {
            this.$emit('filter-change', column, column.dataProp);
          };
          return <Icon class={thBem('filter-icon')} onClick={onFilterIconClick} name="filter" />;
        };

        let className = thBem([thClassModifiers]);

        if (column!.cellClass) {
          className = addClass(className, column!.cellClass);
        }

        if (column!.thCellClass) {
          className = addClass(className, column!.thCellClass);
        }

        return (
          <th key={column.dataProp} class={className} style={thStyle}>
            {column.renderThCell
              ? column.renderThCell(this.$createElement, { column })
              : column.title}
            {sortable && renderSortIcon()}
            {filterable && renderFilterIcon()}
          </th>
        );
      });
      return (
        <thead class={theadBem()}>
          <tr class={trBem()}>
            {expandOptions && expandOptions.fixed !== 'right' && renderExpandTh()}
            {tableHeaderContent}
            {expandOptions && expandOptions.fixed === 'right' && renderExpandTh()}
          </tr>
        </thead>
      );
    },

    ColumnGroup(this: any) {
      const { columns, columnComputedWidth, expandOptions } = this;

      const renderExpandCol = () => {
        const width = expandOptions!.width || `${DEFAULT_EXPAND_COLUMN_WIDTH}px`;
        const colStyle = {
          width,
        };
        return <col style={colStyle} />;
      };
      const columnGroupContent = columns.map(column => {
        const colStyle: CSSProperties = {};

        const colWidth =
          columnComputedWidth[column.dataProp] ||
          Math.max(
            isDef(column.width) ? transformWidth(column.width!) : 0,
            isDef(column.minWidth) ? transformWidth(column.minWidth!) : 0,
          );
        colStyle.width = typeof colWidth === 'number' ? `${colWidth}px` : colWidth;

        return <col key={column.dataProp} style={colStyle} />;
      });
      return (
        <colgroup>
          {expandOptions && expandOptions.fixed !== 'right' && renderExpandCol()}
          {columnGroupContent}
          {expandOptions && expandOptions.fixed === 'right' && renderExpandCol()}
        </colgroup>
      );
    },

    TableBody(this: any) {
      const {
        data,
        columns,
        showShadowLeft,
        showShadowRight,
        leftFixedBoundaryColumnIndex,
        rightFixedBoundaryColumnIndex,
        columnStickyOffset,
        expanded,
        expandOptions,
        swipeable,
      } = this;

      const renderExpandTd = (row: TableDataProps, rowExpanded: boolean) => {
        const tdStyle: CSSProperties = {};
        const tdClassModifiers: Record<string, any> = {};

        if (expandOptions!.fixed) {
          tdClassModifiers[`sticky-${expandOptions!.fixed}`] = true;
          if (swipeable) {
            // unfixed column transform
            this.appendTransitionToFixedCell(tdStyle, expandOptions!.fixed);
          } else {
            tdStyle[expandOptions!.fixed] = `${
              columnStickyOffset[expandOptions!.dataProp]?.[expandOptions!.fixed] || 0
            }px`;
          }
        }

        const onExpandTdClick = () => {
          const newExpanded = [...expanded];
          if (rowExpanded) {
            const expandIndex = expanded.indexOf(row[expandOptions!.dataProp]);
            newExpanded.splice(expandIndex, 1);
          } else {
            newExpanded.push(row[expandOptions!.dataProp]);
          }
          this.$emit('expand-change', row, newExpanded);
        };

        let className = tdBem([tdClassModifiers, { expanded: rowExpanded }]);

        if (expandOptions!.cellClass) {
          className = addClass(className, expandOptions!.cellClass);
        }

        if (expandOptions!.tdCellClass) {
          className = addClass(className, expandOptions!.tdCellClass);
        }

        return (
          <td
            key={expandOptions!.dataProp}
            class={className}
            style={tdStyle}
            onClick={onExpandTdClick}
          >
            <div class={tdBem('expand')}>
              {expandOptions!.renderIcon ? (
                expandOptions!.renderIcon(this.$createElement, { rowData: row })
              ) : (
                <Icon class={tdBem('expand-icon', [{ expanded: rowExpanded }])} name="arrow-down" />
              )}
            </div>
          </td>
        );
      };

      const tableBodyContent = [];
      data.forEach(row => {
        const rowExpanded = expandOptions ? expanded.includes(row[expandOptions.dataProp]) : false;

        const tableTrContent = columns.map((column, columnIndex) => {
          const tdStyle: CSSProperties = {};
          const tdClassModifiers: Record<string, any> = {};

          if (column.fixed) {
            tdClassModifiers[`sticky-${column.fixed}`] = true;

            if (swipeable) {
              // unfixed column transform
              this.appendTransitionToFixedCell(tdStyle, column.fixed);
            } else {
              tdStyle[column.fixed] = `${
                columnStickyOffset[column.dataProp]?.[column.fixed] || 0
              }px`;
            }

            if (
              (showShadowLeft &&
                column.fixed === 'left' &&
                columnIndex === leftFixedBoundaryColumnIndex) ||
              (showShadowRight &&
                column.fixed === 'right' &&
                columnIndex === rightFixedBoundaryColumnIndex)
            ) {
              tdClassModifiers[`sticky-${column.fixed}-shadow`] = true;
            }
          }

          let className = tdBem([tdClassModifiers, { expanded: rowExpanded }]);

          if (column!.cellClass) {
            className = addClass(className, column!.cellClass);
          }

          if (column!.tdCellClass) {
            className = addClass(className, column!.tdCellClass);
          }

          return (
            <td key={column.dataProp} class={className} style={tdStyle}>
              {column.renderCell ? column.renderCell(this.$createElement, { rowData: row, column }) : row[column.dataProp]}
            </td>
          );
        });

        tableBodyContent.push(
          <tr key={`tr-${row[this.dataPropsMapping.id!]}`} class={trBem()}>
            {expandOptions && expandOptions.fixed !== 'right' && renderExpandTd(row, rowExpanded)}
            {tableTrContent}
            {expandOptions && expandOptions.fixed === 'right' && renderExpandTd(row, rowExpanded)}
          </tr>,
        );

        if (rowExpanded) {
          tableBodyContent.push(
            <tr class={trBem()}>
              <td
                key={`tr-expand-${row[this.dataPropsMapping.id!]}`}
                class={tdBem()}
                colSpan={columns.length + (expandOptions ? 1 : 0)}
              >
                {expandOptions!.renderContent(this.$createElement, { rowData: row })}
              </td>
            </tr>,
          );
        }
      });

      const tableFakeTr = (
        <tr ref="tableFakeTr" key="fake-column" class={trBem()}>
          {expandOptions && expandOptions.fixed !== 'right' && (
            <td key="expand-former" class={tdBem([{ fake: true }])}></td>
          )}
          {columns.map(column => {
            return <td key={column.dataProp} class={tdBem([{ fake: true }])}></td>;
          })}
          {expandOptions && expandOptions.fixed === 'right' && (
            <td key="expand-latter" class={tdBem([{ fake: true }])}></td>
          )}
        </tr>
      );

      return (
        <tbody class={tbodyBem()}>
          {tableBodyContent}
          {tableFakeTr}
        </tbody>
      );
    },

    TableEmtpyBody(this: any) {
      const { data, emptyContentImage, emptyContentText } = this;
      if (data.length) return null;
      return (
        <div class={tbodyBem(['empty'])}>
          <EmptyContent emptyContentImage={emptyContentImage} emptyContentText={emptyContentText} />
        </div>
      );
    },

    TableFooter() {
      return <tfoot class={tfootBem()}></tfoot>;
    },

    TalbeSwipeableHeader(this: any) {
      const { indicatorValue, columns, swipeable, showIndicator } = this;
      return (
        swipeable &&
        showIndicator && (
          <div class={bem('indicator')}>
            <TableIndicator value={indicatorValue} length={columns.length} />
          </div>
        )
      );
    },
  },
});
