const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const jsonImporter = require('node-sass-json-importer')

const levelPath = path.resolve(__dirname, './app/level')
const appPath = path.resolve(__dirname, './app')
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

module.exports = {
  entry: mode === 'development' && process.env.REACT_DEVTOOLS ? ['react-devtools', './app/index.jsx'] : './app/index.jsx',
  mode,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index_bundle.js',
    publicPath: '/',
  },
  devtool: mode === 'development' && process.env.REACT_DEVTOOLS ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /base64\.jsx?$/,
        },
        use: 'url-loader',
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.jsx?$/,
        },
        use: [{
          loader: '@svgr/webpack',
          options: {
            svgoConfig: { plugins: { removeViewBox: false } },
          },
        }],
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', {
          loader: 'sass-loader',
          options: {
            // Inject JsonImporter to allow Sass to import .json and .js files
            sassOptions: {
              includePaths: [levelPath],
              importer: jsonImporter({
                // converts camelCase to camel-case for object keys
                convertCase: true,
                // Ensure @use '~level' can find level modules
                resolver: (dir, url) => (url.startsWith('~level')
                  ? path.resolve(levelPath, url.substr(7))
                  : path.resolve(dir, url)),
              }),
            },
          },
        },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 5000,
    disableHostCheck: true,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    // Make it easy to import level modules without specifying path
    alias: {
      level: levelPath,
      '@app': appPath,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html',
    }),
    new Dotenv({}),
  ],
}
