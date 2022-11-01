const jestConfig = require('./jest.config');

const newConfig = {
    ...jestConfig,
    collectCoverageFrom: undefined,
    coverageDirectory: undefined,
    testRegex: '\\.e2e-spec\\.ts$',
};

module.exports = newConfig;
