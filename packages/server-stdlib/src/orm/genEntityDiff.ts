// @graph-mind
// Remove the previous line to stop Ada from updating this file
import kindOf from 'kind-of';
import { Money } from '../primitive';

function getType(value: any): string {
    if (value instanceof Money) {
        return 'money';
    }
    return kindOf(value);
}
// Improvements: should this take an entity schema and strip all fields that are not inside it?
// Improvements: provide a list of deleted relations
export default function genEntityDiff<T extends Record<string, any>>(
    previousEntity: Partial<T>,
    updatedEntity: Partial<T>,
    idKey = 'id',
): Partial<T> {
    // create an entity map to track records by id,
    // for each record found in the new entity, remove it from the old map
    // delete all remaining entities from the old map

    // Depending on the type, the property is tracked differently in the entity map
    // IF the property is an object or primitive it is tracked normally
    // IF the property is an array of primitives it is overwritten
    // IF the property is an array of objects it is mapped to [prop][id] = value

    const entityMap: Record<string, any> = {};
    const diff: Partial<any> = {};

    Object.entries(previousEntity).forEach(([key, value]) => {
        if (key === '$stored') {
            return;
        }
        if (Array.isArray(value)) {
            // Make the assumption that the value is an object
            // Overwrite the value if it is given a primitive
            entityMap[key] = {};
            value.every((item) => {
                const type = getType(item);
                if (type === 'object') {
                    entityMap[key][item.$id] = item;
                    return true;
                }
                // Else update the value
                entityMap[key] = value;
                return false;
            });
            return;
        }
        const type = getType(value);
        if (type === 'object') {
            entityMap[key] = value;
            // It is nested
            return;
        }
        entityMap[key] = value;
    });

    Object.entries(updatedEntity).forEach(([key, value]) => {
        if (key === '$stored') {
            return;
        }
        if (Array.isArray(value)) {
            diff[key] = [];
            value.every((item) => {
                const type = getType(item);
                if (type === 'object') {
                    const currentItem = entityMap[key][item.$id];
                    if (currentItem) {
                        // This is a new item, so take its diff and push it into the array...
                        diff[key].push(genEntityDiff(currentItem, item, '$id'));
                        // Remove the the entity map so we can track deleted relations...
                        delete entityMap[key][item.$id];
                    } else {
                        // This is a new item, so push it into the array...
                        diff[key].push(item);
                    }
                    return true;
                }
                // Else update the value
                diff[key] = value;
                return false;
            });
            return;
        }

        const type = getType(value);
        if (type === 'object') {
            const currentItem = entityMap[key];
            if (currentItem) {
                // This is a new item, so take its diff and push it into the array...
                diff[key] = genEntityDiff(currentItem, value, '$id');
            } else {
                // This is a new item, so push it into the array...
                diff[key] = value;
            }
            return;
        }
        if (entityMap[key] !== value) {
            diff[key] = value;
        }
    });

    // Track the id of the entity;
    diff[idKey] = updatedEntity[idKey];

    // TODO: identify deleted models

    return diff;
}