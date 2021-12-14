const cardsContext = require.context(
  './',
  true,
  /\.(svg|png)$/,
)
cardsContext.keys().forEach(cardsContext)
