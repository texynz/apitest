// @graph-mind
// Remove the previous line to stop Ada from updating this file
/* eslint-disable no-param-reassign */
import knex from 'knex';
import Objection, { Model } from 'objection';
import Money from '../../primitive/money';
import genEntityDelete from '../genEntityDelete';
import { DateStorageModel, MoneyStorageModel } from '../index';

class ProductVariationSubInfoSchema extends Model {
    public static tableName = 'product_variation_sub_info';

    public static idColumn = 'product_variation_sub_info_id';

    public static schema = {
        $table: ProductVariationSubInfoSchema.tableName,
        $id: 'product_variation_sub_info_id',
        id: 'id',
        product_variation_id: 'product_variation_id',
        subName: 'subName',
    };

    public product_variation_sub_info_id?: string;

    public id?: string;

    public product_variation_id?: string;

    public subName?: string;

    public static relationMappings = {};

    public $parseJson(
        json: Objection.Pojo,
        opt?: Objection.ModelOptions,
    ): Objection.Pojo {
        json = super.$parseJson(json, opt);
        json.product_variation_sub_info_id = json.$id;
        return json;
    }

    public $formatJson(json: Objection.Pojo): Objection.Pojo {
        json = super.$formatJson(json);
        json.$id = json.product_variation_sub_info_id;
        return json;
    }
}

class ProductInfoSchema extends Model {
    public static tableName = 'product_info';

    public static idColumn = 'product_info_id';

    public static schema = {
        $table: ProductInfoSchema.tableName,
        $id: 'product_info_id',
        freight: 'freightAmount',
        'freight.amount': 'freightAmount',
        'freight.currency': 'freightCurrency',
        'freight.unit': 'freightUnit',
    };

    public product_info_id?: string;

    public freightAmount?: number;

    public freightCurrency?: string;

    public freightUnit?: string;

    public static relationMappings = {};

    public $parseJson(
        json: Objection.Pojo,
        opt?: Objection.ModelOptions,
    ): Objection.Pojo {
        json = super.$parseJson(json, opt);
        json.product_info_id = json.$id;
        MoneyStorageModel.toStorage(json, 'freight');
        return json;
    }

    public $formatJson(json: Objection.Pojo): Objection.Pojo {
        json = super.$formatJson(json);
        json.$id = json.product_info_id;
        MoneyStorageModel.fromStorage(json, 'freight');
        return json;
    }
}

class ProductVariationSchema extends Model {
    public static tableName = 'product_variation';

    public static idColumn = 'product_variation_id';

    public static schema = {
        $table: ProductVariationSchema.tableName,
        $id: 'product_variation_id',
        id: 'id',
        product_id: 'product_id',
        name: 'name',
        subInfo: ProductVariationSubInfoSchema.schema,
        $from_product_variation_sub_info:
            'product_variation_sub_info.product_variation_id',
        $to_product_variation_sub_info:
            'product_variation.product_variation_id',
    };

    public product_variation_id?: string;

    public id?: string;

    public product_id?: string;

    public name?: string;

    public subInfo?: ProductVariationSubInfoSchema[];

    public static relationMappings = {
        subInfo: {
            relation: Model.HasManyRelation,
            modelClass: ProductVariationSubInfoSchema,
            join: {
                from: 'product_variation_sub_info.product_variation_id',
                to: 'product_variation.product_variation_id',
            },
        },
    };

    public $parseJson(
        json: Objection.Pojo,
        opt?: Objection.ModelOptions,
    ): Objection.Pojo {
        json = super.$parseJson(json, opt);
        json.product_variation_id = json.$id;
        return json;
    }

    public $formatJson(json: Objection.Pojo): Objection.Pojo {
        json = super.$formatJson(json);
        json.$id = json.product_variation_id;
        return json;
    }
}

class ProductSchema extends Model {
    public static tableName = 'product';

    public static idColumn = 'id';

    public static schema = {
        $table: ProductSchema.tableName,
        id: 'id',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        product_info_id: 'product_info_id',
        info: ProductInfoSchema.schema,
        $from_product_info: 'product_info.product_info_id',
        $to_product_info: 'product.product_info_id',
        name: 'name',
        price: 'priceAmount',
        'price.amount': 'priceAmount',
        'price.currency': 'priceCurrency',
        'price.unit': 'priceUnit',
        quantity: 'quantity',
        type: 'type',
        variations: ProductVariationSchema.schema,
        $from_product_variation: 'product_variation.product_id',
        $to_product_variation: 'product.id',
    };

    public id?: string;

    public createdAt?: Date;

    public updatedAt?: Date;

    public product_info_id?: string;

    public info?: ProductInfoSchema;

    public name?: string;

    public priceAmount?: number;

    public priceCurrency?: string;

    public priceUnit?: string;

    public quantity?: number;

    public type?: string;

    public variations?: ProductVariationSchema[];

