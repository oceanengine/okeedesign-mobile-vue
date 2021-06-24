import Vue from 'vue';

export { createNamespace, createBrandName } from './create';
export { value2DomUnit, value2Number } from './dom/unit';

export const isServer: boolean = Vue.prototype.$isServer;

export function isObj(x: any): boolean {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

export function isNumber(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value);
}

export function isDef(value: any): boolean {
  return value !== undefined && value !== null;
}

export function get(object: any, path: string): any {
  const keys = path.split('.');
  let result = object;
  keys.forEach(key => {
    result = isDef(result[key]) ? result[key] : '';
  });
  return result;
}
