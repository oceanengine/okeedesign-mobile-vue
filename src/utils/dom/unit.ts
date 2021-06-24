/**
 * 串转px或者rem
 */

let unit = 'px';
export function value2DomUnit(value: number | string = '', multiple = 1): string {
  if (value === '') {
    return '';
  }

  if (typeof value === 'number') {
    return `${value * multiple}px`;
  } else {
    unit = value.indexOf('rem') > -1 ? 'rem' : 'px';
    value = value.replace(/[^\d.]/g, '').trim();
    return `${Number(value) * multiple}${unit}`;
  }
}

export function value2Number(value: number | string): number {
  if (typeof value === 'number') {
    return value;
  } else {
    value = value.replace(/[^\d.]/g, '').trim();
    value = Number(value);
    return Number.isNaN(value) ? 0 : value;
  }
}
