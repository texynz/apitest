// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

import Knex from 'knex';

export default async function genDatabase(config): Promise<Knex> {
    const database = Knex({
        client: 'pg',
        ...config.POSTGRES_CONNECTION,
    });
    await database.raw('SELECT 1;');
    return database;
}
