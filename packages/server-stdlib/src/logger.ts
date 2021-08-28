// @graph-mind
// Remove the previous line to stop Ada from updating this file
import pino, { Logger as PinoLogger } from 'pino';

type LoggerFn = (
    message: string,
    data: Record<any, any>,
    ...args: any[]
) => void;
export interface LoggerInterface {
    emergency: LoggerFn;
    alert: LoggerFn;
    critical: LoggerFn;
    error: LoggerFn;
    warning: LoggerFn;
    notice: LoggerFn;
    info: LoggerFn;
    debug: LoggerFn;
    child: (context: Record<any, any>) => LoggerInterface;
    addContext: (context: Record<any, any>) => void;
}

export default class Logger implements LoggerInterface {
    public static lowLevelEmergency(message, error) {
        const scrubbedError = Logger.scrub(error);
        const logObject = {
            severity: 'emergency',
            level: 0,
            message,
            error: scrubbedError,
        };
        console.log(JSON.stringify(logObject));
    }

    public static scrub(data) {
        if (!(data instanceof Error)) {
            return data;
        }
        const scrubbedError: Record<any, any> = {
            error: data.message,
            stack: data.stack,
        };
        // If the error is a wrapper for another error, we must log that error too
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { tracer }: { tracer: Error } = data;
        if (tracer) {
            scrubbedError.wrappedError = tracer.message;
            scrubbedError.wrappedStack = tracer.stack;
        }
        return scrubbedError;
    }

    private log: PinoLogger;

    public constructor(log?: PinoLogger) {
        if (log) {
            this.log = log;
        } else {
            this.log = pino({
                customLevels: {
                    emergency: 0,
                    alert: 1,
                    critical: 2,
                    error: 3,
                    warning: 4,
                    notice: 5,
                    info: 6,
                    debug: 7,
                },
                formatters: {
                    level(label, number) {
                        return { severity: label, level: number };
                    },
                    bindings(bindings) {
                        return {};
                    },
                },
                level: 'emergency',
                useOnlyCustomLevels: true,
                messageKey: 'message',
                timestamp: pino.stdTimeFunctions.isoTime,
            });
        }
    }

    public alert(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        this.log.alert(Logger.scrub(data), message, ...args);
    }

    public critical(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        this.log.critical(Logger.scrub(data), message, ...args);
    }

    public debug(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        if (process.env.NODE_ENV !== 'production') {
            this.log.debug(Logger.scrub(data), message, ...args);
        }
    }

    public emergency(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        this.log.emergency(Logger.scrub(data), message, ...args);
    }

    public error(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        this.log.error(Logger.scrub(data), message, ...args);
    }

    public info(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        this.log.info(Logger.scrub(data), message, ...args);
    }

    public notice(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        this.log.notice(Logger.scrub(data), message, ...args);
    }

    public warning(
        message: string,
        data: Record<any, any> = {},
        ...args: any[]
    ): void {
        this.log.warning(Logger.scrub(data), message, ...args);
    }

    public child(context: Record<string, any> = {}): Logger {
        return new Logger(this.log.child(context));
    }

    public addContext(context: Record<string, any>): void {
        this.log = this.log.child(context);
    }
}