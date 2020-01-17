var config = require('./jest.config');

config.testRegex = "/integrationTests.*Tests\\.[jt]sx?$";
config.coverageDirectory = "./coverage/integration/";
config.testTimeout = 6000;
module.exports = config;
