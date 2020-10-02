// 共通プラグイン
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const notifier = require('node-notifier');
const plugins = require('gulp-load-plugins')();

// 環境変数設定
const envSettings = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'development',
  },
};
const options = minimist(process.argv.slice(2), envSettings);
const production = options.env !== 'development';

const documentRoot = production ? '_dest/public_html/' : '_preview/';
const siteRoot = '';

// 共通設定
const BASE_SETTINGS = {
  isProduction: production,
  env: production ? 'production' : 'development',
  src: 'src/',
  dest: documentRoot + siteRoot,
  plugins,
};

// ファイル名・サイズの出力設定
const SIZE_SETTINGS = {
  showFiles: true,
  showTotal: true,
};

// エラーハンドリング設定
const PLUMBER_SETTINGS = {
  common: {
    errorHandler(err) {
      console.log(err.message);
      notifier.notify({
        message: err.message,
      });
      this.emit('end');
    },
  },
  sass: {
    errorHandler(err) {
      console.log(err.messageFormatted);
      notifier.notify({
        message: err.messageFormatted,
      });
      console.log(err);
      this.emit('end');
    },
  },
  ejs: {
    errorHandler(err) {
      console.log(err.message);
      notifier.notify({
        message: err.message,
      });
      this.emit('end');
    },
  },
};

// Sassのコンパイル設定
const nodeSassMagicImporter = require('node-sass-magic-importer');

// Webpackのコンパイル設定
// eslint-disable-next-line import/order
const webpackConfig = require('../webpack.config.js');

// 画像の圧縮設定
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');

const IMAGEMIN_SETTINGS = plugins.imagemin([
  pngquant({
    quality: [0.65, 0.8],
    speed: 1,
  }),
  mozjpeg({
    quality: 60,
    progressive: false,
  }),
  plugins.imagemin.svgo({
    plugins: [
      {
        removeViewBox: false,
      },
    ],
  }),
  plugins.imagemin.optipng(),
  plugins.imagemin.gifsicle(),
]);

// 各タスクごとの設定の出力
module.exports = {
  simple: BASE_SETTINGS,

  /* ejs */
  ejs: {
    base: BASE_SETTINGS,
    plumber: PLUMBER_SETTINGS.ejs,
    size: SIZE_SETTINGS,
    json: {
      dev: !production,
      config: JSON.parse(
        fs.readFileSync(`${BASE_SETTINGS.src}ejs/data/config.json`)
      ),
      info: JSON.parse(
        fs.readFileSync(`${BASE_SETTINGS.src}ejs/data/info.json`)
      ),
    },
    rename: (_path) => {
      _path.extname = '.html';
    },
    prettify: {
      indent_size: 4,
      indent_with_tabs: true,
      max_preserve_newlines: 1,
    },
  },

  /* sassタスクの設定 */
  sass: {
    base: BASE_SETTINGS,
    plumber: PLUMBER_SETTINGS.sass,
    size: SIZE_SETTINGS,
    cleanCss: {
      advanced: true,
    },
    sass: {
      importer: nodeSassMagicImporter(),
    },
    rename: (_path) => {
      if (_path.dirname.match('single/')) {
        _path.dirname = _path.dirname.replace('single/', '');
      }
    },
  },

  /* webpackタスクの設定 */
  webpack: {
    base: BASE_SETTINGS,
    plumber: PLUMBER_SETTINGS.common,
    config: webpackConfig,
  },

  /* image-minタスクの設定 */
  imageMin: {
    base: BASE_SETTINGS,
    size: SIZE_SETTINGS,
    plumber: PLUMBER_SETTINGS.common,
    imagemin: IMAGEMIN_SETTINGS,
  },

  /* icon-fontタスクの設定 */
  iconFont: {
    base: BASE_SETTINGS,
    size: SIZE_SETTINGS,
    plumber: PLUMBER_SETTINGS.common,
    name: 'myicon',
  },

  /* browser-syncタスクの設定 */
  browserSync: {
    base: BASE_SETTINGS,
    init: {
      server: {
        baseDir: documentRoot,
        index: 'index.html',
      },
      https: {
        cert: `${path.join(__dirname)}/../certs/localhost.crt.pem`,
        key: `${path.join(__dirname)}/../certs/localhost.key.pem`,
      },
      port: 3304,
    },
  },

  /* watchタスクの設定 */

  /* watchタスクの設定 */
  watch: {
    SRC: {
      EJS: [`${BASE_SETTINGS.src}ejs/**/*.ejs`],
      SCSS: [`${BASE_SETTINGS.src}scss/**/*.scss`],
      ICONFONT: [`${BASE_SETTINGS.src}iconfont/svg/*.svg`],
      IMAGES: [`${BASE_SETTINGS.src}img/**/*.+(png|jpg|jpeg|gif|svg)`],
      SERVER: [`${BASE_SETTINGS.dest}**/*.+(css|js|html)`],
    },
  },
};
