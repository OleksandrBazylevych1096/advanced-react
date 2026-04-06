import {type KeyboardEvent, useCallback, useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {generatePath, useMatch, useNavigate, useSearchParams} from "react-router";

import {
    MIN_SEARCH_QUERY_LENGTH,
    SEARCH_DEBOUNCE_DELAY,
    SEARCH_QUERY_PARAM,
    SEARCH_SUGGESTIONS_LIMIT,
} from "@/features/product-search/config/constants.ts";
import {
    selectProductSearchIsFocused,
    selectProductSearchQuery,
} from "@/features/product-search/model/selectors/productSearchSelectors.ts";
import {productSearchActions} from "@/features/product-search/model/slice/productSearchSlice.ts";

import {type Product, useGetProducts} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {useDebounce} from "@/shared/lib/async";
import {useAppDispatch, useAppSelector} from "@/shared/lib/state";

export const useProductSearch = () => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const currency = useAppSelector(selectUserCurrency);
    const isFocused = useAppSelector(selectProductSearchIsFocused);
    const query = useAppSelector(selectProductSearchQuery);

    const [searchParams] = useSearchParams();
    const isSearchRoute = Boolean(useMatch(routePaths[AppRoutes.SEARCH]));

    const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_DELAY);

    const trimmedQuery = useMemo(() => query.trim(), [query]);
    const trimmedDebouncedQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery]);
    const isDebouncing = trimmedQuery !== trimmedDebouncedQuery;

    const isValidQuery = trimmedQuery.length >= MIN_SEARCH_QUERY_LENGTH;
    const shouldFetchSuggestions =
        isFocused && trimmedDebouncedQuery.length >= MIN_SEARCH_QUERY_LENGTH;

    const {data, isFetching: isFetchingSuggestions} = useGetProducts(
        {
            searchQuery: trimmedDebouncedQuery,
            limit: SEARCH_SUGGESTIONS_LIMIT,
            locale: i18n.language,
            currency,
        },
        {skip: !shouldFetchSuggestions},
    );
    const suggestions = useMemo<Product[]>(
        () => (data?.products ?? []).slice(0, SEARCH_SUGGESTIONS_LIMIT),
        [data],
    );
    const hasNoSuggestions =
        shouldFetchSuggestions &&
        !isFetchingSuggestions &&
        data !== undefined &&
        suggestions.length === 0;

    const showSuggestionsDropdown = useMemo(
        () =>
            isFocused &&
            isValidQuery &&
            !isDebouncing &&
            (isFetchingSuggestions || suggestions.length > 0 || hasNoSuggestions),
        [
            isFocused,
            isValidQuery,
            isDebouncing,
            isFetchingSuggestions,
            suggestions.length,
            hasNoSuggestions,
        ],
    );

    const setQuery = useCallback(
        (value: string) => {
            dispatch(productSearchActions.setQuery(value));
        },
        [dispatch],
    );

    const onFocusInput = useCallback(() => {
        dispatch(productSearchActions.setFocused(true));
    }, [dispatch]);

    const submitSearch = useCallback(
        (searchQuery?: string) => {
            const effectiveQuery = (searchQuery ?? query).trim();

            if (effectiveQuery.length < MIN_SEARCH_QUERY_LENGTH) return;

            dispatch(productSearchActions.submitQuery(effectiveQuery));
            dispatch(productSearchActions.setFocused(false));

            const nextSearchParams = new URLSearchParams();
            nextSearchParams.set(SEARCH_QUERY_PARAM, effectiveQuery);

            const path = generatePath(routePaths[AppRoutes.SEARCH], {lng: i18n.language});
            navigate(`${path}?${nextSearchParams.toString()}`);
        },
        [dispatch, i18n.language, navigate, query],
    );

    const openProductPage = useCallback(
        (product: Product) => {
            const path = generatePath(routePaths[AppRoutes.PRODUCT], {
                lng: i18n.language,
                slug: product.slug,
            });
            navigate(path);
        },
        [i18n.language, navigate],
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitSearch();
            }
        },
        [submitSearch],
    );

    useEffect(() => {
        if (!isSearchRoute) return;

        const nextQuery = searchParams.get(SEARCH_QUERY_PARAM) ?? "";
        dispatch(productSearchActions.syncQueryFromUrl(nextQuery));
    }, [dispatch, isSearchRoute, searchParams]);

    useEffect(() => {
        dispatch(productSearchActions.setQueryValid(isValidQuery));
    }, [dispatch, isValidQuery]);

    return {
        data: {
            query,
            suggestions,
            currency,
            isValidQuery,
            showSuggestionsDropdown,
        },
        status: {
            isFetchingSuggestions,
            hasNoSuggestions,
        },
        actions: {
            setQuery,
            onFocusInput,
            onKeyDown,
            openProductPage,
            submitSearch,
        },
    };
};
