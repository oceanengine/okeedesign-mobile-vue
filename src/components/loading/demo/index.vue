<template>
  <div class="demo loading">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basic')">
      <o-row>
        <o-col span="12">
          <o-loading />
        </o-col>
      </o-row>
    </demo-cell>

    <demo-cell :title="t('text')">
      <o-row type="flex" align="center">
        <o-col span="12">
          <o-loading :text="onloading" />
        </o-col>
      </o-row>
    </demo-cell>

    <demo-cell :title="t('styleVertical')">
      <o-loading vertical> 加载中... </o-loading>
    </demo-cell>
    <demo-cell :title="t('size')">
      <o-row>
        <o-col span="12">
          <o-loading size="1.2rem" />
        </o-col>
      </o-row>
    </demo-cell>

    <demo-cell :title="t('style')">
      <o-loading />
      <o-loading type="circle" style="margin-left: 16px" />
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell';
export default {
  i18n: {
    'zh-CN': {
      name: '加载',
      basic: '基础用法',
      style: '图标风格',
      text: '加载文案',
      styleVertical: '垂直排列',
      onloading: '加载中',
      size: '图标大小',
    },
    'en-US': {
      name: 'Loading',
      basic: 'Basic',
      style: 'Type',
      text: 'Text',
      styleVertical: 'Vertical arrangement',
      onloading: 'onloading',
      size: 'Icon Size',
    },
  },
  components: {
    demoCell,
  },
  computed: {
    onloading() {
      return this.t('onloading');
    },
  },
  methods: {
    onClick(event) {
      console.log(`click: event:${event}`);
    },
  },
};
</script>
