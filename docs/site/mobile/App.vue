<template>
  <div id="app" ref="app" :class="'app docs' + `${aweme ? ' aweme' : ''}`">
    <template v-if="onHomePath">
      <div :class="isScrollTop ? 'demo-logo demo-logo-out' : 'demo-logo demo-logo-in'">
        <div class="demo-logo-title" v-bind:style="{ color: !this.aweme ? '#333333' : '#338AFF' }">
          Mobile
        </div>
        <div class="demo-logo_text'">{{ logoText }}</div>
      </div>
      <div class="demo-home">
        <div
          class="demo-home-nav"
          v-bind:style="{
            position: 'sticky',
            top: '0px',
            paddingTop: '20px',
            backgroundColor: !this.aweme ? 'white' : '#161823',
          }"
        >
          <div
            class="demo-home-nav-item"
            v-for="(item, index) in catalogue"
            :key="index"
            @click="onChangeActive(index, item.label)"
            v-bind:style="{
              color: activeItem === index ? '#338AFF' : '#999999',
              backgroundColor: activeItem === index ? '#EBF3FF' : '#FAFAFA',
            }"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="demo-home-card">
          <div v-for="(items, index) in catalogue" :key="index" ref="navItem">
            <div class="demo-home-card-title" :id="items.label">{{ items.label }}</div>
            <div
              class="demo-home-card-cell"
              v-for="(cell, index2) in items.list"
              :key="index2"
              @click="goDetail(cell.path)"
            >
              {{ cell.label }}
              <div class="demo-home-card-cell-icon-box">
                <img v-bind:src="arrowRight" alt="" class="demo-home-card-cell-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-show="showDemoBox" class="demo-box">
      <router-view />
    </div>
    <div v-for="(obj, key) in category" :key="key" :class="bem('category')">
      <div :class="bem('category__title')">
        {{ key }}
      </div>
      <div v-for="(item, index) in obj" :key="index" :class="bem('category__cell')">
        <div>{{ item.label }}</div>
        <input
          v-model="item.value"
          type="text"
          :placeholder="`请输入${item.label}`"
          @change="varChange(item)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import varCategory from '../var/index';
import config from '../config';
import { camelize, translate } from '../../../src/utils/format/string';
import { Locale } from '../../../src/index';
import zhCN from '../../../src/locale/lang/zh-CN';
import enUS from '../../../src/locale/lang/en-US';

import themeAwemeJson from '../../../src/theme/aweme.json';
import arrowRight from '../../../src/components/icon/icon/arrow-right.svg';
import './index.less';

