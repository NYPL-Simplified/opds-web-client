const merge = require("webpack-merge");
const common = require("./webpack.common.js");

var config = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    app: ["webpack/hot/dev-server", "./src/app.tsx"]
  },
  output: {
    filename: "opds-web-client.js",
    publicPath: "http://localhost:8090/dist",
    library: "OPDSWebClient",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loaders: ["react-hot-loader/webpack", "ts-loader"]
      }
    ]
  }
});

module.exports = config;
