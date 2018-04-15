const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'main.css'
});

module.exports = {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: './public',
    port: 8080
  },
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'src/main.js')
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build')
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
  resolve: {
    extensions: ['.scss', '.js', '.jsx']
  },
  plugins: [
    extractSass,
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
