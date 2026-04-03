import type {Dispatch, UnknownAction} from "@reduxjs/toolkit";
import {generatePath, type NavigateFunction} from "react-router";

import {productSearchActions, SEARCH_QUERY_PARAM} from "@/features/product-search";

import {AppRoutes, routePaths, type SupportedLngsType} from "@/shared/config";

interface ApplySearchQueryParams {
    query: string;
    dispatch: Dispatch<UnknownAction>;
    navigate: NavigateFunction;
    locale: SupportedLngsType;
}

export const applySearchQuery = ({
    query,
    dispatch,
    navigate,
    locale,
}: ApplySearchQueryParams): void => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
        return;
    }

    dispatch(productSearchActions.setQuery(normalizedQuery));
    dispatch(productSearchActions.submitQuery(normalizedQuery));
    dispatch(productSearchActions.setFocused(false));

    const nextSearchParams = new URLSearchParams();
    nextSearchParams.set(SEARCH_QUERY_PARAM, normalizedQuery);
    const path = generatePath(routePaths[AppRoutes.SEARCH], {lng: locale});

    navigate(`${path}?${nextSearchParams.toString()}`);
};
