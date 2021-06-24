import i18n from './i18n';
export { i18n };

const ua: string = navigator.userAgent.toLowerCase();
export const isMobile: boolean = /ios|iphone|ipod|ipad|android/.test(ua);

/**
 * this interface from '@types/webpack-env'
 */
export interface RequireContext {
  keys(): string[];
  (id: string): any;
  <T>(id: string): T;
  resolve(id: string): string;
  id: string;
}
export interface ImportMap {
  [key: string]: RequireContext;
}

export function importAll(map: ImportMap, r: RequireContext) {
  r.keys().forEach(key => {
    map[key] = r(key);
  });
}
