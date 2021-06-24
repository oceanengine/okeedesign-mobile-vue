import Vue from 'vue';
import { deepAssign } from '../utils/json/deep-assign';
import defaultMessages from './lang/zh-CN';
import { get } from '../utils';

declare module 'vue/types/vue' {
  interface VueConstructor {
    util?: {
      defineReactive(obj: object, key: string, value: any): void;
    };
  }
}

const proto = Vue.prototype;

const { defineReactive } = Vue.util;

defineReactive(proto, '$bytedLanguage', 'zh-CN');
defineReactive(proto, '$bytedMessages', {
  'zh-CN': defaultMessages,
});

export default {
  messages() {
    return proto.$bytedMessages[proto.$bytedLanguage];
  },

  use(lang: string, messages?: object) {
    proto.$bytedLanguage = lang;
    this.add({ [lang]: messages });
  },

  add(messages = {}) {
    deepAssign(proto.$bytedMessages, messages);
  },

  _i18nTranslate: null,

  i18n(translateFunc) {
    if (translateFunc) {
      this._i18nTranslate = translateFunc;
    }
  },

  _t(key, value = '') {
    return get(this.messages(), key) || value;
  },

  t(key, value = '') {
    if (this._i18nTranslate) {
      return this._i18nTranslate(key, value);
    }
    return this._t(key, value);
  },
};
