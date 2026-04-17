export const cloneValue = <T>(value: T): T => {
    return structuredClone(value);
};
