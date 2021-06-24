<template>
  <div class="config-redius">
    <div class="config-redius-title">
      <span class="title">圆角</span>
      <div class="config-redius-title_right">
        <span class="icon-box" @click="subtract">
          <byted-icon name="minus" color="#666" />
        </span>
        <span class="icon-box" @click="addition">
          <byted-icon name="plus" color="#666" />
        </span>
      </div>
    </div>
    <div class="radius-list">
      <item :border-radius="radius.borderRadius1" />
      <item :border-radius="radius.borderRadius2" />
      <item :border-radius="radius.borderRadius3" />
      <item :border-radius="radius.borderRadius4" />
      <item :border-radius="radius.borderRadius5" />
    </div>
  </div>
</template>
<script>
import item from './Item';
export default {
  name: 'Redius',
  components: {
    item,
  },
  props: {
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
  },
  data() {
    return {};
  },
  methods: {
    addition() {
      this.$emit('change', 'addition');
    },
    subtract() {
      this.$emit('change', 'subtract');
    },
  },
};
</script>
<style lang="less" scoped>
.config-redius-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px; /* no */
  margin: 24px 0; /* no */
  .title {
    font-weight: 400; /* no */
    color: #666666;
    font-size: 14px; /* no */
    line-height: 22px; /* no */
  }
  &_right {
    .icon-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px; /* no */
      height: 24px; /* no */
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 4px; /* no */
      cursor: pointer;
    }
    .icon-box:first-child {
      margin-right: 16px; /* no */
    }
  }
}
.radius-list {
  display: flex;
  justify-content: space-between;
  user-select: none;
}
</style>
