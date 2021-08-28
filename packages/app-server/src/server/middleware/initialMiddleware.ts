// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import { StdlibTypes } from '@local/server-stdlib';
import helmet from 'helmet';
import authorizeViewerMiddleware from './authorizeViewerMiddleware';
import identifyViewerMiddleware from './identifyViewerMiddleware';
import initializeHealthCheckMiddleware from './initializeHealthCheckMiddleware';
import initializeViewerMiddleware from './initializeViewerMiddleware';

export default function initialMiddleware(
    app,
    config,
    factory: StdlibTypes['Factory'],
) {
    // Clean headers
    if (process.env.NODE_ENV !== 'production') {
        // Allow all images, restrict scrips to self, data, blob and cdn.jsdelivr.net
        app.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                        'img-src': ['*', 'data:'],
                        'script-src': [
                            "'self'",
                            'data:',
                            'blob:',
                            'cdn.jsdelivr.net',
                        ],
                        'upgrade-insecure-requests': [],
                    },
                },
            }),
        );
    } else {
        // Aggressively block all content via the content security policy
        // This is an api server after all
        app.use(helmet());
    }
    // Disable the powered by header
    app.disable('x-powered-by');
    app.set('trust proxy', 1);
    // initialize our health check endpoint
    initializeHealthCheckMiddleware(app, config, factory);
    // initialize our viewer
    initializeViewerMiddleware(app, config, factory);
    // Identify our viewer by session or token
    identifyViewerMiddleware(app, config, factory);
    // Authorize our viewer by fetching permissions
    authorizeViewerMiddleware(app, config, factory);
}
