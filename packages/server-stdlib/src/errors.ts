// @graph-mind
// Remove the previous line to stop Ada from updating this file
import httpErrors from 'http-errors';
import { FactoryFailed } from './factory';

export class ValidationFailed extends Error {
    public code: string;

    public status: number;

    public statusCode: number;

    public tracer: Error;

    public constructor(message: string, tracer?: Error) {
        super(message);
        // We can convert messages to friendly api fields here;
        this.name = ValidationFailed.name;
        this.code = 'ValidationFailed';
        this.status = 400;
        this.statusCode = this.status;
        this.tracer = tracer;
    }
}
export class EntityValidationFailed extends Error {
    public code: string;

    public status: number;

    public statusCode: number;

    public tracer: Error;

    public constructor(message: string, tracer?: Error) {
        super(message);
        // We can convert messages to friendly api fields here;
        this.name = EntityValidationFailed.name;
        this.code = 'EntityValidationFailed';
        this.status = 400;
        this.statusCode = this.status;
        this.tracer = tracer;
    }
}

export class GatewayFailed extends Error {
    public code: string;

    public status: number;

    public statusCode: number;

    public tracer: Error;

    public constructor(message: string, tracer?: Error) {
        super(message);
        this.name = GatewayFailed.name;
        this.code = 'GatewayFailed';
        this.status = 500;
        this.statusCode = this.status;
        this.tracer = tracer;
    }
}

export class SessionHijackAttempt extends Error {
    public code: string;

    public status: number;

    public statusCode: number;

    public tracer: Error;

    public constructor(message: string, tracer?: Error) {
        super(message);
        this.name = SessionHijackAttempt.name;
        this.code = 'SessionHijackAttempt';
        this.status = 401;
        this.statusCode = this.status;
        this.tracer = tracer;
    }
}

export class SessionExpired extends Error {
    public code: string;

    public status: number;

    public statusCode: number;

    public tracer: Error;

    public constructor(message: string, tracer?: Error) {
        super(message);
        this.name = SessionExpired.name;
        this.code = 'SessionExpired';
        this.status = 401;
        this.statusCode = this.status;
        this.tracer = tracer;
    }
}

export class SearchCriteriaFailed extends Error {
    public code: string;

    public status: number;

    public statusCode: number;

    public tracer: Error;

    public constructor(message: string, tracer?: Error) {
        super(message);
        // We can convert messages to friendly api fields here;
        this.name = SearchCriteriaFailed.name;
        this.code = 'SearchCriteriaFailed';
        this.status = 400;
        this.statusCode = this.status;
        this.tracer = tracer;
    }
}

httpErrors.ValidationFailed = ValidationFailed;
httpErrors.EntityValidationFailed = EntityValidationFailed;
httpErrors.GatewayFailed = GatewayFailed;
httpErrors.FactoryFailed = FactoryFailed;
httpErrors.SessionHijackAttempt = SessionHijackAttempt;
httpErrors.SessionExpired = SessionExpired;
httpErrors.SearchCriteriaFailed = SearchCriteriaFailed;

export default httpErrors;