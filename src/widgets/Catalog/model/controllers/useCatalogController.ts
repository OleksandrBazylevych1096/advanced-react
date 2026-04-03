import {useCallback, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import type {Grid as GridType} from "react-virtualized";

import {selectActiveFilters} from "@/features/product-filters";

import {useResolvedCategoryIdController} from "@/entities/category";
import {useGetInfiniteProducts} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppSelector} from "@/shared/lib/state";

interface UseCatalogControllerArgs {
    categoryId?: string | null;
    searchQuery?: string;
}

export const useCatalogController = ({categoryId, searchQuery}: UseCatalogControllerArgs = {}) => {
    const {i18n} = useTranslation();
    const {slug} = useParams<{slug: string}>();
    const currency = useAppSelector(selectUserCurrency);
    const activeFilters = useAppSelector(selectActiveFilters);
    const isLoadingMore = useRef(false);
    const gridRef = useRef<GridType>(null);
    const {
        data: {resolvedCategoryId},
        status: {isLoading: isCategoryLoading, error: categoryError},
    } = useResolvedCategoryIdController({
        categoryId,
        slug,
        locale: i18n.language,
    });
    const normalizedSearchQuery = searchQuery?.trim();
    const isValidSearchQuery = Boolean(normalizedSearchQuery && normalizedSearchQuery.length >= 2);

    const {
        data: productsData,
        isLoading,
        isFetching,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useGetInfiniteProducts(
        {
            categoryId: resolvedCategoryId,
            searchQuery: normalizedSearchQuery,
            locale: i18n.language,
            currency,
            ...activeFilters,
        },
        {skip: !resolvedCategoryId && !isValidSearchQuery},
    );

    const products = productsData?.pages.flatMap((page) => page.products);

    const isRefetching = isFetching && !isFetchingNextPage && !isLoading;

    const loadMore = useCallback(
        (params: {rowsCount: number; stopIndex: number; threshold?: number}) => {
            const {rowsCount, stopIndex, threshold = 0.2} = params;

            if (isLoadingMore.current || !hasNextPage || isFetchingNextPage) {
                return;
            }

            const loadThreshold = Math.max(2, Math.floor(rowsCount * threshold));

            if (stopIndex >= rowsCount - loadThreshold) {
                isLoadingMore.current = true;
                fetchNextPage().finally(() => {
                    isLoadingMore.current = false;
                });
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage],
    );

    useEffect(() => {
        gridRef.current?.recomputeGridSize();
    }, [products]);

    return createControllerResult({
        data: {
            products,
            hasNextPage,
        },
        status: {
            isLoading: isCategoryLoading || isLoading || isRefetching,
            error: categoryError ?? error,
            isFetchingNextPage,
        },
        actions: {
            loadMore,
            refetch,
        },
        refs: {
            gridRef,
        },
    });
};
