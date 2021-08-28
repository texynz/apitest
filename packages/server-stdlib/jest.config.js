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
    testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/build'],
};