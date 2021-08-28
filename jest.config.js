// @graph-mind
// Remove the previous line to stop Ada from updating this file
module.exports = {
    bail: true,
    verbose: false,
    collectCoverage: false,
    collectCoverageFrom: ['!**/node_modules/**'],
    notify: true,
    notifyMode: 'always',
    reporters: [
        'default',
        [
            'jest-junit',
            {
                output: './test-reports/junit.xml',
            },
        ],
    ],
    moduleNameMapper: {
        '@local/(.*)/?(.*)$': '<rootDir>/packages/$1/src/$2',
    },
    testPathIgnorePatterns: ['node_modules/', 'build/', 'dist/'],
};