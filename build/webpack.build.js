const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.base');

delete config.serve;

function getWebpackConfig(isMinify) {
  return merge(config, {
    mode: 'production',
    entry: {
      bui: './es/index.js',
    },
    output: {
      path: path.join(__dirname, '../lib'),
      library: 'bui',
      libraryTarget: 'umd',
      filename: isMinify ? '[name].min.js' : '[name].js',
      umdNamedDefine: true,
      globalObject: "typeof self !== 'undefined' ? self : this",
    },
    externals: {
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
      },
    },
    performance: false,
    optimization: {
      minimize: isMinify,
    },
  });
}
module.exports = [getWebpackConfig(true), getWebpackConfig(false)];
