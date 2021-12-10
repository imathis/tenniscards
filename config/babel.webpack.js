const babelConfigs = [
  {
    test: /\.(js|jsx)$/,
    // Do not convert anything from node modules or the constants directory
    exclude: /(node_modules|constants)/,
    use: ['babel-loader'],
  },
]

module.exports = {
  babelConfigs,
}
