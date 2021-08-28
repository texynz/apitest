// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import { StdlibTypes } from '@local/server-stdlib';
import Viewer from '../viewer';

export default function initializeViewerMiddleware(
    app,
    config,
    factory: StdlibTypes['Factory'],
) {
    app.use(async (req, res, next) => {
        try {
            const viewer = new Viewer();
            viewer.addLog(factory.new('Logger'), {
                ip: req.ip,
                method: req.method,
                path: req.path,
            });
            viewer.addDatabase(factory.new('Database'));
            req.viewer = viewer;
            req.user = req.viewer;
            req.viewer.useLog().notice('Request started');
            next();
        } catch (e) {
            next(e);
        }
    });
}
