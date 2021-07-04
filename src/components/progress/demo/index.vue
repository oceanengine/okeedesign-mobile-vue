<template>
  <div class="demo progress">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')">
      <o-progress :percentage="val" :color="color" />
    </demo-cell>

    <demo-cell :title="t('inactive')">
      <o-progress :percentage="val" :color="color" :inactive="false" />
    </demo-cell>

    <demo-cell :title="t('NumberUsage')">
      <o-progress :percentage="val" :color="color" :text-in-middle="true" />
      <o-progress :percentage="60" color="#F65656" :text-in-middle="true" />
      <o-progress :percentage="100" color="#6ABF40" :text-in-middle="true" />
    </demo-cell>
  </div>
</template>

<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '进度条',
      basicUsage: '基础用法',
      NumberUsage: '样式展示',
      add: '增加',
      subtract: '减少',
      inactive: '置灰',
    },
    'en-US': {
      name: 'Progress Bar',
      basicUsage: 'Basic Usage',
      NumberUsage: 'Number Usage',
      add: 'add',
      inactive: 'Inactive',
      subtract: 'subtract',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      val: 60,
    };
  },
  computed: {
    color() {
      return this.val >= 100 ? '#00d2d5' : '#0278ff';
    },
  },
  methods: {
    add() {
      if (this.val < 100) {
        this.val++;
      }
    },
    reduce() {
      if (this.val > 0) {
        this.val--;
      }
    },
  },
};
</script>

<style lang="less">
.demo.progress {
  position: relative;
  height: 100vh;
  margin-bottom: 0;
  padding-bottom: 20px;
  .o-progress {
    margin-bottom: 16px;
  }
  .progress-btn {
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
  }
}
</style>
