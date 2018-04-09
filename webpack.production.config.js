var webpack = require('webpack');
var path = require('path');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, 'src/main.js'),
  ],
  output: {
    path: __dirname + '/docs',
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      },
      { test: /\.css$/, include: path.resolve(__dirname, 'src'), loader: 'style-loader!css-loader' },
      { test: /\.scss$/, include: path.resolve(__dirname, 'src'), loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'] }) },
    ]
  },
  resolve: {
    extensions: ['.scss', '.js', '.jsx'],
  },
  plugins: [
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('main.css'),
    new CopyWebpackPlugin([
      { from: './public/index.html', to: 'index.html' },
      { from: './public/data', to: 'data' }
    ]),
  ]
};
