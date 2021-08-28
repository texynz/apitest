// @graph-mind
// Remove the previous line to stop Ada from updating this file
module.exports = {
    sourceType: 'unambiguous',
    env: {
        test: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
            ],
        },
    },
};