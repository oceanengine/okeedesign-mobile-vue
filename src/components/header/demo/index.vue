<template>
  <div class="demo checker">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basic')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-header :title="t('title')" :left-arrow="false"/>
    </demo-cell>

    <demo-cell :title="t('backOrClose')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-header :title="t('title')">
        <template slot="left">
          <img
            src="../../icon/icon/arrow.svg"
            alt=""
            width="16px"
            height="16px"
            style="margin-right: 20px"
          />
          <img src="../../icon/icon/close.svg" alt="" />
        </template>
        <span>{{ t('title') }}</span>
      </byted-header>
    </demo-cell>

    <demo-cell :title="t('textButton')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-header class="showText" :left-arrow="true" :title="t('title')">
        <template slot="left">
          <img
            src="../../icon/icon/arrow.svg"
            alt=""
            width="16px"
            height="16px"
            style="margin-right: 20px"
          />
        </template>
        <byted-button slot="left" text="Return" type="text" />
      </byted-header>
    </demo-cell>

    <demo-cell :title="t('custom')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-header title="OKee Design">
        <byted-button slot="right">
          <img src="../icon/dots.svg" alt="" width="20px" height="20px">
        </byted-button>
      </byted-header>
      <byted-header title="OKee Design">
        <byted-button slot="right">
          <img src="../icon/magnifier.svg" alt="" width="20px" height="20px">
        </byted-button>
      </byted-header>
      <byted-header title="OKee Design">
        <byted-button slot="right" type="text"> Button </byted-button>
      </byted-header>
    </demo-cell>

    <demo-cell :title="t('style')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-header :title="t('title')" type="primary" />
    </demo-cell>

    <demo-cell :title="t('navtab')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-header title="OKee Design" style="margin-bottom: 20px">
        <byted-header-tabs v-model="type">
          <byted-header-tab title="Tab1" name="0" />
          <byted-header-tab name="1">Tab2</byted-header-tab>
        </byted-header-tabs>
      </byted-header>
    </demo-cell>
  </div>
</template>
<script>
// import demoTitle from '../../../../docs/site/components/DomeTitle';
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '导航栏',
      basic: '基础用法',
      noneLeft: '无返回按钮',
      custom: '自定义按钮',
      style: '自定义背景色',
      navtab: '展示切换组件',
      title: '标题',
      backOrClose: '展示返回和关闭',
      textButton: '展示文字按钮',
    },
    'en-US': {
      name: 'Header',
      basic: 'Basic Usage',
      noneLeft: 'No return Button',
      custom: 'Custom Button',
      style: 'Custom Background Color',
      navtab: 'Nav tabs',
      title: 'Title example',
      backOrClose: 'Back Or Close',
      textButton: 'Text Button',
    },
  },
  components: {
    demoCell,
    // demoTitle,
  },
  data() {
    return {
      type: 0,
      titleStyle: {
        'padding-left': '0.8rem',
      },
    };
  },
  methods: {
    back() {
      window.history.go(-1);
    },
    noLeftArrowClick() {
      console.log('no left arrow be clicked'); // this should not be invoke
    },
  },
};
</script>
<style lang="less" scoped>
.showText {
  /deep/ .byted-header__title {
    flex: none;
  }
}
</style>