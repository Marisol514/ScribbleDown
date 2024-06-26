const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      // Webpack plugin that generates HTML file and injects the bundles
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'jate'
      }),
      // Custom Service Worker
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: './src-sw.js'
      }),
      // Manifest.json file
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'jate',
        description: 'A text editor, but be extreme about it',
        background_color: '#225ca3',
        theme_color: '#00FFFF',
        start_url: './',
        publicPath: './',
        icons: [{

          src: path.resolve('src/images/logo.png'),
          sizes: [96, 128, 192, 256, 384, 512],
          destination: path.join('assets', 'icons')
        }],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },

      ],
    },
  };
};