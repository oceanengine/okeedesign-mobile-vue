const fs = require('fs');
const path = require('path');
const uppercamelize = require('uppercamelcase');
const packageJson = require('../package.json');

/**
 * 生产环境root.less写入空 '//'
 */
if (process.env.NODE_ENV === 'production') {
  fs.writeFileSync(
    path.resolve(__dirname, '../src/style/root.less'),
    `//
`,
  );
}

/**
 * 自动生成全局样式入口文件
 */
const Components = fs.readdirSync(path.resolve(__dirname, '../src/components'));

const styleList = [];
Components.forEach(name => {
  if (!fs.existsSync(path.resolve(__dirname, `../src/components/${name}/index.less`))) {
    fs.writeFileSync(path.resolve(__dirname, `../src/components/${name}/index.less`), '');
  }
  styleList.push(`@import './components/${name}/index';`);
});

let content = `
// This file is auto gererated by build/build-entry.js
@import './style/index';
${styleList.join('\n')}
`;
fs.writeFileSync(path.join(__dirname, '../src/index.less'), content);

/**
 * 自动生成全局js入口文件
 */
const version = process.env.VERSION || packageJson.version;
const importList = Components.map(
  name => `import ${uppercamelize(name)} from './components/${name}';`,
);
const exportList = Components.map(name => `${uppercamelize(name)}`);
content = `
// This file is auto gererated by build/build-entry.js
import { VueConstructor } from 'vue/types';
import Locale from './locale';
${importList.join('\n')}

import { PluginObject, PluginFunction } from 'vue/types';

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

const version = '${version}';
const components = [
  Locale,
  ${exportList.join(',\n  ')}
];

export interface BUIPluginOptions {
  i18n?: (key: string, value: string) => string;
}

const install: PluginFunction<BUIPluginOptions> = (Vue, options) => {
  if (options && options.i18n) {
    Locale.i18n(options.i18n);
  }
  components.forEach(Component => {
    Vue.use(Component as PluginObject<unknown>);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  version,
  Locale,
  ${exportList.join(',\n  ')}
};

export default {
  install,
  version
} as PluginObject<unknown>;
`;
fs.writeFileSync(path.join(__dirname, '../src/index.ts'), content);

/**
 * 写入componets数组
 */
fs.writeFileSync(
  path.join(__dirname, '../docs/site/var/components.js'),
  `export default ${JSON.stringify(Components)}`,
);
