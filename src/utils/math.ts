export function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

/**
 * Get correct index in a array.
 * If the array is empty (length 0), return -1.
 * @param length The length of the array
 * @param rawIndex The raw index to process
 */
export function getCorrectIndexInArray(length: number, rawIndex: number): number {
  if (length <= 0) {
    return -1;
  }
  const index = rawIndex % length;
  if (index < 0) {
    return length + index;
  }
  return index;
}
