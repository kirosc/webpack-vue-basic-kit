const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common,
  {
    mode: 'production',
    devtool: 'source-map',
    stats: 'errors-only',
    bail: true,
    output: {
      filename: 'assets/[name].[chunkhash:8].js',
      chunkFilename: 'assets/[name].[chunkhash:8].chunk.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'assets/[name].[contenthash].css',
        chunkFilename: 'assets/[name].[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../public', 'index.html'),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../../',
              }
            },
            {
              // translates CSS into CommonJS
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              // Runs compiled CSS through postcss for vendor prefixing
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              // compiles Sass to CSS
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
                sourceMapContents: true
              }
            }
          ],
        },
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
    }
  });