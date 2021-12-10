const svgConfigs = [
  // SVGR loader and options
  {
    type: 'asset',
    resourceQuery: /url/, // *.svg?react
  },
  {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: ['@svgr/webpack'],
  },
]

module.exports = { svgConfigs }
