// @graph-mind
// Remove the previous line to stop Ada from updating this file
export function isNumber(value) {
    // eslint-disable-next-line no-restricted-globals
    return typeof value === 'number' && !isNaN(value);
}
export function isArrayOfStrings(value) {
    // eslint-disable-next-line no-restricted-globals
    return (
        Array.isArray(value) && value.every((item) => typeof item === 'string')
    );
}