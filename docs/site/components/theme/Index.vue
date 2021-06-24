<template>
  <div>
    <byted-drawer
      v-model="show"
      placement="right"
      width="850"
      class="skin-config-drawer"
      :closable="false"
      @hide="hide"
    >
      <template slot="body">
        <!-- phone -->
        <div class="skin-left">
          <div class="title">组件预览</div>
          <div class="phone-box">
            <div class="docs-show-phone">
              <div class="docs-show-phone-content">
                <iframe
                  id="preview-doc-phone"
                  frameborder="0"
                  :src="phoneSrc"
                  :width="phoneWidth"
                  :height="phoneHeight"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="skin-right">
          <div style="padding-bottom: 58px">
            <div class="header">
              <div class="title">换肤设置</div>
              <!-- <byted-icon
                name="close"
                color="#999"
                width="24px"
                height="24px"
                style="cursor: pointer"
                @click="show = false"
              /> -->
            </div>
            <div>
              <colors
                :colors="colors"
                :current-colors="currentColors"
                @change-theme="changeTheme"
              />
              <!-- 圆角 -->
              <div>
                <b-radius :radius="curRadius" @change="changeRadius" />
              </div>
            </div>
            <div class="footer">
              <byted-button
                :disabled="!colorStack.length"
                class="restore-btn"
                @click="handleRestore"
              >
                还原
              </byted-button>
              <byted-button type="primary" @click="handleExport"> 导出 </byted-button>
            </div>
          </div>
        </div>
      </template>
    </byted-drawer>
  </div>
</template>
<script>
import Colors from './Color';
import bRadius from './radius/Index';
export default {
  components: {
    Colors,
    bRadius,
  },
  props: {
    colors: {
      type: Object,
      default: () => {
        return {
          primaryColor: '#0278ff',
          successColor: '#00d2d5',
          warningColor: '#fec038',
          dangerColor: '#ff6767',
          backgroundColor: '#f8f8f8',
        };
      },
    },
    radius: {
      type: Object,
      default: () => {
        return {
          borderRadius1: '2px',
          borderRadius2: '4px',
          borderRadius3: '6px',
          borderRadius4: '12px',
          borderRadius5: '16px',
        };
      },
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      phoneWidth: 360,
      phoneHeight: '100%',
      show: false,
      currentColors: { ...this.colors },
      colorStack: [],
      curRadius: JSON.parse(JSON.stringify(this.radius)),
    };
  },
  computed: {
    phoneSrc() {
      const l = window.location;
      return `${l.protocol}//${l.host}${l.pathname}online.html${l.hash}`;
    },
  },
  watch: {
    radius(val) {
      this.curRadius = [...val];
    },
    isShow(val) {
      this.show = val;
    },
  },
  methods: {
    hide() {
      this.$emit('close');
    },
    changeTheme(val) {
      this.colorStack.push({ ...this.currentColors });
      this.currentColors = { ...val };
      this.$emit('preview', { ...val });
    },
    changeRadius(val) {
      if (val === 'addition') {
        for (let key in this.curRadius) {
          if (this.curRadius[key]) {
            this.curRadius[key] = parseInt(this.curRadius[key]) + 1 + 'px';
          }
        }
      } else {
        if (!parseInt(this.curRadius['borderRadius1'])) return;
        for (let key in this.curRadius) {
          if (this.curRadius[key] && parseInt(this.curRadius[key])) {
            this.curRadius[key] = parseInt(this.curRadius[key]) - 1 + 'px';
          }
        }
      }
      this.$emit('preview', { ...this.currentColors, ...this.curRadius });
    },
    handleRestore() {
      const lastColors = this.colorStack.pop();
      this.currentColors = { ...lastColors };
      this.$emit('preview', { ...lastColors, ...this.curRadius });
    },
    handleExport() {
      this.$emit('export', { ...this.currentColors, ...this.curRadius });
    },
  },
};
</script>

<style lang="less" scoped>
.skin-config-drawer {
  .skin-right {
    width: 362px; /* no */
    padding: 32px 36px; /* no */
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.08);
    background: #ffffff;
    position: relative;
    .header {
      display: flex;
      justify-content: space-between;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%; /* no */
      padding: 16px; /* no */
      border-top: 1px solid #e9e9e9; /* no */

      .restore-btn {
        margin-right: 16px; /* no */
      }
    }
  }
  .skin-left {
    padding: 32px 48px 0 48px; /* no */
    .phone-box {
      padding-top: 24px; /* no */
      height: calc(100vh - 94px); /* no */
      display: flex;
      flex-direction: column;
    }
  }
  .title {
    font-weight: 600; /* no */
    font-size: 24px; /* no */
    line-height: 28px; /* no */
    color: #333; /* no */
  }
  .global-params {
    position: absolute;
  }
}
.config-redius {
  margin-bottom: 24px;
}
.docs-show-phone {
  border: 8px solid #edf1f4; /* no */
  border-radius: 8px; /* no */
  box-shadow: none;
  background: #edf1f4;
  &-content {
    // border-radius: 8px; /* no */
    height: 100%;
    overflow: hidden;
  }
}
</style>
<style lang="less">
.skin-config-drawer.byted-drawer {
  .bui-drawer-wrapper {
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08); /* no */
    border-radius: 8px 0 0 8px; /* no */
    overflow: hidden;
  }
  .bui-drawer-body {
    padding: 0;
    height: 100%; /* no */
    background: #fafafa;
    display: flex;
    justify-content: space-between;
    // align-items: flex-start;
  }
}
</style>
