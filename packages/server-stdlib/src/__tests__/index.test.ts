// @graph-mind
// Remove the previous line to stop Ada from updating this file
import stdlib from '../index';

describe('stdlib namespace', () => {
    it('Should have namespaces', async () => {
        expect(stdlib).toHaveProperty('validation.id');
        expect(stdlib).toHaveProperty('array.genId');
        expect(stdlib).toHaveProperty('entity.genId');
        expect(stdlib).toHaveProperty('object.genId');
        expect(stdlib).toHaveProperty('primitive.Money');
        expect(stdlib).toHaveProperty('orm');
    });
});