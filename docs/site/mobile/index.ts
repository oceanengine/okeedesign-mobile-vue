import Vue from 'vue';

import App from './App.vue';
import router from './router';
import { i18n } from '../utils';

import '../../../src/index.less';
import { install } from '../../../src/index';

if (process.env.NODE_ENV !== 'production') {
  Vue.config.productionTip = false;
}

// @ts-ignore
install(Vue);
Vue.mixin(i18n);

new Vue({
  el: '#app',
  render: h => h(App),
  router,
});
