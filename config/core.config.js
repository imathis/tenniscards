const NodePath = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const frameworkName = 'level'
const frameworkSlug = `@${frameworkName}`
const scssSlug = `~${frameworkName}`

const appName = 'app'
const appSlug = '@app'

const appPath = NodePath.resolve(__dirname, `../${appName}`)
const frameworkPath = NodePath.resolve(__dirname, `../${frameworkName}`)
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const entry = mode === 'development' && process.env.REACT_DEVTOOLS ? ['react-devtools', './app/index.jsx'] : './app/index.jsx'

module.exports = {
  appName,
  appPath,
  frameworkName,
  frameworkPath,
  alias: { [frameworkSlug]: frameworkPath, [appSlug]: appPath },
  scssSlug,
  HtmlPlugin: new HtmlWebpackPlugin({
    template: 'app/index.html',
  }),
  mode,
  entry,
}
