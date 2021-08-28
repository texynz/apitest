// @graph-mind
// Remove the previous line to stop Ada from updating this file
const base = require('./jest.config.js');

module.exports = {
    ...base,
    transform: {
        '^.+\\.ts?$': 'ts-jest',
        '^.+\\.tsx?$': 'ts-jest',
    },
};