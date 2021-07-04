<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('title1')" :title-style="titleStyle">
      <o-tabs v-model="active" :size="currentSize" @change="onChange">
        <o-tab v-for="index in tabs" :key="index" :name="index" :title="t('title') + index">
          <div class="content">{{ t('value') }} {{ index }}</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-cell :title="t('title2')" :title-style="titleStyle">
      <o-tabs
        :active="activeName"
        swipeable
        :size="currentSize"
        @click="onControlledClick"
        @change="onControlledChange"
      >
        <o-tab name="a" :title="t('title') + 1">
          <div class="content">{{ t('value') }} 1</div>
        </o-tab>
        <o-tab name="b" :title="t('title') + 2">
          <div class="content">{{ t('value') }} 2</div>
        </o-tab>
        <o-tab name="c" :title="t('title') + 3">
          <div class="content">{{ t('value') }} 3</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-cell :title="t('title12')" :title-style="titleStyle">
      <o-tabs :flex="false">
        <o-tab v-for="index in tabs" :key="index" :title="t('title') + index" :size="currentSize">
          <div class="content">{{ t('value') }} {{ index }}</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-cell :title="t('title9')" :title-style="titleStyle">
      <o-tabs type="card" :size="currentSize">
        <o-tab v-for="index in 4" :key="index" :disabled="index === 4" :title="t('title') + index">
          <div class="content">{{ t('value') }} {{ index }}</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-cell :title="t('title3')" :title-style="titleStyle">
      <o-tabs>
        <o-tab v-for="index in 8" :key="index" :title="t('title') + index" :size="currentSize">
          <div class="content">{{ t('value') }} {{ index }}</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-cell :title="t('title4')" :title-style="titleStyle">
      <o-tabs @disabled="onClickDisabled">
        <o-tab
          v-for="index in 3"
          :key="index"
          :title="t('title') + index"
          :disabled="index === 2"
          :size="currentSize"
        >
          <div class="content">{{ t('value') }} {{ index }}</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-cell :title="t('title6')" :title-style="titleStyle">
      <o-tabs :size="currentSize">
        <o-tab v-for="index in 2" :key="index">
          <template slot="title"> T.T{{ t('title') }} </template>
          <div class="content">{{ t('value') }} {{ index }}</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-cell :title="t('title14')" :title-style="titleStyle">
      <o-tabs touchable :size="currentSize">
        <o-tab v-for="index in tabs" :key="index" :title="t('title') + index">
          <div class="content">{{ t('value') }} {{ index }}</div>
        </o-tab>
      </o-tabs>
    </demo-cell>

    <demo-size :current-size="currentSize" :sizes="sizes" @changeSize="changeSize" />
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
import DemoSize from '../../../../docs/site/components/DomSize.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '标签页',
      title: '标签',
      value: '内容',
      title1: '基础用法',
      title2: '异步用法',
      title3: '标签栏滚动',
      title4: '禁用状态',
      title6: '自定义标签',
      // title7: '切换动画',
      // title8: '滑动切换',
      title9: '样式风格 及 自定义颜色',
      title10: '下划线样式',
      title11: '文字样式',
      title12: '静态布局',
      title13: '无边框',
      title14: '滑动切换动画',
      title15: '尺寸大小',
      title17: '安全区域用法',
      disabled: ' 已被禁用',
    },
    'en-US': {
      name: 'Tabs',
      title: 'tab',
      value: 'content',
      title1: 'Basic Usage',
      title2: 'Controlled Usage',
      title3: 'Swipe Tabs',
      title4: 'Disabled Tab',
      title6: 'Custom Tab',
      // title7: 'Switch Animation',
      // title8: 'Swipeable',
      title9: 'Card Style And Custom Color',
      title10: 'Line Style',
      title11: 'Text Style',
      title12: 'Static Layout',
      title13: 'Rimless Style',
      title14: 'touchable Usage',
      title15: 'Size Usage',
      title17: 'safe-area-inset Usage',
      disabled: ' is disabled',
    },
  },

  components: {
    demoCell,
    DemoSize,
  },
  data() {
    return {
      titleStyle: {
        'padding-left': '0.8rem',
      },
      active: 2,
      activeName: 'b',
      tabs: [1, 2, 3, 4],
      sizes: ['normal', 'large'],
      currentSize: 'large',
    };
  },

  methods: {
    changeSize(val) {
      this.currentSize = val;
    },
    onClickDisabled(index, title) {
      console.log(title + this.t('disabled'));
    },

    onClick(name, title) {
      console.log(name, title);
    },

    onChange(name, title) {
      console.log('change', name, title);
    },

    onControlledClick(name, title) {
      this.$confirm('OKee Design', 'Do you love', {
        cancelButtonText: 'Not',
        confirmButtonText: 'Yes',
      })
        .then(() => {
          this.activeName = name;
          console.log('your answer is Yes');
        })
        .catch(() => null);
    },

    onControlledChange(name, title) {
      console.log('change', name, title);
    },
  },
};
</script>
<style lang="less" scoped>
.demo {
  padding: 0 0 80px 0;
  h4 {
    padding: 10px;
  }
  .content {
    text-align: center;
    background: #fff;
    padding: 16px;
    font-size: 16px;
  }
  .o-tabs--card {
    margin: 0 10px;
    .content {
      background: transparent;
    }
  }
}
</style>
