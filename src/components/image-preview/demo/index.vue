<template>
  <div class="demo-box">
    <div class="demo image-preview">
      <byted-header fixed @click-left="$router.back()">
        <div>{{ t('name') }}</div>
      </byted-header>

      <demo-cell :title="t('basic')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('simple')" is-link @click="showPreviewImage" />
        </div>
      </demo-cell>

      <demo-cell :title="t('numberIndicator')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('numberIndicator')" is-link @click="showPreviewImageNum" />
        </div>
      </demo-cell>

      <demo-cell :title="t('moreOptions')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('closeLoop')" is-link @click="showPreviewImage({ loop: false })" />
          <byted-cell
            :title="t('showClose')"
            is-link
            @click="showPreviewImage({ showCloseButton: true })"
          />
          <byted-cell
            :title="t('hiddleIndicator')"
            is-link
            @click="showPreviewImage({ showIndicators: false })"
          />
          <byted-cell :title="t('listenOnClose')" is-link @click="close()" />
        </div>
      </demo-cell>

      <demo-cell :title="t('componentCall')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('componentCall')" is-link @click="show = !show" />
        </div>
        <byted-image-preview v-model="show" :images="images" :change="change" @change="change" />
      </demo-cell>
    </div>
  </div>
</template>
<script>
import ImagePreview from '..';
import pic from '../pics/pic.svg';
import pic2 from '../pics/pic2.svg';
import pic3 from '../pics/pic3.svg';
import pic4 from '../pics/pic4.svg';

const images = [pic, pic2, pic3, pic4];

// import demoTitle from '../../../../docs/site/components/DomeTitle';
import demoCell from '../../../../docs/site/components/DomeCell';
export default {
  i18n: {
    'zh-CN': {
      name: '图片预览',
      basic: '基础用法',
      simple: '预览图片',
      numberIndicator: '展示数字',
      moreOptions: '更多配置项',
      componentCall: '组件调用',
      closeLoop: '关闭切换循环',
      showClose: '显示关闭按钮',
      hiddleIndicator: '隐藏指示器',
      listenOnClose: '监听关闭事件',
    },
    'en-US': {
      name: 'Image Preview',
      basic: 'Basic Usage',
      simple: 'Image Preview',
      moreOptions: 'More Options',
      componentCall: 'Component Call',
      numberIndicator: 'Number Indicator',
      closeLoop: 'No loop',
      showClose: 'Show Close Button',
      hiddleIndicator: 'Hiddle Indicator',
      listenOnClose: 'Listen onClose',
    },
  },
  components: {
    demoCell,
    // demoTitle,
  },
  data() {
    return {
      images,
      show: false,
    };
  },
  methods: {
    showPreviewImage(props) {
      const instance = this.$imagePreview({
        images,
        ...props,
      });
    },
    change(val) {
      console.log(val);
    },
    showPreviewImageNum() {
      let activeIndex = 1;
      const instance = this.$imagePreview({
        images,
        loop: false,
        onChange: val => {
          console.log(val);
          activeIndex = val + 1;
        },
        indicators: ({ active }) => (
          <div staticClass="byted-image-preview__indicators">
            {activeIndex}/{images.length}
          </div>
        ),
      });
    },

    close() {
      const instance = this.$imagePreview({
        images,
        onClosed: () => {
          this.$toast('Closed');
        },
      });
    },
  },
};
</script>
<style lang="less">
.demo.image-preview {
  .byted-button {
    margin-right: 12px;
    margin-bottom: 12px;
  }
}
.byted-image-preview__indicators {
  color: #ffffff;
}
</style>