    public static relationMappings = {
        info: {
            relation: Model.BelongsToOneRelation,
            modelClass: ProductInfoSchema,
            join: {
                from: 'product_info.product_info_id',
                to: 'product.product_info_id',
            },
        },
        variations: {
            relation: Model.HasManyRelation,
            modelClass: ProductVariationSchema,
            join: {
                from: 'product_variation.product_id',
                to: 'product.id',
            },
        },
    };

    public $parseJson(
        json: Objection.Pojo,
        opt?: Objection.ModelOptions,
    ): Objection.Pojo {
        json = super.$parseJson(json, opt);
        MoneyStorageModel.toStorage(json, 'price');
        return json;
    }

    public $formatJson(json: Objection.Pojo): Objection.Pojo {
        json = super.$formatJson(json);
        DateStorageModel.fromStorage(json, 'createdAt');
        DateStorageModel.fromStorage(json, 'updatedAt');
        MoneyStorageModel.fromStorage(json, 'price');
        return json;
    }
}

describe('genEntityDelete', () => {
    it('Given a spec with nested data, should return delete queries', async () => {
        const currentEntity: Record<string, any> = {
            id: 'product_id1',
            createdAt: new Date(1969, 6, 20, 20, 18, 0, 0),
            updatedAt: new Date(1969, 6, 20, 20, 18, 0, 0),
            info: {
                $id: 'product_info_id1',
                freight: new Money({
                    amount: 1000,
                    currency: 'NZD',
                    unit: 'cent',
                }),
            },
            name: 'Foobar',
            price: new Money({
                amount: 1000,
                currency: 'NZD',
                unit: 'cent',
            }),
            quantity: 10,
            type: 'personal care',
            variations: [
                {
                    $id: 'product_variation_id1',
                    id: 'product_variation_id1',
                    name: 'Alt 1',
                    subInfo: [
                        {
                            $id: 'product_variation_id1_sub_info_id1',
                            id: 'product_variation_id1_sub_info_id1',
                            subName: 'subName',
                        },
                    ],
                },
                {
                    $id: 'product_variation_id2',
                    id: 'product_variation_id2',
                    name: 'Alt 2',
                    subInfo: [
                        {
                            $id: 'product_variation_id2_sub_info_id1',
                            id: 'product_variation_id2_sub_info_id1',
                            subName: 'subName',
                        },
                    ],
                },
            ],
        };

        const database = knex({ client: 'mysql' });
        const queries = genEntityDelete(ProductSchema, database, currentEntity);
        const queryStrings = queries.map((query) =>
            query.toKnexQuery().toString(),
        );
        expect(queryStrings).toEqual([
            "delete from `product_info` where `product_info`.`product_info_id` in (select `product`.`product_info_id` from `product` where `product`.`id` in ('product_id1'))",
            "delete from `product_variation_sub_info` where `product_variation_sub_info`.`product_variation_id` in ('product_variation_id1', 'product_variation_id2')",
            "delete from `product_variation` where `product_variation`.`product_id` in ('product_id1')",
            "delete from `product` where `id` = 'product_id1'",
        ]);
    });

    it('Given a spec with $stored property, should ignore the field', async () => {
        const currentEntity: Record<string, any> = {
            id: 'product_id1',
            createdAt: new Date(1969, 6, 20, 20, 18, 0, 0),
            updatedAt: new Date(1969, 6, 20, 20, 18, 0, 0),
            info: {
                $id: 'product_info_id1',
                freight: new Money({
                    amount: 1000,
                    currency: 'NZD',
                    unit: 'cent',
                }),
            },
            name: 'Foobar',
            price: new Money({
                amount: 1000,
                currency: 'NZD',
                unit: 'cent',
            }),
            quantity: 10,
            type: 'personal care',
            variations: [
                {
                    $id: 'product_variation_id1',
                    id: 'product_variation_id1',
                    name: 'Alt 1',
                    subInfo: [
                        {
                            $id: 'product_variation_id1_sub_info_id1',
                            id: 'product_variation_id1_sub_info_id1',
                            subName: 'subName',
                        },
                    ],
                },
                {
                    $id: 'product_variation_id2',
                    id: 'product_variation_id2',
                    name: 'Alt 2',
                    subInfo: [
                        {
                            $id: 'product_variation_id2_sub_info_id1',
                            id: 'product_variation_id2_sub_info_id1',
                            subName: 'subName',
                        },
                    ],
                },
            ],
            $stored: {
                description: 'this should be ignored',
            },
        };

        const database = knex({ client: 'mysql' });
        const queries = genEntityDelete(ProductSchema, database, currentEntity);
        const queryStrings = queries.map((query) =>
            query.toKnexQuery().toString(),
        );
        expect(queryStrings).toEqual([
            "delete from `product_info` where `product_info`.`product_info_id` in (select `product`.`product_info_id` from `product` where `product`.`id` in ('product_id1'))",
            "delete from `product_variation_sub_info` where `product_variation_sub_info`.`product_variation_id` in ('product_variation_id1', 'product_variation_id2')",
            "delete from `product_variation` where `product_variation`.`product_id` in ('product_id1')",
            "delete from `product` where `id` = 'product_id1'",
        ]);
    });
});