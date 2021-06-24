/**
 * num 比较 min 与 max，取极限范围值
 */
export function range(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
