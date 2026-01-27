import {delay, http, HttpResponse} from 'msw';

import {mockBanners} from "@/widgets/PromoCarousel/lib/test/mockData.ts";

import {API_URL} from "@/shared/config";


export const promoCarouselHandlers = {
    default:
        http.get(`${API_URL}/promo-banners/active`, () => {
            return HttpResponse.json(mockBanners);
        }),

    loading: http.get(`${API_URL}/promo-banners/active`, async () => {
        await delay('infinite')
        return HttpResponse.json(mockBanners);
    }),
    error:
        http.get(`${API_URL}/promo-banners/active`, () => {
            return HttpResponse.json(
                {error: 'Failed to load banners'},
                {status: 500}
            );
        }),


};