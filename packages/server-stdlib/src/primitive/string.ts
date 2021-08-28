// @graph-mind
// Remove the previous line to stop Ada from updating this file
import hasha from 'hasha';
import kindOf from 'kind-of';

async function hash(...args) {
    const toHash = [];
    // TODO: add support for walking objects
    args.forEach((arg) => {
        const type = kindOf(arg);
        if (type === 'object') {
            return;
        }
        if (type === 'array') {
            return;
        }
        if (arg === undefined) {
            return;
        }
        toHash.push(String(arg));
    });
    if (!toHash.length) {
        throw new TypeError('Invalid arguments supplied');
    }
    return hasha.async(toHash, { algorithm: 'sha1', encoding: 'hex' });
}

export default {
    hash,
};