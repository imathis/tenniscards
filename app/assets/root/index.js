const staticContext = require.context(
  './',
  true,
  /\.(svg|png|ico|webmanifest)$/,
)
staticContext.keys().forEach(staticContext)
