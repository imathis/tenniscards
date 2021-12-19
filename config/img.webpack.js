const imgConfigs = [
  // SVGR loader and options
  {
    oneOf: [
      {
        type: 'asset',
        resourceQuery: /url/, // *.svg?react
      },
      // app/assets/favicon => /*.ext
      {
        test: /\.(png|j?g|svg|webmanifest|ico)?$/,
        include: /assets\/root\/.*/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext][query]',
        },
      },
      // app/assets/images => /images/*.ext
      {
        test: /\.(png|j?g|svg)?$/,
        include: /assets\/images\/.*/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]',
        },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        include: /\/icons\/.*/,
        use: ['@svgr/webpack'],
      },
    ],
  },
]

module.exports = { imgConfigs }
