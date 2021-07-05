<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')">
      <o-checkbox-group v-model="checkbox2" :size="currentSize">
        <o-checkbox :key="1" :value="1"> {{ t('name') }} 1 </o-checkbox>
        <o-checkbox :key="2" :value="2" type="square"> {{ t('name') }} 2 </o-checkbox>
      </o-checkbox-group>
    </demo-cell>

    <demo-cell :title="t('disabled')">
      <o-checkbox-group v-model="checkbox3" :size="currentSize">
        <o-checkbox :key="1" :value="1" disabled> {{ t('name') }} 1 </o-checkbox>
        <o-checkbox :key="2" :value="2" type="square"> {{ t('name') }} 2 </o-checkbox>
      </o-checkbox-group>
    </demo-cell>

    <demo-cell :title="t('customSize')">
      <o-checkbox-group v-model="checkbox3" :size="currentSize">
        <o-checkbox size="small">{{ t('name') }}</o-checkbox>
        <o-checkbox>{{ t('name') }}</o-checkbox>
        <o-checkbox size="large">{{ t('name') }}</o-checkbox>
      </o-checkbox-group>
    </demo-cell>

    <demo-cell :title="t('max')">
      <o-checkbox-group v-model="checkbox5" :size="currentSize" :max="max">
        <o-checkbox v-for="index in 6" :key="index" :value="index">
          {{ t('name') }} {{ index }}
        </o-checkbox>
      </o-checkbox-group>
    </demo-cell>

    <demo-cell :title="t('withCell')">
      <o-checkbox-group v-model="checkbox6" :size="currentSize">
        <o-cell :size="currentSize" clickable style="padding: 2px 9px">
          <o-checkbox key="1" value="1"> {{ t('name') }} 1 </o-checkbox>
        </o-cell>
        <o-cell :size="currentSize" clickable style="padding: 2px 9px">
          <o-checkbox key="2" value="2"> {{ t('name') }} 2 </o-checkbox>
        </o-cell>
      </o-checkbox-group>
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
      name: '多选框',
      basicUsage: '基础用法',
      disabled: '禁用状态',
      basicStyle: '风格类型',
      stopPropagation: '阻止事件冒泡',
      customShape: '自定义形状',
      customSize: '自定义大小',
      group: '多选框组',
      max: '限制最大可选择数',
      withCell: '搭配单元格组件',
    },
    'en-US': {
      name: 'Checkbox',
      basicUsage: 'Basic Usage',
      basicStyle: 'Basic Style',
      disabled: 'Disabled Status',
      stopPropagation: 'StopPropagation',
      customShape: 'Customize Shape',
      customSize: 'Customize Size',
      group: 'Checkbox Group',
      max: 'Maximum Limitation',
      withCell: 'Inside Cell Component',
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
      // checkbox1: [1, 2, 3],
      checkbox2: [1, 3],
      checkbox3: [2],
      checkbox4: [2],
      checkbox5: [2, 4],
      checkbox6: [],
      max: 3,
      titleStyle: {
        'padding-left': '0.8rem',
      },
    };
  },
  methods: {
    father() {
      alert('you click domFather');
    },
    handleChild() {
      alert('you click domChild');
    },
    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>
<style lang="less" scoped>
.demo {
  margin-bottom: 0;
  padding-bottom: 20px;
  // padding: 0 0 80px 20px;
}
.o-checkbox {
  margin: 10px 0;
}
</style>
