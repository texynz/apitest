// @graph-mind
// Remove the previous line to stop Ada from updating this file
/*
DISCLAIMER:
These tests have been on/copied from:
https://github.com/macor161/ts-money/blob/master/test/money.test.js

Copyright (c) 2014 David Kalosi
Copyright (c) 2017 Mathew Cormier

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */
import Money from '../money';

describe('Money', () => {
    it('should create a new instance from integer', () => {
        const money = new Money(10, 'NZD');

        expect(money.amount).toEqual(1000);
        expect(money.currency).toEqual('NZD');
    });

    it('should not create a new instance from decimal', () => {
        const money = new Money(10.42, 'NZD');

        expect(money.amount).toEqual(1042);
        expect(money.currency).toEqual('NZD');
    });

    it('should create a new instance from raw money object', () => {
        const money = new Money({ amount: 1042, currency: 'NZD' });

        expect(money.amount).toEqual(1042);
        expect(money.currency).toEqual('NZD');
    });

    it('should create a new instance from money object', () => {
        const money = new Money({ amount: 1042, currency: 'NZD' });
        const money2 = new Money(money);

        expect(money2.amount).toEqual(1042);
        expect(money2.currency).toEqual('NZD');
    });

    it('should create a new instance from money object a currency', () => {
        const money = new Money(0, 'NZD');
        const money2 = new Money(money);

        expect(money2.amount).toEqual(0);
        expect(money2.currency).toEqual('NZD');
    });

    it('should create a new instance from money object without a currency', () => {
        const money = new Money(0);
        const money2 = new Money(money);

        expect(money2.amount).toEqual(0);
        expect(money2.currency).toEqual('');
    });

    it('should create a new instance from yen object', () => {
        const money = new Money({ amount: 12000, currency: 'JPY' });
        const money2 = new Money(money);

        expect(money2.amount).toEqual(12000);
        expect(money2.currency).toEqual('JPY');
    });

    it('should detect invalid currency', () => {
        expect(() => {
            // eslint-disable-next-line no-new
            new Money(10, 'XYZ');
        }).toThrow(new Error('Undefined currency code: XYZ'));
    });

    it('should accept currencies as case insensitive', () => {
        const m1 = new Money(10, 'usd');
        const m2 = new Money(10, 'uSd');
        const m3 = new Money(10, 'USD');

        expect(m1.currency).toEqual('USD');
        expect(m2.currency).toEqual('USD');
        expect(m3.currency).toEqual('USD');
    });

    it('should serialize correctly', () => {
        const money = new Money(10.42, 'NZD');

        expect(typeof money.amount).toBe('number');
        expect(typeof money.currency).toBe('string');
    });

    it('should add same currencies', () => {
        const first = new Money(100, 'NZD');
        const second = new Money(50, 'NZD');

        const result = first.add(second);

        expect(result.amount).toEqual(15000);
        expect(result.currency).toEqual('NZD');

        expect(first.amount).toEqual(10000);
        expect(second.amount).toEqual(5000);
    });

    it('should not add different currencies', () => {
        const first = new Money(1000, 'NZD');
        const second = new Money(500, 'USD');

        expect(() => {
            first.add(second);
        }).toThrow(new Error('Cannot mix currencies (NZD, USD)'));
    });

    it('should allow for init without currency', () => {
        const first = new Money(1000);

        expect(first.add(new Money(1000, 'NZD')).toJSON()).toEqual({
            amount: 200000,
            currency: 'NZD',
            unit: 'cent',
        });
    });

    it('should check for same type', () => {
        const first = new Money(1000, 'NZD');

        expect(() => {
            // @ts-ignore
            first.add(new Money(1000, 'USD'));
        }).toThrow(new Error('Cannot mix currencies (NZD, USD)'));
    });

    it('should check if equal', () => {
        const first = new Money(1000, 'NZD');
        const second = new Money(1000, 'NZD');
        const third = new Money(1000, 'USD');
        const fourth = new Money(100, 'NZD');

        expect(first.equal(second)).toEqual(true);
        expect(first.equal(third)).toEqual(false);
        expect(first.equal(fourth)).toEqual(false);
    });

    it('should check if not equal', () => {
        const first = new Money(1000, 'NZD');
        const second = new Money(1000, 'NZD');
        const third = new Money(1000, 'USD');
        const fourth = new Money(100, 'NZD');

        expect(first.notEqual(second)).toEqual(false);
        expect(first.notEqual(third)).toEqual(true);
        expect(first.notEqual(fourth)).toEqual(true);
    });

    it('should check if greater than', () => {
        const first = new Money(10, 'NZD');
        const second = new Money(10, 'NZD');
        const third = new Money(15, 'NZD');
        const fourth = new Money(5, 'USD');
        const fifth = new Money(5, 'NZD');

        expect(first.greaterThan(second)).toEqual(false);
        expect(first.greaterThan(third)).toEqual(false);
        expect(first.greaterThan(fourth)).toEqual(false);
        expect(first.greaterThan(fifth)).toEqual(true);
        expect(first.greaterThan(5)).toEqual(true);
        expect(first.greaterThan(15)).toEqual(false);
    });

    it('should check if greater or equal than', () => {
        const first = new Money(10, 'NZD');
        const second = new Money(10, 'NZD');
        const third = new Money(15, 'NZD');
        const fourth = new Money(5, 'USD');
        const fifth = new Money(5, 'NZD');

        expect(first.greaterThanOrEqual(second)).toEqual(true);
        expect(first.greaterThanOrEqual(third)).toEqual(false);
        expect(first.greaterThanOrEqual(fourth)).toEqual(false);
        expect(first.greaterThanOrEqual(fifth)).toEqual(true);
        expect(first.greaterThanOrEqual(5)).toEqual(true);
        expect(first.greaterThanOrEqual(15)).toEqual(false);
    });

    it('should check if less than', () => {
        const first = new Money(10, 'NZD');
        const second = new Money(10, 'NZD');
        const third = new Money(5, 'NZD');
        const fourth = new Money(15, 'USD');
        const fifth = new Money(15, 'NZD');

        expect(first.lessThan(second)).toEqual(false);
        expect(first.lessThan(third)).toEqual(false);
        expect(first.lessThan(fourth)).toEqual(false);
        expect(first.lessThan(fifth)).toEqual(true);
        expect(first.lessThan(5)).toEqual(false);
        expect(first.lessThan(15)).toEqual(true);
    });

    it('should check if less or equal than', () => {
        const first = new Money(10, 'NZD');
        const second = new Money(10, 'NZD');
        const third = new Money(5, 'NZD');
        const fourth = new Money(15, 'USD');
        const fifth = new Money(15, 'NZD');

        expect(first.lessThan(second)).toEqual(false);
        expect(first.lessThan(third)).toEqual(false);
        expect(first.lessThan(fourth)).toEqual(false);
        expect(first.lessThan(fifth)).toEqual(true);
        expect(first.lessThan(5)).toEqual(false);
        expect(first.lessThan(15)).toEqual(true);
    });

    it('should subtract same currencies correctly', () => {
        const subject = new Money(100, 'NZD');
        const result = subject.subtract(new Money(25, 'NZD'));

        expect(result.amount).toEqual(7500);
        expect(result.currency).toEqual('NZD');
    });

    it('should multiply correctly', () => {
        const subject = new Money(10, 'NZD');

        expect(subject.multiply(1.2234).amount).toEqual(1223);
    });

    it('should divide correctly', () => {
        const subject = new Money(10, 'NZD');
        expect(subject.divide(2.234).amount).toEqual(448);
    });

    it('should allocate correctly', () => {
        const subject = new Money(10, 'NZD');
        const results = subject.allocate([1, 1, 1]);

        expect(results.length).toEqual(3);
        expect(results[0].amount).toEqual(334);
        expect(results[0].currency).toEqual('NZD');
        expect(results[1].amount).toEqual(333);
        expect(results[1].currency).toEqual('NZD');
        expect(results[2].amount).toEqual(333);
        expect(results[2].currency).toEqual('NZD');
    });

    it('should allocate correctly (70, 30)', () => {
        const subject = new Money(10, 'NZD');
        const results = subject.allocate([70, 30]);

        expect(results.length).toEqual(2);
        expect(results[0].amount).toEqual(700);
        expect(results[0].currency).toEqual('NZD');
        expect(results[1].amount).toEqual(300);
        expect(results[1].currency).toEqual('NZD');
    });

    it('should distribute correctly', () => {
        const subject = new Money(12.35, 'NZD');
        const results = subject.distribute(3);

        expect(results.length).toEqual(3);
        expect(results[0].amount).toEqual(412);
        expect(results[0].currency).toEqual('NZD');
        expect(results[1].amount).toEqual(412);
        expect(results[1].currency).toEqual('NZD');
        expect(results[2].amount).toEqual(411);
        expect(results[2].currency).toEqual('NZD');
    });

    it('should allow to be concatenated with a string', () => {
        const subject = new Money(10, 'NZD');

        expect(`${subject}`).toEqual('$10.00');
    });

    it('should allow to be stringified as JSON', () => {
        const subject = new Money(10, 'NZD');

        expect(JSON.stringify({ foo: subject })).toEqual(
            '{"foo":{"currency":"NZD","amount":1000,"unit":"cent"}}',
        );
    });

    it('should return the amount/currency represented by object', () => {
        const subject = new Money(10, 'NZD');

        expect(subject.amount).toEqual(1000);
        expect(subject.currency).toEqual('NZD');
    });

    it('should sum an array of money', () => {
        const first = new Money(10, 'NZD');
        const second = new Money(10, 'NZD');
        const third = new Money(10, 'NZD');
        const result = Money.sum([first, second, third]);

        expect(result.amount).toEqual(3000);
        expect(result.currency).toEqual('NZD');
    });

    it('should sum an array of objects with a money property', () => {
        const first = new Money(10, 'NZD');
        const second = new Money(10, 'NZD');
        const third = new Money(10, 'NZD');
        const result = Money.sum(
            [{ price: first }, { price: second }, { price: third }],
            'price',
        );

        expect(result.amount).toEqual(3000);
        expect(result.currency).toEqual('NZD');
    });

    it('should not mutate the input array', () => {
        const first = new Money(10, 'NZD');
        const second = new Money(10, 'NZD');
        const third = new Money(10, 'NZD');
        const input = [first, second, third];
        Money.sum(input);

        expect(input.length).toEqual(3);
    });

    it('should stringify with a symbol (positive)', () => {
        const subject = new Money(10, 'NZD');

        expect(`${subject}`).toEqual('$10.00');
    });

    it('should stringify with a symbol (negative)', () => {
        const subject = new Money(-10, 'NZD');

        expect(`${subject}`).toEqual('-$10.00');
    });

    it('should format with a symbol (positive)', () => {
        const subject = new Money(10, 'NZD');

        expect(`${subject.format()}`).toEqual('$10.00');
    });

    it('should format with a symbol (negative)', () => {
        const subject = new Money(-10, 'NZD');

        expect(`${subject.format()}`).toEqual('-$10.00');
    });

    it('should format without a symbol (positive)', () => {
        const subject = new Money(10, 'NZD');

        expect(`${subject.format(false)}`).toEqual('10.00');
    });

    it('should format without a symbol (negative)', () => {
        const subject = new Money(-10, 'NZD');

        expect(`${subject.format(false)}`).toEqual('-10.00');
    });
});