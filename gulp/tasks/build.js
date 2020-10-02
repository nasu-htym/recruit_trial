const gulp = require('gulp');

// build用のモジュール

// 設定のインポート

// タスクのインポート
const webPack = require('./webpack.js');
const ejs = require('./ejs.js');
const sass = require('./sass.js');
const iconFont = require('./icon-font.js');
const imageMin = require('./image-min.js');

// 実行タスクの設定
const tasks = [ejs, webPack, sass, imageMin, iconFont];

// タスク
gulp.task('build', gulp.series(...tasks));
