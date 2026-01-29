import {createMockProduct} from '@/entities/product/api/test/mockData.ts';

import {API_URL} from '@/shared/config';
import {createHandlers} from "@/shared/lib/test/msw/createHandlers.ts";


export const firstOrderProductsHandlers = createHandlers({
    endpoint: `${API_URL}/products/first-order-discount`,
    method: 'get',
    defaultData: createMockProduct.createList(3),
    errorData: {error: 'Failed to load first order products'},
    errorStatus: 500,
});