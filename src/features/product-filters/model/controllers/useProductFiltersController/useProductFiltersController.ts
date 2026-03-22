import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams, useSearchParams} from "react-router";

import {
    DEBOUNCE_DELAY,
    DEFAULT_SORT_BY,
    DEFAULT_SORT_ORDER,
    URL_PARAMS,
} from "@/features/product-filters/config/defaults.ts";
import {parsePriceRange} from "@/features/product-filters/lib/parsePriceRange/parsePriceRange.ts";
import {
    isValidSortBy,
    isValidSortOrder,
} from "@/features/product-filters/lib/sortOptionsHelpers/sortOptionsHelpers.ts";
import {validateFiltersFromURL} from "@/features/product-filters/lib/validateFiltersFromURL.ts";
import {
    selectActiveFilters,
    selectHasActiveFilters,
    selectProductFilters,
    selectProductFiltersIsOpen,
    selectSelectedBrands,
    selectSelectedCountries,
    selectSelectedPriceRange,
    selectSortSettings,
} from "@/features/product-filters/model/selectors/productFiltersSelectors.ts";
import {productFiltersActions} from "@/features/product-filters/model/slice/productFiltersSlice.ts";
import type {
    OrderType,
    SortType,
} from "@/features/product-filters/model/types/productFiltersSchema.ts";

import {useResolvedCategoryIdController} from "@/entities/category";
import {useGetInfiniteProducts} from "@/entities/product";
import type {PriceRangeType} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import type {SupportedLngsType} from "@/shared/config";
import {useDebounce} from "@/shared/lib/async";
import {clampOptionalRange} from "@/shared/lib/math";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

interface UseProductFiltersControllerArgs {
    categoryId?: string;
}

