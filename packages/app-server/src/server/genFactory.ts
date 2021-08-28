// @graph-mind
// Remove the previous line to prevent this file from being modified by the robots

import stdlib, { StdlibTypes } from '@local/server-stdlib';

export default function genFactory(dependencies: {
    [dependencyName: string]: any;
}): StdlibTypes['Factory'] {
    const factory = new stdlib.Factory();
    factory.add('date', () => new Date());
    Object.entries(dependencies).forEach(([dependencyName, dependency]) => {
        factory.add(dependencyName, dependency);
    });
    return factory;
}
