// @graph-mind
// Remove the previous line to stop Ada from updating this file
import Money from '../../primitive/money';
import genEntityDiff from '../genEntityDiff';

describe('genEntityDiff', () => {
    it('Given a spec with a string array, should return diff', async () => {
        const previousEntity = {
            id: '1234',
            stockcodes: ['1111', '2222'],
        };
        const updatedEntity = {
            id: '1234',
            stockcodes: ['1111', '3333'],
        };

        let diff = genEntityDiff(previousEntity, updatedEntity);

        diff = JSON.parse(JSON.stringify(diff));
        expect(diff).toEqual({
            id: '1234',
            stockcodes: ['1111', '3333'],
        });
    });

    it('Given a spec with nested object arrays, should return diff', async () => {
        const previousEntity = {
            id: '1234',
            price: new Money({
                amount: 1000,
                currency: 'NZD',
                unit: 'cent',
            }),
            variations: [
                {
                    $id: 'product_variation_id1',
                    id: 'product1',
                    name: 'new name',
                    subInfo: [
                        {
                            $id: 'product_variation_sub_info_id1',
                            id: 'product_variation_sub_info_id1',
                            subName: 'sub name',
                        },
                    ],
                },
                {
                    $id: 'product_variation_id2',
                    id: 'product2',
                    name: 'name',
                    subInfo: [
                        {
                            $id: 'product_variation_sub_info_id2',
                            id: 'product_variation_sub_info_id2',
                            subName: 'name',
                        },
                    ],
                },
            ],
            info: {
                $id: 'product_info_id',
                freight: new Money({
                    amount: 5000,
                    currency: 'USD',
                    unit: 'cent',
                }),
            },
        };
        const updatedEntity = {
            id: '1234',
            price: new Money({
                amount: 2000,
                currency: 'USD',
                unit: 'cent',
            }),
            variations: [
                {
                    $id: 'product_variation_id1',
                    id: 'product1',
                    name: 'new name',
                    subInfo: [
                        {
                            $id: 'product_variation_sub_info_id1',
                            id: 'product_variation_sub_info_id1',
                            subName: 'new sub name',
                        },
                    ],
                },
                {
                    $id: 'product_variation_id3',
                    id: 'product3',
                    name: 'name',
                    subInfo: [
                        {
                            $id: 'product_variation_sub_info_id3',
                            id: 'product_variation_sub_info_id3',
                            subName: 'sub name',
                        },
                    ],
                },
            ],
            info: {
                $id: 'product_info_id',
                freight: new Money({
                    amount: 2000,
                    currency: 'USD',
                    unit: 'cent',
                }),
            },
        };

        let diff = genEntityDiff(previousEntity, updatedEntity);

        diff = JSON.parse(JSON.stringify(diff));
        expect(diff).toEqual({
            id: '1234',
            info: {
                $id: 'product_info_id',
                freight: {
                    amount: 2000,
                    currency: 'USD',
                    unit: 'cent',
                },
            },
            price: {
                amount: 2000,
                currency: 'USD',
                unit: 'cent',
            },
            variations: [
                {
                    $id: 'product_variation_id1',
                    subInfo: [
                        {
                            $id: 'product_variation_sub_info_id1',
                            subName: 'new sub name',
                        },
                    ],
                },
                {
                    $id: 'product_variation_id3',
                    id: 'product3',
                    name: 'name',
                    subInfo: [
                        {
                            $id: 'product_variation_sub_info_id3',
                            id: 'product_variation_sub_info_id3',
                            subName: 'sub name',
                        },
                    ],
                },
            ],
        });
    });

    it('Given a spec with a cart entity, should return diff', async () => {
        const previousEntity = {
            id: '1234',
            products: [
                {
                    $id: 'cart_product_id1',
                    id: 'product1',
                    sku: 'SKU1',
                    quantity: 1,
                    currentPrice: new Money({
                        amount: 1000,
                        currency: 'NZD',
                        unit: 'cent',
                    }),
                },
                {
                    $id: 'cart_product_id2',
                    id: 'product2',
                    sku: 'SKU2',
                    quantity: 1,
                    currentPrice: new Money({
                        amount: 1000,
                        currency: 'NZD',
                        unit: 'cent',
                    }),
                },
            ],
            createdAt: 'now',
        };
        const updatedEntity = {
            id: '1234',
            products: [
                {
                    $id: 'cart_product_id1',
                    id: 'product1',
                    sku: 'SKU1',
                    quantity: 5,
                    currentPrice: new Money({
                        amount: 1000,
                        currency: 'NZD',
                        unit: 'cent',
                    }),
                },
                {
                    $id: 'cart_product_id3',
                    id: 'product3',
                    sku: 'SKU3',
                    quantity: 1,
                    currentPrice: new Money({
                        amount: 1000,
                        currency: 'NZD',
                        unit: 'cent',
                    }),
                },
            ],
            createdAt: 'now',
            updatedAt: 'now',
        };

        let diff = genEntityDiff(previousEntity, updatedEntity);

        diff = JSON.parse(JSON.stringify(diff));
        expect(diff).toEqual({
            id: '1234',
            products: [
                {
                    $id: 'cart_product_id1',
                    currentPrice: {
                        amount: 1000,
                        currency: 'NZD',
                        unit: 'cent',
                    },
                    quantity: 5,
                },
                {
                    $id: 'cart_product_id3',
                    currentPrice: {
                        amount: 1000,
                        currency: 'NZD',
                        unit: 'cent',
                    },
                    id: 'product3',
                    quantity: 1,
                    sku: 'SKU3',
                },
            ],
            updatedAt: 'now',
        });
    });

    it('Given a spec with $stored property, should ignore the field', async () => {
        const previousEntity = {
            id: '1234',
            stockcodes: ['1111', '2222'],
            $stored: {
                description: 'this should be ignored',
            },
        };
        const updatedEntity = {
            id: '1234',
            stockcodes: ['1111', '3333'],
            $stored: {
                description: 'this should be ignored',
            },
        };

        let diff = genEntityDiff(previousEntity, updatedEntity);

        diff = JSON.parse(JSON.stringify(diff));
        expect(diff).toEqual({
            id: '1234',
            stockcodes: ['1111', '3333'],
        });
    });
});