<template>
  <div class="demo button">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('type')">
      <byted-button :text="t('primary')" type="primary" :size="currentSize" @click="onClick" />
      <byted-button :text="t('danger')" type="danger" :size="currentSize" />
      <byted-button :text="t('warning')" type="warning" :size="currentSize" />
      <byted-button :text="t('success')" type="success" :size="currentSize" />
      <byted-button :text="t('default')" :size="currentSize" />
    </demo-cell>
    <!-- plain -->
    <demo-cell :title="t('plain')">
      <byted-button :text="t('plainButton')" :size="currentSize" type="primary" plain />
      <byted-button :text="t('plainButton')" type="success" :size="currentSize" plain />
    </demo-cell>
    <!-- fade -->
    <demo-cell :title="t('fade')">
      <byted-button :text="t('fade')" type="primary" :size="currentSize" fade />
      <byted-button :text="t('fade')" type="success" :size="currentSize" fade />
    </demo-cell>
    <!-- hairline -->
    <!-- shape -->
    <demo-cell :title="t('shape')">
      <byted-button :text="t('square')" type="primary" :size="currentSize" square />
      <byted-button :text="t('round')" type="primary" :size="currentSize" round />
    </demo-cell>
    <!-- disabled -->
    <demo-cell :title="t('disabled')">
      <byted-button :text="t('disabled')" type="primary" :size="currentSize" disabled />
      <byted-button :text="t('disabled')" type="success" :size="currentSize" disabled />
    </demo-cell>
    <demo-cell :title="t('loading')">
      <byted-button :text="t('loading')" type="primary" :size="currentSize" loading />
      <byted-button :text="t('loading')" type="primary" plain :size="currentSize" loading />
      <byted-button :text="t('loading')" type="primary" fade :size="currentSize" loading />
    </demo-cell>
    <demo-cell :title="t('iconButton')">
      <byted-button :text="t('iconButton')" type="primary" :size="currentSize">
        <img src="../../icon/icon/add.svg" alt="" height="16px" width="16px" />
        <span>{{ t('iconButton') }}</span>
      </byted-button>
      <byted-button :text="t('iconButton')" type="primary" fade :size="currentSize">
        <img src="../../icon/icon/addColored.svg" alt="" height="16px" width="16px" />
        <span>{{ t('iconButton') }}</span>
      </byted-button>
      <byted-button :text="t('iconButton')" type="primary" fade :size="currentSize">
        <img src="../../icon/icon/addColored.svg" alt="" height="16px" width="16px" />
        <span>{{ t('iconButton') }}</span>
      </byted-button>
    </demo-cell>
    <!-- text -->
    <demo-cell :title="t('text')">
      <byted-button :text="t('text')" :size="currentSize" type="text" />
    </demo-cell>

    <demo-size :current-size="currentSize" :sizes="sizes" @changeSize="changeSize" />
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
import demoSize from '../../../../docs/site/components/DomSize.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '按钮',
      type: '基础用法',
      default: '次要按钮',
      primary: '主要按钮',
      success: '成功按钮',
      warning: '警示按钮',
      danger: '危险按钮',
      plain: '线框类型',
      plainButton: '线框按钮',
      iconButton: '图标按钮',
      fade: '透明按钮',
      hairline: '细边类型',
      shape: '形状类型',
      square: '方形',
      round: '圆形',
      disabled: '禁用状态',
      size: '尺寸',
      text: '文字按钮',
      loading: '加载状态',
      add: '../icon/add.svg',
    },
    'en-US': {
      name: 'Button',
      type: 'Type',
      default: 'Default',
      primary: 'Primary',
      success: 'Success',
      warning: 'Warning',
      danger: 'Danger',
      plain: 'Plain',
      iconButton: 'Icon',
      fade: 'Fade',
      hairline: 'Hairline',
      shape: 'Shape',
      square: 'Square',
      round: 'Round',
      disabled: 'Disabled',
      size: 'Size',
      text: 'Text',
      loading: 'Loading',
      plainButton: 'Plain Button',
    },
  },
  components: {
    // BytedIconModuleButton,
    demoCell,
    demoSize,
    // demoTitle,
  },
  data() {
    return {
      sizes: ['tiny', 'mini', 'small', 'normal', 'large'],
      currentSize: 'large',
    };
  },
  methods: {
    onClick(event) {
      console.log(`click: event:${event}`);
    },
    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>
<style lang="less">
.demo {
  &.button {
    .byted-button {
      margin-right: 12px;
      margin-bottom: 12px;
    }
    p {
      margin: 10px 0;
    }
  }
  &-header-icon {
    width: 88px;
    height: 100%;
    display: inline-flex;
    align-items: center;
  }
  .img-icon {
    height: 22px;
  }
}
</style>
