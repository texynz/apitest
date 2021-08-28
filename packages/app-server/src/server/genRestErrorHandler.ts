// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

import { StdlibTypes } from '@local/server-stdlib';
import camelCase from 'camelcase';
import errorMessages, { RestError, RestInnerError } from './errorMessages';
import Viewer from './viewer';

interface RestErrorResponse {
    success: boolean;
    error: RestError;
}

export class RestErrorHandler {
    public static DEFAULT_ERROR_STATUS = 500;

    public static DEFAULT_ERROR_RESPONSE: {
        success: boolean;
        error: RestError;
    } = {
        success: false,
        error: {
            code: 'ServerError',
            message: 'Internal server error',
        },
    };

    public static handleError(
        error: Error | any,
        viewer: Viewer,
        isOperational: boolean,
    ): [number, RestErrorResponse] {
        // If the status code cannot be determined, then it is 500 by default
        let statusCode = 500;
        const body = {
            success: false,
            error: undefined,
        };
        try {
            if (errorMessages[error.name]) {
                [statusCode, body.error] = errorMessages[error.name](
                    viewer,
                    error,
                );
            }
        } catch (e) {
            statusCode = 500;
        }

        if (!body.error) {
            body.error = { ...RestErrorHandler.DEFAULT_ERROR_RESPONSE.error };
            statusCode = 500;
        }
        body.error = RestErrorHandler.standardizeError(body.error);
        return [statusCode, body];
    }

    public static standardizeError<T>(
        currentError: RestError | RestInnerError | any,
    ): T {
        const nextError = {
            ...currentError,
        };
        nextError.code = camelCase(nextError.code, { pascalCase: true });
        if (nextError.details) {
            nextError.details = nextError.details.map(
                RestErrorHandler.standardizeError,
            );
        }
        if (nextError.innererror) {
            nextError.innererror = RestErrorHandler.standardizeError(
                nextError.innererror,
            );
        }
        return nextError;
    }
}

export default function genRestErrorHandler(
    factory: StdlibTypes['Factory'],
): void {}
