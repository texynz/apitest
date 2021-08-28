// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

// NPM Packages
import bodyParser from 'body-parser';

export default function endpointsMiddleware(app) {
    // Enable json bodies
    app.use('/api/rest', bodyParser.json());
}
