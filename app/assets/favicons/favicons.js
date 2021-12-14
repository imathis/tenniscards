const faviconsContext = require.context(
  './',
  true,
  /\.(svg|png)$/,
)
faviconsContext.keys().forEach(faviconsContext)
