// @ts-ignore
import { generate } from '../color-palette';
import config from './aweme.json';

const baseColorKeys = ['primary-color', 'success-color', 'warning-color', 'danger-color'];

baseColorKeys.forEach(key => {
  const color = config[key];
  if (color) {
    const colors = generate(color);
    const colorIndex = [6, 5, 4, 2, 0];
    colorIndex.forEach((index, i) => {
      config[`${key}-${i + 1}`] = colors[index];
    });
  }
});

export default config;
