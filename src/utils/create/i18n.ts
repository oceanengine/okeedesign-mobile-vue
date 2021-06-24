import { camelize, translate } from '../format/string';
import locale from '../../locale';

export function createI18N(name: string) {
  const prefix = name ? camelize(name) + '.' : '';
  return function (path: string, ...args: any[]): string {
    const message = locale.t(prefix + path) || locale.t(path);
    return translate(message, args);
  };
}
