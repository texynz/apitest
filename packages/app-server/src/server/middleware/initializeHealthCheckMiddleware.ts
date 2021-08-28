// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import { StdlibTypes } from '@local/server-stdlib';
import openapi from '../../../openapi.json';
import { ErrorHandler } from '../genErrorHandler';
import { RestErrorHandler } from '../genRestErrorHandler';

export default function initializeHealthCheckMiddleware(
    app,
    config,
    factory: StdlibTypes['Factory'],
) {
    app.get('/health', (req, res) => {
        const {
            errorHandler,
        }: {
            errorHandler: ErrorHandler;
        } = req.app.locals;
        if (errorHandler.isCritical) {
            res.status(RestErrorHandler.DEFAULT_ERROR_STATUS).send(
                RestErrorHandler.DEFAULT_ERROR_RESPONSE,
            );
        } else {
            res.status(200).send({ success: true });
        }
    });

    if (process.env.NODE_ENV !== 'production') {
        app.get('/api/docs', (req, res) => {
            res.status(200).send(`<!DOCTYPE html>
<html>
    <head>
        <title>App - ReDoc</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
            body {
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body>
        <redoc spec-url='/api/openapi.json'></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
    </body>
</html>`);
        });
        app.get('/api/openapi.json', (req, res) => {
            res.status(200).send(openapi);
        });
    }
}
