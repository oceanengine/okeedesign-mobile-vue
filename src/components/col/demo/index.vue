<template>
  <div class="demo col">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basic')">
      <byted-row>
        <byted-col span="8"> span:8 </byted-col>
        <byted-col span="8"> span:8 </byted-col>
        <byted-col span="8"> span:8 </byted-col>
      </byted-row>
      <byted-row>
        <byted-col span="4"> span:4 </byted-col>
        <byted-col span="16" offset="4"> span:10 offset: 4 </byted-col>
      </byted-row>
    </demo-cell>

    <demo-cell :title="t('setGutter')">
      <byted-row gutter="12">
        <byted-col span="8"> span:8 </byted-col>
        <byted-col span="8"> span:8 </byted-col>
        <byted-col span="8"> span:8 </byted-col>
      </byted-row>
    </demo-cell>

    <demo-cell :title="t('flex')">
      <byted-row type="flex">
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
      </byted-row>
      <byted-row type="flex" justify="center">
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
      </byted-row>
      <byted-row type="flex" justify="end">
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
      </byted-row>
      <byted-row type="flex" justify="space-between">
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
      </byted-row>
      <byted-row type="flex" justify="space-around">
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
        <byted-col span="6"> span:6 </byted-col>
      </byted-row>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '布局',
      basic: '基础用法',
      setGutter: '设置间距',
      flex: 'flex布局',
      rem: 'Gutter REM',
    },
    'en-US': {
      basic: 'Basic',
      name: 'Layout',
      setGutter: 'SetGutter',
      flex: 'Flex',
      rem: 'Gutter REM',
    },
  },
  components: {
    demoCell,
    // demoTitle,
    // BytedIconModuleLayout,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less">
.demo.col {
  .byted-col {
    text-align: center;
    margin-bottom: 8px;
    background-clip: content-box;
    font-size: 16px;
    height: 32px;
    line-height: 2;
    color: #fff;
    font-weight: 300;
    &:nth-child(odd) {
      background-color: #58a0ff;
    }
    &:nth-child(even) {
      background-color: #a1caff;
    }
  }
}
</style>
