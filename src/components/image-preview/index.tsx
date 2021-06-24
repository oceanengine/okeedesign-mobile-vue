import Vue, { ComponentOptions, CreateElement, VueConstructor } from 'vue';
import { PropsDefinition } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { ScopedSlotReturnValue } from 'vue/types/vnode';

import { createNamespace, createBrandName, isServer } from '../../utils';
import { ByComponentOptions } from '../../utils/create/component';
import { clamp, getCorrectIndexInArray } from '../../utils/math';
import { preventDefault, on, off } from '../../utils/dom/event';
import { raf } from '../../utils/dom/raf';

import { PopupMixin } from '../../mixins/popup';
import { PopupMixinProps, PopupMixinPropsInit, PopupMixinInstance } from '../../mixins/popup/type';
import { BindEventMixin } from '../../mixins/bind-event';

const closeIcon = require(`!html-loader!../../../svg/close-one.svg`);

declare const h: CreateElement;

const MIN_DISTANCE_CLOSE = 50;
const MIN_DISTANCE_SWITCH = 10;

const [createComponent, bem] = createNamespace('image-preview');

export interface ImagePreviewData {
  moving: boolean;
  zooming: boolean;
  toggleZooming: boolean;
  switching: boolean;

  /** Index of current image */
  currentIndex: number;
  /** Position X of current image */
  currentX: number;
  /** Position Y of current image */
  currentY: number;
  /** Translate Z of current image before close */
  currentZ: number;
  /** Opacity of current image before close */
  currentOpacity: number;

  /** Index of adjacent image (previous or next to current image) */
  adjacentIndex: number;
  /** Position X of adjacent image */
  adjacentX: number;

  /** Scale ratio while zooming */
  scale: number;
}

export type ImagePreviewCloseButtonPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

const CLOSE_ICON_POSITIONS: ImagePreviewCloseButtonPosition[] = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

export interface ImagePreviewPropsDeclare {
  /**
   * The string array of image URLs.
   */
  images: string[];

  /**
   * The index number for first showing.
   * @default 0
   */
  startIndex?: number;

  /**
   * The duration (millisecond) for swipe motion.
   * @default 200
   */
  swipeDuration?: number;

  /**
   * Toggle loop or not for swipe.
   * @default true
   */
  loop?: boolean;

  /**
   * Set maximum zoom scale.
   * @default 3
   */
  maxZoom?: number;
  /**
   * Set minimum zoom scale.
   * @default 1
   */
  minZoom?: number;

  /**
   * Just be closed via .close() or not.
   * @alpha Probably be removed in future.
   */
  asyncClose?: boolean;

  /**
   * Close on backward (history popstate).
   * @default false
   */
  closeOnPopstate?: boolean;

  /**
   * Show close button or not.
   * @default false
   */
  showCloseButton?: boolean;

  /**
   * The position of close button.
   * @default 'top-right'
   */
  closeButtonPosition?: ImagePreviewCloseButtonPosition;

  /**
   * Show images swipe indicators or not.
   * @default true
   */
  showIndicators?: boolean;
}

export interface ImagePreviewProps extends ImagePreviewPropsDeclare, PopupMixinProps {}

export interface ImagePreviewPropsInit
  extends Required<ImagePreviewPropsDeclare>,
    PopupMixinPropsInit {
  // override portal mixin
  appendToBody: boolean;
  // override popup mixin
  overlay: boolean;
  closeOnClickOverlay: boolean;
}

export interface ImagePreviewMethods {
  handlePopstate(isBind: boolean): void;

  moveStart(event: TouchEvent): void;
  move(event: TouchEvent): void;
  movePend(event: TouchEvent): void;
  resetMove(): void;

  zoomStart(event: TouchEvent): void;
  zoom(event: TouchEvent): void;
  zoomPend(event: TouchEvent): void;
  toggleZoom(): void;

  switch(): void;

  detectDoubleClick(event: TouchEvent): boolean;

  onTouchStart(event: TouchEvent): void;
  onTouchMove(event: TouchEvent): void;
  onTouchEnd(event: TouchEvent): void;
}

export interface ImagePreviewEvents {
  onChange?(activeIndex: number): void;
  onScale?(scale: number): void;
  onOpen?(event?: Event): void;
  onOpened?(event?: Event): void;
  onClose?(event?: Event): void;
  onClosed?(event?: Event): void;
}

export interface ImagePreviewScopedSlots {
  close?: (props: {
    onClose: any;
    position: ImagePreviewCloseButtonPosition;
  }) => ScopedSlotReturnValue;
  indicators?: (props: { active: number }) => ScopedSlotReturnValue;
}

