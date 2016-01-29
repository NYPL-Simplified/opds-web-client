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
    path: './dist',
    filename: 'opds-browser.js',
    publicPath: 'http://localhost:8090/dist',
    library: 'OPDSBrowser',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({ "process.env": JSON.stringify(process.env)})
  ],
  module: {
    // preLoaders: [
    //   {
    //     test: /\.tsx?$/,
    //     exclude: [/node_modules/],
    //     loader: 'source-map'
    //   }
    // ],
    loaders: [
      { 
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loaders: [
          'react-hot', 
          'babel?presets[]=es2015',
          'ts-loader'
        ] 
      },
    ],
    noParse:[]
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
  }
};

module.exports = config;