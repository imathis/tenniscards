const { DefinePlugin } = require('webpack')

const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  BugsnagPlugin: process.env.BUGSNAG_API_KEY ? new BugsnagSourceMapUploaderPlugin({
    apiKey: process.env.BUGSNAG_API_KEY,
    appVersion: JSON.stringify(gitRevisionPlugin.version()),
    overwrite: true,
  }) : new DefinePlugin({}),
}
