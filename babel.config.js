/* eslint-env node */
module.exports = {
  ignore: [/core-js/],
  presets: [
    ["@babel/env", { useBuiltIns: "usage", corejs: 3 }],
    "@babel/react",
  ],
}
