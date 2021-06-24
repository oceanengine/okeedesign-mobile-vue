<template>
  <div class="demo-cell">
    <div class="demo-cell-header">
      <div class="demo-cell-header-title">
        <span class="demo-cell-header-title__left" :style="titleStyle">{{ title }}</span>
      </div>
      <!-- <div class="demo-cell-header-line"></div> -->
    </div>
    <div class="demo-cell-content-slot">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    titleStyle: {
      type: [Array, Object],
      default: function _default() {},
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.demo-cell {
  // margin-top: 16px;
  &-content-slot {
    padding: 16px 0;
  }
  &-header {
    &-title {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      line-height: 22px;
      &__left {
        color: #999999;
        font-weight: 400;
      }
    }
    &-line {
      margin-top: 9px;
      height: 1px;
      background-color: #ebebeb;
      position: relative;
      &::before {
        display: inline-block;
        content: '';
        width: 32px;
        height: 3px;
        background: #3337c5;
        position: absolute;
        top: -1px;
      }
    }
  }
}
</style>
