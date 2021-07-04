<template>
  <div class="demo cascader">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basic')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('basic')" is-link @click="showBasic = true" />
      </div>
      <o-popup v-model="showBasic" position="bottom">
        <o-cascader v-model="selected" :options="options" @change="handleChange" />
      </o-popup>
    </demo-cell>
    <demo-cell :title="t('defaultValue')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('defaultValue')" is-link @click="showDefault = true" />
      </div>
      <o-popup v-model="showDefault" position="bottom">
        <o-cascader
          v-model="selected"
          :options="options"
          :selected-item="selectedItem"
          @change="handleChange"
        />
      </o-popup>
    </demo-cell>

    <demo-cell :title="t('asyncLoad')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('asyncLoad')" is-link @click="showAsync = true" />
      </div>
      <o-popup v-model="showAsync" position="bottom">
        <o-cascader
          v-model="selected"
          :options="options3"
          @active-item-change="handleActiveItemChange"
          @change="handleChange"
        />
      </o-popup>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
const Options = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'shejiyuanze',
        label: '设计原则',
        children: [
          {
            value: 'yizhi',
            label: '一致',
          },
          {
            value: 'fankui',
            label: '反馈',
          },
          {
            value: 'xiaolv',
            label: '效率',
          },
          {
            value: 'kekong',
            label: '可控',
          },
        ],
      },
      {
        value: 'daohang',
        label: '导航',
        children: [
          {
            value: 'cexiangdaohang',
            label: '侧向导航',
          },
          {
            value: 'dingbudaohang',
            label: '顶部导航',
          },
        ],
      },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout 布局',
          },
          {
            value: 'color',
            label: 'Color 色彩',
          },
          {
            value: 'typography',
            label: 'Typography 字体',
          },
          {
            value: 'icon',
            label: 'Icon 图标',
            children: [
              {
                value: 'iconChild',
                label: 'icon 图标子元素',
              },
            ],
          },
          {
            value: 'button',
            label: 'Button 按钮',
          },
        ],
      },
    ],
  },
  {
    value: 'test1',
    label: '测试一级',
  },
  {
    value: 'test2',
    label: '测试二级',
    children: [
      {
        value: 'test21',
        label: '测试二级1',
      },
      {
        value: 'test22',
        label: '测试二级2',
      },
    ],
  },
];

const Options2 = [
  {
    value: 'zhinan',
    label: '指南',
    children: [
      {
        value: 'shejiyuanze',
        label: '设计原则哈哈哈',
        children: [
          {
            value: 'yizhi',
            label: '设计原则哈哈哈一致',
          },
          {
            value: 'fankui',
            label: '设计原则哈哈哈反馈',
          },
          {
            value: 'xiaolv',
            label: '设计原则哈哈哈效率',
          },
          {
            value: 'kekong',
            label: '设计原则哈哈哈可控',
          },
        ],
      },
      {
        value: 'daohang',
        label: '导航',
        children: [
          {
            value: 'cexiangdaohang',
            label: '侧向导航',
          },
          {
            value: 'dingbudaohang',
            label: '顶部导航',
          },
        ],
      },
    ],
  },
  {
    value: 'zujian',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          {
            value: 'layout',
            label: 'Layout 布局',
          },
          {
            value: 'color',
            label: 'Color 色彩',
          },
          {
            value: 'typography',
            label: 'Typography 字体',
          },
          {
            value: 'icon',
            label: 'Icon 图标',
            children: [
              {
                value: 'iconChild',
                label: 'icon 图标子元素',
              },
            ],
          },
          {
            value: 'button',
            label: 'Button 按钮',
          },
        ],
      },
    ],
  },
  {
    value: 'test1',
    label: '测试一级',
  },
  {
    value: 'test2',
    label: '测试二级',
    children: [
      {
        value: 'test21',
        label: '测试二级1',
      },
      {
        value: 'test22',
        label: '测试二级2',
      },
    ],
  },
];

const Options3 = [
  {
    value: 'zhinan',
    label: '指南',
    children: [],
  },
  {
    value: 'test1',
    label: '测试一级',
  },
  {
    value: 'test2',
    label: '测试二级',
    children: [],
  },
];

const valueMap = {
  zhinan: [
    {
      value: 'shejiyuanze',
      label: '设计原则',
      children: [
        {
          value: 'yizhi',
          label: '一致',
        },
        {
          value: 'fankui',
          label: '反馈',
        },
        {
          value: 'xiaolv',
          label: '效率',
        },
        {
          value: 'kekong',
          label: '可控',
        },
      ],
    },
    {
      value: 'daohang',
      label: '导航',
      children: [
        {
          value: 'cexiangdaohang',
          label: '侧向导航',
        },
        {
          value: 'dingbudaohang',
          label: '顶部导航',
        },
      ],
    },
  ],
  test2: [
    {
      value: 'test21',
      label: '测试二级1',
    },
    {
      value: 'test22',
      label: '测试二级2',
    },
  ],
};

const SelectedItem = ['test2', 'test21'];

export default {
  i18n: {
    'zh-CN': {
      name: '级联选择',
      basic: '基础用法',
      collapse: '大于两列可收缩首列',
      defaultValue: '默认选择',
      asyncLoad: '异步加载',
      defaultAndAsync: '有默认值',
    },
    'en-US': {
      name: 'Cascader',
      basic: 'basci use',
      collapse: 'collapse',
      defaultValue: 'has default value',
      asyncLoad: 'async Load children',
      defaultAndAsync: 'show default selected value and async Load children',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      options: [],
      options2: [],
      options3: Options3,
      options4: Options3,
      selected: [],
      selectedItem: SelectedItem,
      selectedItem2: [],
      showBasic: false,
      showDefault: false,
      showAsync: false,
    };
  },
  created() {
    // 支持异步数据
    setTimeout(() => {
      this.options = Options;
      this.options2 = Options2;
    }, 500);

    // 对于即异步加载数据又需要回显的情况，需要将回显的数据先赋值给options
    setTimeout(() => {
      let value = SelectedItem[0];
      let selectedNode = this.options4.filter(item => item.value === value)[0];
      if (selectedNode && selectedNode.children && selectedNode.children.length === 0) {
        setTimeout(() => {
          // 注意顺序，不然会导致异步数据的默认值回显失败
          selectedNode.children = valueMap[value];
          this.selectedItem2 = SelectedItem;
        }, 500);
      }
    }, 500);
  },
  methods: {
    handleChange(labelArr) {
      console.log('change事件返回数据:', labelArr);
      this.$toast('选中了:' + labelArr.join('/'));
      console.log('input事件返回数据:', JSON.stringify(this.selected));
    },
    handleActiveItemChange(selectedValueArr) {
      // 测试异步数据加载情况
      let value = selectedValueArr[0];
      let selectedNode = this.options3.filter(item => item.value === value)[0];
      if (selectedNode && selectedNode.children && selectedNode.children.length === 0) {
        setTimeout(() => {
          selectedNode.children = valueMap[value];
        }, 500);
      }
    },
    handleActiveItemChange2(selectedValueArr) {
      // 测试异步数据加载情况
      let value = selectedValueArr[0];
      let selectedNode = this.options4.filter(item => item.value === value)[0];
      if (selectedNode && selectedNode.children && selectedNode.children.length === 0) {
        setTimeout(() => {
          selectedNode.children = valueMap[value];
        }, 500);
      }
    },
  },
};
</script>
