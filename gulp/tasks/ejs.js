const gulp = require('gulp');

// 設定のインポート
const config = require('../config').ejs;

const src = [
  `${config.base.src}ejs/**/*.ejs`,
  `!${config.base.src}ejs/**/_*.ejs`,
];
const { dest } = config.base;
const { plugins } = config.base;

// タスク
const ejs = () => {
  return gulp
    .src(src, {
      base: `${config.base.src}ejs/pages/`,
      // since: gulp.lastRun(ejs)
    })
    .pipe(plugins.plumber(config.plumber))
    .pipe(
      plugins.data((file) => {
        return {
          filename: file.path,
        };
      })
    )
    .pipe(plugins.ejs(config.json))
    .pipe(plugins.rename(config.rename))
    .pipe(plugins.beautify.html(config.prettify))
    .pipe(plugins.size(config.size))
    .pipe(gulp.dest(dest));
};

gulp.task('ejs', ejs);

module.exports = ejs;
