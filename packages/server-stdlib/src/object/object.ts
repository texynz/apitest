// @graph-mind
// Remove the previous line to stop Ada from updating this file
import cuid from 'cuid';

function genId() {
    return cuid();
}

export default {
    genId,
};