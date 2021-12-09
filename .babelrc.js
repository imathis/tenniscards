module.exports = (api) => {
  api.cache(true)
  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
  ]
  const plugins = [
    ['@babel/plugin-transform-runtime', {}],
  ]
  const overrides = [
    {
      test: './app/level/constants/*.js',
      presets: [
        ['@babel/preset-env', {
          corejs: 3,
          useBuiltIns: 'usage',
          modules: 'commonjs',
        }],
        '@babel/preset-react',
      ],
    },
  ]

  if (process.env.npm_lifecycle_event === 'build') {
    plugins.push('transform-inline-environment-variables')
  }

  return {
    presets,
    plugins,
    overrides,
  }
}
