var webpack = require('webpack');

var config = {
  entry: {
    app: [
      './src/index.tsx',
    ],
  },
  output: {
    path: './lib',
    filename: 'index.js',
    library: 'OPDSBrowser',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) })
  ],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loaders: [
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