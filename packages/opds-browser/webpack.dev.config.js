var webpack = require('webpack');

var config = {
  entry: {
    app: [
      'webpack/hot/dev-server',
      './src/app.tsx',
    ],
  },
  output: {
    filename: 'opds-browser.js',
    publicPath: 'http://localhost:8090/dist',
    library: 'OPDSBrowserApp',
    libraryTarget: 'umd'
  },
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) })
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
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ],
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".tsx"]
  }
};

module.exports = config;