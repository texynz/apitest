// @graph-mind
// Remove the previous line to stop Ada from updating this file
/* eslint-disable no-param-reassign */
import Money from '../primitive/money';

export default class MoneyStorageModel {
    public static toStorage(json: Record<string, any>, fieldName: string) {
        const currencyName = `${fieldName}Currency`;
        const unitName = `${fieldName}Unit`;
        const amountName = `${fieldName}Amount`;

        json[currencyName] = json[fieldName].currency;
        json[unitName] = json[fieldName].unit;
        json[amountName] = json[fieldName].amount;
        delete json[fieldName];
    }

    public static fromStorage(json: Record<string, any>, fieldName: string) {
        const currencyName = `${fieldName}Currency`;
        const unitName = `${fieldName}Unit`;
        const amountName = `${fieldName}Amount`;

        json[fieldName] = new Money({
            currency: json[currencyName],
            unit: json[unitName],
            amount: json[amountName],
        });
        delete json[currencyName];
        delete json[unitName];
        delete json[amountName];
    }
}