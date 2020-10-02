const gulp = require('gulp');

// 設定のインポート
const config = require('../config').iconFont;

const srcDir = `${config.base.src}iconfont/`;
const destDir = `${config.base.dest}assets/`;
const dest = `${config.base.dest}assets/fonts/`;
const { plugins } = config.base;

const runTimestamp = Math.round(Date.now() / 1000);

// タスク
const iconFont = () => {
  return gulp
    .src([`${srcDir}svg/*.svg`])
    .pipe(plugins.if(!config.base.isProduction, plugins.changed(dest)))
    .pipe(
      plugins.iconfont({
        fontName: config.name,
        timestamp: runTimestamp,
        formats: ['woff2', 'woff', 'svg'],
      })
    )
    .on('glyphs', (glyphs, options) => {
      const engine = 'lodash';
      const consolidateOptions = {
        glyphs,
        fontName: config.name,
        fontPath: '../fonts/', // cssからのフォントパスを指定 ※cssからの相対パスでフォントを指定してもOK
        className: config.name, // cssのフォントのクラス名を指定
      };

      // アイコンフォント用のscssを作成(実装用・必要なとき)
      /* gulp.src(
        [
          srcDir + 'templates/myfont.scss.template'
        ]
      )
      .pipe(plugins.consolidate(engine, consolidateOptions))
      .pipe(plugins.rename({
        basename: '_' + config.name,
        extname: '.scss',
      }))
      .pipe(plugins.size(config.size))
      .pipe(gulp.dest(config.base.src + 'scss/foundation/')); // scssの吐き出し先を指定 */

      // アイコンフォント用のcssを作成(実装用・プレビュー用)
      gulp
        .src([`${srcDir}templates/myfont.css.template`])
        .pipe(plugins.consolidate(engine, consolidateOptions))
        .pipe(
          plugins.rename({
            basename: config.name,
            extname: '.css',
          })
        )
        .pipe(plugins.size(config.size))
        .pipe(gulp.dest(`${destDir}css/`)) // 実装用cssの吐き出し先を指定
        .pipe(gulp.dest(`${srcDir}preview/css/`)); // プレビュー用cssの吐き出し先を指定

      // アイコンフォント一覧のサンプルHTMLを作成(プレビュー用)
      gulp
        .src([`${srcDir}templates/myfont.html.template`])
        .pipe(plugins.consolidate(engine, consolidateOptions))
        .pipe(
          plugins.rename({
            basename: config.name,
            extname: '.html',
          })
        )
        .pipe(gulp.dest(`${srcDir}preview/`)); // プレビュー用htmlの吐き出し先を指定
    })
    .pipe(gulp.dest(dest))
    .pipe(gulp.dest(`${srcDir}preview/fonts/`))
    .pipe(plugins.size(config.size));
};

gulp.task('icon-font', iconFont);

module.exports = iconFont;
