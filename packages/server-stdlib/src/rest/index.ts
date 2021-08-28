// @graph-mind
// Remove the previous line to stop Ada from updating this file
import createError from '../errors';

const validationOptions = {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
};

async function validateInput(EndpointClass, { body, query, params }) {
    try {
        const cleanInput = await EndpointClass.INPUT_VALIDATION.validateAsync(
            {
                body,
                query,
                parameter: params,
            },
            validationOptions,
        );
        return cleanInput;
    } catch (exe) {
        throw new createError.ValidationFailed('Invalid input', exe);
    }
}

function endpoint(EndpointClass) {
    return async (req, res, next) => {
        try {
            const { factory } = req.app.locals;
            const { viewer, factoryContext } = req;
            await EndpointClass.assertAuthorized(viewer);
            const cleanInput = await validateInput(EndpointClass, req);
            const endpointInstance = factory.new(EndpointClass, factoryContext);
            const result = await endpointInstance.run(viewer, cleanInput);
            res.status(200).send(result);
        } catch (exe) {
            next(exe);
        }
    };
}

export default {
    endpoint,
};