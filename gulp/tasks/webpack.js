require('dotenv').config();

const gulp = require('gulp');

// webpack用のモジュール
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// 設定のインポート
const config = require('../config').webpack;

const src = `${config.base.src}ts/**/.js`;
const dest = `${config.base.dest}assets/`;
const { plugins } = config.base;

const webPack = () => {
  const mode = process.env.BUILD_MODE || '';

  if (process.env.NODE_ENV === 'production' && mode === 'delivery') {
    config.config.plugins.push(new BundleAnalyzerPlugin());
  }

  return gulp
    .src(src)
    .pipe(plugins.plumber(config.plumber))
    .pipe(webpackStream(config.config, webpack))
    .pipe(gulp.dest(dest));
};

gulp.task('webpack', webPack);

module.exports = webPack;
