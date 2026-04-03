import {createSelector} from "@reduxjs/toolkit";

import type {ProductSearchSubmittedEvent} from "../types/productSearchSchema";

export const selectProductSearch = (state: StateSchema) => state.productSearch;

export const selectProductSearchQuery = createSelector(
    selectProductSearch,
    (state) => state?.query ?? "",
);

export const selectProductSearchIsFocused = createSelector(
    selectProductSearch,
    (state) => state?.isFocused ?? false,
);

export const selectProductSearchIsQueryValid = createSelector(
    selectProductSearch,
    (state) => state?.isQueryValid ?? false,
);

export const selectProductSearchSubmittedEvent = createSelector(
    selectProductSearch,
    (state): ProductSearchSubmittedEvent | null => state?.submittedEvent ?? null,
);

export const selectProductSearchShowHistoryDropdown = createSelector(
    selectProductSearchIsFocused,
    selectProductSearchIsQueryValid,
    (isFocused, isQueryValid) => isFocused && !isQueryValid,
);
