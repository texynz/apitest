// @graph-mind
// Remove the previous line to stop Ada from updating this file
import currency from 'currency.js';
import kindOf from 'kind-of';
import objectPath from 'object-path';

const CURRENCIES = {
    USD: {
        currency: 'USD',
        symbol: '$',
        precision: 2,
        unit: 'cent',
    },
    NZD: {
        currency: 'NZD',
        symbol: '$',
        precision: 2,
        unit: 'cent',
    },
    JPY: {
        currency: 'JPY',
        symbol: '¥',
        precision: 0,
        unit: 'yen',
    },
};

const UNKNOWN_CURRENCY = {
    currency: '',
    symbol: '$',
    precision: 2,
    unit: 'cent',
};
function getIso(currencyCode) {
    if (!currencyCode) {
        return UNKNOWN_CURRENCY;
    }
    const iso = CURRENCIES[currencyCode.toUpperCase()];
    if (!iso) {
        throw new Error(`Undefined currency code: ${currencyCode}`);
    }
    return iso;
}

export default class Money {
    public static CURRENCIES = CURRENCIES;

    public static CURRENCIES_LIST = Object.values(CURRENCIES);

    public static sum(itemsInput: any[], field?: string): Money {
        const items = [...itemsInput];
        let base: Money | any = items.shift();
        if (!base) {
            return undefined;
        }
        if (field) {
            base = objectPath.get(base, field);
            items.forEach((item) => {
                base = base.add(objectPath.get(item, field));
            });
        } else {
            items.forEach((item) => {
                base = base.add(item);
            });
        }
        return base;
    }

    public readonly amount: number;

    public currency: string;

    public unit: string;

    public readonly value: currency;

    public constructor(value, currencyCode?) {
        if (value === undefined || value == null) {
            return;
        }
        let iso = getIso(currencyCode);
        if (value instanceof currency) {
            this.value = currency(value, iso);
        } else if (value instanceof Money || kindOf(value) === 'object') {
            iso = getIso(value.currency);
            this.value = currency(value.amount, { ...iso, fromCents: true });
        } else {
            this.value = currency(value, iso);
        }
        this.amount = this.value.intValue;
        this.currency = iso.currency;
        this.unit = iso.unit;
    }

    private assert(money: Money) {
        if (!this.currency) {
            this.currency = money.currency;
            this.unit = money.unit;
        }
        if (this.currency !== money.currency) {
            throw new Error(
                `Cannot mix currencies (${this.currency}, ${money.currency})`,
            );
        }
    }

    private getValueFromMoney(money) {
        if (kindOf(money) === 'object') {
            this.assert(money as Money);
            return money.value;
        }
        return money;
    }

    public add(money: Money): Money {
        const amount = this.value.add(this.getValueFromMoney(money));
        return new Money(amount, this.currency);
    }

    public subtract(money: Money): Money {
        const amount = this.value.subtract(this.getValueFromMoney(money));
        return new Money(amount, this.currency);
    }

    public multiply(value): Money {
        const amount = this.value.multiply(value);
        return new Money(amount, this.currency);
    }

    public divide(value): Money {
        const amount = this.value.divide(value);
        return new Money(amount, this.currency);
    }

    /*
        DISCLAIMER:
        This method has been based on "allocate" from https://github.com/macor161/ts-money/blob/master/index.ts
     */
    public allocate(ratios: number[]): Money[] {
        let remainder = this.value;
        let total = 0;
        const values: Money[] = [];
        ratios.forEach((ratio) => {
            total += ratio;
        });
        ratios.forEach((ratio) => {
            const share = this.value.multiply(ratio).divide(total);
            values.push(new Money(share, this.currency));
            remainder = remainder.subtract(share);
        });
        for (let i = 0; remainder.intValue > 0; i += 1) {
            // We're working with cents here
            values[i] = new Money({
                amount: values[i].amount + 1,
                currency: values[i].currency,
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            remainder.intValue -= 1;
        }
        return values;
    }

    public distribute(between: number): Money[] {
        const values: currency[] = this.value.distribute(between);
        return values.map((value) => new Money(value, this.currency));
    }

    /**
     * X of the current currency to one of the target currency
     * @param ratio X of the current currency to one of the target currency
     * @param currencyCode
     */
    public convert(ratio: number, currencyCode: string) {
        const amount = this.value.divide(ratio);
        return new Money(amount, currencyCode);
    }

    // Boolean operators
    private equalCurrency(money: Money) {
        if (!this.currency) {
            return true;
        }
        if (!money.currency) {
            return true;
        }
        return this.currency === money.currency;
    }

    public equal(money: Money | number): boolean {
        if (money instanceof Money) {
            return this.amount === money.amount && this.equalCurrency(money);
        }
        return this.value.value === money;
    }

    public notEqual(money: Money | number): boolean {
        return !this.equal(money);
    }

    public greaterThan(money: Money | number): boolean {
        if (money instanceof Money) {
            return this.amount > money.amount && this.equalCurrency(money);
        }
        return this.value.value > money;
    }

    public greaterThanOrEqual(money: Money | number): boolean {
        return this.greaterThan(money) || this.equal(money);
    }

    public lessThan(money: Money | number): boolean {
        if (money instanceof Money) {
            return this.amount < money.amount && this.equalCurrency(money);
        }
        return this.value.value < money;
    }

    public lessThanOrEqual(money: Money | number): boolean {
        return this.lessThan(money) || this.equal(money);
    }

    public format(withSymbol = true) {
        if (!this.value) {
            return '';
        }
        if (withSymbol) {
            return this.value.format();
        }
        return this.value.format({ symbol: '' });
    }

    // We make the assumption that the value will always be displayed with its symbol by default
    public toString() {
        if (!this.value) {
            return '';
        }
        return this.value.format();
    }

    public toJSON() {
        return {
            currency: this.currency,
            amount: this.amount,
            unit: this.unit,
        };
    }

    public toNumber() {
        return this.value.value;
    }

    public clone() {
        return new Money(this);
    }

    public getSymbol() {
        return Money.CURRENCIES[this.currency]?.symbol || '';
    }
}