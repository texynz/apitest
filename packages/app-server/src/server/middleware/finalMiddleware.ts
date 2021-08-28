// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import stdlib, { StdlibTypes } from '@local/server-stdlib';
import { ErrorHandler } from '../genErrorHandler';
import { RestErrorHandler } from '../genRestErrorHandler';

async function errorMiddleware(error, req, res, next) {
    const { viewer } = req;
    // The errorHandler is taken from the app instead of using the factory to reduce more errors from occurring
    const {
        errorHandler,
    }: {
        errorHandler: ErrorHandler;
    } = req.app.locals;
    try {
        const isOperational = await errorHandler.handleError(error, viewer);
        const [statusCode, statusBody] = RestErrorHandler.handleError(
            error,
            viewer,
            isOperational,
        );
        res.status(Number(statusCode)).send(statusBody);
    } catch (e) {
        res.status(RestErrorHandler.DEFAULT_ERROR_STATUS).send(
            RestErrorHandler.DEFAULT_ERROR_RESPONSE,
        );
    }
}

export default function finalMiddleware(
    app,
    config,
    factory: StdlibTypes['Factory'],
) {
    app.use((req, res, next) => {
        next(stdlib.createError.NotFound(req.url));
    });
    app.use(errorMiddleware);
}
