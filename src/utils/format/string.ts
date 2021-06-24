/**
 * 驼峰处理
 * b(byted-button) // 'bytedButton'
 */
const camelizeRE = /-(\w)/g;
export function camelize(str: string): string {
  return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;

/**
 * 获取字符长度
 * 数字英文算一个字符长度 汉字算两个字符长度
 */
export function getStringLen(str: string): number {
  return !str ? 0 : str.replace(/[^\x00-\xff]/g, 'oe').length;
}

/**
 * 多语言文案翻译
 * @param msg 源文案
 * @param options 格式化选项
 * @example
 * translate('normal text') // 'normal text'
 * translate('已选 {num} 项', { num: 10 }) // '已选 10 项'
 * translate('escape {{ brace }} ') // 'escape brace'
 */
export function translate(msg: string, options: any): string {
  if (options.length === 1 && typeof options[0] === 'object') {
    options = options[0];
  }

  if (!options || !options.hasOwnProperty) {
    options = {};
  }

  return msg.replace(RE_NARGS, (match, _prefix, i, index) => {
    let result;

    // escape {{}} to {}
    if (msg[index - 1] === '{' && msg[index + match.length] === '}') {
      return i;
    } else {
      // fill placeholder
      result = Object.prototype.hasOwnProperty.call(options, i) ? options[i] : null;
      if (result === null || result === undefined) {
        return '';
      }

      return result;
    }
  });
}
