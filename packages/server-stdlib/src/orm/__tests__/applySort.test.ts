// @graph-mind
// Remove the previous line to stop Ada from updating this file
/* eslint-disable no-param-reassign */
import knex from 'knex';
import Objection, { Model } from 'objection';
import applySort from '../applySort';
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

describe('applySort', () => {
    describe('Happy path', () => {
        it('Given an ascending sort, then sort ASC', async () => {
            const sort = ['+name'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applySort(query, ProductSchema.schema, sort);
            expect(query.toKnexQuery().toString()).toEqual(
                'select `product`.* from `product` order by `product`.`name` asc',
            );
        });

        it('Given an descending sort, then sort DESC', async () => {
            const sort = ['-name'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applySort(query, ProductSchema.schema, sort);
            expect(query.toKnexQuery().toString()).toEqual(
                'select `product`.* from `product` order by `product`.`name` desc',
            );
        });

        it('given a relation sort, then sorts with joins', async () => {
            // TODO: fix this
            const sort = ['+info.freight', '-name'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applySort(query, ProductSchema.schema, sort);

            expect(query.toKnexQuery().toString()).toEqual(
                'select `product`.* from `product` inner join `product_info` on `product`.`product_info_id` = `product_info`.`product_info_id` order by `product_info`.`freightAmount` asc, `product`.`name` desc',
            );
        });
    });

    describe('Bad path', () => {
        it('Given an object property, then throw an error', async () => {
            const sort = ['+info'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            expect(() => {
                query = applySort(query, ProductSchema.schema, sort);
            }).toThrowError(new Error('Invalid sort criteria'));
        });
    });
});