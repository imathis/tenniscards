const cardsContext = require.context(
  '!!file-loader?name=[name].[ext]!.',
  true,
  /\.(svg|png|ico|xml|json|webmanifest)$/,
)
cardsContext.keys().forEach(cardsContext)
