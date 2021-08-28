// @graph-mind
// Remove the previous line to stop Ada from updating this file
import object from '../object';

describe('object.genId', () => {
    it('Should generate an id 25 characters long', async () => {
        const id = object.genId();
        expect(id.length).toEqual(25);
    });
});