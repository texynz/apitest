// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

import Viewer from './viewer';

/**
 * The rest api errors follow the Microsoft api guidelines
 * For more details see https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#7102-error-condition-responses
 */

export interface RestInnerError {
    code: string;
    innererror?: RestInnerError;
    details?: RestInnerError[];
}

export interface RestError {
    code: string;
    message: string;
    target?: string;
    details?: RestError[];
    innererror?: RestInnerError;
}

type ErrorMessageFn = (
    viewer: Viewer,
    error: Error | any,
) => [number, RestError];

function joiErrorsToApiErrors(joiErrors: any[] = []): any[] {
    const apiErrors = joiErrors.map((joiError) => {
        const apiError = {
            code: undefined,
            message: undefined,
            target: undefined,
        };
        const fullTarget = joiError.path.join('.');
        const localTarget = joiError.path.slice(1).join('.');
        apiError.code = joiError.type;
        apiError.message = joiError.message;
        apiError.message = apiError.message.replace(fullTarget, localTarget);
        apiError.target = localTarget;
        return apiError;
    });

    return apiErrors;
}

const ERROR_MESSAGES: Record<string, ErrorMessageFn> = {
    ValidationFailed: (viewer, error) => {
        const statusCode = 400;
        const apiError = {
            code: 'BadArgument',
            message: 'Invalid argument',
            details: undefined,
        };
        if (error.tracer.details) {
            apiError.details = joiErrorsToApiErrors(error.tracer.details);
        }
        return [statusCode, apiError];
    },
    EntityValidationFailed: (viewer, error) => {
        const statusCode = 400;
        const apiError = {
            code: 'BadArgument',
            message: 'Invalid argument',
        };
        return [statusCode, apiError];
    },
    UnauthorizedError: (viewer, error) => {
        let statusCode = 401;
        let apiError = {
            code: 'Unauthenticated',
            message: 'Authentication required',
        };
        if (viewer.isAuthenticated) {
            statusCode = 403;
            apiError = {
                code: 'Unauthorized',
                message: 'Insufficient permissions',
            };
        }
        return [statusCode, apiError];
    },
    ForbiddenError: (viewer, error) => {
        const statusCode = 403;
        const apiError = {
            code: 'Unauthorized',
            message: 'Insufficient permissions',
        };
        return [statusCode, apiError];
    },
    SessionHijackAttempt: (viewer, error) => {
        const statusCode = 401;
        const apiError = {
            code: 'SessionSecurity',
            message: 'Session expired for security reasons',
        };
        return [statusCode, apiError];
    },
    SessionExpired: (viewer, error) => {
        const statusCode = 401;
        const apiError = {
            code: 'SessionExpired',
            message: 'Session expired due to inactivity',
        };
        return [statusCode, apiError];
    },
    NotFoundError: () => {
        return [
            404,
            {
                code: 'NotFound',
                message: 'Resource not found',
            },
        ];
    },
};

export default ERROR_MESSAGES;
