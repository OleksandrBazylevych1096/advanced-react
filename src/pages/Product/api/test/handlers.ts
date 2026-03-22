import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {mockProductPageProduct} from "./mockData";

const productBySlugBase = createHandlers({
    endpoint: `${API_URL}/products/slug/:slug`,
    method: "get",
    defaultData: mockProductPageProduct,
    errorData: {error: "Failed to load product"},
    errorStatus: 500,
});

export const productPageHandlers = {
    productBySlug: extendHandlers(productBySlugBase, {
        empty: http.get(`${API_URL}/products/slug/:slug`, () => HttpResponse.json(null)),
    }),
};
