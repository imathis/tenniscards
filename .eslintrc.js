module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['airbnb'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'never',
    ],
    yoda: 0, // Allow sane comparison order
    'react/prefer-stateless-function': [0],
    'react/forbid-prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
    'react/jsx-fragments': 0,
    'react/no-unused-prop-types': 0,
    'no-bitwise': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/function-component-definition': 0,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'config.webpack.js',
      },
    },
  },
}
