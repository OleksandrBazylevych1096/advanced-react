import {API_URL} from '@/shared/config';
import {createHandlers} from "@/shared/lib/test/msw/createHandlers.ts";

import {mockBanners} from './mockData.ts';


export const promoCarouselHandlers = createHandlers({
    endpoint: `${API_URL}/promo-banners/active`,
    method: 'get',
    defaultData: mockBanners,
    errorData: {error: 'Failed to load banners'},
    errorStatus: 500,
});