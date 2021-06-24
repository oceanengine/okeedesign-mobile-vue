import components from './components';
import varJson from '../../../src/style/var.config.json';

const baseKey = 'base';
const category = {
  [baseKey]: [],
};
const componentsKey = {};

components.forEach(component => {
  Object.keys(varJson).forEach(key => {
    if (key.indexOf(`${component}-`) > -1) {
      componentsKey[key] = true;
      if (category[component]) {
        category[component].push({
          label: key,
          value: varJson[key],
        });
      } else {
        category[component] = [
          {
            label: key,
            value: varJson[key],
          },
        ];
      }
    }
  });
});

Object.keys(varJson).forEach(key => {
  if (!componentsKey[key]) {
    category[baseKey].push({
      label: key,
      value: varJson[key],
    });
  }
});

export default category;
