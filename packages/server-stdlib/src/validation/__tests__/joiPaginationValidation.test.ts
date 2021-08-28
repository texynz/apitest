// @graph-mind
// Remove the previous line to stop Ada from updating this file
import joiBase from 'joi';
import joiPaginationValidation from '../joiPaginationValidation';

const joi = joiBase.extend(joiPaginationValidation);

describe('joiPaginationValidation sortable', () => {
    describe('Happy path', () => {
        it('Should pass when input is empty', async () => {
            const rule = joi.pagination().sortable(['name', 'createdAt']);
            const input = undefined;
            const output = [];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it('Should pass when given a single field', async () => {
            const rule = joi.pagination().sortable(['name', 'createdAt']);
            const input = 'name';
            const output = ['+name'];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass when given multiple fields', async () => {
            const rule = joi.pagination().sortable(['name', 'createdAt']);
            const input = 'name, createdAt';
            const output = ['+name', '+createdAt'];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass when given multiple fields (ascending, descending)', async () => {
            const rule = joi.pagination().sortable(['name', 'createdAt']);
            const input = '+name, -createdAt';
            const output = ['+name', '-createdAt'];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass when given a single nested field', async () => {
            const rule = joi
                .pagination()
                .sortable(['related.name', 'createdAt']);
            const input = 'related.name';
            const output = ['+related.name'];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
    });

    describe('Bad path', () => {
        it('Should fail when input limit is more than the max limit', async () => {
            const rule = joi.pagination().sortable(['name', 'createdAt']);
            const input = 'updatedAt';
            const output = new Error(
                '"value" must one or more of [name, createdAt]',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail when input offset is negative', async () => {
            const rule = joi.pagination().sortable(['name', 'createdAt']);
            const input = 'name, updatedAt';
            const output = new Error(
                '"value" must one or more of [name, createdAt]',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});

describe('joiPaginationValidation filter', () => {
    describe('Happy path', () => {
        it("Should pass when all products with a name equal to 'Milk'", async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
            });
            const input = "name eq 'Milk'";
            const output = ['===', 'name', 'Milk'];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it("Should pass when all products with a name not equal to 'Milk'", async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
            });
            const input = "name ne 'Milk'";
            const output = ['!==', 'name', 'Milk'];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it("Should pass when all products with the name 'Milk' that also have a price less than 2.55", async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                price: joi.number(),
            });
            const input = "name eq 'Milk' and price lt 2.55";
            const output = [
                '&&',
                ['<', 'price', 2.55],
                ['===', 'name', 'Milk'],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it("Should pass when all products that either have the name 'Milk' or have a price less than 2.55", async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                price: joi.number(),
            });
            const input = "name eq 'Milk' or price lt 2.55";
            const output = [
                '||',
                ['<', 'price', 2.55],
                ['===', 'name', 'Milk'],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it("Should pass when all products that have the name 'Milk' or 'Eggs' and have a price less than 2.55", async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                price: joi.number(),
            });
            const input =
                "(name eq 'Milk' or name eq 'Eggs') and price lt 2.55";
            const output = [
                '&&',
                ['<', 'price', 2.55],
                ['||', ['===', 'name', 'Eggs'], ['===', 'name', 'Milk']],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it("Should pass when all products that have a price less than 2.55 and have the name 'Milk' or 'Eggs'", async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                price: joi.number(),
            });
            const input =
                "price lt 2.55 and (name eq 'Milk' or name eq 'Eggs') ";
            const output = [
                '&&',
                ['||', ['===', 'name', 'Eggs'], ['===', 'name', 'Milk']],
                ['<', 'price', 2.55],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it("Should pass when all products that have a price less than 2.55 and have the name 'Milk'", async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                price: joi.number(),
            });
            const input = "price lt 2.55 and (name eq 'Milk') ";
            const output = [
                '&&',
                ['===', 'name', 'Milk'],
                ['<', 'price', 2.55],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it('Should pass when all products with not quantity less than 10', async () => {
            const rule = joi.pagination().filter({
                quantity: joi.number(),
            });
            const input = 'not quantity le 10';
            const output = ['!', ['<=', 'quantity', 10]];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass when all products with name eq or not quantity less than 10', async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                quantity: joi.number(),
            });
            const input = "name eq 'Milk' or not quantity le 10";
            const output = [
                '||',
                ['!', ['<=', 'quantity', 10]],
                ['===', 'name', 'Milk'],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass when all products with not name eq or not quantity less than 10', async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                quantity: joi.number(),
            });
            const input = "not name eq 'Milk' or not quantity le 10";
            const output = [
                '||',
                ['!', ['<=', 'quantity', 10]],
                ['!', ['===', 'name', 'Milk']],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass when all products with not grouped (name eq or quantity less than 10)', async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
                quantity: joi.number(),
            });
            const input = "not (name eq 'Milk' or quantity le 10)";
            const output = [
                '!',
                ['||', ['<=', 'quantity', 10]],
                ['===', 'name', 'Milk'],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it('Should pass given text with a space', async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
            });
            const input = "name eq 'Milk n Cookies'";
            const output = ['===', 'name', 'Milk n Cookies'];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it('Should pass given negative numbers', async () => {
            const rule = joi.pagination().filter({
                pi: joi.number(),
            });
            const input = 'pi ne -3.1415926';
            const output = ['!==', 'pi', -3.1415926];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it('Should pass field eq null', async () => {
            const rule = joi.pagination().filter({
                name: joi.string(),
            });
            const input = 'name eq null';
            const output = ['isNull', 'name', undefined];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass given field in string array', async () => {
            const rule = joi.pagination().filter({
                id: joi.string(),
            });
            const input = 'id in ["id1", "id2", "id3"]';
            const output = ['in', 'id', ['id1', 'id2', 'id3']];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass given field in numeric array', async () => {
            const rule = joi.pagination().filter({
                quantity: joi.number(),
            });
            const input = 'quantity in [1, 2, 3]';
            const output = ['in', 'quantity', [1, 2, 3]];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });

        it('Should pass given precedence grouping', async () => {
            const rule = joi.pagination().filter({
                priority: joi.number(),
                price: joi.number(),
                city: joi.string(),
            });
            const input =
                "(priority eq 1 or city eq 'Redmond') and price gt 100";
            const output = [
                '&&',
                ['>', 'price', 100],
                ['||', ['===', 'city', 'Redmond'], ['===', 'priority', 1]],
            ];
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
    });

    describe('Bad path', () => {
        it('Should fail when field is missing', async () => {
            const rule = joi.pagination().filter({});
            const input = "name eq 'Milk'";
            const output = new Error('"value" forbidden field: name');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail when field fails validation', async () => {
            const rule = joi.pagination().filter({
                name: joi.string().min(8),
            });
            const input = "name eq 'Milk'";
            const output = new Error(
                '"value" "name" length must be at least 8 characters long',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail when a field is an operator', async () => {
            const rule = joi.pagination().filter({
                name: joi.string().min(8),
            });
            const input = "name eq 'Milk' and gt 10";
            const output = new Error('"value" field cannot be an operator');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail when a value is an operator', async () => {
            const rule = joi.pagination().filter({
                name: joi.string().min(8),
            });
            const input = 'name eq gt 10';
            const output = new Error('"value" value cannot be an operator');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});