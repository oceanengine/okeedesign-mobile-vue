<template>
  <div class="demo switch">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>
    <demo-cell :title="t('basicUsage')">
      <byted-switch v-model="valueBase" :size="currentSize" @change="change" />
    </demo-cell>
    <demo-cell :title="t('disabledUsage')">
      <byted-switch v-model="valueDiasbledTrue" disabled :size="currentSize" />
    </demo-cell>

    <demo-cell :title="t('loading')">
      <byted-switch v-model="valueLoading" :loading="true" :size="currentSize" />
    </demo-cell>

    <demo-cell :title="t('customizeScale')">
      <byted-switch v-model="valueScale" size="large" />
      <byted-switch v-model="valueScale" size="small" />
    </demo-cell>

    <demo-cell :title="t('controlledUsage')">
      <byted-switch
        :value="valueControlled"
        :loading="isLoading"
        :size="currentSize"
        @input="changeValue"
      />
    </demo-cell>

    <demo-cell :title="t('combineCell')">
      <byted-cell :title="t('title')" :size="currentSize">
        <byted-switch v-model="valueCell" />
      </byted-cell>
    </demo-cell>

    <dom-size :current-size="currentSize" :sizes="sizes" @changeSize="changeSize" />
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
import DomSize from '../../../../docs/site/components/DomSize.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '开关',
      basicUsage: '基础用法',
      disabledUsage: '禁用状态',
      largeSize: '大尺寸',
      controlledUsage: '异步控制',
      loading: '加载状态',
      customizeScale: '自定义大小',
      combineCell: '搭配单元格使用',
      title: '标题',
    },
    'en-US': {
      name: 'Switch',
      basicUsage: 'Basic Usage',
      disabledUsage: 'Disabled Usage',
      largeSize: 'Large Size',
      controlledUsage: 'Asynchronous',
      loading: 'Loading',
      customizeScale: 'Customize Scale',
      combineCell: 'Combine With Cell',
      title: 'Title',
    },
  },
  components: {
    demoCell,
    DomSize,
    // demoTitle,
    // BytedIconModuleSwitch,
  },
  data() {
    return {
      valueBase: true,
      valueLoading: true,
      valueDiasbledTrue: true,
      valueControlled: true,
      valueScale: true,
      isLoading: false,
      sizes: ['normal', 'large'],
      currentSize: 'normal',
      valueCell: true,
    };
  },
  methods: {
    change(value) {
      console.log(`new value ${value}`);
    },
    changeValue(value) {
      this.isLoading = true;
      this.isLoading = false;
      this.$confirm('Whether to switch', {
        title: 'Title',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
      })
        .then(() => {
          this.valueControlled = !this.valueControlled;
        })
        .catch(() => {});
    },
    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>
<style lang="less">
.demo.switch {
  height: 100vh;
  .byted-switch {
    margin-right: 10px;
  }
}
</style>
