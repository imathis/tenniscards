const NodePath = require('path')
const jsonImporter = require('node-sass-json-importer')
const { frameworkPath, frameworkName, scssSlug } = require('./core.config')

const sassFrameworkPath = `${frameworkPath}/scss`

const cssConfigs = [
  // Standard CSS importer
  {
    test: /\.css$/, use: ['style-loader', 'css-loader'],
  },
  // SCSS importer (including json importer)
  {
    test: /\.s[ac]ss$/i,
    use: ['style-loader', 'css-loader', {
      loader: 'sass-loader',
      options: {
      // Inject JsonImporter to allow Sass to import .json and .js files
        sassOptions: {
          includePaths: [sassFrameworkPath],
          importer: jsonImporter({
            // converts camelCase to camel-case for object keys
            convertCase: true,
          }),
        },
      },
    },
    ],
  },
]

module.exports = { cssConfigs }
