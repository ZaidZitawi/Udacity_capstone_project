// webpack.prod.js
// This file is used to configure Webpack for production.
import { merge } from 'webpack-merge';
import common from './webpack.config.js';

export default merge(common, {
  mode: 'production',
});
