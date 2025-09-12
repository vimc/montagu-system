var config = require('./jest.config');

config.testRegex = "(/__tests__/.*|(\\.|/)(itest))\\.[jt]sx?$";

module.exports = config;