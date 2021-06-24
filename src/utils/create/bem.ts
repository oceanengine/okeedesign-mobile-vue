/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b('text', 'color') // 'button__text button__text--color'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['primary', 'large']) // 'button button--primary button--large'
 */

export type Mod = string | { [key: string]: any };
export type Mods = Mod | Mod[];

const ELEMENT = '__';
const MODS = '--';

function join(name: string, el?: string, symbol?: string): string {
  return el ? name + symbol + el : name;
}
function prefix(name: string, mods: Mods): string {
  if (typeof mods === 'string') {
    return join(name, mods, MODS);
  }

  if (Array.isArray(mods)) {
    return mods.map(item => prefix(name, item)).join(' ');
  }

  const ret: string[] = [];
  if (mods) {
    Object.keys(mods).forEach(key => {
      if (mods[key]) {
        ret.push(name + MODS + key);
      }
    });
  }

  return ret.join(' ');
}

export function createBEM(name: string) {
  return function (el?: Mods, mods?: Mods): string {
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }

    el = join(name, el as string | undefined, ELEMENT);

    if (mods) {
      return `${el} ${prefix(el, mods)}`.trim();
    } else {
      return el;
    }
  };
}

export function addClass(
  base: string,
  ...classNames: (string | undefined | null | boolean | Array<string>)[]
): string {
  let result = base;
  for (let i = 0; i < classNames.length; i++) {
    const className = classNames[i];
    if (className) {
      if (Array.isArray(className)) {
        result = addClass(result, className);
      } else {
        result = `${result} ${className}`;
      }
    }
  }
  return result;
}
