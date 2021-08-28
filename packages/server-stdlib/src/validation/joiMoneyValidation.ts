// @graph-mind
// Remove the previous line to stop Ada from updating this file
import Joi from 'joi';
import kindOf from 'kind-of';
import Money from '../primitive/money';
import { isArrayOfStrings, isNumber } from './utils';

export interface JoiMoneySchema extends Joi.AnySchema {
    currency: (string: string[]) => this;
    min: (limit: number) => this;
    max: (limit: number) => this;
}

const SUPPORTED_CURRENCIES = Object.keys(Money.CURRENCIES);

export default function (joi: Joi.Root): Joi.Extension {
    const MONEY_BASE = joi
        .object({
            amount: joi.number().integer().required(),
            currency: joi.string().length(3).required(),
        })
        .required();
    const MONEY_TYPE_BASE = joi
        .object({
            amount: joi.number().integer().required(),
            currency: joi.string().length(3).allow('').required(),
        })
        .required();

    function cleanValue(
        rawValue,
        helpers,
    ): { value: { amount: number; currency: string }; error: any } {
        try {
            const context = {
                dataType: kindOf(rawValue),
            };
            if (rawValue instanceof Money) {
                const { value, error } = MONEY_TYPE_BASE.validate(rawValue, {
                    stripUnknown: true,
                    convert: true,
                    context,
                });
                return { value, error };
            }
            const { value, error } = MONEY_BASE.validate(rawValue, {
                stripUnknown: true,
                convert: true,
                context,
            });
            return { value, error };
        } catch (e) {
            return { value: rawValue, error: helpers.error('money.base') };
        }
    }
    return {
        type: 'money',
        base: joi.any(),
        messages: {
            'money.base': '{{#label}} must be a money object',
            'money.currency': '"currency" must be one of {{#codes}}',
            'money.min':
                '{{#label}} must be larger than or equal to {{#limit}}',
            'money.max': '{{#label}} must be less than or equal to {{#limit}}',
        },
        flags: {
            currencies: {
                default: [],
            },
        },
        validate(rawValue, helpers) {
            const { value, error } = cleanValue(rawValue, helpers);
            if (error) {
                return { value, errors: error };
            }
            if (
                !SUPPORTED_CURRENCIES.includes(value.currency) &&
                !(rawValue instanceof Money)
            ) {
                return {
                    value,
                    errors: helpers.error('money.currency', {
                        codes: SUPPORTED_CURRENCIES,
                    }),
                };
            }
            let money;
            try {
                money = new Money(value);
            } catch (e) {
                return { value, errors: helpers.error('money.base') };
            }

            // Check our currency is one we expect it to be
            const currencies = [];
            if (helpers.schema.$_getFlag('currencies')) {
                currencies.push(...helpers.schema.$_getFlag('currencies'));
                // If we are coming from a money object then allow empty currency
                if (rawValue instanceof Money) {
                    currencies.push('');
                }
                if (!currencies.includes(value.currency)) {
                    return {
                        value: money,
                        errors: helpers.error('money.currency', {
                            codes: currencies,
                        }),
                    };
                }
            }

            return { value: money, errors: undefined };
        },
        rules: {
            currency: {
                args: [
                    {
                        name: 'currencies',
                        assert: (value) => isArrayOfStrings(value),
                        message: 'must be an array of currency codes',
                    },
                ],
                method(currencies = []) {
                    if (!isArrayOfStrings(currencies)) {
                        throw new Error('must be an array of currency codes');
                    }
                    const allCodesAreSupported = currencies.every((code) =>
                        SUPPORTED_CURRENCIES.includes(code),
                    );
                    if (!allCodesAreSupported) {
                        throw new Error(
                            `Currency codes can only be [${SUPPORTED_CURRENCIES.join(
                                ', ',
                            )}]`,
                        );
                    }
                    return this.$_setFlag('currencies', currencies);
                },
            },
            min: {
                args: [
                    {
                        name: 'limit',
                        // eslint-disable-next-line no-restricted-globals
                        assert: isNumber,
                        message: 'must be a number',
                    },
                ],
                method(limit) {
                    return this.$_addRule({ name: 'min', args: { limit } });
                },
                validate(value, helpers, args, options) {
                    if (value.lessThan(args.limit)) {
                        return helpers.error('money.min', {
                            limit: args.limit,
                        });
                    }
                    return value;
                },
            },
            max: {
                args: [
                    {
                        name: 'limit',
                        ref: true,
                        // eslint-disable-next-line no-restricted-globals
                        assert: isNumber,
                        message: 'must be a number',
                    },
                ],
                method(limit) {
                    return this.$_addRule({ name: 'max', args: { limit } });
                },
                validate(value, helpers, args, options) {
                    if (value.greaterThan(args.limit)) {
                        return helpers.error('money.max', {
                            limit: args.limit,
                        });
                    }
                    return value;
                },
            },
        },
    };
}