import {mockFacets, mockProducts} from "@/entities/product/api/test/mockData";

import {API_URL} from "@/shared/config";
import {createHandlers} from "@/shared/lib/testing";

export const bestSellingProductsHandlers = createHandlers({
    endpoint: `${API_URL}/products/best-sellers`,
    method: "get",
    defaultData: {
        facets: mockFacets,
        products: mockProducts.slice(0, 20),
        pagination: {
            hasNext: true,
            hasPrev: false,
            limit: 20,
            page: 1,
            total: 50,
            totalPages: 3,
        },
    },
    errorData: {error: "Failed to load products"},
    errorStatus: 500,
});
