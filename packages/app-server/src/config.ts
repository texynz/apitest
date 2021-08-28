// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

import path from 'path';

if (process.env.NODE_ENV !== 'production') {
    // Load local environment variables
    require('dotenv').config({
        path: path.resolve(__dirname, '.env.development'),
    });
} else {
    require('dotenv').config();
}

const config: Record<string, any> = {
    SERVER_PORT: Number(process.env.PORT),
    SERVER_HOST: process.env.HOST,
    POSTGRES_CONNECTION: {
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_USER_PASSWORD,
            database: process.env.DATABASE_NAME,
            timezone: 'UTC',
        },
        searchPath: [process.env.DATABASE_SCHEMA],
    },
};

export default config;
