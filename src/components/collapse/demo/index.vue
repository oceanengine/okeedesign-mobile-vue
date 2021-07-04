<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')" :title-style="{ 'padding-left': '0.8rem' }">
      <o-collapse v-model="active1">
        <o-collapse-item :title="t('title')" :message="t('content')" />
        <o-collapse-item :title="t('title')" :message="t('content')" />
        <o-collapse-item :title="t('title')" :message="t('content')" />
      </o-collapse>
    </demo-cell>

    <demo-cell :title="t('accordion')" :title-style="{ 'padding-left': '0.8rem' }">
      <o-collapse v-model="active2" accordion>
        <o-collapse-item :title="t('title')" :message="t('content')" name="1" />
        <o-collapse-item :title="t('title')" :message="t('content')" name="2" />
        <o-collapse-item :title="t('title')" :message="t('content')" name="3" />
      </o-collapse>
    </demo-cell>

    <demo-cell :title="t('disabled')" :title-style="{ 'padding-left': '0.8rem' }">
      <o-collapse v-model="active3">
        <o-collapse-item :title="t('title')" :message="t('content')" />
        <o-collapse-item disabled :title="t('title')" />
        <o-collapse-item disabled :title="t('title')" />
      </o-collapse>
    </demo-cell>

    <demo-cell :title="t('customize')" :title-style="{ 'padding-left': '0.8rem' }">
      <o-collapse v-model="active4">
        <o-collapse-item :title="t('title')" :message="t('content')">
          <template #title>
            <img
              src="../../../../svg/cell.svg"
              alt=""
              width="17px"
              height="17px"
              style="margin-right: 6px; vertical-align: middle"
            />
            <span style="vertical-align: middle">{{ t('title') }}</span>
          </template>
        </o-collapse-item>
        <o-collapse-item :title="t('title')" :message="t('content')">
          <template #value>
            <span>{{ t('content') }}</span>
          </template>
        </o-collapse-item>
      </o-collapse>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '折叠面板',
      title: '标题',
      content: '内容',
      basicUsage: '基础用法',
      accordion: '手风琴',
      basicSize: '尺寸大小',
      disabled: '禁用状态',
      customize: '自定义标题内容',
    },
    'en-US': {
      name: 'Collapse',
      title: 'title',
      content: 'i am content',
      basicUsage: 'Basic Usage',
      accordion: 'Accordion',
      basicSize: 'Basic Size',
      disabled: 'Disabled Status',
      customize: 'Customize',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      active1: [0],
      active2: '1',
      active3: [0],
      active4: [],
      active5: [],
    };
  },
};
</script>
<style lang="less" scoped>
.demo {
  padding: 0;
}
.o-collapse {
  margin: 10px 0;
  p {
    font-size: 12px;
    padding: 12px;
  }
}
</style>
