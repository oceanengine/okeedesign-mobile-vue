/**
 * 主题定制演示
 */
const fs = require('fs');
const path = require('path');
const LessVarMark = require('@byted/less-var-mark');
const less2json = require('./less2json');

const varJsonPath = path.join(__dirname, '../../src/style/var.config.json');
const rootLessPath = path.join(__dirname, '../../src/style/root.less');
const lessVarPath = path.join(__dirname, '../../src/style/var.less');

const awemeJson = require('../../src/theme/aweme.json');

let lessVars = {};
let lessMap = {};

// 清空 var.config.json
fs.writeFileSync(varJsonPath, '{}');

// 设置 var.config.json
less2json(lessVarPath);

// 获取 var.config.json
const configJson = require(varJsonPath);

// 设置 lessVars
Object.keys(awemeJson).forEach(key => {
  lessVars[key] = configJson[key];
});

// 清空 root.less
fs.writeFileSync(rootLessPath, '//');

// 写入root.less
const rootJson = {};
Object.keys(lessVars).forEach(key => {
  rootJson[`--${key}`] = lessVars[key];
});
fs.writeFileSync(
  rootLessPath,
  `
  /* stylelint-disable */
  :root${JSON.stringify(rootJson)}
  `
    .replace('}', ';}')
    .replace(/,/g, ';')
    .replace(/"/g, ''),
);

// 设置 lessMap
const lessVarMark = new LessVarMark();
const lessVarJson = lessVarMark.variables2Json(fs.readFileSync(`${lessVarPath}`, 'utf-8'));
lessMap = lessVarMark.getVariablesMap(lessVars, lessVarJson);

module.exports = {
  lessVars,
  lessMap,
};
