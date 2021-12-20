const path = require('path')

const Dotenv = require('dotenv-webpack')
const {
  mode,
  alias,
  entry,
  HtmlPlugin,
} = require('./config/core.config')

// Webpack configs
const { babelConfigs } = require('./config/babel.webpack')
const { cssConfigs } = require('./config/css.webpack')
const { GitPlugin } = require('./config/git.webpack')
const { imgConfigs } = require('./config/img.webpack')

module.exports = {
  entry,
  mode,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index_bundle.js',
    publicPath: '/',
  },
  devtool: mode === 'development' && process.env.REACT_DEVTOOLS ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      // Inject Image congfig and svgr loader
      ...cssConfigs,
      ...imgConfigs,
      ...babelConfigs,
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 5200,
    disableHostCheck: true,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    // Make it easy to import framework modules without specifying path
    alias,
    fallback: {
      fs: false,
    },
  },
  plugins: [
    HtmlPlugin,
    new Dotenv(),
    GitPlugin,
  ],
}
