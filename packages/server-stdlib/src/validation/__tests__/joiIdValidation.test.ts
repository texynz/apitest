// @graph-mind
// Remove the previous line to stop Ada from updating this file
import joiBase from 'joi';
import joiIdValidation from '../joiIdValidation';

const joi = joiBase.extend(joiIdValidation);

describe('joiIdValidation cuid', () => {
    describe('Happy path', () => {
        it('Should pass when input (cjt41o9o4000001mm592xbfpi) matches the pattern: /c[a-zA-Z0-9]{24}/', async () => {
            const rule = joi.id();
            const input = 'cjt41o9o4000001mm592xbfpi';
            const output = 'cjt41o9o4000001mm592xbfpi';
            const result = await rule.validateAsync(input);
            expect(result).toBe(output);
        });
        it('Should trim the input', async () => {
            const rule = joi.id();
            const input = ' cjt41o9o4000001mm592xbfpi ';
            const output = 'cjt41o9o4000001mm592xbfpi';
            const result = await rule.validateAsync(input);
            expect(result).toBe(output);
        });
        it('Should pass with example value (cjt41o9o4000001mm592xbfpi)', async () => {
            const rule = joi.id();
            const input = 'cjt41o9o4000001mm592xbfpi';
            const output = 'cjt41o9o4000001mm592xbfpi';
            const result = await rule.validateAsync(input);
            expect(result).toBe(output);
        });
    });

    describe('Bad path', () => {
        it('Should fail when input length is more than length (25)', async () => {
            const rule = joi.id();
            const input = 'cccccccccccccccccccccccccc';
            const output = new Error(
                '"value" length must be 25 characters long',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail when input length is less than length (25)', async () => {
            const rule = joi.id();
            const input = 'cccccccccccccccccccccccc';
            const output = new Error(
                '"value" length must be 25 characters long',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail when input (ajld2cjxh0000qzrmn831i7rn) does not match the pattern: /c[a-zA-Z0-9]{24}/', async () => {
            const rule = joi.id();
            const input = 'ajld2cjxh0000qzrmn831i7rn';
            const output = new Error(
                '"value" with value "ajld2cjxh0000qzrmn831i7rn" fails to match the required pattern: /c[a-zA-Z0-9]{24}/',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});