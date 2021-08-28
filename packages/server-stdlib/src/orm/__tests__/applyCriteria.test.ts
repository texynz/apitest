// @graph-mind
// Remove the previous line to stop Ada from updating this file
/* eslint-disable no-param-reassign */
import knex from 'knex';
import Objection, { Model } from 'objection';
import applyCriteria from '../applyCriteria';
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

describe('applyCriteria', () => {
    describe('Happy path', () => {
        it("Should pass when all products with a name equal to 'Milk'", async () => {
            const criteria = ['===', 'name', 'Milk'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where `product`.`name` = 'Milk'",
            );
        });

        it("Should pass when all products with a name not equal to 'Milk'", async () => {
            const criteria = ['!==', 'name', 'Milk'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where not `product`.`name` = 'Milk'",
            );
        });

        it("Should pass when all products with the name 'Milk' that also have a price less than 2.55", async () => {
            const criteria = [
                '&&',
                ['<', 'price', 2.55],
                ['===', 'name', 'Milk'],
            ];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where (`product`.`priceAmount` < 2.55 and `product`.`name` = 'Milk')",
            );
        });

        it("Should pass when all products that either have the name 'Milk' or have a price less than 2.55", async () => {
            const criteria = [
                '||',
                ['<', 'price', 2.55],
                ['===', 'name', 'Milk'],
            ];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where (`product`.`priceAmount` < 2.55 or `product`.`name` = 'Milk')",
            );
        });

        it("Should pass when all products that have the name 'Milk' or 'Eggs' and have a price less than 2.55", async () => {
            const criteria = [
                '&&',
                ['<', 'price', 2.55],
                ['||', ['===', 'name', 'Eggs'], ['===', 'name', 'Milk']],
            ];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where (`product`.`priceAmount` < 2.55 and (`product`.`name` = 'Eggs' or `product`.`name` = 'Milk'))",
            );
        });

        it("Should pass when all products that do not have the name 'Milk' or 'Eggs' and have a price less than 2.55", async () => {
            const criteria = [
                '&&',
                ['<', 'price', 2.55],
                ['&&', ['!==', 'name', 'Eggs'], ['!==', 'name', 'Milk']],
            ];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where (`product`.`priceAmount` < 2.55 and (not `product`.`name` = 'Eggs' and not `product`.`name` = 'Milk'))",
            );
        });

        it('Should pass when all products with a name is null', async () => {
            const criteria = ['isNull', 'name'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                'select `product`.* from `product` where `product`.`name` is null',
            );
        });

        it('Should pass when all products with a name in group array', async () => {
            const criteria = ['in', 'name', ['foo', 'bar']];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where `product`.`name` in ('foo', 'bar')",
            );
        });

        it('Should pass when all products with a name in group', async () => {
            const criteria = ['in', 'name', 'foo'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where `product`.`name` in ('foo')",
            );
        });

        it('given a "not less than" operation', async () => {
            const criteria = ['!', ['<', 'quantity', 10]];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                'select `product`.* from `product` where (not `product`.`quantity` < 10)',
            );
        });

        it('given an "equal", "not", "and", "or" operation, then returns a value', async () => {
            const criteria = [
                '&&',
                ['===', 'type', `personal care`],
                [
                    '!',
                    [
                        '||',
                        ['===', 'name', `L'Oréal`],
                        ['===', 'name', `Rexona`],
                    ],
                ],
            ];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);
            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` where (`product`.`type` = 'personal care' and (not (`product`.`name` = 'L\\'Oréal' or `product`.`name` = 'Rexona')))",
            );
        });

        it('given a relation search, then search with joins', async () => {
            // TODO: fix this
            const criteria = [
                '&&',
                ['===', 'type', `personal care`],
                ['>', 'info.freight.amount', 100],
                ['<', 'info.freight.amount', 500],
            ];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            query = applyCriteria(query, ProductSchema.schema, criteria);

            expect(query.toKnexQuery().toString()).toEqual(
                "select `product`.* from `product` inner join `product_info` on `product`.`product_info_id` = `product_info`.`product_info_id` where (`product`.`type` = 'personal care' and `product_info`.`freightAmount` > 100 and `product_info`.`freightAmount` < 500)",
            );
        });
    });

    describe('Bad path', () => {
        it('Given an object property, then throw an error', async () => {
            const criteria = ['===', 'info', 'Milk'];
            const database = knex({ client: 'mysql' });
            let query = ProductSchema.query(database).withGraphFetched('*');
            expect(() => {
                query = applyCriteria(query, ProductSchema.schema, criteria);
            }).toThrowError(new Error('Invalid search criteria'));
        });
    });
});