const less = require('less');
const fs = require('fs');
const path = require('path');
const NpmImportPlugin = require('less-plugin-npm-import');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const dependencyTree = require('dependency-tree');
const csso = require('csso');

async function transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);

  let data = fs.readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  const postcssConfig = await postcssrc();

  // Do less compile
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: '~' })],
    javascriptEnabled: true,
  };
  return less
    .render(data, lessOpts)
    .then(result =>
      postcss(postcssConfig.plugins).process(result.css, { from: path.dirname(resolvedLessFile) }),
    )
    .then(r => csso.minify(r.css).css);
}

// 需要在ES目录生成之后进行，因为需要使用es module的语法分析样式依赖
exports.getStyleDependencies = function (dir, components, component) {
  return analyzeDependencies(dir, components, component).map(dep =>
    getStyleRelativePath(component, dep),
  );
};

// analyze component dependencies
function analyzeDependencies(dir, components, component) {
  const checkList = ['index'];
  search(
    dependencyTree({
      directory: dir,
      filename: path.join(dir, component, 'index.js'),
      filter: path => !~path.indexOf('node_modules'),
    }),
    dir,
    components,
    component,
    checkList,
  );

  checkList.push(component);

  return checkList.filter(item => checkComponentHasStyle(item));
}

function search(tree, dir, components, component, checkList) {
  Object.keys(tree).forEach(key => {
    search(tree[key], dir, components, component, checkList);
    components
      .filter(item => key.replace(dir, '').split('/').includes(item))
      .forEach(item => {
        if (!checkList.includes(item) && item !== component) {
          checkList.push(item);
        }
      });
  });
}

function getStylePath(component, ext = '') {
  if (component === 'index') {
    return path.join(__dirname, `../es/style/index${ext}`);
  }
  return path.join(__dirname, `../es/components/${component}/index${ext}`);
}

// replace sep for windows
function replaceSep(path) {
  if (path === 'index') {
    return './index';
  }
  return path.split(path.sep).join('/');
}

function getStyleRelativePath(component, style) {
  return replaceSep(
    path.relative(path.join(__dirname, `../es/components/${component}/style`), getStylePath(style)),
  );
}

function checkComponentHasStyle(component) {
  return fs.existsSync(getStylePath(component, '.less'));
}

exports.transformLess = transformLess;
