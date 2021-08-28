// @graph-mind
// Remove the previous line to stop Ada from updating this file
import hasha from 'hasha';
import objectPath from 'object-path';
import { SessionExpired, SessionHijackAttempt } from './errors';

interface SessionOptions {
    timeToLive?: number;
    now?: number;
}
export default class Session {
    private req;

    private readonly timeToLive: number = 15 * 60;

    private readonly now: number;

    public constructor(req, options: SessionOptions = {}) {
        this.req = req;
        this.timeToLive = (options.timeToLive ?? this.timeToLive) * 1000;
        this.now = options.now ?? Date.now();
    }

    public get(key): any {
        return objectPath.get(this.req.session, key);
    }

    public set(key, value): any {
        objectPath.set(this.req.session, key, value);
    }

    public async regenerate(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.req.session.regenerate) {
                resolve();
                return;
            }
            this.req.session.regenerate((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async destroy(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.req.session.destroy) {
                resolve();
                return;
            }
            this.req.session.destroy((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async reload(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.req.session.reload) {
                resolve();
                return;
            }
            this.req.session.reload((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async save(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.req.session.save) {
                resolve();
                return;
            }
            this.req.session.save((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async touch(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.req.session.touch) {
                resolve();
                return;
            }
            this.req.session.touch();
            resolve();
        });
    }

    public async start(): Promise<void> {
        await this.regenerate();
        const userAgentHash = await this.hashUserAgent();
        const expiresAt = this.now + this.timeToLive;
        this.set('$userAgent', userAgentHash);
        this.set('$expiresAt', expiresAt);
    }

    public async analyze(): Promise<void> {
        const userAgentHash = await this.hashUserAgent();
        if (userAgentHash !== this.get('$userAgent')) {
            await this.destroy();
            throw new SessionHijackAttempt('Incorrect user-agent');
        }
        let expiresAt = this.get('$expiresAt');
        if (expiresAt < this.now) {
            await this.destroy();
            throw new SessionExpired('Session expired');
        }
        if (
            this.req.method === 'POST' ||
            this.req.method === 'PUT' ||
            this.req.method === 'DELETE'
        ) {
            // If we are 10% of the way to expiring then refresh it
            // This is done so the session store isn't updated on every request
            const expiresAtPercent = expiresAt - this.timeToLive * 0.9;
            if (expiresAtPercent < this.now) {
                expiresAt = this.now + this.timeToLive;
                this.set('$expiresAt', expiresAt);
            }
        }
    }

    private async hashUserAgent(): Promise<string> {
        let userAgent = this.req.get('user-agent') || '';
        userAgent = hasha.async(userAgent, { algorithm: 'sha1' });
        return userAgent;
    }
}