import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {productApi} from "./productApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("productApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getProducts requests /products with provided params", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);

            expect(url.pathname).toContain("/products");
            expect(url.searchParams.get("categoryId")).toBe("cat-1");
            expect(url.searchParams.get("locale")).toBe("en");

            return new Response(
                JSON.stringify({
                    products: [],
                    pagination: {
                        hasNext: false,
                        hasPrev: false,
                        limit: 20,
                        page: 1,
                        total: 0,
                        totalPages: 0,
                    },
                    facets: {},
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        await store.dispatch(
            productApi.endpoints.getProducts.initiate({
                categoryId: "cat-1",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test("getInfiniteProducts uses default limit=20 and page=1", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);

            expect(url.pathname).toContain("/products");
            expect(url.searchParams.get("categoryId")).toBe("cat-1");
            expect(url.searchParams.get("page")).toBe("1");
            expect(url.searchParams.get("limit")).toBe("20");

            return new Response(
                JSON.stringify({
                    products: [],
                    pagination: {
                        hasNext: false,
                        hasPrev: false,
                        limit: 20,
                        page: 1,
                        total: 0,
                        totalPages: 0,
                    },
                    facets: {},
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        await store.dispatch(
            productApi.endpoints.getInfiniteProducts.initiate({
                categoryId: "cat-1",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test("getInfiniteBestSellers requests /products/best-sellers with page params", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);

            expect(url.pathname).toContain("/products/best-sellers");
            expect(url.searchParams.get("locale")).toBe("en");
            expect(url.searchParams.get("page")).toBe("1");
            expect(url.searchParams.get("limit")).toBe("20");

            return new Response(
                JSON.stringify({
                    products: [],
                    pagination: {
                        hasNext: false,
                        hasPrev: false,
                        limit: 20,
                        page: 1,
                        total: 0,
                        totalPages: 0,
                    },
                    facets: {},
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        await store.dispatch(
            productApi.endpoints.getInfiniteBestSellers.initiate({
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});
