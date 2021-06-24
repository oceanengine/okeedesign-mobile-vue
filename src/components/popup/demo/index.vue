<template>
  <div class="demo popup">
    <div class="popup-box">
      <byted-header fixed @click-left="$router.back()">
        <div >{{t('name')}}</div>
      </byted-header>

      <demo-cell :title="t('basic')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('click')" is-link @click="showBasic = true" />
        </div>
        <byted-popup v-model="showBasic" class="demo-popup-basic">
          <img class="popup-img" src="../image/pic.svg" />
        </byted-popup>
      </demo-cell>

      <demo-cell :title="t('position')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('top')" is-link @click="showTop = true" />
          <byted-cell :title="t('bottom')" is-link @click="showBottom = true" />
          <byted-cell :title="t('left')" is-link @click="showLeft = true" />
          <byted-cell :title="t('right')" is-link @click="showRight = true" />
        </div>

        <byted-popup v-model="showTop" position="top" append-to-body>
          <div class="demo-popup-top">
            <img class="popup-img" src="../image/pic.svg" />
          </div>
        </byted-popup>
        <byted-popup v-model="showBottom" position="bottom" append-to-body>
          <div class="demo-popup-bottom">
            <img class="popup-img" src="../image/pic.svg" />
          </div>
        </byted-popup>
        <byted-popup v-model="showLeft" class="demo-popup-vh" position="left" append-to-body>
          <div class="demo-popup-left">
            <img class="popup-img" src="../image/pic.svg" />
          </div>
        </byted-popup>
        <byted-popup v-model="showRight" class="demo-popup-vh" position="right" append-to-body>
          <div class="demo-popup-right">
            <img class="popup-img" src="../image/pic.svg" />
          </div>
        </byted-popup>
      </demo-cell>

      <demo-cell :title="t('appendToBody')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('click')" is-link @click="showAppendBody = true" />
        </div>
        <byted-popup v-model="showAppendBody" class="demo-popup-basic" append-to-body>
          <img class="popup-img" src="../image/pic.svg" />
        </byted-popup>
      </demo-cell>

      <demo-cell :title="t('getContainer')">
        <div class="bui-doc-demo-block__card">
          <byted-cell :title="t('click')" is-link @click="showAppend = true" />
        </div>
        <byted-popup v-model="showAppend" class="demo-popup-basic" get-container="body">
          <img class="popup-img" src="../image/pic.svg" />
        </byted-popup>
      </demo-cell>
    </div>
  </div>
</template>
<script>
// import demoTitle from '../../../../docs/site/components/DomeTitle';
import demoCell from '../../../../docs/site/components/DomeCell';
export default {
  i18n: {
    'zh-CN': {
      name: '弹出层',
      basic: '基础用法',
      appendToBody: '挂载根结点',
      getContainer: '指定挂载结点',
      position: '弹出位置',
      top: '顶部弹出',
      left: '左侧弹出',
      right: '右侧弹出',
      bottom: '底部弹出',
      click: '展示弹出层',
      closeIcon: '关闭图标',
    },
    'en-US': {
      name: 'Popup',
      basic: 'Basic',
      appendToBody: 'AppendToBody',
      getContainer: 'GetContainer',
      position: 'Position',
      top: 'top',
      left: 'left',
      right: 'right',
      bottom: 'bottom',
      closeIcon: 'Close Icon',
      click: 'Show Popup',
    },
  },
  components: {
    demoCell,
    // demoTitle,
  },
  data() {
    return {
      showBasic: false,
      showAppendBody: false,
      showAppend: false,
      showTop: false,
      showBottom: false,
      showLeft: false,
      showRight: false,
      showClose: false,
    };
  },
  methods: {},
};
</script>
<style lang="less">
.demo-popup-basic {
  padding: 38px;
  font-size: 18px;
  border-radius: 4px;
  .popup-img {
    width: 124px;
  }
}
.demo-popup-vh {
  height: 100vh;
  line-height: 100vh;
}
.demo.popup {
  position: relative;
  padding: 0 16px;
  margin: 0;
  .popup-box {
    .byted-button {
      margin-right: 10px;
    }
  }
  .demo-cell {
    // padding: 0 12px;
  }
}

.demo-popup-top,
.demo-popup-bottom {
  height: 40vh;
  line-height: 40vh;
  font-size: 0;
  text-align: center;
  img {
    vertical-align: middle;
  }
}
.demo-popup-left,
.demo-popup-right {
  width: 60vw;
  height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
