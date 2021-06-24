<template>
  <div class="dome-size">
    <div
      :class="[
        'dome-size-content',
        {
          show: boolOpen,
        },
      ]"
    >
      <span class="dome-size-content_title">尺寸</span>
      <div class="dome-size-content_slider">
        <step :currentSize="currentSize" :sizes="sizes" @change="change" :boolOpen="boolOpen" />
      </div>
    </div>

    <div class="dome-size-icon" @click="switchContnet">
      <img v-show="boolOpen" :src="closeIcon" alt="" class="svg-icon-close" />
      <img v-show="!boolOpen" :src="transferIcon" alt="" class="svg-icon-transfer" />
    </div>
  </div>
</template>

<script>
import closeIcon from './svg/close.svg';
import transferIcon from './svg/transfer.svg';
import step from './step/Step';
export default {
  props: {
    currentSize: {
      type: [String, Number],
      default: 'normal',
    },
    sizes: {
      type: Array,
      require: true,
      // large/normal/small/mini/tiny
      // default: () => {
      //   return ['tiny', 'mini', 'small', 'normal', 'large']
      // }
    },
  },
  components: {
    step,
  },
  data() {
    return {
      closeIcon,
      transferIcon,
      boolOpen: false,
    };
  },
  methods: {
    change(val) {
      this.$emit('changeSize', val);
    },
    switchContnet() {
      this.boolOpen = !this.boolOpen;
    },
  },
  watch: {
    currentSize(val) {},
  },
};
</script>

<style lang="less" scoped>
.dome-size {
  position: fixed;
  z-index: 2;
  bottom: 48px;
  right: 16px;
  height: 42px;
  background: #ffffff;
  box-shadow: 0px 4px 20px rgba(10, 33, 64, 0.07);
  border-radius: 21px;
  &-icon {
    position: relative;
    z-index: 11;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 42px;
    background: #338aff;
  }
}
.dome-size-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 42px;
  height: 42px;
  padding-right: 42px;
  align-items: center;
  display: flex;
  border-radius: 21px;
  white-space: nowrap;
  overflow: hidden;
  transition: 0.3s ease-in-out;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 4px 20px rgba(10, 33, 64, 0.07);
  &.show {
    width: 328px;
    display: flex;
    padding-left: 16px;
  }
  &_title {
    font-size: 12px;
    line-height: 24px;
    color: #333333;
    flex-shrink: 0;
    white-space: nowrap;
  }
  &_slider {
    flex: 1;
    padding: 0 12px;
  }
}
</style>
