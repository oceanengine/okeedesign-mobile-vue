<template>
  <div class="demo badge">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basicUsage')" :title-style="{ 'padding-left': '0.8rem' }">
      <byted-badge is-dot :value="100" :max="9" :style="{ 'padding-left': '1rem' }">
        <div class="square"></div>
      </byted-badge>
      <byted-badge :value="2" :max="9" :style="{ 'padding-left': '1rem' }">
        <div class="square"></div>
      </byted-badge>
      <byted-badge :value="9999" :max="999" :style="{ 'padding-left': '1rem' }">
        <div class="square"></div>
      </byted-badge>
      <byted-badge value="Hot" :style="{ 'padding-left': '1rem' }">
        <div class="square"></div>
      </byted-badge>
    </demo-cell>

    <demo-cell :title="t('maxValue')" :title-style="{ 'padding-left': '0.8rem' }">
      <byted-badge :value="99" :max="9" :style="{ 'padding-left': '1rem' }">
        <div class="square"></div>
      </byted-badge>

      <byted-badge :value="99" :max="60" :style="{ 'padding-left': '1rem' }">
        <div class="square"></div>
      </byted-badge>

      <byted-badge :value="999" :max="99" :style="{ 'padding-left': '1rem' }">
        <div class="square"></div>
      </byted-badge>
    </demo-cell>

    <demo-cell :title="t('text')" :title-style="{ 'padding-left': '0.8rem' }">
      <byted-collapse v-model="activeNamesDot" :border="false">
        <byted-collapse-item>
          <div slot="title">
            <byted-badge :value="8">
              <span>{{ t('text') }}</span>
            </byted-badge>
          </div>
          <div slot="right-icon" class="right-slot">
            <byted-icon name="right" size="18" fill="#999" />
          </div>
        </byted-collapse-item>
        <byted-collapse-item>
          <div slot="title">
            <byted-badge :max="99" :value="100">
              <span>{{ t('text') }}</span>
            </byted-badge>
          </div>
          <div slot="right-icon" class="right-slot">
            <byted-icon name="right" size="18" fill="#999" />
          </div>
        </byted-collapse-item>
      </byted-collapse>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '徽标',
      message: '消息',
      basicUsage: '基础用法',
      maxValue: '最大值',
      spot: '小红点',
      custom: '自定义颜色',
      text: '与文字搭配',
    },
    'en-US': {
      name: 'Badge',
      message: 'Message',
      basicUsage: 'Basic Usage',
      maxValue: 'Max Value',
      spot: 'Red Spot',
      custom: 'Custom color',
      text: 'Badge With Text',
    },
  },
  components: {
    // demoTitle,
    demoCell,
    // BytedIconBadge,
  },
  data() {
    return {
      activeNames: [],
      activeNamesDot: [],
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>
<style lang="less">
.demo.badge {
  padding: 0;
  .byted-badge {
    margin-right: 8px;
  }
  .right-slot {
    display: flex;
    align-items: center;
  }
  .collapse-slot {
    padding: 12px;
    margin: 0;
  }
}

.square {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin: 0 auto;
  // margin-right: 25px;
  background: #ebebeb;
  border-radius: 5px;
}
</style>
