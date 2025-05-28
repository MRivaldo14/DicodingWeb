const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/DicodingWeb/', // ✅ HARUS SESUAI NAMA REPO TANPA <>
    clean: true,
  },

  mode: 'development',

  devServer: {
    static: './dist',
    port: 3000,
    open: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/service-worker.js'), to: '' },

        { from: path.resolve(__dirname, 'public/styles'), to: 'styles' },

        { from: path.resolve(__dirname, 'public/manifest.json'), to: '' },

        { from: path.resolve(__dirname, 'public/icons'), to: 'icons' },
      ],
    }),
  ],
};
