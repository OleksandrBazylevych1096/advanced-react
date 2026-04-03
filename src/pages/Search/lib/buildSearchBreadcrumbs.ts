import {SEARCH_QUERY_PARAM} from "@/features/product-search";

import type {BreadcrumbItem} from "@/shared/ui/Breadcrumbs";

interface BuildSearchBreadcrumbsParams {
    isValidSearch: boolean;
    searchQuery: string;
    categoryLabel?: string;
    searchRoute: string;
}

export const buildSearchBreadcrumbs = ({
    isValidSearch,
    searchQuery,
    categoryLabel,
    searchRoute,
}: BuildSearchBreadcrumbsParams): BreadcrumbItem[] => {
    if (!isValidSearch) {
        return [];
    }

    if (!categoryLabel) {
        return [{label: searchQuery}];
    }

    const queryParams = new URLSearchParams();
    queryParams.set(SEARCH_QUERY_PARAM, searchQuery);

    return [
        {
            label: searchQuery,
            href: `${searchRoute}?${queryParams.toString()}`,
        },
        {label: categoryLabel},
    ];
};
