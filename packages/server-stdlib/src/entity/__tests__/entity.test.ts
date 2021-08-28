// @graph-mind
// Remove the previous line to stop Ada from updating this file
import createError from '../../errors';
import stdlib from '../../index';
import entity from '../entity';

describe('entity.genId', () => {
    it('Should generate an id 25 characters long', async () => {
        const id = entity.genId();
        expect(id.length).toEqual(25);
    });
});

describe('entity.clone', () => {
    it('Given an object, then return a new object without references to the last', async () => {
        const input = {
            name: 'test',
            sub: {
                item: 1,
            },
        };
        const result = entity.clone(input);
        input.sub.item = 2;
        expect(result).toEqual({
            name: 'test',
            sub: {
                item: 1,
            },
        });
    });
});

describe('entity.validate', () => {
    it('Given an entity and validation rule, validate the entity', async () => {
        const input = {
            name: 'test',
        };
        const validationRule = stdlib.validation.object().keys({
            name: stdlib.validation.string(),
        });
        const result = entity.validate(input, validationRule);
        await expect(result).resolves.toEqual(undefined);
    });

    it('Given an invalid entity and validation rule, validate the entity', async () => {
        const input = {
            name: true,
        };
        const validationRule = stdlib.validation.object().keys({
            name: stdlib.validation.string(),
        });
        const result = entity.validate(input, validationRule);
        await expect(result).rejects.toEqual(
            new createError.EntityValidationFailed('Invalid entity'),
        );
    });
});