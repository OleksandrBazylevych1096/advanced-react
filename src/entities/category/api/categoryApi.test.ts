import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";
import {createMockCategory} from "@/entities/category/api/test/mockData";

import {categoryApi} from "./categoryApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("categoryApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getCategoryBySlug requests category by slug with locale", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/categories/slug/phones");
            expect(url.searchParams.get("locale")).toBe("en");

            return new Response(
                JSON.stringify(createMockCategory({id: "c1", name: "Phones", slug: "phones"})),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            categoryApi.endpoints.getCategoryBySlug.initiate({
                slug: "phones",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.slug).toBe("phones");
    });

    test("getCategoryBreadcrumbs maps response into breadcrumb items with href", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/categories/breadcrumbs/c1");
            expect(url.searchParams.get("locale")).toBe("en");

            return new Response(
                JSON.stringify([
                    createMockCategory({id: "root", name: "Catalog", slug: "catalog"}),
                    createMockCategory({id: "c1", name: "Phones", slug: "phones"}),
                ]),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            categoryApi.endpoints.getCategoryBreadcrumbs.initiate({
                id: "c1",
                locale: "en",
            }),
        );

        expect(result.data).toEqual([
            expect.objectContaining({
                label: "Catalog",
                href: expect.stringContaining("catalog"),
            }),
            expect.objectContaining({
                label: "Phones",
                href: expect.stringContaining("phones"),
            }),
        ]);
    });
});
