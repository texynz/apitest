// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

import stdlib, { StdlibTypes } from '@local/server-stdlib';
import Viewer from './viewer';

export class ErrorHandler {
    public static DEPENDENCIES = ['Logger'];

    public static OPERATIONAL_ERRORS = [
        stdlib.createError.NotFound.name,
        stdlib.createError.Unauthorized.name,
        stdlib.createError.Forbidden.name,
        stdlib.createError.ValidationFailed.name,
        stdlib.createError.EntityValidationFailed.name,
        stdlib.createError.SessionHijackAttempt.name,
        stdlib.createError.SessionExpired.name,
        'SIGINT',
        'SIGUSR1',
        'SIGUSR2',
        'gracefulShutdown',
    ];

    public isCritical: boolean;

    public readonly logger: StdlibTypes['Logger'];

    public constructor(dependencies: { Logger: StdlibTypes['Logger'] }) {
        this.isCritical = false;
        this.logger = dependencies.Logger;
    }

    public async handleError(
        error: Error | any,
        viewer?: Viewer,
    ): Promise<boolean> {
        try {
            const isOperational = ErrorHandler.isOperationalError(error);
            // Log the error...
            if (isOperational) {
                this.useLogger(viewer).warning('Handled runtime error', error);
            } else {
                // Crash the process because this is unexpected...
                this.isCritical = true;
                this.useLogger(viewer).critical('Unhandled error', error);
            }
            return isOperational;
        } catch (unexpectedError) {
            this.useLogger(viewer).emergency('Unhandled error', error);
            this.requestGracefulShutdown(unexpectedError);
            return false;
        }
    }

    public static isOperationalError(error: Error): boolean {
        try {
            if (typeof error === 'string') {
                return ErrorHandler.OPERATIONAL_ERRORS.includes(error);
            }
            if (!error.name) {
                return false;
            }
            return ErrorHandler.OPERATIONAL_ERRORS.includes(error.name);
        } catch (e) {
            return false;
        }
    }

    public requestGracefulShutdown(error: Error): void {
        if (!this.isCritical) {
            this.isCritical = true;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            process.emit('gracefulShutdown', error);
        }
    }

    public useLogger(viewer: Viewer): StdlibTypes['Logger'] {
        if (!viewer) {
            return this.logger;
        }
        if (!viewer.useLog()) {
            return this.logger;
        }
        return viewer.useLog();
    }
}

export default function genErrorHandler(
    factory: StdlibTypes['Factory'],
): ErrorHandler {
    const errorHandler = factory.new<ErrorHandler>(ErrorHandler);
    factory.add(ErrorHandler, errorHandler);
    return errorHandler;
}
