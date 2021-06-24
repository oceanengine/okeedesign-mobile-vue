module.exports = function (api, modules = false) {
  api && api.cache && api.cache(false);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          loose: true,
          modules: modules ? false : 'commonjs',
        },
      ],
      [
        '@vue/babel-preset-jsx',
        {
          functional: false,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: modules,
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-object-assign',
    ],
  };
};
