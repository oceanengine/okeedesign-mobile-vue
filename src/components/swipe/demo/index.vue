<template>
  <div class="demo swipe">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basicUsage')">
      <byted-swipe>
        <byted-swipe-item>
          <img src="../pics/pic.svg" width="100%" height="100%" alt="pic" />
          <span class="text">0</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic2.svg" width="100%" height="100%" alt="pic" />
          <span class="text">1</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic3.svg" width="100%" height="100%" alt="pic" />
          <span class="text">2</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic4.svg" width="100%" height="100%" alt="pic" />
          <span class="text">3</span>
        </byted-swipe-item>
      </byted-swipe>
    </demo-cell>

    <demo-cell :title="t('autoplay')">
      <byted-swipe :autoplay="2000">
        <byted-swipe-item>
          <img src="../pics/pic2.svg" width="100%" height="100%" alt="pic" />
          <span class="text">0</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic.svg" width="100%" height="100%" alt="pic" />
          <span class="text">1</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic3.svg" width="100%" height="100%" alt="pic" />
          <span class="text">2</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic4.svg" width="100%" height="100%" alt="pic" />
          <span class="text">3</span>
        </byted-swipe-item>
      </byted-swipe>
    </demo-cell>

    <demo-cell :title="t('forbiddenTouch')">
      <byted-swipe :autoplay="2000" :touchable="false">
        <byted-swipe-item>
          <img src="../pics/pic3.svg" width="100%" height="100%" alt="pic" />
          <span class="text">0</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic2.svg" width="100%" height="100%" alt="pic" />
          <span class="text">1</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic.svg" width="100%" height="100%" alt="pic" />
          <span class="text">2</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic4.svg" width="100%" height="100%" alt="pic" />
          <span class="text">3</span>
        </byted-swipe-item>
      </byted-swipe>
    </demo-cell>

    <demo-cell :title="t('forbiddenLoop')">
      <byted-swipe :loop="false" :initial-swipe="1">
        <byted-swipe-item>
          <img src="../pics/pic.svg" width="100%" height="100%" alt="pic" />
          <span class="text">0</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic2.svg" width="100%" height="100%" alt="pic" />
          <span class="text">1</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic3.svg" width="100%" height="100%" alt="pic" />
          <span class="text">2</span>
        </byted-swipe-item>
      </byted-swipe>
    </demo-cell>

    <demo-cell :title="t('indicatorColor')">
      <byted-swipe indicator-color="#0278FF">
        <byted-swipe-item>
          <img src="../pics/pic4.svg" width="100%" height="100%" alt="pic" />
          <span class="text">0</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic2.svg" width="100%" height="100%" alt="pic" />
          <span class="text">1</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic3.svg" width="100%" height="100%" alt="pic" />
          <span class="text">2</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic.svg" width="100%" height="100%" alt="pic" />
          <span class="text">3</span>
        </byted-swipe-item>
      </byted-swipe>
    </demo-cell>

    <demo-cell :title="t('customIndicator')">
      <byted-swipe @change="onChange">
        <byted-swipe-item>
          <img src="../pics/pic.svg" width="100%" height="100%" alt="pic" />
          <span class="text">1</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic2.svg" width="100%" height="100%" alt="pic" />
          <span class="text">2</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic3.svg" width="100%" height="100%" alt="pic" />
          <span class="text">3</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic4.svg" width="100%" height="100%" alt="pic" />
          <span class="text">4</span>
        </byted-swipe-item>
        <div slot="indicator" class="custom-indicator">{{ current + 1 }}/4</div>
      </byted-swipe>
    </demo-cell>

    <demo-cell :title="t('dataBinding')">
      <byted-swipe ref="boundSwipe" v-model="boundValue">
        <byted-swipe-item>
          <img src="../pics/pic2.svg" width="100%" height="100%" alt="pic" />
          <span class="text">0</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic.svg" width="100%" height="100%" alt="pic" />
          <span class="text">1</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic3.svg" width="100%" height="100%" alt="pic" />
          <span class="text">2</span>
        </byted-swipe-item>
        <byted-swipe-item>
          <img src="../pics/pic4.svg" width="100%" height="100%" alt="pic" />
          <span class="text">3</span>
        </byted-swipe-item>
      </byted-swipe>
      <div class="button-wrap">
        <byted-button
          text="<"
          plain
          type="primary"
          square
          size="mini"
          @click="() => this.$refs.boundSwipe.previous()"
        />
        <byted-button
          v-for="i of 4"
          :key="i - 1"
          :text="(i - 1).toString()"
          :plain="i - 1 !== boundValue"
          :fade="i - 1 === boundValue"
          type="primary"
          square
          size="mini"
          @click="boundValue = i - 1"
        />
        <byted-button
          text=">"
          plain
          type="primary"
          square
          size="mini"
          @click="() => this.$refs.boundSwipe.next()"
        />
      </div>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '轮播',
      basicUsage: '基础用法',
      autoplay: '自动播放',
      forbiddenTouch: '禁用手势',
      forbiddenLoop: '禁止循环播放',
      indicatorColor: '指示器颜色',
      customIndicator: '自定义指示器',
      dataBinding: '受控模式（双向绑定）',
    },
    'en-US': {
      name: 'Swipe',
      basicUsage: 'Basic Usage',
      autoplay: 'Auto Play',
      forbiddenTouch: 'Forbidden Touch',
      forbiddenLoop: 'Forbidden Loop',
      indicatorColor: 'Indicator Color',
      customIndicator: 'Custom Indicator',
      dataBinding: 'Controlled Mode (Two-way Binding)',
    },
  },
  components: {
    demoCell,
    // demoTitle,
    // BytedIconModuleCarousel,
  },
  data() {
    return {
      current: 0,
      boundValue: 0,
    };
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
  },
};
</script>
<style lang="less">
.demo {
  &.swipe {
    .show {
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
    .byted-swipe-item {
      .show {
        color: #fff;
      }
      &:nth-child(odd) {
        .show {
          background: #58a0ff;
        }
      }
      &:nth-child(even) {
        .show {
          background: #a1caff;
        }
      }
    }
    .custom-indicator {
      position: absolute;
      right: 0;
      bottom: 0;
      padding: 4px 6px;
      background: rgba(255, 255, 255, 0.6);
    }

    .button-wrap {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      margin-top: 16px;

      > *:not(:last-child) {
        margin-right: 4px;
      }
    }
  }
}

.text {
  position: absolute;
  color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
