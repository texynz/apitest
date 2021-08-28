// @graph-mind
// Remove the previous line to stop Ada from updating this file
// We inherit from the project files so tests are identical to the produced source code
const base = require('../../jest.config.js');

module.exports = {
    testEnvironment: 'node',
    ...base,
    collectCoverage: true,
    collectCoverageFrom: ['src/server/**/*.{ts}', ...base.collectCoverageFrom],
};