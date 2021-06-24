const fs = require('fs');
const path = require('path');
const { generate } = require('@byte-design/color-palette');

const ignoreKeys = ['primary-color-', 'success-color-', 'warning-color-', 'danger-color-'];

function checkKey(key) {
  return !ignoreKeys.some(item => key.search(item) > -1);
}

function less2json(varPath) {
  const json = {};
  const less = fs.readFileSync(varPath).toString();
  const lines = less.split('\n');

  lines.forEach(line => {
    if (line.indexOf('@') > -1) {
      let key = line.split(':')[0];
      if (key && checkKey(key)) {
        key = key.replace('@', '').trim();
        let value = line.split(':')[1];
        if (value) {
          value = value.split('//')[0].split(';')[0].trim();
          json[key] = value;
        }
      }
    }
  });

  const baseColorKeys = ['primary-color', 'success-color', 'warning-color', 'danger-color'];

  baseColorKeys.forEach(key => {
    let value = json[key];
    if (value.indexOf('@') > -1) {
      value = value.substring(1);
      json[key] = json[value.trim()];
    }
  });

  baseColorKeys.forEach(key => {
    var color = json[key];
    if (color) {
      const colors = generate(color);
      const colorIndex = [6, 5, 4, 2, 0];
      colorIndex.forEach((index, i) => {
        json[`${key}-${i + 1}`] = colors[index];
      });
    }
  });

  Object.keys(json).forEach(key => {
    let valueArr = json[key].split(' ');
    valueArr.forEach((value, index) => {
      if (value[0] === '@') {
        value = value.substring(1);
        if (json[value]) {
          valueArr[index] = json[value];
        }
      }
    });

    json[key] = valueArr.join(' ');
  });

  // var.config.json
  const configJsonPath = path.join(__dirname, '../../src/style/var.config.json');
  fs.writeFileSync(configJsonPath, JSON.stringify(json));
}
module.exports = less2json;
