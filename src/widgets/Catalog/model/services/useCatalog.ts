import {useCallback, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import type {Grid as GridType} from "react-virtualized";

import {useGetCategoryBySlugQuery} from "@/pages/Category/api/categoryPageApi.ts";

import {selectActiveFilters} from "@/features/productFilters/model/selectors/productFiltersSelectors.ts";

import {useGetInfiniteProducts} from "@/entities/product/api/productApi.ts";
import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib";


export const useCatalog = () => {
    const {slug} = useParams<{ slug: string }>()
    const {i18n} = useTranslation()
    const currency = useAppSelector(selectUserCurrency)
    const activeFilters = useAppSelector(selectActiveFilters)
    const isLoadingMore = useRef(false);
    const gridRef = useRef<GridType>(null);


    const {data: category} = useGetCategoryBySlugQuery({slug: slug!, locale: i18n.language!})

    const {
        data: productsData,
        isLoading,
        isFetching,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch
    } = useGetInfiniteProducts({
        categoryId: category?.id,
        locale: i18n.language,
        currency,
        ...activeFilters,
    }, {skip: !category?.id})

    const products = productsData?.pages.flatMap((page) => page.products)

    const isRefetching = isFetching && !isFetchingNextPage && !isLoading

    const handleLoadMore = useCallback((params: {
        rowsCount: number;
        stopIndex: number;
        threshold?: number;
    }) => {
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
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        gridRef.current?.recomputeGridSize();
    }, [products]);

    return {
        isLoading: isLoading || isRefetching,
        error,
        products,
        isFetchingNextPage,
        hasNextPage,
        handleLoadMore,
        gridRef,
        refetch
    }
}