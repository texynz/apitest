// @graph-mind
// Remove the previous line to stop Ada from updating this file
import joiBase from 'joi';
import Money from '../../primitive/money';
import joiMoneyValidation from '../joiMoneyValidation';

const joi = joiBase.extend(joiMoneyValidation);

describe('joiMoneyValidation money', () => {
    describe('Happy path', () => {
        it('Should pass given a money object of value ($10)', async () => {
            const rule = joi.money();
            const input = {
                amount: 1000,
                currency: 'NZD',
            };
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });

        it('Should pass given a money object of value ($0)', async () => {
            const rule = joi.money();
            const input = {
                amount: 0,
                currency: 'NZD',
            };
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });
        it('Should pass given a negative number', async () => {
            const rule = joi.money();
            const input = {
                amount: -1000,
                currency: 'NZD',
            };
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });

        it('Should pass given a money class of value ($10)', async () => {
            const rule = joi.money();
            const input = new Money({
                amount: 1000,
                currency: 'NZD',
            });
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });

        it('Should pass given a money class of value ($0) without a currency', async () => {
            const rule = joi.money();
            const input = new Money({
                amount: 0,
            });
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });
    });

    describe('Bad path', () => {
        it('Should fail given an empty object', async () => {
            const rule = joi.money();
            const input = {};
            const output = new Error('"amount" is required');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail given a string', async () => {
            const rule = joi.money();
            const input = 'string';
            const output = new Error('"value" must be of type object');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail given a number', async () => {
            const rule = joi.money();
            const input = 1;
            const output = new Error('"value" must be of type object');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail given an unknown currency', async () => {
            const rule = joi.money();
            const input = {
                amount: 1000,
                currency: '___',
            };
            const output = new Error(
                '"currency" must be one of [USD, NZD, JPY]',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});

describe('joiMoneyValidation money.currency', () => {
    describe('Happy path', () => {
        it('Should pass given a money object of value ($10)', async () => {
            const rule = joi.money().currency(['NZD']);
            const input = {
                amount: 1000,
                currency: 'NZD',
            };
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });

        it('Should pass given a money object of value ($0)', async () => {
            const rule = joi.money().currency(['NZD']);
            const input = {
                amount: 0,
                currency: 'NZD',
            };
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });

        it('Should pass given a money class of value ($0) with no currency', async () => {
            const rule = joi.money().currency(['NZD']);
            const input = new Money({
                amount: 0,
                currency: '',
            });
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });
        it('Should not store state between validation', async () => {
            const rule = joi.money().currency(['NZD']);
            const input = new Money({
                amount: 0,
                currency: '',
            });
            const input2 = {
                amount: 0,
                currency: 'NZD',
            };
            const output = new Money(input);
            const output2 = new Money(input2);
            const result = await rule.validateAsync(input);
            const result2 = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
            expect(result2.equal(output2)).toBeTruthy();
        });
    });

    describe('Bad path', () => {
        it('Should fail given an invalid currency', async () => {
            const rule = joi.money().currency(['USD']);
            const input = {
                amount: 1000,
                currency: 'NZD',
            };
            const output = new Error('"currency" must be one of [USD]');
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
        it('Should fail given an unsupported currency', async () => {
            const output = new Error(
                'Currency codes can only be [USD, NZD, JPY]',
            );
            return expect(async () => {
                joi.money().currency(['AUD-2']);
            }).rejects.toEqual(output);
        });
    });
});

describe('joiMoneyValidation money.min', () => {
    describe('Happy path', () => {
        it('Should pass given a money object of value ($10)', async () => {
            const rule = joi.money().min(10);
            const input = {
                amount: 1000,
                currency: 'NZD',
            };
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });
    });

    describe('Bad path', () => {
        it('Should fail given less than 10', async () => {
            const rule = joi.money().min(10);
            const input = {
                amount: 500,
                currency: 'NZD',
            };
            const output = new Error(
                '"value" must be larger than or equal to 10',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});

describe('joiMoneyValidation money.max', () => {
    describe('Happy path', () => {
        it('Should pass given a money object of value ($10)', async () => {
            const rule = joi.money().max(10);
            const input = {
                amount: 1000,
                currency: 'NZD',
            };
            const output = new Money(input);
            const result = await rule.validateAsync(input);
            expect(result.equal(output)).toBeTruthy();
        });
    });

    describe('Bad path', () => {
        it('Should fail given more than 10', async () => {
            const rule = joi.money().max(10);
            const input = {
                amount: 10000,
                currency: 'NZD',
            };
            const output = new Error(
                '"value" must be less than or equal to 10',
            );
            return expect(rule.validateAsync(input)).rejects.toEqual(output);
        });
    });
});