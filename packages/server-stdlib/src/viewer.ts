// @graph-mind
// Remove the previous line to stop Ada from updating this file
import { Ability } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import cuid from 'cuid';
import httpErrors from 'http-errors';
import kindOf from 'kind-of';
import objectPath from 'object-path';
import Logger from './logger';

export function hydratePolicy(template: string, variables: Record<any, any>) {
    return JSON.parse(template, (_, rawValue) => {
        if (typeof rawValue !== 'string') {
            return rawValue;
        }
        if (!rawValue.startsWith('{{')) {
            return rawValue;
        }

        const name = rawValue.slice(2, -2);
        const value = objectPath.get(variables, name);

        if (typeof value === 'undefined') {
            throw new ReferenceError(`Variable ${name} is not defined`);
        }

        return value;
    });
}

export function readWhitelist(whitelist: string[], data: Record<any, any>) {
    if (!whitelist.length) {
        return null;
    }
    if (whitelist[0] === '**') {
        return data;
    }
    const whitelistTree = {};
    whitelist.forEach((rawPath) => {
        let path = rawPath;
        const value = true;
        if (path.endsWith('**')) {
            path = path.replace('**', '');
        }
        objectPath.set(whitelistTree, path, value);
    });
    const pickTree = (whitelistTrunk, source) => {
        if (kindOf(source) !== 'object') {
            return undefined;
        }
        const output = {};
        Object.entries(whitelistTrunk).forEach(
            ([whitelistField, branchValue]) => {
                const value = source[whitelistField];
                // If we are an object, then we must map each of our fields
                if (kindOf(branchValue) === 'object') {
                    if (
                        kindOf(value) === 'array' &&
                        kindOf(value[0]) === 'object'
                    ) {
                        output[whitelistField] = value.map((item) =>
                            pickTree(branchValue, item),
                        );
                    } else if (kindOf(value) === 'object') {
                        output[whitelistField] = pickTree(branchValue, value);
                    }
                } else {
                    output[whitelistField] = value;
                }
            },
        );
        return output;
    };
    return pickTree(whitelistTree, data);
}

export default class Viewer {
    public id;

    public isAuthenticated: boolean;

    protected $requestId: string;

    protected $database;

    protected $transaction;

    protected $transactionCommit;

    protected $isRollingBackTransaction: boolean;

    protected $ability: Ability;

    protected $logger: Logger;

    public constructor() {
        this.$ability = null;
        this.$requestId = cuid();
    }

    public async isAuthorized(
        rule: string,
        data?: Record<string, any>,
    ): Promise<boolean> {
        let grant = false;
        if (!this.$ability) {
            grant = false;
        } else {
            grant = this.$ability.can(rule, data);
        }
        if (grant) {
            this.$logger?.notice(`Permission granted for ${rule}`, {
                rule,
                grant,
                resourceId: data?.id,
            });
        } else {
            this.$logger?.notice(`Permission denied for ${rule}`, {
                rule,
                grant,
                resourceId: data?.id,
            });
        }
        return grant;
    }

    public async assertAuthorized(
        rule: string,
        data?: Record<string, any>,
    ): Promise<void> {
        const isAuthorized = await this.isAuthorized(rule, data);
        if (!isAuthorized) {
            throw new httpErrors.Unauthorized(`Unauthorized for ${rule}`);
        }
    }

    public async assertAuthorizedData(
        rule: string,
        data: Record<string, any>,
    ): Promise<any> {
        const fields = await this.readAuthorizedData(rule, data);
        if (!fields) {
            throw new httpErrors.Unauthorized(`Unauthorized for ${rule}`);
        }
        return fields;
    }

    public async readAuthorizedData(
        rule: string,
        data: Record<string, any>,
    ): Promise<any> {
        let whitelist = [];
        let grantedFields = null;
        if (!this.$ability) {
            grantedFields = null;
        } else {
            whitelist = permittedFieldsOf(this.$ability, rule, data, {
                fieldsFrom: (match) => {
                    return match.fields || [];
                },
            });
            grantedFields = readWhitelist(whitelist, data);
        }
        const grant = Boolean(grantedFields);
        if (grant) {
            this.$logger?.notice(`Permission granted for ${rule}`, {
                rule,
                grant,
                resourceId: data?.id,
                resourceFields: whitelist,
            });
        } else {
            this.$logger?.notice(`Permission denied for ${rule}`, {
                rule,
                grant,
                resourceId: data?.id,
                resourceFields: whitelist,
            });
        }
        return grantedFields;
    }

    // TODO: implement with the "&&" operator e.g.
    // ["&&", authzCriteria, criteria]
    public async genAuthorizedCriteria(rule: string, criteria) {
        return criteria;
    }

    public async genConnection(isTransaction = false) {
        if (this.$transaction) {
            return this.$transaction;
        }
        if (isTransaction) {
            const trx = await this.$database.transaction();
            return trx;
        }
        return this.$database;
    }

    public async startTransaction(): Promise<void> {
        this.$transaction = await this.$database.transaction();
        this.$transactionCommit = this.$transaction.commit.bind(
            this.$transaction,
        );
        this.$transaction.commit = async () => {};
    }

    public async commitTransaction(): Promise<void> {
        if (this.$transactionCommit) {
            await this.$transactionCommit();
        }
        this.$transaction = null;
        this.$transactionCommit = null;
    }

    public async rollbackTransaction(): Promise<void> {
        if (this.$transaction) {
            await this.$transaction.rollback();
        }
        this.$transaction = null;
        this.$transactionCommit = null;
        this.$isRollingBackTransaction = false;
    }

    public async rollingBackTransaction(): Promise<void> {
        this.$isRollingBackTransaction = true;
    }

    public isRollingBackTransaction(): boolean {
        return this.$isRollingBackTransaction;
    }

    public addDatabase(database): void {
        this.$database = database;
    }

    public setPolicies(
        rawPolicies: string[],
        variables: Record<string, any>,
    ): void {
        const rawRules = rawPolicies
            .filter(Boolean)
            .map((rawPolicy) =>
                hydratePolicy(rawPolicy, { ...variables, $viewer: this }),
            );
        this.$ability = new Ability(rawRules);
    }

    public getPolicies(): any[] {
        return [...this.$ability.rules];
    }

    /* LOGGING */

    public addLog(logger: Logger, initialContext = {}) {
        // Initial context allows requestId to be overridden for downstream requests
        this.$logger = logger.child({
            requestId: this.$requestId,
            ...initialContext,
        });
    }

    public addLogContext(context: Record<any, any>): void {
        this.$logger.addContext(context);
    }

    public useLog(): Logger {
        return this.$logger;
    }
}