import {mockFacets, mockProducts} from '@/entities/product/api/test/mockData.ts';

import {API_URL} from '@/shared/config';
import {createHandlers} from "@/shared/lib/test/msw/createHandlers.ts";


export const bestSellingProductsHandlers = createHandlers({
    endpoint: `${API_URL}/products/best-sellers`,
    method: 'get',
    defaultData: {
        facets: mockFacets,
        products: mockProducts.slice(0, 20),
        total: 50,
        page: 1,
        limit: 20,
    },
    errorData: {error: 'Failed to load products'},
    errorStatus: 500,
});