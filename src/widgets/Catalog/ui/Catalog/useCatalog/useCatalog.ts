import {useCallback, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import type {Grid as GridType} from "react-virtualized";

import {selectActiveFilters} from "@/features/product-filters";

import {useGetInfiniteProducts} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";

export type CatalogSpecialType = "bestseller";

interface UseCatalogControllerArgs {
    categoryId?: string | null;
    tagId?: string | null;
    searchQuery?: string;
    special?: CatalogSpecialType;
}

export const useCatalog = ({
    categoryId,
    tagId,
    searchQuery,
    special,
}: UseCatalogControllerArgs = {}) => {
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const activeFilters = useAppSelector(selectActiveFilters);
    const isLoadingMore = useRef(false);
    const gridRef = useRef<GridType>(null);
    const normalizedSearchQuery = searchQuery?.trim();
    const isValidSearchQuery = Boolean(normalizedSearchQuery && normalizedSearchQuery.length >= 2);
    const queryArgs = {
        categoryId: categoryId ?? undefined,
        tagId: tagId ?? undefined,
        searchQuery: normalizedSearchQuery,
        locale: i18n.language,
        currency,
        ...activeFilters,
    };

    const shouldLoadProducts =
        special === "bestseller" || categoryId || tagId || isValidSearchQuery;

    const {
        data: productsData,
        isLoading: isProductsLoading,
        isFetching,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useGetInfiniteProducts(queryArgs, {
        skip: !shouldLoadProducts,
    });

    const products = productsData?.pages.flatMap((page) => page.products);

    const isRefetching = isFetching && !isFetchingNextPage && !isProductsLoading;

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

    const isLoading =
        isProductsLoading ||
        isRefetching ||
        (special !== "bestseller" && !categoryId && !tagId && !isValidSearchQuery);

    return {
        data: {
            products,
            hasNextPage,
        },
        status: {
            isLoading,
            error,
            isFetchingNextPage,
        },
        actions: {
            loadMore,
            refetch,
        },
        refs: {
            gridRef,
        },
    };
};
