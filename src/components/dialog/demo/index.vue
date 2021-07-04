<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basic')">
      <o-cell :title="t('basic')" is-link @click="show = true" />
      <o-dialog
        v-model="show"
        :callback="callback"
        title="OKee Design"
        message="OKee Design"
        show-cancel-button
      />
    </demo-cell>

    <demo-cell :title="t('async')">
      <o-cell :title="t('async')" is-link @click="showAsync = true" />
      <o-dialog
        v-model="showAsync"
        message="tel: ************"
        :before-close="beforeClose"
        :confirm-button-text="confirmButtonText"
      />
    </demo-cell>

    <demo-cell :title="t('slot')">
      <o-cell :title="t('slot')" is-link @click="showSlot = true" />
      <o-dialog v-model="showSlot">
        <img
          class="demo-dialog-img"
          src="https://s1.pstatp.com/cdn/expire-1-M/o-creative-app/static/app_iconstore_1024pt@2x.png"
        />
        <template slot="title"> oceanengine </template>
      </o-dialog>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '弹出框',
      basic: '基础用法',
      async: '异步用法',
      slot: '插槽 default & title',
      updata: '提交信息',
      wait: '请稍后...',
      success: '提交成功',
      show: '点击查看',
    },
    'en-US': {
      name: 'Dialog',
      basic: 'Basic',
      async: 'Async',
      slot: 'Slot includes default & title',
      updata: 'Updata',
      wait: 'Waiting...',
      success: 'Success',
      show: 'show',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      show: false,
      showAsync: false,
      showSlot: false,
      loading: false,
    };
  },
  computed: {
    confirmButtonText() {
      return this.loading ? this.t('wait') : this.t('updata');
    },
  },
  methods: {
    beforeClose(a, b) {
      this.loading = true;
      setTimeout(() => {
        b(true);
        this.$toast(this.t('success'));
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }, 2000);
    },
    callback() {
      console.log('After dialog closed');
    },
  },
};
</script>
<style lang="less">
.demo {
  &-dialog-img {
    width: 100%;
  }
}
</style>
