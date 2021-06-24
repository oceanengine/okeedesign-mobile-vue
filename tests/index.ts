import { mount } from '@vue/test-utils';
import Vue from 'vue';

export function later(delay: number = 0): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// prevent vue warning log
Vue.config.silent = true;
export * from './dom';
export * from './event';
export * from './utils';
export { mount };
