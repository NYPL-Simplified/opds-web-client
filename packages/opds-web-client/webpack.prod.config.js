var webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require("webpack-merge");
const path = require("path");

const common = require("./webpack.common.js");

var config = merge(common, {
  mode: "production",
  // devtool: "source-map",
  entry: {
    "opds-web-client": ["./src/app.tsx"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "OPDSWebClient",
    libraryTarget: "umd",
    publicPath: "dist/",
  },
  plugins: [
    // jsdom is needed for server rendering, but causes errors
    // in the browser even if it is never used, so we ignore it:
    new webpack.IgnorePlugin(/jsdom$/),

    // Extract separate css file.
    new MiniCssExtractPlugin({ filename: "opds-web-client.css" })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ["ts-loader"]
      }
    ]
  }
});

module.exports = config;
