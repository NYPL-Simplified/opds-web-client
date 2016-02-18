var webpack = require("webpack");
var config = require("./webpack.dev.config");

config.entry.app = [
  "./src/index.ts"
];

config.output = {
  path: "./dist",
  filename: "opds-browser.js",
  library: "OPDSBrowser",
  libraryTarget: "umd"
};

config.devtool = undefined;

module.exports = config;