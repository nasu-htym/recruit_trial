const gulp = require('gulp');

// 設定のインポート
const config = require('../config').watch;

// タスクのインポート
const ejs = require('./ejs.js');
const sass = require('./sass.js');
const iconFont = require('./icon-font.js');
const imageMin = require('./image-min.js');

const browser = require('./browser-sync.js');

// タスク
const watch = () => {
  gulp.watch(config.SRC.EJS, { cwd: './' }, gulp.series(ejs));
  gulp.watch(config.SRC.SCSS, { cwd: './' }, gulp.series(sass));
  gulp.watch(config.SRC.ICONFONT, { cwd: './' }, gulp.series(iconFont));
  gulp.watch(config.SRC.IMAGES, { cwd: './' }, gulp.series(imageMin));
  gulp.watch(config.SRC.SERVER, { cwd: './' }, gulp.series(browser.reload));
};

gulp.task('watch', gulp.series(browser.sync, watch));
