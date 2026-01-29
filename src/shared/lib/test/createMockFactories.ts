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

export const random = {
    int: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
    element: <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)],
    boolean: (probability: number = 0.5) => Math.random() < probability,
    oneOf: <T>(items: T[]) => () => items[Math.floor(Math.random() * items.length)],
    shuffle: <T>(array: T[]): T[] => {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
};