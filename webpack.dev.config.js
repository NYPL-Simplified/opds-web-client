/* global process */
var webpack = require('webpack');


var config = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      './src/index.ts',
    ],
  },
  output: {
    filename: 'opds-browser.js',
    publicPath: 'http://localhost:8090/dist',
    library: 'OPDSBrowser',
    libraryTarget: 'umd'
  },
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({ "process.env": JSON.stringify(process.env)})
  ],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loaders: [
          'react-hot',
          'ts-loader'
        ]
      }
    ],
    noParse:[]
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
  }
};

module.exports = config;