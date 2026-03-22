import {mockCategories} from "@/entities/category/api/test/mockData.ts";

import {API_URL} from "@/shared/config";
import {createHandlers} from "@/shared/lib/testing";

export const categoryHandlers = createHandlers({
    endpoint: `${API_URL}/categories/slug/:slug`,
    method: "get",
    defaultData: mockCategories[0],
    errorData: {error: "Failed to load category"},
    errorStatus: 500,
});

export const categoryBreadcrumbsHandlers = createHandlers({
    endpoint: `${API_URL}/categories/breadcrumbs/:id`,
    method: "get",
    defaultData: mockCategories,
    errorData: {error: "Failed to load breadcrumbs"},
    errorStatus: 500,
});
