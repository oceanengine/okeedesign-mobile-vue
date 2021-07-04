<template>
  <div class="demo toast">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('loading')">
      <o-button @click="updata('')">
        {{ t('updata') }}
      </o-button>
    </demo-cell>

    <demo-cell :title="t('text')">
      <o-button @click="updata('some message')">
        {{ t('updata') }}
      </o-button>
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
  .o-button {
    margin-right: 10px;
  }
}
</style>
