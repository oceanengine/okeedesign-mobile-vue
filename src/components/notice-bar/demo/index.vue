<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')" :title-style="titleStyle">
      <o-notice-bar type="primary" :text="t('reminder')" />
      <o-notice-bar type="success" :text="t('success')" />
      <o-notice-bar type="warning" :text="t('warning')" />
      <o-notice-bar type="danger" :text="t('danger')" />
    </demo-cell>

    <demo-cell :title="t('scrolling')" :title-style="titleStyle">
      <o-notice-bar type="warning" :text="t('reminder')" />
    </demo-cell>

    <demo-cell :title="t('noticeMode')" :title-style="titleStyle">
      <o-notice-bar show-close type="warning" :text="t('warning')">
        <img src="../icon/horn.svg" slot="left" width="16px" height="16px" alt="" />
      </o-notice-bar>
      <o-notice-bar type="warning" :text="t('warning')">
        <o-button slot="right" type="text">button</o-button>
        <img src="../icon/horn.svg" slot="left" width="16px" height="16px" alt="" />
      </o-notice-bar>
    </demo-cell>

    <demo-cell :title="t('custom')" :title-style="titleStyle">
      <o-notice-bar show-close type="primary" :text="t('default')"></o-notice-bar>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
import sendSvg from '../../../../docs/site/components/svg/send.svg';
export default {
  i18n: {
    'zh-CN': {
      name: '通知栏',
      title1: '字节跳动OKee Design',
      title2: '字节跳动OKee Design字节跳动OKee Design字节跳动OKee Design字节跳动OKee Design',
      basicUsage: '基础用法',
      showClose: '关闭用法',
      ellipsis: '溢出省略',
      typeStyle: '风格样式',
      linkStyle: '链接跳转',
      triggerStyle: '触发功能',
      reminder: '这是一条提醒消息',
      success: '这是一条成功消息',
      warning: '这是一条警告消息',
      danger: '这是一条危险消息',
      default: '这是一条默认消息',
      scrolling: '滚动播放',
      noticeMode: '通知栏模式',
      custom: '自定义样式',
    },
    'en-US': {
      name: 'NoticeBar',
      title1: '字节跳动OKee Design',
      title2: '字节跳动OKee Design字节跳动字节跳动OKee Design字节跳动OKee Design',
      basicUsage: 'Basic Usage',
      showClose: 'showClose',
      ellipsis: 'ellipsis',
      typeStyle: 'type style',
      linkStyle: 'link',
      triggerStyle: 'trigger',
      reminder: 'This is a reminder message',
      success: 'This is a success message',
      warning: 'This is a warning message',
      danger: 'This is a danger message',
      default: 'This is a default',
      scrolling: 'Scrolling',
      noticeMode: 'Notice Bar Mode',
      custom: 'Custom style',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      sendSvg,
      titleStyle: {
        'padding-left': '16px',
      },
    };
  },
  methods: {
    send() {
      this.$toast({
        message: 'success',
        type: 'success',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.demo {
  padding: 0 0 24px 0;
  h4 {
    padding: 0 10px;
  }
  .o-notice-bar {
    margin-bottom: 16px;
  }
  .right-slot {
    display: inline-flex;
    align-items: center;
    img {
      margin-right: 8px;
    }
  }
}
</style>
