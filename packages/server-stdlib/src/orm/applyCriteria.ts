// @graph-mind
// Remove the previous line to stop Ada from updating this file
/* eslint-disable @typescript-eslint/no-use-before-define */
import { QueryBuilder } from 'objection';
import { SearchCriteriaFailed } from '../errors';

type SchemaType = Record<string, any>;

type QueryMethodName = 'where' | 'andWhere' | 'orWhere' | 'whereNot';

type CriteriaQueryFn = (
    currentQuery: QueryBuilder<any, any>,
    schema: SchemaType,
    condition: any[],
    method: QueryMethodName,
) => void;

function testColumnName(columnName: string) {
    if (typeof columnName !== 'string') {
        throw new SearchCriteriaFailed('Invalid search criteria');
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
            throw new SearchCriteriaFailed('Invalid search criteria');
        }
        columnName = currentSchema[columnName];
        testColumnName(columnName);
        columnName = `${currentSchema.$table}.${columnName}`;
    }
    return [columnName, currentSchema];
}

const OPERATOR_GROUP_MAP = {
    '()': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        currentQuery[method]((builder) => {
            condition.slice(1).forEach((criteria) => {
                criteriaToQuery(builder, schema, criteria, 'where');
            });
        });
    },
    '&&': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        currentQuery[method]((builder) => {
            condition.slice(1).forEach((criteria) => {
                criteriaToQuery(builder, schema, criteria, 'andWhere');
            });
        });
    },
    '||': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        currentQuery[method]((builder) => {
            condition.slice(1).forEach((criteria) => {
                criteriaToQuery(builder, schema, criteria, 'orWhere');
            });
        });
    },
    '!': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        currentQuery[method]((builder) => {
            condition.slice(1).forEach((criteria) => {
                criteriaToQuery(builder, schema, criteria, 'whereNot');
            });
        });
    },
};
const OPERATOR_MAP: Record<string, CriteriaQueryFn> = {
    ...OPERATOR_GROUP_MAP,
    '===': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        const value = condition[2];
        currentQuery[method](columnName, '=', value);
    },
    '!==': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        const value = condition[2];
        currentQuery.whereNot(columnName, '=', value);
    },
    '>': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        const value = condition[2];
        currentQuery[method](columnName, '>', value);
    },
    '>=': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        const value = condition[2];
        currentQuery[method](columnName, '>=', value);
    },
    '<': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        const value = condition[2];
        currentQuery[method](columnName, '<', value);
    },
    '<=': (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        const value = condition[2];
        currentQuery[method](columnName, '<=', value);
    },
    isNull: (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        currentQuery[method](columnName, 'is', null);
    },
    in: (
        currentQuery: QueryBuilder<any, any>,
        schema: SchemaType,
        condition: any[],
        method: QueryMethodName = 'where',
    ) => {
        const [columnName] = findColumnName(schema, condition[1]);
        let value = condition[2];
        if (!Array.isArray(value)) {
            value = [value];
        }
        currentQuery[method](columnName, 'in', value);
    },
};

function criteriaToQuery(
    currentQuery: QueryBuilder<any, any>,
    schema: SchemaType,
    criteria: any[],
    method: QueryMethodName = 'where',
): QueryBuilder<any, any> {
    const operator = criteria[0];
    const operatorFn: CriteriaQueryFn = OPERATOR_MAP[operator];
    if (operatorFn) {
        operatorFn(currentQuery, schema, criteria, method);
    }
    return currentQuery;
}

function joinQueries(
    query: QueryBuilder<any, any>,
    schema: SchemaType,
    criteria: any,
) {
    const relations: Record<
        string,
        { join: string; by: string; on: string }
    > = {};
    const walkCriteria = (condition: any[]) => {
        const operator = condition[0];
        const operatorFn: CriteriaQueryFn = OPERATOR_GROUP_MAP[operator];
        if (operatorFn) {
            condition.slice(1).forEach(walkCriteria);
            return;
        }
        const [, columnSchema] = findColumnName(schema, condition[1]);
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
    walkCriteria(criteria);
    Object.values(relations).forEach((relation) => {
        query.join(relation.join, relation.on, '=', relation.by);
    });
}

export default function applyCriteria(
    query: QueryBuilder<any, any>,
    schema: SchemaType,
    criteria: any,
): QueryBuilder<any, any> {
    joinQueries(query, schema, criteria);
    criteriaToQuery(query, schema, criteria);
    return query;
}