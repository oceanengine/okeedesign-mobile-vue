<template>
  <div class="demo step">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>
    <demo-cell>
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('basicUsage')" :size="currentSize">
          <template #right-icon>
            <o-stepper v-model="value1" :size="currentSize" />
          </template>
        </o-cell>
      </div>

      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('step')" :size="currentSize">
          <template #right-icon>
            <o-stepper v-model="value5" :size="currentSize" :step="2" />
          </template>
        </o-cell>
      </div>

      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('range')" :size="currentSize">
          <template #right-icon>
            <o-stepper v-model="value2" :min="2" :size="currentSize" :max="5" />
          </template>
        </o-cell>
      </div>

      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('size')" :size="currentSize">
          <template #right-icon>
            <o-stepper v-model="value4" size="large" />
          </template>
        </o-cell>
      </div>

      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('disabled')" :size="currentSize">
          <template #right-icon>
            <o-stepper v-model="value3" disabled :size="currentSize" />
          </template>
        </o-cell>
      </div>
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
      name: '步进器',
      basicUsage: '基础用法',
      'min&max': '边界值',
      disabled: '禁用状态',
      size: '自定义大小',
      step: '步长设置',
      range: '限制输入范围',
      int: '限制输入整数',
      decimal: '固定小数位数',
      round: '圆角风格',
    },
    'en-US': {
      name: 'Stepper',
      basicUsage: 'Basic Usage',
      'min&max': 'Min & Max',
      disabled: 'Disabled',
      step: 'Step',
      size: 'Size',
      range: 'Range',
      int: 'Integer',
      decimal: 'Fixed decimal places',
      round: 'Round style',
    },
  },
  components: {
    demoCell,
    DomSize,
  },
  data() {
    return {
      sizes: ['small', 'normal', 'large'],
      currentSize: 'normal',
      value1: 1,
      value2: 3,
      value3: 1,
      value4: 1,
      value5: 1,
      value6: 1,
      value7: 1,
      value8: 1,
      value9: 1,
    };
  },
  methods: {
    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>

<style lang="less">
.demo.step {
  .o-cell__title {
    display: flex;
    align-items: center;
  }
}
</style>
