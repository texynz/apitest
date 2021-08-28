// @graph-mind
// Remove the previous line to stop Ada from updating this file
export class FactoryFailed extends Error {
    public code: string;

    public status: number;

    public statusCode: number;

    public tracer: Error;

    public constructor(message: string, tracer?: Error) {
        super(message);
        this.name = 'FACTORY_FAILED';
        this.code = 'FACTORY_FAILED';
        this.status = 500;
        this.statusCode = this.status;
        this.tracer = tracer;
    }
}

export default class Factory {
    private map = {};

    public add(lookupName, ClassReference) {
        let className = lookupName;
        if (typeof lookupName === 'function') {
            className = lookupName.name;
        }
        const classString = ClassReference.toString();
        // If the function looks like it is nameless then make it nameless
        const isFunction =
            classString.startsWith('(') ||
            classString.startsWith('function(') ||
            classString.startsWith('function (');
        if (isFunction) {
            this.map[className] = (...args) => ClassReference(...args);
        } else {
            this.map[className] = ClassReference;
        }
    }

    public new<T = any>(ClassReference, context: Record<any, any> = {}): T {
        if (typeof ClassReference === 'string') {
            if (context[ClassReference]) {
                // eslint-disable-next-line no-param-reassign
                ClassReference = context[ClassReference];
            } else if (this.map[ClassReference]) {
                // eslint-disable-next-line no-param-reassign
                ClassReference = this.map[ClassReference];
            } else {
                throw new FactoryFailed(
                    `Failed to find reference for ${ClassReference}`,
                );
            }
        } else if (typeof ClassReference === 'function') {
            // @ts-ignore Do we have a singleton of this class?
            if (this.map[ClassReference.name]) {
                // eslint-disable-next-line no-param-reassign
                ClassReference = this.map[ClassReference.name];
            }
            if (typeof ClassReference === 'object') {
                return ClassReference;
            }
        }

        if (typeof ClassReference === 'object') {
            return ClassReference;
        }
        if (typeof ClassReference !== 'function') {
            throw new FactoryFailed(
                `Failed to find reference for ${ClassReference}`,
            );
        }
        const isClass =
            Boolean(ClassReference.name) &&
            ClassReference.name[0] === ClassReference.name[0].toUpperCase();
        if (!isClass) {
            return ClassReference(context);
        }
        const dependencies = {
            date: undefined,
        };
        if (ClassReference.DEPENDENCIES) {
            ClassReference.DEPENDENCIES.forEach((dependency) => {
                let lookupName = dependency;
                if (lookupName.name) {
                    lookupName = lookupName.name;
                }
                dependencies[lookupName] = this.new(dependency, context);
            });
        }
        dependencies.date = this.new('date', context);
        return new ClassReference(dependencies);
    }
}