<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell>
      <o-tabs v-model="active">
        <o-tab :title="t('basicUsage')">
          <o-pull-refresh
            v-model="isLoading"
            load-end-status=""
            type="primary"
            size="large"
            foot-disabled
            style="background: #fff"
            @pull-down="pullDownBasic"
          >
            <div
              class="content"
              style="
                display: flex;
                justify-content: flex-start;
                align-items: stretch;
                margin-left: 15px;
              "
            >
              <img src="../pics/pic1.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic2.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic3.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic4.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic5.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic6.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic7.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic8.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic1.svg" width="150px" height="68px" alt="" />
            </div>
          </o-pull-refresh>
        </o-tab>

        <o-tab :title="t('successNotice')">
          <o-pull-refresh
            v-model="isLoading"
            :load-end-status="loadEndStatus"
            type="primary"
            size="large"
            foot-disabled
            style="background: #fff;"
            @pull-down="pullDown"
          >
            <div
              class="content"
              style="
                display: flex;
                justify-content: flex-start;
                align-items: stretch;
                margin-left: 15px;
              "
            >
              <img src="../pics/pic1.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic2.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic3.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic4.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic5.svg" width="150px" height="68px" alt="" />
            </div>
          </o-pull-refresh>
        </o-tab>

        <o-tab :title="t('customize')">
          <o-pull-refresh
            v-model="isLoading"
            :load-end-status="loadEndStatus"
            type="primary"
            size="large"
            foot-disabled
            style="background: #fff;"
            @pull-down="pullDown"
          >
            <div
              class="content"
              style="
                display: flex;
                justify-content: flex-start;
                align-items: stretch;
                margin-left: 15px;
              "
            >
              <img src="../pics/pic1.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic2.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic3.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic4.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic5.svg" width="150px" height="68px" alt="" />
            </div>
            <div slot="success" style="width: 80px; margin: auto">
              <img
                src="../pics/refreshIcon.svg"
                alt=""
                width="15px"
                height="15px"
                style="vertical-align: middle; margin-bottom: 2px"
              />
              Success!
            </div>
          </o-pull-refresh>
        </o-tab>
        <o-tab :title="t('pullUpTitle')">
          <o-pull-refresh
            v-model="isPullUpLoading"
            :load-end-status="loadEndStatus"
            headDisabled
            type="primary"
            size="normal"
            style="background: #fff"
            @pull-up="pullUp"
          >
            <div
              class="content"
              style="
                display: flex;
                justify-content: flex-start;
                align-items: stretch;
                margin-left: 15px;
              "
            >
              <img src="../pics/pic8.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic6.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic4.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic2.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic1.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic3.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic5.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic7.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic1.svg" width="150px" height="68px" alt="" />
              <img src="../pics/pic2.svg" width="150px" height="68px" alt="" />
            </div>
          </o-pull-refresh>
        </o-tab>
      </o-tabs>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '滑动加载',
      title: '标题',
      basicUsage: '基础用法',
      pullUpTitle: '上拉加载',
      pullDownTitle: '下拉刷新',
      refreshStatus: '刷新状态',
      pullDownStatus: '向下滑动页面试试',
      pullUpStatus: '向上滑动页面试试',
      successNotice: '成功加载',
      customize: '自定义提示',
    },
    'en-US': {
      name: 'Sliding Loading',
      title: 'title',
      pullUpTitle: 'Pull up loading',
      pullDownTitle: 'Drop down refresh',
      basicUsage: 'Drop down loading',
      successNotice: 'Loading Successful',
      customize: 'Customize Notice',
      refreshStatus: 'Refresh Status',
    },
  },

  components: {
    demoCell,
  },
  data() {
    return {
      isLoading: false,
      isPullUpLoading: false,
      loadEndStatus: '',
      titleStyle: {
        'padding-left': '0.8rem',
      },
      active: 0,
      tabs: [1, 2, 3, 4],
    };
  },

  methods: {
    pullDown() {
      setTimeout(() => {
        this.isLoading = false;
        this.loadEndStatus = 'success';
      }, 1100);
    },
    pullDownBasic() {
      setTimeout(() => {
        this.isLoading = false;
        this.$toast('刷新成功');
      }, 1100);
    },
    pullUp() {
      setTimeout(() => {
        this.isPullUpLoading = false;
        this.loadEndStatus = 'success';
      }, 1100);
    },
  },
};
</script>
<style lang="less" scoped>
.demo {
  margin: 0;
  padding: 0 0 30px 0;
  .content {
    height: 84vh;
    padding: 20px 0 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }
}
img {
  pointer-events: none;
}
</style>
