const sequences = new Map<string, number>();

export function resetSequences(prefix?: string): void {
    if (prefix) {
        sequences.delete(prefix);
    } else {
        sequences.clear();
    }
}

export function sequence(prefix: string = '__default__'): (index: number) => string {
    return () => {
        const current = (sequences.get(prefix) || 0) + 1;
        sequences.set(prefix, current);
        return `${prefix}-${current}`;
    };
}

type FactoryFieldGenerator<T> = (index: number) => T;
type FactoryField<T> = T | FactoryFieldGenerator<T>;

type FactoryDefinition<T> = {
    [K in keyof T]: FactoryField<T[K]>;
};

interface MockFactory<T> {
    createList: (count: number, overrides?: (index: number) => Partial<T>) => T[];

    (overrides?: Partial<T>): T;
}

export function createMockFactory<T extends object>(
    definition: FactoryDefinition<T>
): MockFactory<T> {
    let callCount = 0;

    const factory = (overrides?: Partial<T>): T => {
        callCount++;
        const result = {} as T;

        for (const key in definition) {
            const fieldValue = definition[key];

            if (typeof fieldValue === 'function') {
                result[key] = (fieldValue as FactoryFieldGenerator<T[Extract<keyof T, string>]>)(callCount);
            } else {
                result[key] = fieldValue as T[Extract<keyof T, string>];
            }
        }

        if (overrides) {
            Object.assign(result, overrides);
        }

        return result;
    };

    factory.createList = (count: number, overrides?: (index: number) => Partial<T>) => {
        return Array.from({length: count}, (_, i) => {
            const itemOverrides = overrides ? overrides(i) : undefined;
            return factory(itemOverrides);
        });
    };

    return factory;
}

let deterministicCounter = 0;

export function resetDeterministicCounter(): void {
    deterministicCounter = 0;
}

export const random = {
    int: (min: number, max: number) => {
        const value = min + (deterministicCounter % (max - min + 1));
        deterministicCounter++;
        return value;
    },
    element: <T>(items: T[]): T => {
        const value = items[deterministicCounter % items.length];
        deterministicCounter++;
        return value;
    },
    boolean: (probability: number = 0.5) => {
        const value = (deterministicCounter % 100) < probability * 100;
        deterministicCounter++;
        return value;
    },
    oneOf: <T>(items: T[]) => {
        const startIndex = deterministicCounter;
        return () => items[startIndex % items.length];
    },

};