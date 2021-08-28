// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import stdlib from '@local/server-stdlib';
import express, { Express } from 'express';
import http from 'http';
import endpointsMiddleware from './api/endpoints';
import config from './config';
import genDatabase from './server/genDatabase';
import genErrorHandler, { ErrorHandler } from './server/genErrorHandler';
import genFactory from './server/genFactory';
import finalMiddleware from './server/middleware/finalMiddleware';
import initialMiddleware from './server/middleware/initialMiddleware';

// Custom types
type HttpServer = Omit<http.Server, 'close'> & {
    close: (cb?) => Promise<void>;
};

// Register our initial fatal handler
function fatalListener(error) {
    stdlib.Logger.lowLevelEmergency('Unexpected fatal error', error);
    process.exitCode = 1;
    process.exit(1);
}
process.on('unhandledRejection', fatalListener);
process.on('uncaughtException', fatalListener);

function genExitHandler(server: HttpServer, errorHandler: ErrorHandler) {
    function exitHandler(reason: string, exit: boolean, code?: number) {
        return async (error) => {
            errorHandler.logger.notice('Exit handler called', { reason });
            if (exit) {
                await errorHandler.handleError(error).catch(() => {});
                // Register a timeout handler to ensure the application exits
                setTimeout(() => {
                    errorHandler.logger.notice('Forced exit by timeout');
                    process.exit(code);
                }, 2500).unref();
            }
            // Attempt graceful shutdown
            await server
                .close()
                .then(() => {
                    errorHandler.logger.notice('Server gracefully shutdown');
                })
                .catch((shutdownError) => {
                    errorHandler.logger.warning(
                        'Server failed to shutdown',
                        shutdownError,
                    );
                });
            if (exit) {
                process.exit(code);
            }
        };
    }

    // shutdown the server on exit
    process.on('exit', exitHandler('exit', false));

    // catches ctrl+c event
    process.on('SIGINT', exitHandler('SIGINT', true, 0));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler('SIGUSR1', true, 0));
    process.on('SIGUSR2', exitHandler('SIGUSR2', true, 0));

    // catches unhandled rejections
    process.on(
        'unhandledRejection',
        exitHandler('unhandledRejection', true, 1),
    );
    // catches uncaught exceptions
    process.on('uncaughtException', exitHandler('uncaughtException', true, 1));

    // catches graceful shutdown
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.on('gracefulShutdown', exitHandler('gracefulShutdown', true, 0));

    // Once we have registered out exitHandler then remove our initial fatal listeners
    process.removeListener('unhandledRejection', fatalListener);
    process.removeListener('uncaughtException', fatalListener);

    errorHandler.logger.notice('Exit handler registered');
}

async function startup(): Promise<HttpServer> {
    const logger = new stdlib.Logger();
    const database = await genDatabase(config);

    const factory = genFactory({
        config,
        Logger: () => logger,
        Database: () => database,
    });

    const errorHandler = genErrorHandler(factory);
    try {
        const app: Express = express();
        app.locals.factory = factory;
        app.locals.errorHandler = errorHandler;
        // Initialize our middleware, this is where we add session recognition
        initialMiddleware(app, config, factory);
        endpointsMiddleware(app);
        // Finalize our middleware, this is where we add error handling
        finalMiddleware(app, config, factory);
        // Start the application server
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const server = app.listen({ port: config.SERVER_PORT }, (error) => {
            if (error) {
                logger.emergency('Server startup failure', error);
                errorHandler.handleError(error);
                // Crash the server, we encountered a critical error
                throw error;
            }
            logger.notice('Server started');
        }) as HttpServer;
        // Convert "server.close" into a promise
        const originalClose = server.close.bind(server);
        server.close = () => {
            return new Promise((resolveClose) => {
                originalClose(resolveClose);
            });
        };
        genExitHandler(server, errorHandler);
        return server;
    } catch (error) {
        await errorHandler.handleError(error);
        throw error;
    }
}
// Export out startup function
export default startup;
