<template>
  <div class="demo col">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basic')">
      <o-row>
        <o-col span="8"> span:8 </o-col>
        <o-col span="8"> span:8 </o-col>
        <o-col span="8"> span:8 </o-col>
      </o-row>
      <o-row>
        <o-col span="4"> span:4 </o-col>
        <o-col span="16" offset="4"> span:10 offset: 4 </o-col>
      </o-row>
    </demo-cell>

    <demo-cell :title="t('setGutter')">
      <o-row gutter="12">
        <o-col span="8"> span:8 </o-col>
        <o-col span="8"> span:8 </o-col>
        <o-col span="8"> span:8 </o-col>
      </o-row>
    </demo-cell>

    <demo-cell :title="t('flex')">
      <o-row type="flex">
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
      </o-row>
      <o-row type="flex" justify="center">
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
      </o-row>
      <o-row type="flex" justify="end">
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
      </o-row>
      <o-row type="flex" justify="space-between">
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
      </o-row>
      <o-row type="flex" justify="space-around">
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
        <o-col span="6"> span:6 </o-col>
      </o-row>
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
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less">
.demo.col {
  .o-col {
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
