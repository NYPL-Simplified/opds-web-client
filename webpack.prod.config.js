/* global process */
var webpack = require('webpack');

var config = {
  entry: {
    app: [
      './src/index.ts',
    ],
  },
  output: {
    path: './dist',
    filename: 'opds-browser.js',
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
      },
    ],
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
  }
};

module.exports = config;