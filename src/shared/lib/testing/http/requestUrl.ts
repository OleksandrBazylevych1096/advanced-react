export const TEST_REQUEST_BASE_ORIGIN = "https://example.test";

export const getRequestUrl = (input: RequestInfo | URL): string => {
    if (typeof input === "string") return input;
    if (input instanceof URL) return input.toString();
    return input.url;
};

export const parseRequestUrl = (
    input: RequestInfo | URL,
    baseOrigin: string = TEST_REQUEST_BASE_ORIGIN,
): URL => {
    return new URL(getRequestUrl(input), baseOrigin);
};

