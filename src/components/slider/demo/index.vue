<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')">
      <o-slider v-model="value1" @change="onChange" />
    </demo-cell>

    <demo-cell :title="t('rangeUsage')">
      <o-slider v-model="value2" :min="-50" :max="50" @change="onChange" />
    </demo-cell>
    <demo-cell :title="t('stepUsage')">
      <o-slider v-model="value3" :step="10" @change="onChange" />
    </demo-cell>
    <demo-cell :title="t('setSteps')">
      <o-slider v-model="value4" :steps="[0, 50, 70, 77, 90, 120]" @change="onChange" />
    </demo-cell>
    <demo-cell :title="t('disabledUsage')">
      <o-slider v-model="value5" disabled />
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '滑块',
      title: '标题',
      basicUsage: '基础用法',
      rangeUsage: '指定选择范围',
      stepUsage: '指定步长',
      setSteps: '指定步长值',
      disabledUsage: '禁用状态',
      customize: '自定义样式',
    },
    'en-US': {
      name: 'Slider',
      title: 'title',
      basicUsage: 'Basic Usage',
      rangeUsage: 'Range Usage',
      stepUsage: 'Step Usage',
      setSteps: 'Set Steps',
      customize: 'Customize style',
      disabledUsage: 'Disabled Usage',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      value1: 50,
      value2: 0,
      value3: 50,
      value4: 70,
      value5: 50,
      steps: [0, 50, 70, 77, 90, 120],
    };
  },
  methods: {
    onChange(val) {
      this.$toast(val);
    },
  },
};
</script>

<style lang="less" scoped>
.demo .o-slider {
  margin: 4px;
}
</style>
