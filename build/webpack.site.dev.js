const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.base');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = merge(config, {
  mode: 'development',
  entry: {
    index: resolve('docs/site/mobile/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../docs/dist'),
    publicPath: '/',
    chunkFilename: 'async_[name].js',
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    stats: 'errors-only',
    clientLogLevel: 'warning',
  },
  stats: {
    modules: false,
    children: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'docs/site/mobile/template.html',
      filename: 'index.html',
      inject: false,
      context: {
        theme: process.env.THEME,
      },
    }),
  ],
});
