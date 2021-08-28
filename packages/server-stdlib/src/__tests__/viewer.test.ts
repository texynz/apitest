// @graph-mind
// Remove the previous line to stop Ada from updating this file
import Viewer, { hydratePolicy, readWhitelist } from '../viewer';

describe('viewer readWhitelist', () => {
    it('Given an any whitelist, return all fields', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
        };
        const whitelist = ['**'];
        const output = {
            id: 'cuid',
            email: 'foo.bar@example.com',
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given an single depth field, return only specified fields', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
        };
        const whitelist = ['id'];
        const output = {
            id: 'cuid',
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given a primitive array field, return only specified fields', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            policyIds: [
                'read:Account',
                'read:AuthzPolicy',
                'read:AuthzPolicyGroup',
            ],
        };
        const whitelist = ['id', 'policyIds'];
        const output = {
            id: 'cuid',
            policyIds: [
                'read:Account',
                'read:AuthzPolicy',
                'read:AuthzPolicyGroup',
            ],
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given an object array field, return only specified fields', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            providers: [
                {
                    id: 'id',
                    provider: 'password',
                    hash: 'hashhash',
                },
            ],
        };
        const whitelist = ['id', 'providers.provider', 'providers.hash'];
        const output = {
            id: 'cuid',
            providers: [
                {
                    hash: 'hashhash',
                    provider: 'password',
                },
            ],
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given a sub object field, return only specified fields', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            provider: {
                id: 'id',
                name: 'password',
                hash: 'hashhash',
            },
        };
        const whitelist = ['id', 'provider.name', 'provider.hash'];
        const output = {
            id: 'cuid',
            provider: {
                hash: 'hashhash',
                name: 'password',
            },
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given a dates array field, return only specified fields', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            dates: [new Date(1591768963)],
        };
        const whitelist = ['id', 'dates'];
        const output = {
            id: 'cuid',
            dates: [new Date(1591768963)],
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given undefined fields, ignore them', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            provider: {
                id: 'id',
                name: 'password',
                hash: 'hashhash',
            },
        };
        const whitelist = ['id', 'providers.name', 'providers.hash'];
        const output = {
            id: 'cuid',
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given primitive array in place of object array fields, ignore them', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            providers: ['providerId'],
        };
        const whitelist = ['id', 'providers.name', 'providers.hash'];
        const output = {
            id: 'cuid',
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given an empty array, ignore them', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            providers: [],
        };
        const whitelist = ['id', 'providers.name', 'providers.hash'];
        const output = {
            id: 'cuid',
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });

    it('Given an any of dates, ignore them', () => {
        const input = {
            id: 'cuid',
            email: 'foo.bar@example.com',
            providers: [new Date(1591768963)],
        };
        const whitelist = ['id', 'providers.name', 'providers.hash'];
        const output = {
            id: 'cuid',
        };
        const result = readWhitelist(whitelist, input);
        expect(result).toEqual(output);
    });
});

describe('viewer hydratePolicy', () => {
    it('Given a template, returns hyrdated policy', () => {
        const template =
            '{"action":"read:Account","fields":["**"],"conditions":{"id":"{{$viewer.id}}"}}';
        const values = {
            $viewer: {
                id: 'viewerId',
            },
        };
        const output = {
            action: 'read:Account',
            conditions: {
                id: 'viewerId',
            },
            fields: ['**'],
        };
        const policy = hydratePolicy(template, values);
        expect(policy).toEqual(output);
    });
});

describe('viewer readAuthorizedData', () => {
    it('Given a template, allowing all fields, returns all fields', async () => {
        const template =
            '{"action":"read:Account", "fields":["**"],"conditions":{"id":"{{$viewer.id}}"}}';
        const input = {
            id: 'viewerId',
            name: 'Foo Bar',
        };
        const output = {
            id: 'viewerId',
            name: 'Foo Bar',
        };
        const viewer = new Viewer();
        viewer.id = 'viewerId';
        viewer.setPolicies([template], {});
        const result = await viewer.readAuthorizedData('read:Account', input);
        expect(result).toEqual(output);
    });

    it('Given a template, allowing all fields, with a failing condition, returns no fields', async () => {
        const template =
            '{"action":"read:Account", "fields":["**"],"conditions":{"id":"{{$viewer.id}}"}}';
        const input = {
            id: 'anotherViewerId',
            name: 'Foo Bar',
        };
        const output = null;
        const viewer = new Viewer();
        viewer.id = 'viewerId';
        viewer.setPolicies([template], {});
        const result = await viewer.readAuthorizedData('read:Account', input);
        expect(result).toEqual(output);
    });

    it('Given a template, allowing all some fields, returns allowed fields', async () => {
        const template =
            '{"action":"read:Account", "fields":["id","name"],"conditions":{"id":"{{$viewer.id}}"}}';
        const input = {
            id: 'viewerId',
            name: 'Foo Bar',
            superSecretField: 'Foo Bar is cool',
        };
        const output = {
            id: 'viewerId',
            name: 'Foo Bar',
        };
        const viewer = new Viewer();
        viewer.id = 'viewerId';
        viewer.setPolicies([template], {});
        const result = await viewer.readAuthorizedData('read:Account', input);
        expect(result).toEqual(output);
    });
});