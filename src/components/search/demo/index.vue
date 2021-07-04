<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')" :title-style="titleStyle">
      <o-search v-model="value1" />
    </demo-cell>

    <demo-cell :title="t('onListen')" :title-style="titleStyle">
      <o-search v-model="value2" cancelable @cancel="cancel" />
    </demo-cell>

    <demo-cell :title="t('slotsUsage')" :title-style="titleStyle">
      <o-search v-model="value4">
        <template #left>
          <span class="fz-16">{{ t('left') }}</span>
        </template>
        <template #right>
          <span class="fz-16">{{ t('right') }}</span>
        </template>
      </o-search>
    </demo-cell>

    <demo-cell :title="t('radiusUsage')" :title-style="titleStyle">
      <o-search v-model="value3" border-radius="22px" />
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '搜索框',
      basicUsage: '基础用法',
      cancelUsage: '取消类型',
      radiusUsage: '自定义圆角',
      slotsUsage: '插槽用法',
      left: '左边',
      right: '右边',
      onListen: '监听事件',
    },
    'en-US': {
      name: 'Search',
      basicUsage: 'Basic Usage',
      cancelUsage: 'Cancel Usage',
      radiusUsage: 'Radius Usage',
      slotsUsage: 'Slots Usage',
      left: 'left',
      onListen: 'Listen Event',
      right: 'right',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      titleStyle: {
        'padding-left': '16px',
      },
    };
  },

  methods: {
    cancel() {
      this.$toast('cancel');
    },
  },
};
</script>
<style lang="less" scoped>
.demo {
  min-height: 100vh;
  padding: 0;
  .dome-title {
    margin-left: 16px;
  }
  .fz-16 {
    font-size: 16px;
  }
  h4 {
    padding-left: 10px;
  }
}
</style>
