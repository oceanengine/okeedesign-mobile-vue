import Vue from 'vue';
import { CombinedVueInstance } from 'vue/types/vue';
import { on } from '../utils/dom/event';

const MIN_DISTANCE = 5;

function getScaleDistance(touches: TouchList): number {
  return Math.sqrt(
    (touches[0].clientX - touches[1].clientX) ** 2 + (touches[0].clientY - touches[1].clientY) ** 2,
  );
}

function getDirection(x: number, y: number): TouchMixinDirection {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }

  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }

  return '';
}

export type TouchMixinDirection = '' | 'horizontal' | 'vertical';

export interface TouchMixinData {
  // non-reactive
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  offsetX: number;
  offsetY: number;
  startScaleDistance: number;
  scaleDistance: number;
  // reactive
  direction: TouchMixinDirection;
}

export interface TouchMixinMethods {
  touchStart(event: TouchEvent): void;
  touchMove(event: TouchEvent): void;
  resetTouchStatus(): void;
  bindTouchEvent(el: HTMLElement): void;
}

export type TouchMixinInstance = CombinedVueInstance<
  Vue,
  TouchMixinData,
  TouchMixinMethods,
  {},
  {}
>;

export const TouchMixin = Vue.extend<TouchMixinData, TouchMixinMethods, {}, {}>({
  data() {
    return { direction: '' } as TouchMixinData;
  },

  methods: {
    touchStart(event) {
      this.resetTouchStatus();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.timeStamp = event.timeStamp;
      if (event.touches.length === 2) {
        this.startScaleDistance = getScaleDistance(event.touches);
      }
    },

    touchMove(event) {
      const { timeStamp } = event;
      const touch = event.touches[0];

      const { deltaX: lastDeltaX, deltaY: lastDeltaY, timeStamp: lastTimeStamp } = this;

      this.deltaX = touch.clientX - this.startX;
      this.deltaY = touch.clientY - this.startY;
      this.offsetX = Math.abs(this.deltaX);
      this.offsetY = Math.abs(this.deltaY);
      this.timeStamp = timeStamp;

      const time = timeStamp - lastTimeStamp;
      this.speedX = (this.deltaX - lastDeltaX) / time;
      this.speedY = (this.deltaY - lastDeltaY) / time;

      if (event.touches.length > 1) {
        this.scaleDistance = getScaleDistance(event.touches);
      }
      this.direction = this.direction || getDirection(this.offsetX, this.offsetY);
    },

    resetTouchStatus() {
      this.direction = '';
      this.deltaX = 0;
      this.deltaY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.startScaleDistance = 0;
      this.scaleDistance = 0;
      this.timeStamp = 0;
      this.speedX = 0;
      this.speedY = 0;
    },

    // avoid Vue 2.6 event bubble issues by manually binding events
    // https://github.com/youzan/vant/issues/3015
    bindTouchEvent(el: HTMLElement) {
      const { onTouchStart, onTouchMove, onTouchEnd } = this as any;

      on(el, 'touchstart', onTouchStart);
      on(el, 'touchmove', onTouchMove);

      if (onTouchEnd) {
        on(el, 'touchend', onTouchEnd);
        on(el, 'touchcancel', onTouchEnd);
      }
    },
  },
});
