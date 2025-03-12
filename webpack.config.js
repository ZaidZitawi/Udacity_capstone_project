// webpack.config.js
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { InjectManifest } from 'workbox-webpack-plugin'; // Import the plugin
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
  // If you still want dev vs. prod builds for other features, keep this flag:
  const isProduction = env === 'production';

  return {
    // Use the `isProduction` flag to set mode, etc.
    mode: isProduction ? 'production' : 'development',

    entry: './src/client/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' },
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.html$/,
          use: ['html-loader'],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: './src/client/views/index.html',
        filename: './index.html',
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new InjectManifest({
        // The original SW file is in the client folder:
        swSrc: './src/client/sw.js',
        // Tell Webpack to place the compiled SW as 'service-worker.js'
        swDest: 'service-worker.js',
      }),
    ],
  };
};
