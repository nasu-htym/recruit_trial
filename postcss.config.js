const postcssPresetEnv = require('postcss-preset-env');
const postcssEasings = require('postcss-easings');

module.exports = (ctx) => ({
  plugins: [
    postcssPresetEnv({
      stage: 3,
      features: {
        nestingRules: true,
        customProperties: true,
        calc: true,
        customMedia: true,
        mediaQueriesRange: true,
      },
      autoprefixer: {
        grid: true,
      },
    }),
    postcssEasings(),
  ],
});
