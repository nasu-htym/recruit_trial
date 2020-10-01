const webpack = require('webpack');
const path = require('path');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const TerserPlugin = require('terser-webpack-plugin');

// 開発環境と本番環境用の環境変数設定
const ENV = JSON.stringify(process.env.NODE_ENV || 0);

const DEV_MODE = !!ENV.match('development');

const sourceMap = !DEV_MODE ? false : 'source-map';

// ディレクトリ設定
const DOCUMENT_ROOT = DEV_MODE ? '_preview/' : '_dest/public_html/';

const SRC = 'src';
const DEST = `${DOCUMENT_ROOT}assets/`;

module.exports = {
  context: path.join(__dirname, SRC),
  entry: {
    'js/app_bundle': './js/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, DEST),
    publicPath: './',
  },
  mode: DEV_MODE ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, `${SRC}/js`), 'node_modules'],
    extensions: ['.', '.js'],
    alias: {
      '~': path.resolve(__dirname, `${SRC}/js`),
    },
  },
  externals: [],
  devtool: sourceMap,
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      name: 'js/vendor_bundle',
      chunks: 'initial',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new WebpackBuildNotifierPlugin({
      sound: false,
      suppressSuccess: 'always',
    }),
  ],
};
