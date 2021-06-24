<template>
  <div class="demo table">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('fixedHeight')">
      <byted-table :columns="fixedHeightColumns" :data="data" :height="350" />
    </demo-cell>

    <demo-cell :title="t('fixedColumn')">
      <byted-table :columns="fixedColumns" :data="data" :height="350" />
    </demo-cell>

    <demo-cell :title="t('expand')">
      <byted-table
        :columns="fixedHeightColumns"
        :data="data"
        :height="350"
        :expanded="expanded"
        :expandOptions="expandingOptions"
        @expand-change="onExpandChange"
      />
    </demo-cell>

    <demo-cell :title="t('sorting')">
      <byted-table
        :columns="columns"
        :data="data"
        :height="350"
        :sortDataProp="sortDataProp"
        :sortType="sortType"
        @sort-change="handleSortChange"
        @filter-change="handleFilterChange"
      />
    </demo-cell>

    <demo-cell :title="t('emptyContent')">
      <byted-table :columns="fixedHeightColumns" :data="[]" :height="350" />
    </demo-cell>

    <demo-cell :title="t('slidingTable')">
      <byted-table swipeable :columns="columns" :data="data" :height="350" />
    </demo-cell>

    <demo-cell :title="t('stickyTable')">
      <byted-table :columns="ceilingColumns" :data="data" :ceilingOptions="ceilingOptions" />
    </demo-cell>
  </div>
</template>

<script>
import demoCell from '../../../../docs/site/components/DomeCell';

export default {
  components: {
    demoCell,
    // demoTitle,
    // BytedIconModuleTable,
  },
  i18n: {
    'zh-CN': {
      name: '表格',
      type: '基础用法',
      default: '默认',
      primary: '主要',
      success: '成功',
      warning: '警告',
      danger: '危险',
      plain: '描边类型',
      fade: '透明类型',
      hairline: '细边类型',
      shape: '形状类型',
      square: '直角',
      round: '圆角',
      disabled: '禁用类型',
      size: '尺寸',
      text: '文字类型',
      loading: '加载状态',
      fixedHeight: '固定高度',
      fixedColumn: '固定列',
      sorting: '筛选和排序',
      expand: '可展开',
      slidingTable: '滑动表格',
      stickyTable: '吸顶表格',
      emptyContent: '空白表格',
    },
    'en-US': {
      name: 'Table',
      type: 'Type',
      default: 'Default',
      primary: 'Primary',
      success: 'Success',
      warning: 'Warning',
      danger: 'Danger',
      plain: 'Plain',
      fade: 'Fade',
      hairline: 'Hairline',
      shape: 'Shape',
      square: 'Square',
      round: 'Round',
      disabled: 'Disabled',
      size: 'Size',
      text: 'Text',
      fixedColumn: 'Fixed Column',
      fixedHeight: 'Fixed Height',
      loading: 'Loading',
      sorting: 'Sorting',
      expand: 'Expandable',
      slidingTable: 'Sliding Table',
      emptyContent: 'Empty Content',
      stickyTable: 'Ceiling',
    },
  },
  data() {
    const columns = [
      {
        dataProp: 'key1',
        title: 'Title1',
        minWidth: '100px',
        sortable: true,
        filterable: true,
        fixed: 'left',
        cellClass: 'test',
        thCellClass: 'thclass',
        tdCellClass: 'tdClass',
      },
      {
        dataProp: 'key2',
        title: 'Title2',
        minWidth: '160px',
        width: '100px',
        sortable: true,
      },
      {
        dataProp: 'key3',
        title: 'Title3',
        minWidth: '150px',
        width: '250px',
        sortable: true,
        filterable: true,
      },
      {
        dataProp: 'key31',
        title: 'Title31',
        minWidth: '150px',
        width: '250px',
        sortable: true,
        filterable: true,
      },
      {
        dataProp: 'key32',
        title: 'Title32',
        minWidth: '150px',
        width: '250px',
        sortable: true,
        filterable: true,
      },
      {
        dataProp: 'key4',
        title: 'Title4',
        width: '100px',
        sortable: true,
        fixed: 'right',
      },
    ];
    return {
      data: Array.from(new Array(20), () => {
        return {
          id: Math.random(),
          key1: 'Column1',
          key2: 'Column2',
          key3: 'Column3',
          key31: 'Column31',
          key32: 'Column32',
          key4: 'Column4',
          key5: 'Column5',
          key455: 'Column455',
          key566: 'Column566',
          key666: 'Column666',
          key777: 'Column777',
          key888: 'Column888',
          key999: 'Column999',
          key22333: 'Column2333',
        };
      }),
      columns,
      fixedHeightColumns: columns.map(item => {
        return Object.assign({}, item, {
          fixed: undefined,
          sortable: false,
          filterable: false,
        });
      }),
      fixedColumns: columns.map(item => {
        return Object.assign({}, item, {
          sortable: false,
          filterable: false,
        });
      }),
      ceilingColumns: columns.slice(0, 2),
      sortDataProp: 'key2',
      sortType: 'asc',
      ceilingOptions: null,
      expanded: [],
      expandingOptions: {
        dataProp: 'id',
        // fixed: 'left',
        renderContent(h, { rowData }) {
          return <div>Surprise!</div>;
        },
      },
    };
  },
  mounted() {
    const scrollBoundary = document.querySelector('.app');
    this.ceilingOptions = {
      top: 42,
      scrollBoundary,
    };
  },
  methods: {
    handleSortChange(column, newSortDataProp, newSortType) {
      this.sortDataProp = newSortDataProp;
      this.sortType = newSortType;
    },
    handleFilterChange(column, filterDataProp) {
      this.$toast(`filter ${filterDataProp}`);
    },
    onExpandChange(expandRowData, newExpanded) {
      this.expanded = newExpanded;
    },
  },
};
</script>

<style></style>
