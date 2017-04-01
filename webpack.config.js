var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var APP_DIR = path.resolve(__dirname, 'app');
var BUILD_DIR = path.resolve(__dirname, 'dist');


var config = {
 entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel',
        query:{
          presets:['es2015']
        }
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: APP_DIR + '/style.css'
    },
    {
      from: APP_DIR + '/index.html'
    }]),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    })
  ],
  devServer: {
    contentBase: APP_DIR,
    compress: true,
    port: 8080,
    inline:true,
  }
};
module.exports = config;