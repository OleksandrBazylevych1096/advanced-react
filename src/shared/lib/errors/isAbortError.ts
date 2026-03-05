export const isAbortError = (error: unknown): boolean =>
    error instanceof Error && error.name === "AbortError";
