import {mockCategories} from "@/entities/category/api/test/mockData.ts";

import {API_URL} from '@/shared/config';
import {createHandlers} from "@/shared/lib/test/msw/createHandlers.ts";


export const breadcrumbsHandlers = createHandlers({
    endpoint: `${API_URL}/categories/breadcrumbs/:slug`,
    method: 'get',
    defaultData: mockCategories,
    errorData: {error: 'Failed to load breadcrumbs'},
    errorStatus: 500,
});
