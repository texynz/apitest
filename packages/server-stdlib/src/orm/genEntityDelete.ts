// @graph-mind
// Remove the previous line to stop Ada from updating this file
import kindOf from 'kind-of';
import * as Knex from 'knex';
import { QueryBuilder } from 'objection';
import { Money } from '../primitive';

function getType(value: any): string {
    if (value instanceof Money) {
        return 'money';
    }
    return kindOf(value);
}

export default function genEntityDelete<T extends Record<string, any>>(
    rootSchema: any,
    transaction: Knex,
    currentEntity: T,
): QueryBuilder<any, any>[] {
    const queries = [];

    const queryBatchMap: Record<
        string,
        { query: QueryBuilder<any, any>; ids: any[] }
    > = {};

    const addToQueryBatch = (schema: any, relation: string, id: any) => {
        const queryBatchId = `${schema.$tableName}-${relation}`;
        if (!queryBatchMap[queryBatchId]) {
            queryBatchMap[queryBatchId] = {
                query: schema.relatedQuery(relation, transaction),
                ids: [id],
            };
        } else {
            queryBatchMap[queryBatchId].ids.push(id);
        }
    };

    const walkEntity = (
        entity: Record<string, any>,
        schema: any,
        idKey = 'id',
    ) => {
        Object.entries(entity).forEach(([relation, value]) => {
            if (relation === '$stored') {
                return;
            }
            if (Array.isArray(value)) {
                value.every((item) => {
                    const type = getType(item);
                    if (type === 'object') {
                        walkEntity(
                            item,
                            schema.relationMappings[relation].modelClass,
                            '$id',
                        );
                        return true;
                    }
                    return false;
                });
                addToQueryBatch(schema, relation, entity[idKey]);
                return;
            }
            const type = getType(value);
            if (type === 'object') {
                walkEntity(
                    value,
                    schema.relationMappings[relation].modelClass,
                    '$id',
                );
                addToQueryBatch(schema, relation, entity[idKey]);
            }
        });
    };

    walkEntity(currentEntity, rootSchema);

    Object.values(queryBatchMap).forEach((batch) => {
        queries.push(batch.query.for(batch.ids).delete());
    });
    queries.push(
        rootSchema
            .query(transaction)
            .where('id', '=', currentEntity.id)
            .delete(),
    );

    return queries;
}