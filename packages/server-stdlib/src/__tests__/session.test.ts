// @graph-mind
// Remove the previous line to stop Ada from updating this file
import { SessionExpired, SessionHijackAttempt } from '../errors';
import Session from '../session';

describe('Session', () => {
    it('Given a new session, then generate security fields', async () => {
        const req = {
            get: () =>
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
            session: {},
        };
        const session = new Session(req, { now: 0 });
        await session.start();
        expect(req.session).toEqual({
            $expiresAt: 900000,
            $userAgent: '1ef9297aa114fee95f233626e3211492ee47ea1b',
        });
    });
});

describe('Session analyze', () => {
    let req;
    beforeEach(() => {
        req = {
            method: 'GET',
            get: () =>
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
            session: {
                $expiresAt: 900000,
                $userAgent: '1ef9297aa114fee95f233626e3211492ee47ea1b',
            },
        };
    });
    it('Given a valid session, then resolve', async () => {
        const session = new Session(req, { now: 0 });
        await expect(session.analyze()).resolves.toBeFalsy();
    });
    describe('refresh', () => {
        it('Given a "GET" request, then do not refresh', async () => {
            req.method = 'GET';
            const session = new Session(req, { now: 90001 });
            await expect(session.analyze()).resolves.toBeFalsy();
            expect(req.session.$expiresAt).toEqual(900000);
        });
        it('Given a "POST" request before the fresh boundary, then do not refresh', async () => {
            req.method = 'POST';
            const session = new Session(req, { now: 0 });
            await expect(session.analyze()).resolves.toBeFalsy();
            expect(req.session.$expiresAt).toEqual(900000);
        });
        it('Given a "POST" request, then refresh', async () => {
            req.method = 'POST';
            const session = new Session(req, { now: 90001 });
            await expect(session.analyze()).resolves.toBeFalsy();
            expect(req.session.$expiresAt).toEqual(990001);
        });
        it('Given a "PUT" request, then refresh', async () => {
            req.method = 'PUT';
            const session = new Session(req, { now: 90001 });
            await expect(session.analyze()).resolves.toBeFalsy();
            expect(req.session.$expiresAt).toEqual(990001);
        });
        it('Given a "DELETE" request, then refresh', async () => {
            req.method = 'DELETE';
            const session = new Session(req, { now: 90001 });
            await expect(session.analyze()).resolves.toBeFalsy();
            expect(req.session.$expiresAt).toEqual(990001);
        });
    });

    it('Given a different user-agent, then reject', async () => {
        req.session.$userAgent = '0000000000000000000000000000000000000000';
        const session = new Session(req, { now: 0 });
        await expect(session.analyze()).rejects.toThrowError(
            SessionHijackAttempt,
        );
    });
    it('Given an expired session, then reject', async () => {
        const session = new Session(req, { now: req.session.$expiresAt + 1 });
        await expect(session.analyze()).rejects.toThrowError(SessionExpired);
    });
});