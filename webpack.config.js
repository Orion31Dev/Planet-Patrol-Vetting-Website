const webpack = require('webpack');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
require('dotenv').config();

const htmlPlugin = new HtmlWebPackPlugin({
  template: './client/public/index.html',
  filename: './index.html',
});

module.exports = {
  entry: './client/src/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    htmlPlugin,
    new webpack.EnvironmentPlugin(['REACT_APP_GOOGLE_CLIENT_ID']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './client/public',
          to: 'public',
          globOptions: {
            ignore: ['*.html'],
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx', '.tsx', '.ts'],
        },
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
    ],
  },
};
