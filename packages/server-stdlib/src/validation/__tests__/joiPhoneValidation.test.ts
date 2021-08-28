// @graph-mind
// Remove the previous line to stop Ada from updating this file
import joiBase from 'joi';
import joiPhoneValidation from '../joiPhoneValidation';

const joi = joiBase.extend(joiPhoneValidation);

describe('joiPhoneValidation mobile', () => {
    describe('Happy path', () => {
        it('Should pass when input is a valid mobile phone number', async () => {
            const rule = joi.phone().mobile();
            const input = '+64214444333';
            const output = '+64214444333';
            const result = await rule.validateAsync(input);
            expect(result).toBe(output);
        });
        it('Should pass when input is a valid mobile phone number in the allowed country list [NZL]', async () => {
            const rule = joi.phone().mobile(['NZL']);
            const input = ' +64214444333 ';
            const output = '+64214444333';
            const result = await rule.validateAsync(input);
            expect(result).toBe(output);
        });
        it('Should trim the input', async () => {
            const rule = joi.phone().mobile();
            const input = ' +64214444333 ';
            const output = '+64214444333';
            const result = await rule.validateAsync(input);
            expect(result).toBe(output);
        });
    });
    describe('Bad path', () => {
        it('Should fail when input is a valid mobile phone number and not in the allowed country list [NZL]', async () => {
            const rule = joi.phone().mobile(['NZL']);
            const input = '+61414444333';
            const output = new Error('"value" must be one of [NZL]');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });

        it('Should fail when input is no a mobile phone number', async () => {
            const rule = joi.phone().mobile(['NZL']);
            const input = '0800 83 83 83';
            const output = new Error('"value" must be a mobile phone number');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});