export default {
  name: 'Demo',
  data() {
    return {
      active: [],
      aweme: false,
      activeItem: 0,
      isScrollTop: true,
      arrowRight: arrowRight,
      // isScrollTop: true
    };
  },
  computed: {
    catalogue() {
      return config;
    },
    category() {
      let result = {};
      let name = this.$route.name;
      if (name) {
        name = name.split('/')[1];
        if (varCategory[name]) {
          result[name] = varCategory[name];
        }
      }

      if (varCategory['base'] && varCategory['base'].length) {
        result['base'] = varCategory['base'];

        const noShowKeyArr = [
          'blue',
          'cyan',
          'red',
          'orange',
          'yellow',
          'green',
          'animation-duration-base',
          'animation-duration-fast',
        ];

        noShowKeyArr.forEach(key => {
          result['base'] = result['base'].filter(item => {
            return noShowKeyArr.indexOf(item.label) === -1;
          });
        });
      }

      return {};
    },
    onHomePath() {
      return !this.$route.name;
    },
    logoText() {
      return this.$bytedLanguage === 'zh-CN'
        ? '轻量、可靠的 Vue 组件库'
        : 'lightweight, reliable Vue component library';
    },
    showDemoBox() {
      return Boolean(this.$route.name);
    },
  },
  created() {
    /**
     * 监听父级iframe hash变化/
     * 监听父级语言切换 hash变化
     */
    if (
      window.location.href.indexOf('theme=aweme') > -1 ||
      (window.Global && window.Global.theme && window.Global.theme === 'aweme')
    ) {
      this.aweme = true;

      Object.keys(themeAwemeJson).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, themeAwemeJson[key]);
      });
    }
    var cssRootJson = {};
    Object.keys(themeAwemeJson).forEach(key => {
      cssRootJson[key] = getComputedStyle(document.documentElement).getPropertyValue(`--${key}`);
    });

    window.addEventListener(
      'message',
      event => {
        if (event && event.data) {
          const { hash, bytedLang, theme } = event.data;
          if (hash) {
            this.$router.push({
              path: hash.replace('#', ''),
            });
            this.$refs['app'].scrollTop = 0;
          }

          if (bytedLang) {
            bytedLang === 'en-US' ? Locale.use('en-US', enUS) : Locale.use('zh-CN', zhCN);
            this.$bytedLanguage = bytedLang;

            document.documentElement.lang = bytedLang === 'en-US' ? 'en' : 'zh';
          }

          if (theme !== undefined) {
            this.aweme = theme === 'aweme';
            var json = theme ? themeAwemeJson : cssRootJson;
            Object.keys(json).forEach(key => {
              document.documentElement.style.setProperty(`--${key}`, json[key]);
            });
          }
        }
      },
      false,
    );
  },
  methods: {
    getT(path) {
      /**
       * 国际化处理函数
       */
      let name = path.replace('/', '');
      name = camelize(name);
      name = name.split('');
      name[0] = name[0].toUpperCase();
      name = name.join('');
      return this.t(`demo${name}.name`);
    },
    goDetail(path) {
      /**
       * 跳转到对应的demo页
       */
      this.activeItem = 0;
      this.$router.push({
        path: `${path}`,
      });
      this.$refs['app'].scrollTop = 0;
    },
    varChange(item) {
      /**
       * 换肤设置动态改变全局变量
       */
      let value = item.value;
      if (value.indexOf('#') === -1 && value.indexOf('px') > -1) {
        value = Number(value.replace(/[^0-9]/gi, '')) / 20 + 'rem';
      }
      document.documentElement.style.setProperty(`--${item.label}`, value);
    },
    bem(name) {
      return `docs__${name}`;
    },
    onChangeActive(index, label) {
      this.activeItem = index;
      var element = this.$refs.navItem[index];
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = offsetPosition + elementPosition;
      var scrollingTop = this.$refs['app'].scrollTop;
      var offset = index === 0 ? 0 : elementPosition + scrollingTop - 65;
      this.$refs['app'].scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    },
    onScrollTop(v) {
      return (this.isScrollTop = v);
    },
  },
  watch: {
    onScroll(v) {
      this.isScrollTop = v;
    },
  },
};
</script>
<style lang="less">
.docs {
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  h2 {
    font-size: 24px;
    color: #2c2c2c;
    text-align: center;
    margin-top: 10px;
  }
  .demo {
    min-height: 100vh;
    padding: 0 16px;
    padding-bottom: 80px;
    box-sizing: border-box;
    &.picker {
      padding: 0 0;
    }
    &-box {
      background: #fafafa;
      min-height: 100vh;
    }
    &-cell {
    }
    .dome-title {
      .byted-icon {
        width: 20px;
        height: 20px;
        display: inline-flex;
        margin-right: 8px;
      }
    }
    .bui-doc-demo-block__card {
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04);
      border-radius: 4px;
      overflow: hidden;
    }
  }

  &.aweme {
    background: #161823;
    .demo-box {
      background: #161823;
    }
    .demo-cell {
      .demo-cell-header-title__left {
        color: rgba(255, 255, 255, 0.9);
      }
    }
    .dome-title {
      .dome-title-word {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  &__logo {
    padding: 64px 0 0 40px;
    &__text {
      font-size: 14px;
      line-height: 30px;
      color: #999999;
    }
  }
  &__catalogue {
    margin: 24px 16px 0 16px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    &::after {
      display: none;
    }

    .byted-collapse-item__wrapper {
      .byted-cell__title {
        color: #666666;
      }
    }
  }
  &__path {
    &:active {
      opacity: 0.8;
    }
    &__cell {
      margin: 10px 0;
      color: #0278ff;
      text-align: center;
      font-size: 20px;
    }
  }
  &__category {
    padding: 0 12px;
    &__title {
      font-size: 18px;
      line-height: 26 / 18;
      padding: 8px 0;
    }
    &__cell {
      font-size: 0;
      padding: 4px 0;
      input {
        display: inline-block;
        font-size: 16px;
      }
      div {
        width: 120px;
        margin: 0 16px;
        display: inline-block;
        font-size: 12px;
      }
    }
  }
}

// .demo-logo-title {
//   color: #0278ff;
// }
// .demo-home-nav-dark {
//   // background-color: #161823;
// }
</style>
