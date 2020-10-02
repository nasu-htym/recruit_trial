const gulp = require('gulp');

// 設定のインポート
const config = require('../config').imageMin;

const src = `${config.base.src}img/**/*.+(png|jpg|jpeg|gif|svg)`;
const dest = `${config.base.dest}assets/img/`;
const { plugins } = config.base;

// タスク
const imageMin = () => {
  return gulp
    .src([src], {
      base: `${config.base.src}img/`,
    })
    .pipe(plugins.if(!config.base.isProduction, plugins.changed(dest)))
    .pipe(plugins.plumber(config.plumber))
    .pipe(config.imagemin)
    .pipe(plugins.size(config.size))
    .pipe(gulp.dest(dest));
};

gulp.task('image-min', imageMin);

module.exports = imageMin;
