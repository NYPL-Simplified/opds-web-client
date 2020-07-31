const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
var webpack = require("webpack");

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
    // jsdom is needed for server rendering, but causes errors
    // in the browser even if it is never used, so we ignore it:
    new webpack.IgnorePlugin(/jsdom$/),
    // Set a local global variable in the app that will be used only
    // for testing AXE in development mode.
    new webpack.DefinePlugin({
      "process.env.TEST_AXE": JSON.stringify(process.env.TEST_AXE)
    })
  ],

  module: {
    rules: [
      {
        test: /\.(ttf|woff|eot|svg|png|woff2|gif|jpg)(\?[\s\S]+)?$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".scss"]
  }
};
