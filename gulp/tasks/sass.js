const gulp = require('gulp');

// 設定のインポート
const config = require('../config').sass;

const src = `${config.base.src}scss/**/*.scss`;
const dest = `${config.base.dest}assets/css/`;
const { plugins } = config.base;

// sass用のモジュール
const sassModule = plugins.sass;
sassModule.compiler = require('node-sass');

// タスク
const sass = () => {
  return gulp
    .src([src], {
      sourcemaps: !config.base.isProduction,
    })
    .pipe(plugins.if(!config.base.isProduction, plugins.changed(dest)))
    .pipe(plugins.plumber(config.plumber))
    .pipe(sassModule(config.sass).on('error', sassModule.logError))
    .pipe(plugins.postcss())
    .pipe(plugins.cleanCss(config.cleanCss))
    .pipe(plugins.rename(config.rename))
    .pipe(plugins.size(config.size))
    .pipe(gulp.dest(dest, { sourcemaps: '.' }));
};

gulp.task('sass', sass);

module.exports = sass;
