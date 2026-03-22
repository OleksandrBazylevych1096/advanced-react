import {URL_PARAMS} from "@/features/product-filters/config/defaults.ts";

import type {ProductFacets} from "@/entities/product";

export const validateFiltersFromURL = (searchParams: URLSearchParams, facets: ProductFacets) => {
    const countries = searchParams.get(URL_PARAMS.COUNTRIES)?.split(",").filter(Boolean) || [];
    const brands = searchParams.get(URL_PARAMS.BRANDS)?.split(",").filter(Boolean) || [];

    const availableCountries = facets?.countries?.map((c) => c.value) || [];
    const availableBrands = facets?.brands?.map((b) => b.value) || [];

    return {
        validCountries: countries.filter((country) => availableCountries.includes(country)),
        validBrands: brands.filter((brand) => availableBrands.includes(brand)),
    };
};