// non-reactive
export interface ImagePreviewDataExtra {
  bindStatus: boolean;

  swipeWidth: number;
  swipeHeight: number;

  currentWidth: number;
  currentHeight: number;

  edgeLeft: number;
  edgeRight: number;
  edgeTop: number;
  edgeBottom: number;

  startCurrentX: number;
  startCurrentY: number;

  startScale: number;

  swipeTimer: number | undefined;
  lastClickTime: number | undefined;
  lastDoubleClickTime: number | undefined;

  onOpen(event?: Event): void;
  onOpened(event?: Event): void;
  onClose(event?: Event): void;
  onClosed(event?: Event): void;

  $refs: {
    swipe: HTMLDivElement;
    current?: HTMLImageElement;
  };
  $scopedSlots: ImagePreviewScopedSlots;
}

type ImagePreviewInstance = CombinedVueInstance<
  PopupMixinInstance,
  ImagePreviewData,
  ImagePreviewMethods,
  {},
  ImagePreviewPropsInit
> &
  ImagePreviewDataExtra;

const componentOptions: ComponentOptions<
  Vue,
  () => ImagePreviewData,
  ImagePreviewMethods,
  {},
  PropsDefinition<ImagePreviewProps>
> = {
  mixins: [
    PopupMixin,
    BindEventMixin(function (this: ImagePreviewInstance, _bind, isBind) {
      this.handlePopstate(isBind && this.closeOnPopstate);
    }),
  ],

  data() {
    return {
      moving: false,
      zooming: false,
      toggleZooming: false,
      switching: false,

      currentIndex: 0,
      currentX: 0,
      currentY: 0,
      currentZ: 0,
      currentOpacity: 1,

      adjacentIndex: -1,
      adjacentX: 0,

      scale: 1,
      lastScale: 1,
    };
  },

  props: {
    images: {
      type: Array,
      required: true,
      validator: value => {
        return Array.isArray(value) && value.every(i => typeof i === 'string');
      },
    },
    startIndex: {
      type: Number,
      default: 0,
    },
    swipeDuration: {
      type: Number,
      default: 200,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    maxZoom: {
      type: Number,
      default: 3,
    },
    minZoom: {
      type: Number,
      default: 1,
    },
    asyncClose: {
      type: Boolean,
      default: false,
    },
    closeOnPopstate: {
      type: Boolean,
      default: true,
    },
    showCloseButton: {
      type: Boolean,
      default: false,
    },
    closeButtonPosition: {
      type: String as () => ImagePreviewCloseButtonPosition,
      default: 'top-right',
      validator: value => !!value && CLOSE_ICON_POSITIONS.includes(value),
    },
    showIndicators: {
      type: Boolean,
      default: true,
    },
    // override portal mixin
    appendToBody: {
      type: Boolean,
      default: true,
    },
    // override popup mixin
    overlay: {
      type: Boolean,
      default: true,
    },
    overlayStyle: {
      type: Object,
      default() {
        return {
          backgroundColor: '#000',
        };
      },
    },
  },

  watch: {
    value(this: ImagePreviewInstance, value) {
      if (value) {
        this.onOpen();
      } else {
        this.onClose();
      }
    },
    closeOnPopstate(this: ImagePreviewInstance, val) {
      this.handlePopstate(val);
    },
  },

  created(this: ImagePreviewInstance) {
    this.currentIndex = clamp(this.startIndex, 0, this.images.length);

    this.bindStatus = false;

    this.swipeWidth = 0;
    this.swipeHeight = 0;
    this.currentWidth = 0;
    this.currentHeight = 0;

    this.startCurrentY = 0;
    this.startCurrentX = 0;

    this.startScale = 1;

    const createEmitter = (eventName: string) => (event?: Event) => this.$emit(eventName, event);
    this.onOpen = createEmitter('open');
    this.onOpened = createEmitter('opened');
    this.onClose = createEmitter('close');
    const onClosed = createEmitter('closed');
    this.onClosed = event => {
      this.resetMove();
      onClosed(event);
    };
  },

  methods: {
    handlePopstate(this: ImagePreviewInstance, isBind) {
      if (this.$isServer) {
        return;
      }

      if (this.bindStatus !== isBind) {
        this.bindStatus = isBind;
        const action = isBind ? on : off;
        action(window, 'popstate', () => {
          this.close();
        });
      }
    },

    moveStart(this: ImagePreviewInstance, _event) {
      const {
        scale,
        $refs: { swipe, current },
      } = this;
      const swipeWidth = swipe.clientWidth;
      const swipeHeight = swipe.clientHeight;
      const currentWidth = (current && current.clientWidth * scale) || 0;
      const currentHeight = (current && current.clientHeight * scale) || 0;
      const edgeLeft = ((swipeWidth - currentWidth) / 2) * (swipeWidth < currentWidth ? 1 : -1);
      const edgeRight = -edgeLeft;
      const edgeTop = ((swipeHeight - currentHeight) / 2) * (swipeHeight < currentHeight ? 1 : -1);
      const edgeBottom = -edgeTop;

      this.swipeWidth = swipeWidth;
      this.swipeHeight = swipeHeight;
      this.currentWidth = currentWidth;
      this.currentHeight = currentHeight;
      this.edgeLeft = edgeLeft;
      this.edgeRight = edgeRight;
      this.edgeTop = edgeTop;
      this.edgeBottom = edgeBottom;

      raf(() => {
        this.moving = true;
      });
    },

    move(this: ImagePreviewInstance) {
      const {
        deltaX,
        deltaY,
        direction,

        currentIndex,

        swipeWidth,
        swipeHeight,
        edgeLeft,
        edgeRight,
        edgeTop,
        edgeBottom,

        startCurrentX,
        startCurrentY,

        images: { length },
        loop,
      } = this;

      if (this.zooming) {
        const currentX = clamp(deltaX + startCurrentX, edgeLeft, edgeRight);
        const currentY = clamp(deltaY + startCurrentY, edgeTop, edgeBottom);
        raf(() => {
          this.currentX = currentX;
          this.currentY = currentY;
        });
        return;
      }

      if (this.moving) {
        let currentX = startCurrentX + deltaX;
        let currentY = startCurrentY + deltaY;
        let currentZ = 0;
        let currentOpacity = 1;
        let adjacentIndex = -1;
        let adjacentX = 0;

        switch (direction) {
          case 'vertical':
            currentX = 0;
            currentZ = -Math.abs(currentY);
            currentOpacity = clamp((swipeHeight + currentZ * 2) / swipeHeight, 0, 1);
            break;

          case 'horizontal':
            currentY = 0;
          default:
            if (deltaX > 0) {
              adjacentIndex = getCorrectIndexInArray(length, currentIndex - 1);
              adjacentX = currentX - swipeWidth;
            } else {
              adjacentIndex = getCorrectIndexInArray(length, currentIndex + 1);
              adjacentX = currentX + swipeWidth;
            }
            break;
        }

        const outOfRange =
          !loop &&
          ((currentX > 0 && adjacentIndex > currentIndex) ||
            (currentX < 0 && adjacentIndex < currentIndex));
        if (outOfRange || adjacentIndex === currentIndex) {
          adjacentIndex = -1;
          adjacentX = 0;
        }

        raf(() => {
          this.currentX = currentX;
          this.currentY = currentY;
          this.currentZ = currentZ;
          this.currentOpacity = currentOpacity;
          this.adjacentIndex = adjacentIndex;
          this.adjacentX = adjacentX;
        });
      }
    },

    movePend(this: ImagePreviewInstance, _event) {
      raf(() => {
        this.startCurrentX = this.currentX;
        this.startCurrentY = this.currentY;
      });
    },

    resetMove(this: ImagePreviewInstance) {
      raf(() => {
        this.currentX = 0;
        this.currentY = 0;
        this.currentZ = 0;
        this.currentOpacity = 1;
        this.adjacentIndex = -1;
        this.adjacentX = 0;
        this.startCurrentX = 0;
        this.startCurrentY = 0;
        this.scale = 1;
      });
    },

    zoomStart(this: ImagePreviewInstance, _event) {
      raf(() => {
        this.moving = false;
        this.zooming = true;
        this.scale = this.startScale;
        this.startCurrentX = this.currentX;
        this.startCurrentY = this.currentY;
      });
    },

    zoom(this: ImagePreviewInstance, _event) {
      const scale = clamp(
        (this.startScale * this.scaleDistance) / this.startScaleDistance,
        this.minZoom,
        this.maxZoom,
      );
      raf(() => {
        this.scale = scale;
        this.$emit('scale', scale);
      });
    },

    zoomPend(this: ImagePreviewInstance, _event) {
      raf(() => {
        this.startScale = this.scale;
      });
    },

    toggleZoom(this: ImagePreviewInstance) {
      const { zooming } = this;
      raf(() => {
        this.toggleZooming = true;

        this.currentY = 0;
        this.currentX = 0;
        this.adjacentIndex = -1;

        this.scale = zooming ? 1 : this.maxZoom;

        this.startScale = this.scale;
      });
      this.swipeTimer = window.setTimeout(
        () =>
          raf(() => {
            this.zooming = !zooming;
            this.toggleZooming = false;
          }),
        this.swipeDuration,
      );
    },

    switch(this: ImagePreviewInstance) {
      const {
        currentIndex: adjacentIndex,
        currentX,
        adjacentIndex: currentIndex,
        swipeWidth,
        swipeDuration,
      } = this;

      raf(() => {
        this.moving = false;
        this.switching = true;

        this.currentIndex = currentIndex;
        this.currentY = 0;
        this.currentX = 0;

        this.adjacentIndex = adjacentIndex;
        this.adjacentX = currentX > 0 ? swipeWidth : -swipeWidth;

        this.$emit('change', currentIndex);
      });
      this.swipeTimer = window.setTimeout(
        () =>
          raf(() => {
            this.switching = false;
            this.adjacentIndex = -1;
            this.startCurrentX = 0;
            this.startCurrentY = 0;
          }),
        swipeDuration,
      );
    },

    detectDoubleClick(this: ImagePreviewInstance, event): boolean {
      if (event.touches.length !== 0) {
        return false;
      }
      const { lastClickTime, lastDoubleClickTime } = this;
      const currentClickTime = Date.now();
      this.lastClickTime = currentClickTime;
      if (lastDoubleClickTime && currentClickTime - lastDoubleClickTime < 200) {
        return false;
      }
      if (lastClickTime && currentClickTime - lastClickTime < 200) {
        this.lastDoubleClickTime = currentClickTime;
        return true;
      }
      return false;
    },

    onTouchStart(this: ImagePreviewInstance, event) {
      preventDefault(event);
      this.touchStart(event);
      if (this.toggleZooming || this.switching) {
        return;
      }
      // if (event.touches.length === 2 && !this.moving) {
      //   this.zoomStart(event);
      //   return;
      // }
      if (event.touches.length === 1) {
        this.moveStart(event);
        return;
      }
    },

    onTouchMove(this: ImagePreviewInstance, event) {
      preventDefault(event);
      this.touchMove(event);
      if (this.toggleZooming || this.switching) {
        return;
      }
      // if (event.touches.length > 1 && this.zooming) {
      //   this.zoom(event);
      //   return;
      // }
      if (event.touches.length === 1 && this.moving) {
        this.move(event);
        return;
      }
    },

    onTouchEnd(this: ImagePreviewInstance, event) {
      preventDefault(event);
      const {
        toggleZooming,
        switching,
        adjacentIndex,
        direction,
        currentX,
        currentY,
        asyncClose,
      } = this;
      const {
        touches: { length },
      } = event;
      if (toggleZooming || switching) {
        return;
      }
      // if (this.detectDoubleClick(event)) {
      //   this.toggleZoom();
      //   return;
      // }
      // if (length === 1 && this.zooming) {
      //   this.zoomPend(event);
      //   return;
      // }
      if (length > 0) {
        return;
      }
      // if (zooming) {
      //   this.movePend(event);
      //   return;
      // }
      if (
        adjacentIndex > -1 &&
        direction === 'horizontal' &&
        Math.abs(currentX) >= MIN_DISTANCE_SWITCH
      ) {
        this.switch();
        return;
      }
      if (
        !asyncClose &&
        ((direction === 'vertical' && Math.abs(currentY) >= MIN_DISTANCE_CLOSE) || direction === '')
      ) {
        this.close();
        return;
      }
      this.resetMove();
    },
  },

  render(this: ImagePreviewInstance) {
    if (!this.shouldRender) {
      return h();
    }

    const brandName = createBrandName();
    const {
      value,
      toggleZooming,
      switching,
      currentIndex,
      currentX,
      currentY,
      currentZ,
      currentOpacity,
      adjacentIndex,
      adjacentX,
      scale,
      images,
      swipeDuration,
      showCloseButton,
      closeButtonPosition,
      showIndicators,
    } = this;
    const changing = switching || toggleZooming;

    const classes = [bem(), { changing }];
    const itemClasses = bem('item');
    const imageClasses = bem('image');

    const currentItemStyle = {
      top: `${currentY}px`,
      left: `${currentX}px`,
      'transition-duration': (changing && `${swipeDuration}ms`) || null,
    };
    const adjacentItemStyle = {
      left: `${adjacentX}px`,
      'transition-duration': (changing && `${swipeDuration}ms`) || null,
    };
    const currentImageStyle = {
      opacity: (currentOpacity < 1 && currentOpacity) || null,
      transform:
        (scale !== 1 && `scale(${scale})`) ||
        (currentZ !== 0 && `perspective(400px) translate3d(0,0,${currentZ}px)`) ||
        null,
      'transition-duration': (toggleZooming && `${swipeDuration}ms`) || null,
    };

    const {
      $scopedSlots: {
        close = ({ onClose, position }) => (
          <button key="close" class={bem('close-button', position)} onClick={onClose}>
            <i class={bem('close-icon')} domPropsInnerHTML={closeIcon} />
          </button>
        ),
        indicators = ({ active }) => (
          <div key="indicators" class={bem('indicators')}>
            {images.map((_image, index) => (
              <i class={bem('indicator-item', { active: index === active })} />
            ))}
          </div>
        ),
      },
    } = this;

    return (
      <transition
        name={`${brandName}fade`}
        onAfterEnter={this.onOpened}
        onAfterLeave={this.onClosed}
      >
        <div v-show={value} class={classes}>
          <div
            key="swipe"
            ref="swipe"
            class={bem('swipe')}
            onTouchstart={this.onTouchStart}
            onTouchmove={this.onTouchMove}
            onTouchend={this.onTouchEnd}
            onTouchcancel={this.onTouchEnd}
          >
            {images.map((image, index) => (
              <div
                key={image}
                class={itemClasses}
                style={
                  (index === currentIndex && currentItemStyle) ||
                  (index === adjacentIndex && adjacentItemStyle) ||
                  undefined
                }
              >
                <img
                  ref={index === currentIndex ? 'current' : undefined}
                  src={image}
                  class={imageClasses}
                  style={(index === currentIndex && currentImageStyle) || undefined}
                />
              </div>
            ))}
          </div>
          {!!showCloseButton && close({ onClose: this.close, position: closeButtonPosition })}
          {!!showIndicators && indicators({ active: currentIndex })}
        </div>
      </transition>
    );
  },
};

const byComponentOptions = createComponent<
  ImagePreviewProps,
  ImagePreviewEvents,
  ImagePreviewScopedSlots
>(componentOptions as any);

const { install: installComponent } = byComponentOptions as ByComponentOptions;

let $$Vue: VueConstructor | undefined;

export type InvokeImagePreviewOptions = ImagePreviewProps &
  ImagePreviewEvents &
  ImagePreviewScopedSlots;

declare module 'vue/types/vue' {
  interface Vue {
    $imagePreview(options: InvokeImagePreviewOptions): ImagePreviewInstance | undefined;
  }
  interface VueConstructor<V extends Vue = Vue> {
    $imagePreview(options: InvokeImagePreviewOptions): ImagePreviewInstance | undefined;
  }
}

function install(this: ComponentOptions<Vue>, $Vue: VueConstructor) {
  if ($$Vue && $$Vue === $Vue) {
    return;
  }
  $$Vue = $Vue;

  function invokeImagePreview(
    options: InvokeImagePreviewOptions,
  ): ImagePreviewInstance | undefined {
    if (isServer) {
      return undefined;
    }

    const handler = () => {};
    const {
      onChange = handler,
      onScale = handler,
      onOpen = handler,
      onOpened = handler,
      onClose = handler,
      onClosed = handler,

      close,
      indicators,

      ...props
    } = options;

    const container = new $Vue({
      el: document.createElement('div'),
      data() {
        return { value: false };
      },
      render(this: { value: boolean }, h) {
        return h(componentOptions, {
          ref: 'instance',
          props: {
            ...props,
            value: this.value,
            lazyRender: false,
          },
          scopedSlots: { close, indicators },
          on: {
            input: (value: boolean) => (this.value = value),
            change: onChange,
            scale: onScale,
            open: onOpen,
            opened: onOpened,
            close: onClose,
            closed: [onClosed, () => container.$destroy()],
          },
        });
      },
    });

    const instance = container.$refs.instance as ImagePreviewInstance;

    instance.$emit('input', true);

    return instance;
  }

  installComponent!.call(this, $Vue as VueConstructor);
  Object.defineProperty($Vue.prototype, '$imagePreview', {
    configurable: false,
    value: invokeImagePreview,
  });
  Object.defineProperty($Vue, '$imagePreview', {
    configurable: false,
    value: invokeImagePreview,
  });
}

(byComponentOptions as ByComponentOptions).install = install;

export default byComponentOptions;
