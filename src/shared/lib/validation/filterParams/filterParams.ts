export const filterParams = <T extends Record<string, unknown>>(params: T) =>
    Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null && v !== ""),
    ) as Partial<T>;
