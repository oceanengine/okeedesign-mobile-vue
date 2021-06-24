<template>
  <div class="dome-slider" @click.stop="skip">
    <div class="dome-slider-container">
      <div class="popover" v-show="isShowPopover" ref="popover">
        <span class="content">{{ currentSize }}</span>
        <div class="popover-arrow"></div>
      </div>
      <div
        class="dome-slider-button"
        :style="{ left: active ? active * leftWidth + '%' : 0 }"
        @touchmove="moveBtn"
        @touchend="touchendBtn"
        @touchstart="touchBtnStart"
        @click.self="showPop"
      ></div>
      <div
        class="dome-slider-active"
        :style="{ width: active ? active * leftWidth + '%' : 0 }"
      ></div>
      <div
        v-for="(d, i) in step"
        :key="d"
        :class="[
          'slider-stop',
          {
            'slider-stop-active': i <= active,
          },
        ]"
        :style="{ left: leftWidth * i ? leftWidth * i + '%' : 0 }"
        @click.stop="end(i)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentSize: {
      type: [String, Number],
      default: 'normal',
    },
    sizes: {
      type: Array,
      require: true,
    },
    boolOpen: {
      type: Boolean,
    },
  },
  data() {
    return {
      isShowPopover: false,
      lock: true,
      totalWidth: 0,
      flags: false,
      x: 0,
      moveX: 0,
    };
  },
  methods: {
    skip(e) {
      if (e.target.className === 'dome-slider-button') return;
      let index = Math.round(e.offsetX / this.oneStep);
      this.$emit('change', this.sizes[index]);
      this.isShowPopover = false;
    },
    end(i) {
      this.isShowPopover = false;
      this.$emit('change', this.sizes[i]);
    },
    touchBtnStart(event) {
      this.flags = true;
      let touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.x = touch.clientX;
    },
    showPop(e) {
      let midpoint = Math.ceil(e.target.clientHeight / 2);
      let x = e.clientX,
        y = e.clientY;
      if (e.offsetX > midpoint) {
        x = e.clientX - (e.offsetX - midpoint);
      } else if (e.offsetX < midpoint) {
        x = e.clientX + (midpoint - e.offsetX);
      }
      // y
      if (e.offsetY > midpoint) {
        y = e.clientY - (e.offsetY - midpoint);
      } else if (e.offsetX < midpoint) {
        y = e.clientY + (midpoint - e.offsetY);
      }
      // console.log(x, y)
      this.popoverFixed(x, y);
    },
    moveBtn(event) {
      if (this.flags) {
        let touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.moveX = touch.clientX - this.x;
      }
    },
    touchendBtn(e) {
      this.isShowPopover = false;
      let moveX = this.moveX;
      this.moveX = Math.abs(this.moveX);
      let goStep = this.mathRound(this.moveX, this.oneStep);
      let index;
      if (moveX > 0) {
        index = this.active + goStep;
        index = index > this.sizes.length - 1 ? this.sizes.length - 1 : index;
      } else {
        index = this.active - goStep < 0 ? 0 : this.active - goStep;
      }
      this.$emit('change', this.sizes[index]);
      this.flags = false;
      this.x = 0;
      this.moveX = 0;
      this.lock = false;
    },
    mathRound(a, b) {
      return Math.round(a / b);
    },
    popoverFixed(left, top) {
      let pop = this.$refs['popover'];
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
      this.isShowPopover = true;
    },
  },
  computed: {
    step() {
      return this.sizes.length;
    },
    leftWidth() {
      return 100 / (this.step - 1);
    },
    active() {
      let i = this.sizes.indexOf(this.currentSize);
      return i;
    },
    oneStep() {
      return this.totalWidth / (this.sizes.length - 1);
    },
  },
  mounted() {},
  watch: {
    boolOpen(val) {
      // console.log(val)
      this.isShowPopover = false;
      setTimeout(() => {
        this.totalWidth = document.querySelector('.dome-slider').clientWidth;
      }, 300);
    },
  },
};
</script>

<style lang="less" scoped>
.dome-slider {
  width: 100%;
  position: relative;
  padding: 10px 0;
  &-active {
    height: 100%;
    border-radius: 3px;
    background-color: #338aff;
    position: absolute;
    top: 0;
    left: 0;
  }
  &-button {
    width: 10px;
    height: 10px;
    background-color: #ffffff;
    border: 3px solid #338aff;
    position: absolute;
    border-radius: 100%;
    top: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    cursor: pointer;
    z-index: 10;
    // box-sizing: border-box;
    .tips {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      padding: 8px 16px;
      background: rgba(51, 51, 51, 0.95);
      color: #ffffff;
      font-size: 12px;
    }
  }
  &-button:hover {
    .tips {
      display: block;
    }
  }
  &-container {
    border-radius: 3px;
    height: 4px;
    background-color: #ebebeb;
    position: relative;
    .slider-stop {
      width: 8px;
      height: 8px;
      background-color: #ebebeb;
      // border: 2px solid #EBEBEB;
      position: absolute;
      border-radius: 100%;
      top: 50%;
      -webkit-transform: translateX(-50%) translateY(-50%);
      -ms-transform: translateX(-50%) translateY(-50%);
      transform: translateX(-50%) translateY(-50%);
      cursor: pointer;
    }
    .slider-stop-active {
      background-color: #338aff;
    }
  }
}
.popover {
  padding: 6px 0;
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(-50%, -150%);
  .content {
    padding: 8px 16px;
    color: #ffffff;
    font-size: 12px;
    line-height: 20px;
    border-radius: 4px;
    background: rgba(51, 51, 51, 0.95);
  }
}
.popover-arrow {
  position: absolute;
  left: 50%;
  border-top-width: 0px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 0px;
  width: 10px;
  height: 10px;
  background: rgba(51, 51, 51, 0.95);
  transform: rotate(45deg) translateX(-50%);
}
</style>
