const { getProjectPath } = require('./build/utils/projectHelper');

const fs = require('fs');
const merge2 = require('merge2');
const through2 = require('through2');
const webpack = require('webpack');
const babel = require('gulp-babel');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const ts = require('gulp-typescript');
const gulp = require('gulp');
const rimraf = require('rimraf');
const stripCode = require('gulp-strip-code');
const runCmd = require('./build/runCmd');
const { transformLess, getStyleDependencies } = require('./build/transformLess');
const tsConfig = require('./tsconfig.json');
const getBabelConfig = require('./babel.config');
const webpackConfig = require('./build/webpack.build');
const replaceLib = require('./build/replaceLib');

const tsDefaultReporter = ts.reporter.defaultReporter();

const libDir = getProjectPath('lib');
const esDir = getProjectPath('es');

gulp.task('build-entry', done => {
  console.log('[Build] Build entry...');
  buildEntry(done);
});

gulp.task('compile-with-es', done => {
  console.log('[Parallel] Compile to es...');
  compile(false).on('finish', done);
});

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to js...');
  compile().on('finish', done);
});

gulp.task('compile-less-with-es', done => {
  console.log('[Parallel] Compile to es css...');
  compileLess(false).on('finish', done);
});

gulp.task('compile-less-with-lib', done => {
  console.log('[Parallel] Compile to lib css...');
  compileLess().on('finish', done);
});

gulp.task(
  'compile',
  gulp.series(
    'build-entry',
    gulp.parallel('compile-with-es', 'compile-with-lib'),
    gulp.parallel('compile-less-with-es', 'compile-less-with-lib'),
  ),
);

gulp.task(
  'dist',
  gulp.series(done => {
    dist(done);
  }),
);

function buildEntry(done) {
  const args = ['./build/build-entry.js'];
  runCmd('node', args, done);
}

function dist(done) {
  process.env.RUN_ENV = 'PRODUCTION';
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    });
    console.log(buildInfo);

    done(0);
  });
}

function babelify(js, modules) {
  const babelConfig = getBabelConfig(null, modules === false);
  delete babelConfig.cacheDirectory;
  if (modules === false) {
    babelConfig.plugins.push(replaceLib);
  }
  let stream = js.pipe(babel(babelConfig));
  if (modules === false) {
    stream = stream.pipe(
      stripCode({
        start_comment: '@remove-on-es-build-begin',
        end_comment: '@remove-on-es-build-end',
      }),
    );
  }
  return stream.pipe(gulp.dest(modules === false ? esDir : libDir));
}

function compile(modules) {
  rimraf.sync(modules !== false ? libDir : esDir);

  const less = gulp
    .src(['src/**/*.less'])
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());

        const matchComponent = file.path.match(/components(\/|\\)([^\/|\\]+)(?:\/|\\)index\.less$/);

        if (matchComponent) {
          file.path = file.path.replace(/(\w+\.less)$/, `style${matchComponent[1]}$1`);
          file.contents = Buffer.from(`@import '../index.less';\n`);
          this.push(file);
        }
        next();
      }),
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir));

  let error = 0;
  const source = [
    'src/**/*.tsx',
    'src/**/*.ts',
    // 'typings/**/*.d.ts',
  ];
  // allow jsx file in components/xxx/
  if (tsConfig.compilerOptions.allowJs) {
    source.unshift('src/**/*.js');
  }

  const tsResult = gulp.src(source).pipe(
    ts(tsConfig.compilerOptions, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    }),
  );

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }

  tsResult.on('finish', check);
  tsResult.on('end', check);
  const tsFilesStream = babelify(tsResult.js, modules);
  const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir));
  return merge2([less, tsFilesStream, tsd]);
}

function compileLess(modules) {
  const analyseDir = path.join(__dirname, './es/components');
  const components = fs.readdirSync(path.resolve(__dirname, './src/components'));

  const less = gulp
    .src(['es/**/*.less'])
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());
        transformLess(file.path)
          .then(css => {
            file.contents = Buffer.from(css);
            file.path = file.path.replace(/\.less$/, '.css');
            this.push(file);
            next();
          })
          .catch(e => {
            console.error(e);
          });
      }),
    )
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());

        const matchComponent = file.path.match(
          /components(?:\/|\\)([^\/|\\]+)(?:\/|\\)style(?:\/|\\)index\.css$/,
        );

        if (matchComponent) {
          const deps = getStyleDependencies(analyseDir, components, matchComponent[1]);

          let cssContent = '';
          let lessContent = '';
          if (modules === false) {
            lessContent = deps.map(dep => `import '${dep}.less';`).join('\n');
            cssContent = deps.map(dep => `import '${dep}.css';`).join('\n');
          } else {
            lessContent = deps.map(dep => `require('${dep}.less');`).join('\n');
            cssContent = deps.map(dep => `require('${dep}.css');`).join('\n');
          }

          const lessFile = file.clone();
          lessFile.contents = Buffer.from(lessContent);
          lessFile.path = lessFile.path.replace(
            /(\/|\\)([^\/|\\]+\/|\\)index\.css/,
            '$1$2index.js',
          );
          this.push(lessFile);

          const cssFile = file.clone();
          cssFile.contents = Buffer.from(cssContent);
          cssFile.path = cssFile.path.replace(/(\/|\\)([^\/|\\]+\/|\\)index\.css/, '$1$2css.js');
          this.push(cssFile);

          const lessDtsFile = lessFile.clone();
          lessDtsFile.path = lessDtsFile.path.replace(/\.js$/, '.d.ts');
          this.push(lessDtsFile);
        }
        next();
      }),
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir));
  const assets = gulp
    .src(['src/**/*.@(png|svg)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir));

  return merge2([less, assets]);
}
