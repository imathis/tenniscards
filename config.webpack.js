const path = require('path')

const Dotenv = require('dotenv-webpack')
const {
  mode,
  alias,
  entry,
  HtmlPlugin,
} = require('./config/core.config')

// Webpack Plugins

// Webpack configs
const { babelConfigs } = require('./config/babel.webpack')
const { cssConfigs } = require('./config/css.webpack')
const { GitPlugin } = require('./config/git.webpack')
const { svgConfigs } = require('./config/svg.webpack')

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
      // Inject SVG congfig and svgr loader
      ...cssConfigs,
      ...svgConfigs,
      ...babelConfigs,
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 5000,
    disableHostCheck: true,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    // Make it easy to import framework modules without specifying path
    alias,
  },
  plugins: [
    HtmlPlugin,
    new Dotenv({}),
    GitPlugin,
  ],
}
