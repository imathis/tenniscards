const { DefinePlugin } = require('webpack')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')

const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  GitPlugin: new DefinePlugin({
    'process.env.GIT_VERSION': JSON.stringify(gitRevisionPlugin.version()),
    'process.env.GIT_COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
  }),
}
