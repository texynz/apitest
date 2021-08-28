// @graph-mind
// Remove the previous line to stop Ada from updating this file
import Joi from 'joi';
import phone from 'phone';
import { isArrayOfStrings } from './utils';

export interface JoiPhoneSchema extends Joi.StringSchema {
    mobile: (string: string[]) => this;
}

export default function (joi: Joi.Root): Joi.Extension {
    return {
        type: 'phone',
        base: joi.string(),
        messages: {
            'phone.mobile': '{{#label}} must be a mobile phone number',
            'phone.country': '{{#label}} must be one of {{#codes}}',
        },
        rules: {
            mobile: {
                args: [
                    {
                        name: 'countryCodes',
                        assert: (value) => isArrayOfStrings(value),
                        message: 'must be an array of currency codes',
                    },
                ],
                method(countryCodes = []) {
                    if (!isArrayOfStrings(countryCodes)) {
                        throw new Error('must be an array of country codes');
                    }
                    return this.$_addRule({
                        name: 'mobile',
                        args: { countryCodes },
                    }).default([]);
                },
                validate(value, helpers, args, options) {
                    const [mobileNumber, countryCode] = phone(value);
                    if (!mobileNumber) {
                        return helpers.error('phone.mobile', {});
                    }
                    if (
                        args.countryCodes.length &&
                        !args.countryCodes.includes(countryCode)
                    ) {
                        return helpers.error('phone.country', {
                            codes: args.countryCodes,
                        });
                    }
                    return mobileNumber;
                },
            },
        },
    };
}