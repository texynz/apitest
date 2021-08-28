// @graph-mind
// Remove the previous line to stop Ada from updating this file
// name eq "Tacos" and price gt 100.00
// Identify strings and strip them
// Identify tokens and split them
// Foreach token, if the next token is an operator
// operators
import Joi from 'joi';
import { isArrayOfStrings } from './utils';

export interface JoiPaginationSchema extends Joi.AnySchema {
    sortable: (string: string[]) => this;
    filter: (rules: Record<string, any>) => this;
}

const FILTER_OPERATOR_LOOKUP = {
    not: {
        symbol: '!',
        precedence: 4,
    },
    gt: {
        symbol: '>',
        precedence: 2,
    },
    ge: {
        symbol: '>=',
        precedence: 2,
    },
    lt: {
        symbol: '<',
        precedence: 2,
    },
    le: {
        symbol: '<=',
        precedence: 2,
    },
    eq: {
        symbol: '===',
        precedence: 3,
    },
    ne: {
        symbol: '!==',
        precedence: 3,
    },
    in: {
        symbol: 'in',
        precedence: 3,
    },
    and: {
        symbol: '&&',
        precedence: 40,
    },
    or: {
        symbol: '||',
        precedence: 40,
    },
};
const VALID_OPERATORS = {
    '&&': true,
    '||': true,
    '!': true,
    '===': true,
    '!==': true,
    '>': true,
    '>=': true,
    '<': true,
    '<=': true,
    in: true,
};
// How do we handle money operations?
function expressionBuilder(tokens, fieldValidation) {
    const operators = [];
    const output = [];
    let groupedOutput;

    // Shunting-yard_algorithm
    tokens.forEach((dirtyToken) => {
        const token = dirtyToken.trim();
        const operator = FILTER_OPERATOR_LOOKUP[token];
        if (operator) {
            while (
                operators.length &&
                operators[operators.length - 1].precedence <
                    operator.precedence &&
                operators[operators.length - 1].symbol !== '('
            ) {
                output.push(operators.pop().symbol);
            }
            operators.push(operator);
        } else if (token === '(') {
            output.push(')');
            operators.push({
                precedence: 0,
                symbol: '(',
            });
        } else if (token === ')') {
            while (
                operators.length &&
                operators[operators.length - 1].symbol !== '('
            ) {
                output.push(operators.pop().symbol);
            }
            if (operators[operators.length - 1].symbol === '(') {
                operators.pop();
            }
        } else if (token === '[') {
            groupedOutput = [];
        } else if (token === ']') {
            output.push(groupedOutput);
            groupedOutput = null;
        } else if (token !== '') {
            if (groupedOutput) {
                // If the value is a comma, ignore it
                if (token === ',') {
                    return;
                }
                groupedOutput.push(token);
            } else {
                output.push(token);
            }
        }
    });
    while (operators.length) {
        output.push(operators.pop().symbol);
    }
    // Operation to criteria
    // check variables are valid, take in an object matching field names to validation objects
    let isUnary = false;
    let currentCondition = [];
    const criteria: any = [[]];
    output.reverse();
    for (let i = 0; i < output.length - 2; i += 1) {
        let operator = output[i];
        if (operator === '&&') {
            if (currentCondition[0] === '&&') {
                // eslint-disable-next-line no-continue
                continue;
            }
            currentCondition = [operator];
            criteria[criteria.length - 1].push(currentCondition);
            criteria.push(currentCondition);
            // eslint-disable-next-line no-continue
            continue;
        }
        if (operator === '||') {
            if (currentCondition[0] === '||') {
                // eslint-disable-next-line no-continue
                continue;
            }
            currentCondition = [operator];
            criteria[criteria.length - 1].push(currentCondition);
            criteria.push(currentCondition);
            // eslint-disable-next-line no-continue
            continue;
        }
        if (operator === '!') {
            isUnary = true;
            currentCondition = [operator];
            criteria[criteria.length - 1].push(currentCondition);
            criteria.push(currentCondition);
            // eslint-disable-next-line no-continue
            continue;
        }
        if (operator === ')') {
            // Only pop if we there is more than one operator
            if (criteria.length > 2) {
                criteria.pop();
                currentCondition = criteria[criteria.length - 1];
            }
            // eslint-disable-next-line no-continue
            continue;
        }
        if (!VALID_OPERATORS[operator]) {
            throw new Error(`invalid operator: ${operator}`);
        }

        const field = output[i + 2];
        const dirtyValue = output[i + 1];

        // If our field or value are a filter, then something has gone wrong and we must stop with an error
        if (VALID_OPERATORS[field]) {
            throw new Error(`field cannot be an operator`);
        }
        if (VALID_OPERATORS[dirtyValue]) {
            throw new Error(`value cannot be an operator`);
        }
        // If the field does not have validation, then we must stop because something has gone wrong.
        if (!fieldValidation[field]) {
            throw new Error(`forbidden field: ${field}`);
        }
        let error;
        let value = dirtyValue;
        let validator = fieldValidation[field];
        if (value === 'null') {
            value = null;
            validator = Joi.any().allow(null).default(null);
        } else if (Array.isArray(dirtyValue)) {
            validator = Joi.array().items(validator).min(1).max(100);
        }
        const result = validator.validate(value);
        error = result.error;
        value = result.value;
        if (error) {
            error.message = error.message.replace('"value"', `"${field}"`);
            throw error;
        }
        // HACKHACK
        if (operator === '===' && value === null) {
            operator = 'isNull';
            value = undefined;
        }

        currentCondition.push([operator, field, value]);

        // Skip forward past our field and value index
        i += 2;
        if (isUnary) {
            isUnary = false;
            criteria.pop();
            currentCondition = criteria[criteria.length - 1];
        }
    }

    const result = criteria.shift().shift();
    if (!result) {
        return currentCondition.shift();
    }
    return result;
}
function expressionTokenizer(rawExpression: string): string[] {
    let trimmedText = rawExpression;
    const literalMap: Record<string, any> = {};
    // Extract string literals
    (
        trimmedText.match(
            /(?=["'`])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*'|`[^`\\]*(?:\\[\s\S][^'\\]*)*`)/g,
        ) ?? []
    ).forEach((stringLiteral: string, index) => {
        const key = `_string_${index}`;
        literalMap[key] = stringLiteral.slice(1, -1);
        trimmedText = trimmedText.replace(stringLiteral, key);
    });

    // Extract numeric literals
    (trimmedText.match(/\W(-?\d+(?:.\d+)?)\W?/g) ?? []).forEach(
        (rawNumberLiteral: string, index) => {
            const key = `_number_${index}`;
            const [numberLiteral] = rawNumberLiteral.match(/(-?\d+(?:.\d+)?)/);
            literalMap[key] = numberLiteral.trim();
            trimmedText = trimmedText.replace(numberLiteral.trim(), key);
        },
    );

    trimmedText = trimmedText.replace(/(\W+)/gi, ' $1 ');
    trimmedText = trimmedText.replace(/ +/gi, ' ');
    const tokens: string[] = trimmedText.split(' ').map((item) => {
        if (literalMap[item]) {
            return literalMap[item];
        }
        return item;
    });

    return tokens;
}

export default function (joi: Joi.Root): Joi.Extension {
    return {
        type: 'pagination',
        base: joi.any(),
        messages: {
            'pagination.sortable': '{{#label}} must one or more of {{#fields}}',
            'pagination.filterString': '{{#label}} must be a string',
            'pagination.filterError': '{{#label}} {{#message}}',
            'pagination.filterLength':
                '{{#label}} must be shorter than {{#length}}',
        },
        rules: {
            sortable: {
                args: [
                    {
                        name: 'fields',
                        assert: isArrayOfStrings,
                        message: 'must be an array of strings',
                    },
                ],
                method(fields) {
                    if (!isArrayOfStrings(fields)) {
                        throw new Error('must be an array of strings');
                    }
                    return this.$_addRule({
                        name: 'sortable',
                        args: { fields },
                    }).default([]);
                },
                validate(value, helpers, args, options) {
                    const cleanValues = [];
                    const dirtyValues = value.split(',') || [];
                    dirtyValues.forEach((dirtyValue) => {
                        let sortField = dirtyValue.trim();
                        let sortDirection = '+';
                        if (
                            sortField.startsWith('+') ||
                            sortField.startsWith('-')
                        ) {
                            sortDirection = sortField.slice(0, 1);
                            sortField = sortField.slice(1);
                        }
                        if (!args.fields.includes(sortField)) {
                            return;
                        }
                        cleanValues.push(sortDirection + sortField);
                    });
                    if (cleanValues.length !== dirtyValues.length) {
                        return helpers.error('pagination.sortable', {
                            fields: args.fields,
                        });
                    }
                    return cleanValues;
                },
            },
            filter: {
                args: [
                    {
                        name: 'fields',
                        assert: (value) => typeof value === 'object',
                        message: 'must a validation schema',
                    },
                ],
                method(fields) {
                    return this.$_addRule({
                        name: 'filter',
                        args: { fields },
                    }).default([]);
                },
                validate(value, helpers, args, options) {
                    if (typeof value !== 'string') {
                        return helpers.error('pagination.filterString', {
                            fields: args.fields,
                        });
                    }
                    const trimmedText = value.trim();
                    if (trimmedText.length > 4096) {
                        return helpers.error('pagination.filterString', {
                            length: 4096,
                        });
                    }
                    const tokens: string[] = expressionTokenizer(trimmedText);
                    let criteria;
                    try {
                        criteria = expressionBuilder(tokens, args.fields) || [];
                    } catch (e) {
                        return helpers.error('pagination.filterError', {
                            message: e.message,
                        });
                    }
                    return criteria;
                },
            },
        },
    };
}