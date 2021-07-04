<template>
  <div class="demo swipe-cell">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>
    <demo-cell :title="t('basicUsage')" :title-style="titleStyle">
      <div class="swipe-cell-content">
        <o-swipe-cell async @click="onClick" @close="onCloseLeft">
          <template #left>
            <o-button :text="t('delete')" type="primary" square />
          </template>
          <o-cell :title="t('title')" :value="t('base.content1')" />
        </o-swipe-cell>
        <o-swipe-cell async @close="onCloseLeft">
          <template #left>
            <o-button :text="t('collection')" type="primary" square />
            <o-button :text="t('delete')" type="danger" square />
          </template>
          <o-cell :title="t('title')" :value="t('base.content2')" />
        </o-swipe-cell>
        <o-swipe-cell async @close="onCloseRight">
          <template #right>
            <o-button :text="t('collection')" type="primary" square />
          </template>
          <o-cell :title="t('title')" :value="t('base.content3')" />
        </o-swipe-cell>
      </div>
    </demo-cell>

    <demo-cell :title="t('icon.title')" :title-style="titleStyle">
      <div class="swipe-cell-content">
        <o-swipe-cell async @click="onClick" @close="onCloseLeft">
          <template #left>
            <div
              style="
                width: 40px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <o-icon name="check" size="24" fill="#666" />
            </div>
          </template>
          <o-cell :title="t('title')" :value="t('icon.content1')" />
        </o-swipe-cell>
        <o-swipe-cell async @close="onCloseLeft">
          <template #left>
            <div class="left-two">
              <div class="icon-box">
                <o-icon name="check" size="24" fill="#666" />
              </div>
              <div class="icon-box">
                <o-icon name="arrow" size="24" fill="#666" />
              </div>
            </div>
          </template>
          <o-cell :title="t('title')" :value="t('icon.content2')" />
        </o-swipe-cell>
        <o-swipe-cell async @close="onCloseRight">
          <template #right>
            <div
              style="
                width: 40px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <o-icon name="check" size="24" fill="#666" />
            </div>
          </template>
          <o-cell :title="t('title')" :value="t('icon.content3')" />
        </o-swipe-cell>
      </div>
    </demo-cell>

    <demo-cell :title="t('slide.title')" :title-style="titleStyle">
      <div class="swipe-cell-content">
        <o-swipe-cell async @close="onClose">
          <o-cell :title="t('title')" :value="t('slide.content')" />
          <template #right>
            <o-button :text="t('right')" type="danger" square />
          </template>
        </o-swipe-cell>
      </div>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '滑动单元格',
      basicUsage: '基础用法',
      asyncUsage: '异步用法',
      title: '标题',
      content: '内容',
      collection: '收藏',
      delete: '删除',
      finish: '完成',
      left: '向左',
      right: '提交',
      base: {
        content1: '左滑显示单按钮',
        content2: '左滑显示双按钮',
        content3: '右滑显示单按钮',
      },
      icon: {
        title: '显示图标操作',
        content1: '左滑显示单图标',
        content2: '左滑显示双图标',
        content3: '右滑显示单图标',
      },
      slide: {
        title: '滑动直接操作',
        content: '右滑提交完成',
      },
    },
    'en-US': {
      name: 'SwipeCell',
      basicUsage: 'Basic Usage',
      asyncUsage: 'Async Usage',
      title: 'title',
      content: 'content',
      left: 'turn left',
      right: 'Submit',
      collection: 'Collection',
      delete: 'delete',
      base: {
        content1: 'Slide left to show single button',
        content2: 'Slide left double button',
        content3: 'Slide right to show single button',
      },
      icon: {
        title: 'Display icon operation',
        content1: 'Slide left to show single icon',
        content2: 'Slide left to show double icons',
        content3: 'Slide right to show single icon',
      },
      slide: {
        title: 'Sliding direct operation',
        content: 'Right slide commit complete',
      },
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      titleStyle: {
        'padding-left': '0.8rem',
      },
    };
  },
  methods: {
    onClick() {
      console.log('click');
    },
    onCloseLeft(clickPosition, instance) {
      switch (clickPosition) {
        case 'left':
          instance.close();
      }
    },
    onCloseRight(clickPosition, instance) {
      switch (clickPosition) {
        case 'right':
          instance.close();
      }
    },
    onClose(clickPosition, instance, detail) {
      switch (clickPosition) {
        case 'left':
          break;
        case 'cell':
          break;
        case 'outside':
          break;
        case 'right':
          this.$confirm(this.t('content'), this.t('title'))
            .then(() => {
              instance.close();
            })
            .catch(() => {
              instance.close();
            });
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.swipe-cell {
  padding: 0;
}
.swipe-cell-content {
  .o-swipe-cell {
    // margin-bottom: 8px;
  }
  & .o-swipe-cell:last-child {
    margin-bottom: 0;
  }
  .o-swipe-cell__right,
  .o-swipe-cell__left {
    .o-button {
      height: 100%;
      display: inline-flex;
      align-items: center;
    }
  }
}
.left-two {
  width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  .icon-box {
    text-align: center;
    flex: 1;
  }
}
.o-cell:not(:last-child)::after {
  display: none;
}
</style>
