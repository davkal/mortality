const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'main.css'
});

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, 'src/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react']
          }
        }
      },
      // { test: /\.css$/, include: path.resolve(__dirname, 'src'), use: 'style-loader!css-loader' },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        use: extractSass.extract({
          use: [{
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              sourceMap: true
            }
          }],
          fallback: 'style-loader'
        })
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  resolve: {
    extensions: ['.scss', '.js', '.jsx'],
  },
  plugins: [
    extractSass,
    new CleanWebpackPlugin(['docs']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      { from: './public/index.html', to: 'index.html' },
      { from: './public/data', to: 'data' }
    ]),
  ]
};