export const useProductFiltersController = ({categoryId}: UseProductFiltersControllerArgs = {}) => {
    const {i18n} = useTranslation();
    const {slug} = useParams<{slug: string; lng: SupportedLngsType}>();
    const locale = i18n.language as SupportedLngsType;
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const currency = useAppSelector(selectUserCurrency);
    const activeFilters = useAppSelector(selectActiveFilters);
    const hasActiveFilters = useAppSelector(selectHasActiveFilters);
    const filtersState = useAppSelector(selectProductFilters);
    const currentCountries = useAppSelector(selectSelectedCountries);
    const currentBrands = useAppSelector(selectSelectedBrands);
    const currentPriceRange = useAppSelector(selectSelectedPriceRange);
    const sortSettings = useAppSelector(selectSortSettings);
    const isSidebarOpen = useAppSelector(selectProductFiltersIsOpen);

    const [isInitialized, setIsInitialized] = useState(false);
    const [localPriceRange, setLocalPriceRange] = useState<PriceRangeType>(currentPriceRange);
    const isUserChangingPrice = useRef(false);

    const isReducerReady = filtersState !== undefined;

    const debouncedPriceRange = useDebounce(localPriceRange, DEBOUNCE_DELAY);
    const {
        data: {resolvedCategoryId},
        status: {isLoading: isCategoryLoading, error: categoryError},
    } = useResolvedCategoryIdController({
        categoryId,
        slug,
        locale,
    });

    const productsQuery = useGetInfiniteProducts(
        {
            categoryId: resolvedCategoryId,
            locale,
            currency,
            ...activeFilters,
            ...sortSettings,
        },
        {
            skip: !resolvedCategoryId,
            selectFromResult: ({data, isLoading, error}) => ({
                facets: data?.pages[0].facets,
                isLoading,
                error,
            }),
        },
    );

    const {facets, isLoading: isProductsLoading, error: productsError} = productsQuery;
    const refetch = productsQuery.refetch;

    useEffect(() => {
        if (isInitialized || !isReducerReady || !facets) return;

        const {validCountries, validBrands} = validateFiltersFromURL(searchParams, facets);

        if (validCountries.length > 0) {
            dispatch(productFiltersActions.setSelectedCountries(validCountries));
        }

        if (validBrands.length > 0) {
            dispatch(productFiltersActions.setSelectedBrands(validBrands));
        }

        const minPrice = searchParams.get(URL_PARAMS.MIN_PRICE);
        const maxPrice = searchParams.get(URL_PARAMS.MAX_PRICE);

        if (minPrice || maxPrice) {
            const priceRange = parsePriceRange(minPrice, maxPrice);

            if (priceRange === null) {
                dispatch(productFiltersActions.resetPriceRange());
                setLocalPriceRange({min: undefined, max: undefined});

                const updated = new URLSearchParams(searchParams);
                updated.delete(URL_PARAMS.MIN_PRICE);
                updated.delete(URL_PARAMS.MAX_PRICE);
                setSearchParams(updated, {replace: true});
            } else {
                dispatch(productFiltersActions.setSelectedPriceRange(priceRange));
                setLocalPriceRange(priceRange);
            }
        }

        const sortBy = searchParams.get(URL_PARAMS.SORT_BY);
        const sortOrder = searchParams.get(URL_PARAMS.SORT_ORDER);

        if (isValidSortBy(sortBy)) {
            dispatch(productFiltersActions.setSortBy(sortBy));
        }

        if (isValidSortOrder(sortOrder)) {
            dispatch(productFiltersActions.setSortOrder(sortOrder));
        }

        setIsInitialized(true);
    }, [dispatch, isInitialized, searchParams, setSearchParams, isReducerReady, facets]);

    useEffect(() => {
        if (!isInitialized) return;

        const params = new URLSearchParams();

        if (currentCountries.length > 0) {
            params.set(URL_PARAMS.COUNTRIES, currentCountries.join(","));
        }

        if (currentBrands.length > 0) {
            params.set(URL_PARAMS.BRANDS, currentBrands.join(","));
        }

        if (currentPriceRange.min !== undefined) {
            params.set(URL_PARAMS.MIN_PRICE, currentPriceRange.min.toString());
        }

        if (currentPriceRange.max !== undefined) {
            params.set(URL_PARAMS.MAX_PRICE, currentPriceRange.max.toString());
        }

        if (sortSettings.sortBy !== DEFAULT_SORT_BY) {
            params.set(URL_PARAMS.SORT_BY, sortSettings.sortBy);
        }

        if (sortSettings.sortOrder !== DEFAULT_SORT_ORDER) {
            params.set(URL_PARAMS.SORT_ORDER, sortSettings.sortOrder);
        }

        const newSearch = params.toString();
        const currentSearch = searchParams.toString();

        if (newSearch !== currentSearch) {
            setSearchParams(params, {replace: true});
        }
    }, [
        currentCountries,
        currentBrands,
        currentPriceRange,
        sortSettings,
        isInitialized,
        searchParams,
        setSearchParams,
    ]);

    useEffect(() => {
        if (isUserChangingPrice.current) {
            dispatch(productFiltersActions.setSelectedPriceRange(debouncedPriceRange));
            isUserChangingPrice.current = false;
        } else {
            setLocalPriceRange(currentPriceRange);
        }
    }, [debouncedPriceRange, currentPriceRange, dispatch]);

    useEffect(() => {
        const facetsMin = facets?.priceRange?.min;
        const facetsMax = facets?.priceRange?.max;

        if (facetsMin === undefined || facetsMax === undefined) return;

        const needsUpdate =
            (currentPriceRange.min !== undefined && currentPriceRange.min < facetsMin) ||
            (currentPriceRange.max !== undefined && currentPriceRange.max > facetsMax);

        if (!needsUpdate) return;

        const newRange = clampOptionalRange(currentPriceRange, {min: facetsMin, max: facetsMax});

        dispatch(productFiltersActions.setSelectedPriceRange(newRange));
    }, [currentPriceRange, facets?.priceRange?.min, facets?.priceRange?.max, dispatch]);

    const toggleCountry = (countryValue: string) => {
        dispatch(productFiltersActions.toggleCountry(countryValue));
    };

    const toggleBrand = (brandValue: string) => {
        dispatch(productFiltersActions.toggleBrand(brandValue));
    };

    const changePriceRange = (priceRange: PriceRangeType) => {
        isUserChangingPrice.current = true;
        setLocalPriceRange(priceRange);
    };

    const changeSort = (sortBy: SortType, sortOrder: OrderType) => {
        dispatch(productFiltersActions.setSortBy(sortBy));
        dispatch(productFiltersActions.setSortOrder(sortOrder));
    };

    const resetFilters = () => {
        dispatch(productFiltersActions.resetFilters());
    };

    const closeSidebar = () => {
        dispatch(productFiltersActions.setIsOpen(false));
    };

    const isLoading = isCategoryLoading || isProductsLoading;
    const hasError = Boolean(categoryError || productsError);

    return createControllerResult({
        data: {
            facets,
            currentCountries,
            currentBrands,
            localPriceRange,
            sortSettings,
            currency,
            isSidebarOpen,
            locale,
        },
        derived: {
            hasActiveFilters,
        },
        status: {
            isLoading,
            hasError,
        },
        actions: {
            toggleCountry,
            toggleBrand,
            changePriceRange,
            changeSort,
            resetFilters,
            closeSidebar,
            refetch,
        },
    });
};
