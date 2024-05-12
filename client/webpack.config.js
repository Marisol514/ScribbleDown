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
      // Generates an HTML file from a template
      new HtmlWebpackPlugin({
        template: './src/index.html', // Path to HTML file that serves as a template
        favicon: './src/images/favicon.ico'
      }),
      // Generates a service worker using Workbox that precaches and manages assets
      new InjectManifest({
        swSrc: './src/src-sw.js', // Path to the source service worker file
        swDest: 'service-worker.js', // Destination filename in the output directory
      }),
      // Creates a manifest file for PWA
      new WebpackPwaManifest({
        name: 'JATE Text Editor',
        short_name: 'JATE',
        description: 'Just Another Text Editor',
        background_color: '#ffffff',
        crossorigin: 'use-credentials', // can be null, use-credentials or anonymous
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
          }
        ]
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/, // Matches any .css files
          use: ['style-loader', 'css-loader'] // Use these loaders for CSS files
        },
        {
          test: /\.js$/, // Matches any .js files
          exclude: /node_modules/, // Exclude the node_modules directory
          use: {
            loader: 'babel-loader', // Use Babel loader for transpiling JavaScript
            options: {
              presets: ['@babel/preset-env'] // Use the preset-env Babel preset
            }
          }
        }
      ],
    },
  };
};
