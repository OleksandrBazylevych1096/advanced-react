import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {createMockCategory} from "@/entities/category/testing";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {categoryNavigationApi} from "./categoryNavigationApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("categoryNavigationApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("returns top-level navigation when slug is not provided", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/categories/navigation");
            expect(url.searchParams.get("locale")).toBe("en");
            expect(url.searchParams.get("slug")).toBeNull();

            return new Response(
                JSON.stringify({
                    currentCategory: null,
                    parentCategory: null,
                    items: [createMockCategory({id: "c1", name: "Phones", slug: "phones"})],
                    isShowingSubcategories: false,
                }),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            categoryNavigationApi.endpoints.getCategoryNavigation.initiate({
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({
            currentCategory: null,
            parentCategory: null,
            items: [
                expect.objectContaining({
                    id: "c1",
                    slug: "phones",
                }),
            ],
            isShowingSubcategories: false,
        });
    });

    test("returns slug navigation when slug is provided", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/categories/navigation");
            expect(url.searchParams.get("locale")).toBe("en");
            expect(url.searchParams.get("slug")).toBe("phones");

            return new Response(
                JSON.stringify({
                    currentCategory: createMockCategory({id: "c1", name: "Phones", slug: "phones"}),
                    parentCategory: null,
                    items: [],
                    isShowingSubcategories: true,
                }),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            categoryNavigationApi.endpoints.getCategoryNavigation.initiate({
                slug: "phones",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.currentCategory?.slug).toBe("phones");
        expect(result.data?.isShowingSubcategories).toBe(true);
    });

    test("returns error for top-level request failure", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify({message: "Server error"}), {
                status: 500,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            categoryNavigationApi.endpoints.getCategoryNavigation.initiate({
                locale: "en",
            }),
        );

        expect("error" in result).toBe(true);
    });

    test("returns error for slug navigation request failure", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify({message: "Server error"}), {
                status: 500,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            categoryNavigationApi.endpoints.getCategoryNavigation.initiate({
                slug: "phones",
                locale: "en",
            }),
        );

        expect("error" in result).toBe(true);
    });
});
