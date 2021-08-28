// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import { StdlibTypes } from '@local/server-stdlib';

export default function authorizeViewerMiddleware(
    app,
    config,
    factory: StdlibTypes['Factory'],
) {
    app.use(async (req, res, next) => {
        try {
            const { viewer } = req;
            next();
        } catch (e) {
            next(e);
        }
    });
}
