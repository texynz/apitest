// @graph-mind
// Remove the previous line to stop Ada from updating this file
import joiDateValidation from '@joi/date';
import * as joiBase from 'joi';

const joi = joiBase.extend(joiDateValidation);

describe('joiDateValidation date', () => {
    describe('Happy path', () => {
        it('Given an input that is an ISO 8601 date, then succeed', async () => {
            const rule = joi.date().iso().utc();
            const input = '1969-07-16T13:32:00.000Z';
            const output = new Date('1969-07-16T13:32:00.000Z');
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
        it('Given an input that is a date object, then succeed', async () => {
            const rule = joi.date().iso().utc();
            const input = new Date('1969-07-16T13:32:00.000Z');
            const output = new Date('1969-07-16T13:32:00.000Z');
            const result = await rule.validateAsync(input);
            expect(result).toEqual(output);
        });
    });

    describe('Bad path', () => {
        it('Given an input that is not an ISO 8601 date, then fail', async () => {
            const rule = joi.date().iso().utc();
            const input = 'Wed, 06 Mar 2019 09:09:00 +0000';
            const output = new Error('"value" must be in ISO 8601 date format');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Given an input that is a number, then fail', async () => {
            const rule = joi.date().iso().utc();
            const input = 117;
            const output = new Error('"value" must be a valid date');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Given an input that is a string, then fail', async () => {
            const rule = joi.date().iso().utc();
            const input = 'a string';
            const output = new Error('"value" must be in ISO 8601 date format');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Given an input that is a boolean, then fail', async () => {
            const rule = joi.date().iso().utc();
            const input = true;
            const output = new Error('"value" must be a valid date');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});