// @graph-mind
// Remove the previous line to stop Ada from updating this file
import fullClone from 'clone';
import cuid from 'cuid';
import createError from '../errors';

function genId() {
    return cuid();
}

function clone(entity) {
    return fullClone(entity, false);
}

async function validate(entity, validationRule) {
    try {
        await validationRule.validateAsync(entity, {
            abortEarly: true,
            allowUnknown: true,
            stripUnknown: false,
        });
    } catch (e) {
        throw new createError.EntityValidationFailed('Invalid entity', e);
    }
}

export default {
    genId,
    clone,
    validate,
};