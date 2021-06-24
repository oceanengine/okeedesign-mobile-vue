<template>
  <div class="edit-color">
    <div class="edit-color-box">
      <span class="edit-color-title">主题编辑</span>
      <span class="edit-color-line"></span>
    </div>
    <div class="edit-color-title_second">
      <span>颜色</span>
    </div>
    <div class="edit-color-item">
      <byted-color-picker v-model="themeColor.primaryColor" transfer @change="handleChange">
        <div class="color-box">
          <div :style="{ background: themeColor.primaryColor }" class="color-block">
            <span>Primary</span>
            <byted-icon name="angle-down" color="#fff" />
          </div>
        </div>
      </byted-color-picker>
      <byted-input v-model="themeColor.primaryColor" style="margin-left: 16px" />
    </div>
    <div class="edit-color-item">
      <byted-color-picker v-model="themeColor.successColor" transfer @change="handleChange">
        <div class="color-box">
          <div :style="{ background: themeColor.successColor }" class="color-block">
            <span>Success</span>
            <byted-icon name="angle-down" color="#fff" />
          </div>
        </div>
      </byted-color-picker>
      <byted-input v-model="themeColor.successColor" style="margin-left: 16px" />
    </div>
    <div class="edit-color-item">
      <byted-color-picker v-model="themeColor.warningColor" transfer @change="handleChange">
        <div class="color-box">
          <div :style="{ background: themeColor.warningColor }" class="color-block">
            <span>Warning</span>
            <byted-icon name="angle-down" color="#fff" />
          </div>
        </div>
      </byted-color-picker>
      <byted-input v-model="themeColor.warningColor" style="margin-left: 16px" />
    </div>
    <div class="edit-color-item">
      <byted-color-picker v-model="themeColor.dangerColor" transfer @change="handleChange">
        <div class="color-box">
          <div :style="{ background: themeColor.dangerColor }" class="color-block">
            <span>Danger</span>
            <byted-icon name="angle-down" color="#fff" />
          </div>
        </div>
      </byted-color-picker>
      <byted-input v-model="themeColor.dangerColor" style="margin-left: 16px" />
    </div>

    <div class="edit-color-item">
      <byted-color-picker v-model="themeColor.backgroundColor" transfer @change="handleChange">
        <div class="color-box">
          <div :style="{ background: themeColor.backgroundColor }" class="color-block">
            <span>Background</span>
            <byted-icon name="angle-down" color="#fff" />
          </div>
        </div>
      </byted-color-picker>
      <byted-input v-model="themeColor.backgroundColor" style="margin-left: 16px" />
    </div>
  </div>
</template>

<script>
export default {
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
    currentColors: {
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
  },
  data() {
    return {
      themeColor: { ...this.colors },
    };
  },
  watch: {
    currentColors(newVal) {
      if (newVal) {
        this.themeColor = { ...newVal };
      }
    },
  },
  methods: {
    handleChange(value) {
      console.log(value);
      if (!value) {
        Object.keys(this.themeColor).forEach(d => {
          if (!this.themeColor[d]) {
            this.themeColor[d] = this.colors[d];
          }
        });
      }
      this.$emit('change-theme', this.themeColor);
    },
  },
};
</script>

<style lang="less">
.edit-color {
  &-box {
    display: flex;
    align-items: center;
    margin-top: 24px; /* no */
  }
  &-line {
    display: inline-block;
    height: 1px; /* no */
    flex: 1;
    background: #e9e9e9;
    margin-left: 12px; /* no */
  }
  &-title {
    font-weight: 600;
    font-size: 14px; /* no */
    line-height: 28px; /* no */
    color: #333;
  }
  &-title_second {
    color: #666;
    margin: 16px 0 12px 0; /* no */
    font-size: 14px; /* no */
    line-height: 22px; /* no */
  }
  & &-item:last-child {
    margin-bottom: 0;
  }
  &-item {
    display: flex;
    margin-bottom: 24px; /* no */
  }
}
.color-box {
  width: 143px; /* no */
  height: 34px; /* no */
  border: 1px solid #dadfe3;
  box-sizing: border-box;
  border-radius: 4px; /* no */
  padding: 4px; /* no */
}
.color-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 2px; /* no */
  height: 100%; /* no */
  color: #ffffff;
  font-size: 14px; /* no */
  line-height: 22px; /* no */
  padding-left: 8px; /* no */
  padding-right: 6px; /* no */
}
</style>
