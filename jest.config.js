const { frameworkName, appName } = require('./config/core.config')

module.exports = {
  moduleNameMapper: {
    [`^@${frameworkName}(.*)`]: `<rootDir>/${frameworkName}$1`,
    [`^@${appName}/(.*)`]: `<rootDir>/${appName}/$1`,
    // Jest doesn't care about svgs or scss
    '\\.svg$': '<rootDir>/tests/mocks/svgrMock.js',
    '\\.scss$': '<rootDir>/tests/mocks/scssMock.js',
    '\\.css$': '<rootDir>/tests/mocks/scssMock.js',
  },
}
