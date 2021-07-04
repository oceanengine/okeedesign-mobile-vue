<template>
  <div class="demo toast">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('base')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('success')" is-link @click="clickType('success')" />
        <o-cell :title="t('error')" is-link @click="clickType('error')" />
        <o-cell :title="t('warning')" is-link @click="clickType('warning')" />
      </div>
    </demo-cell>

    <demo-cell :title="t('text')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('words')" is-link @click="click" />
      </div>
    </demo-cell>

    <demo-cell :title="t('loading')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('loadingDefault')" is-link @click="clickType('loading')" />
        <o-cell :title="t('loadingCustom')" is-link @click="clickLoading('loadingCustom')" />
      </div>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell';
export default {
  i18n: {
    'zh-CN': {
      name: '轻提示',
      base: '基础用法',
      text: '文字提示',
      words: '文字提示',
      manyWords: '长文字',
      success: '成功提示',
      error: '危险提示',
      warning: '警告提示',
      loading: '加载用法',
      setTime: '时间设置',
      setTimeText: '1秒钟后消失',
      forbidden: '禁止点击背景',
      forbiddenText: '此时点击页面其他按钮无效',
      show: '展示',
      event: '开启/关闭事件',
      loadingDefault: '默认样式',
      loadingCustom: '自定义文字',
    },
    'en-US': {
      name: 'Toast',
      base: 'Basic Usage',
      text: 'Text',
      words: 'words',
      manyWords: 'Many Words',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      loading: 'loading',
      setTime: 'SetTime',
      setTimeText: 'Disappear after 1 second',
      forbidden: 'Forbidden Click Background',
      forbiddenText: 'Clicking any other button on the page is invalid',
      show: 'show',
      event: 'open & close',
      loadingDefault: 'Default Style',
      loadingCustom: 'Custom Words',
    },
  },
  components: {
    demoCell,
  },
  methods: {
    click() {
      this.$toast('OKee Design');
    },
    clickLong() {
      this.$toast('If you have better suggestions. Please call totoo');
    },
    clickDuration() {
      this.$toast({
        message: 'OKee Design',
        duration: 1000,
      });
    },
    clickType(type) {
      this.$toast({
        message: this.t(type),
        type,
      });
    },
    clickLoading(type) {
      this.$toast({
        message: this.t(type),
        type: 'loading',
      });
    },
    clickForbid() {
      this.$toast({
        message: this.t('forbiddenText'),
        forbidClick: true,
      });
    },
    clickOpen() {
      this.$toast({
        message: 'Pay attention to console log',
        onOpened: () => {
          console.log('toast opened');
        },
        onClose: () => {
          console.log('toast colsed');
        },
      });
    },
  },
};
</script>
<style lang="less">
.demo.toast {
  .o-button {
    margin-right: 10px;
  }
  .demo-toast-cell {
    .o-button {
      margin-bottom: 16px;
    }
    & .o-button:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
