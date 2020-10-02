const browserSync = require('browser-sync').create();

// 設定のインポート
const config = require('../config').browserSync;

// タスク
const sync = (done) => {
  browserSync.init(config.init);
  done();
};

const reload = (done) => {
  browserSync.reload();
  done();
};

const browser = { sync, reload };

module.exports = browser;
