import Vue from 'vue';
import Toast from '../toast';
import { createI18N } from '../../utils/create/i18n';

function Loading(message) {
  if (!message) message = `${createI18N('loading')('loading')}...`;
  return Toast({
    message,
    type: 'loading',
    duration: 0,
    overlay: false,
    forbidClick: true,
  });
}

Loading.install = () => {};

declare module 'vue/types/vue' {
  interface VueConstructor {
    $loading?: any;
  }
}

Vue.$loading = Vue.prototype.$loading = Loading;

export default Loading;
