import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";

import {productFiltersActions} from "@/features/productFilters";
import {selectActiveFilters} from "@/features/productFilters/model/selectors/productFiltersSelectors.ts";

import {useGetInfiniteProducts} from "@/entities/product/api/productApi.ts";
import {selectUserCurrency} from "@/entities/user";

import {useAppDispatch, useAppSelector, useIntersectionObserver} from "@/shared/lib";

export const useCatalog = () => {
    const {slug} = useParams()
    const {i18n} = useTranslation()
    const dispatch = useAppDispatch()
    const currency = useAppSelector(selectUserCurrency)
    const activeFilters = useAppSelector(selectActiveFilters)

    const {
        data: productsData,
        isLoading,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage
    } = useGetInfiniteProducts({
        categorySlug: slug!,
        locale: i18n.language,
        currency,
        limit: 10,
        ...activeFilters,
    })

    const products = productsData?.pages.flatMap((page) => page.products)

    const [sentryRef, isIntersecting] = useIntersectionObserver({
        threshold: 0.5,
        rootMargin: '200px',
    });

    useEffect(() => {
        if (productsData?.pages?.length) {
            const lastPage = productsData.pages[productsData.pages.length - 1];
            if (lastPage?.facets) {
                dispatch(productFiltersActions.syncFacets(lastPage.facets));
            }
        }
    }, [productsData?.pages, dispatch]);

    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);


    return {
        isLoading,
        error,
        products,
        isFetchingNextPage,
        hasNextPage,
        sentryRef
    }

}