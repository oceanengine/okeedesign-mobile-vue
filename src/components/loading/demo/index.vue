<template>
  <div class="demo loading">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basic')">
      <byted-row>
        <byted-col span="12">
          <byted-loading />
        </byted-col>
      </byted-row>
    </demo-cell>

    <demo-cell :title="t('text')">
      <byted-row type="flex" align="center">
        <byted-col span="12">
          <byted-loading :text="onloading" />
        </byted-col>
      </byted-row>
    </demo-cell>

    <demo-cell :title="t('styleVertical')">
      <byted-loading vertical> 加载中... </byted-loading>
    </demo-cell>
    <demo-cell :title="t('size')">
      <byted-row>
        <byted-col span="12">
          <byted-loading size="1.2rem" />
        </byted-col>
      </byted-row>
    </demo-cell>

    <demo-cell :title="t('style')">
      <byted-loading />
      <byted-loading type="circle" style="margin-left: 16px" />
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
    // demoTitle,
    demoCell,
    // BytedIconModuleLoading,
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
