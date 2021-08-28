// @graph-mind
// Remove the previous line to stop Ada from updating this file
import array from '../array';

describe('array.genId', () => {
    it('Should generate an id 25 characters long', async () => {
        const id = array.genId();
        expect(id.length).toEqual(25);
    });
});

describe('array.find', () => {
    it('Given an element, find it in the array (direct reference)', async () => {
        const input = [1];
        const result = array.find(input, 1);
        expect(result).toEqual(1);
    });
    it('Given an element, find it in the array (path reference)', async () => {
        const input = {
            arr: [1],
        };
        const result = array.find(input, 'arr', 1);
        expect(result).toEqual(1);
    });
    it('Given an element that does not exist, return undefined', async () => {
        const input = {
            arr: [1],
        };
        const result = array.find(input, 'arr', 0);
        expect(result).toEqual(undefined);
    });
});

describe('array.add', () => {
    it('Given a new element, add it to the array (direct reference)', async () => {
        const input = [];
        array.add(input, 1);
        expect(input).toEqual([1]);
    });
    it('Given a new element, add it to the array (path reference)', async () => {
        const input = {
            arr: [],
        };
        array.add(input, 'arr', 1);
        expect(input).toEqual({
            arr: [1],
        });
    });
});

describe('array.remove', () => {
    it('Given an element, remove it from the array (direct reference)', async () => {
        const input = [1];
        array.remove(input, 1);
        expect(input).toEqual([]);
    });
    it('Given an element, remove it from the array (path reference)', async () => {
        const input = {
            arr: [1],
        };
        array.remove(input, 'arr', 1);
        expect(input).toEqual({
            arr: [],
        });
    });
    it('Given an element that does not exist, leave the array alone', async () => {
        const input = {
            arr: [1],
        };
        array.remove(input, 'arr', 0);
        expect(input).toEqual({
            arr: [1],
        });
    });
});

describe('array.findObject', () => {
    it('Given an element, find it in the array (direct reference)', async () => {
        const input = [
            {
                id: 1,
            },
        ];
        const result = array.findObject(input, 1);
        expect(result).toEqual({
            id: 1,
        });
    });
    it('Given an element, find it in the array (path reference)', async () => {
        const input = {
            arr: [
                {
                    id: 1,
                },
            ],
        };
        const result = array.findObject(input, 'arr', 1);
        expect(result).toEqual({
            id: 1,
        });
    });
    it('Given an element that does not exist, return undefined', async () => {
        const input = {
            arr: [
                {
                    id: 1,
                },
            ],
        };
        const result = array.findObject(input, 'arr', 0);
        expect(result).toEqual(undefined);
    });
});

describe('array.addObject', () => {
    it('Given a new element, add it to the array (direct reference)', async () => {
        const input = [];
        array.addObject(input, {
            id: 1,
        });
        expect(input).toEqual([
            {
                id: 1,
            },
        ]);
    });
    it('Given a new element, add it to the array (path reference)', async () => {
        const input = {
            arr: [],
        };
        array.addObject(input, 'arr', {
            id: 1,
        });
        expect(input).toEqual({
            arr: [
                {
                    id: 1,
                },
            ],
        });
    });
});

describe('array.updateObject', () => {
    it('Given an element, remove it from the array (direct reference)', async () => {
        const input = [
            {
                id: 1,
            },
        ];
        array.updateObject(input, {
            id: 1,
            name: 'name',
        });
        expect(input).toEqual([
            {
                id: 1,
                name: 'name',
            },
        ]);
    });
    it('Given an element, remove it from the array (path reference)', async () => {
        const input = {
            arr: [
                {
                    id: 1,
                    name: 'name',
                },
            ],
        };
        array.updateObject(input, 'arr', {
            id: 1,
            name: 'name',
        });
        expect(input).toEqual({
            arr: [
                {
                    id: 1,
                    name: 'name',
                },
            ],
        });
    });
    it('Given an element that does not exist, add it to the array', async () => {
        const input = {
            arr: [],
        };
        array.updateObject(input, 'arr', {
            id: 1,
            name: 'name',
        });
        expect(input).toEqual({
            arr: [
                {
                    id: 1,
                    name: 'name',
                },
            ],
        });
    });
});

describe('array.removeObject', () => {
    it('Given an element, remove it from the array (direct reference)', async () => {
        const input = [
            {
                id: 1,
            },
        ];
        array.removeObject(input, 1);
        expect(input).toEqual([]);
    });
    it('Given an element, remove it from the array (path reference)', async () => {
        const input = {
            arr: [
                {
                    id: 1,
                },
            ],
        };
        array.removeObject(input, 'arr', 1);
        expect(input).toEqual({
            arr: [],
        });
    });
    it('Given an element that does not exist, leave the array alone', async () => {
        const input = {
            arr: [
                {
                    id: 1,
                },
            ],
        };
        array.removeObject(input, 'arr', 0);
        expect(input).toEqual({
            arr: [
                {
                    id: 1,
                },
            ],
        });
    });
});