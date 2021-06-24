<template>
  <div class="demo toast">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('loading')">
      <byted-button @click="updata('')">
        {{ t('updata') }}
      </byted-button>
    </demo-cell>

    <demo-cell :title="t('text')">
      <byted-button @click="updata('some message')">
        {{ t('updata') }}
      </byted-button>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
import { setTimeout } from 'timers';
export default {
  i18n: {
    'zh-CN': {
      name: '加载中',
      loading: '加载',
      updata: '提交',
      text: '文字设置',
    },
    'en-US': {
      name: 'OnLoading',
      loading: 'Loading',
      updata: 'Updata',
      text: 'Text',
    },
  },
  components: {
    demoCell,
    // demoTitle,
    // BytedIconModuleLoading,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    updata(message) {
      const instance = this.$loading(message);
      setTimeout(() => {
        instance.clear();
      }, 3000);
    },
  },
};
</script>
<style lang="less">
.demo.toast {
  .byted-button {
    margin-right: 10px;
  }
}
</style>
