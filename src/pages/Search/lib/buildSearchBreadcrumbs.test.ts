import {describe, expect, test} from "vitest";

import {buildSearchBreadcrumbs} from "./buildSearchBreadcrumbs";

describe("buildSearchBreadcrumbs", () => {
    test("returns empty list for invalid search", () => {
        const result = buildSearchBreadcrumbs({
            isValidSearch: false,
            searchQuery: "milk",
            searchRoute: "/en/search",
        });

        expect(result).toEqual([]);
    });

    test("returns single breadcrumb when category label is absent", () => {
        const result = buildSearchBreadcrumbs({
            isValidSearch: true,
            searchQuery: "milk",
            searchRoute: "/en/search",
        });

        expect(result).toEqual([{label: "milk"}]);
    });

    test("returns search and category breadcrumbs when category label exists", () => {
        const result = buildSearchBreadcrumbs({
            isValidSearch: true,
            searchQuery: "milk",
            categoryLabel: "Dairy",
            searchRoute: "/en/search",
        });

        expect(result).toEqual([{label: "milk", href: "/en/search?q=milk"}, {label: "Dairy"}]);
    });
});
