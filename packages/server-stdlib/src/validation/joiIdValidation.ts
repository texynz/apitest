// @graph-mind
// Remove the previous line to stop Ada from updating this file
import Joi from 'joi';

export interface JoiIdInterface {
    id: () => Joi.StringSchema;
}

export default function (joi: Joi.Root): Joi.Extension {
    return {
        type: 'id',
        base: joi
            .string()
            .trim()
            .length(25)
            .regex(/c[a-zA-Z0-9]{24}/),
        messages: {},
        rules: {},
    };
}