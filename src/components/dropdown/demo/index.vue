<template>
  <div class="demo">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basicUsage')" :title-style="titleStyle">
      <byted-dropdown>
        <byted-dropdown-item v-model="value1" :options="option1" @click="onClick" />
        <byted-dropdown-item v-model="value2" :options="option2" @click="onClick" />
      </byted-dropdown>
    </demo-cell>

    <demo-cell :title="t('upUsage')" :title-style="titleStyle">
      <byted-dropdown direction="up">
        <byted-dropdown-item v-model="value1" :options="option1" />
        <byted-dropdown-item v-model="value2" :options="option2" />
      </byted-dropdown>
    </demo-cell>

    <demo-cell :title="t('customUsage')" :title-style="titleStyle">
      <byted-dropdown>
        <byted-dropdown-item v-model="value1" :options="option1" />
        <byted-dropdown-item ref="item" :title="t('title')">
          <byted-cell :title="t('title') + 1">
            <template #right-icon>
              <byted-switch v-model="switch1" />
            </template>
          </byted-cell>
          <byted-cell :title="t('title') + 2">
            <template #right-icon>
              <byted-switch v-model="switch2" />
            </template>
          </byted-cell>
          <byted-button
            size="large"
            type="primary"
            :text="t('customButtom')"
            square
            @click="onConfirm"
          />
        </byted-dropdown-item>
      </byted-dropdown>
    </demo-cell>

    <demo-cell :title="t('titleSlot')" :title-style="titleStyle">
      <byted-dropdown>
        <byted-dropdown-item v-model="value3" :options="option1">
          <template slot="title">
            <span class="title-slot">{{ t('titleSlot') }}</span>
          </template>
        </byted-dropdown-item>
      </byted-dropdown>
    </demo-cell>

    <demo-cell :title="t('disabled')" :title-style="titleStyle">
      <byted-dropdown>
        <byted-dropdown-item v-model="value1" :options="option1" disabled />
        <byted-dropdown-item v-model="value2" :options="option2" disabled />
      </byted-dropdown>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell';
export default {
  i18n: {
    'zh-CN': {
      name: '下拉菜单',
      title: '标题',
      content: '我是内容',
      basicUsage: '基础用法',
      upUsage: '向上展开',
      disabled: '禁用状态',
      titleSlot: '标题插槽',
      customUsage: '自定义用法',
      option1Text1: '全部商品',
      option1Text2: '新款商品',
      option1Text3: '活动商品',
      option2Text1: '默认排序',
      option2Text2: '好评排序',
      option2Text3: '销量排序',
      customButtom: '确定',
    },
    'en-US': {
      name: 'Dropdown',
      title: 'title',
      content: 'i am content',
      basicUsage: 'Basic Usage',
      upUsage: 'Expand Direction',
      disabled: 'Disabled Status',
      titleSlot: 'Title Slot',
      customUsage: 'Custom Usage',
      option1Text1: 'All Products',
      option1Text2: 'New Products',
      option1Text3: 'Event Goods',
      option2Text1: 'Sort By Default',
      option2Text2: 'Sort By Praise',
      option2Text3: 'Sort By Sales',
      customButtom: 'Yes',
    },
  },
  components: {
    demoCell,
    // demoTitle,
    // BytedIconModuleDropdown,
  },
  data() {
    return {
      value1: 0,
      value2: 'a',
      value3: 0,
      switch1: true,
      switch2: false,
      titleStyle: {
        'padding-left': '0.8rem',
      },
    };
  },

  created() {},
  computed: {
    option1() {
      return [
        { text: this.t('option1Text1'), value: 0 },
        { text: this.t('option1Text2'), value: 1 },
        { text: this.t('option1Text3'), value: 2 },
      ];
    },
    option2() {
      return [
        { text: this.t('option2Text1'), value: 'a' },
        { text: this.t('option2Text2'), value: 'b' },
        { text: this.t('option2Text3'), value: 'c' },
      ];
    },
  },
  methods: {
    onConfirm() {
      this.$refs.item.toggle();
    },
    onClick(value) {
      console.log(value);
    },
  },
};
</script>
<style lang="less" scoped>
.demo {
  padding: 0 0 160px 0;
  h4 {
    padding: 0 10px;
  }
  .title-slot {
    font-size: 16px;
    color: #333333;
  }
}
</style>
