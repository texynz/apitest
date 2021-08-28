// @graph-mind
// Remove the previous line to stop Ada from updating this file
/* eslint-disable @typescript-eslint/no-use-before-define */
import { QueryBuilder } from 'objection';
import { SearchCriteriaFailed } from '../errors';

type SchemaType = Record<string, any>;

function testColumnName(columnName: string) {
    if (typeof columnName !== 'string') {
        throw new SearchCriteriaFailed('Invalid sort criteria');
    }
}
// This only search a single depth
function findColumnName(
    schema: SchemaType,
    dirtyColumnName: string,
): [string, SchemaType] {
    // If we can find the column name directly, then use it;
    let currentSchema = schema;
    let columnName = schema[dirtyColumnName];
    if (columnName) {
        // if not a string, then throw an error!
        testColumnName(columnName);
        // Scope the request to the current table

        columnName = `${currentSchema.$table}.${columnName}`;
        return [columnName, currentSchema];
    }
    // Otherwise split the name and see if it is inside our child name
    const columnNameParts = dirtyColumnName.split('.');
    if (columnNameParts.length >= 2) {
        const [tableName, ...remainingColumnParts] = columnNameParts;
        columnName = remainingColumnParts.join('.');
        currentSchema = currentSchema[tableName];
        if (!currentSchema) {
            throw new SearchCriteriaFailed('Invalid sort criteria');
        }
        columnName = currentSchema[columnName];
        testColumnName(columnName);
        columnName = `${currentSchema.$table}.${columnName}`;
    }
    return [columnName, currentSchema];
}

function joinQueries(
    query: QueryBuilder<any, any>,
    schema: SchemaType,
    sort: string[],
) {
    let hasId = false;
    const relations: Record<
        string,
        { join: string; by: string; on: string }
    > = {};
    const walkSort = (sortBy: string) => {
        const sortDirection = sortBy.slice(0, 1);
        const [columnName, columnSchema] = findColumnName(
            schema,
            sortBy.slice(1),
        );
        if (columnName === 'id') {
            if (hasId) {
                return;
            }
            hasId = true;
        }
        if (sortDirection === '-') {
            query.orderBy(columnName, 'desc');
        } else {
            query.orderBy(columnName, 'asc');
        }
        if (schema.$table !== columnSchema.$table) {
            const fromProperty = `$from_${columnSchema.$table}`;
            const toProperty = `$to_${columnSchema.$table}`;
            relations[columnSchema.$table] = {
                join: columnSchema.$table,
                by: schema[fromProperty],
                on: schema[toProperty],
            };
        }
    };
    sort.forEach(walkSort);
    Object.values(relations).forEach((relation) => {
        query.join(relation.join, relation.on, '=', relation.by);
    });
}

export default function applySort(
    query: QueryBuilder<any, any>,
    schema: SchemaType,
    sort: string[],
): QueryBuilder<any, any> {
    joinQueries(query, schema, sort);
    return query;
}