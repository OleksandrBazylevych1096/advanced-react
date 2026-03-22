import {useCallback} from "react";
import {useSelector} from "react-redux";

import {productFiltersActions} from "@/features/product-filters";
import {SORT_OPTIONS, type SortOptionValue} from "@/features/product-filters/config/sortOptions.ts";
import {
    createSortValue,
    parseSortValue,
} from "@/features/product-filters/lib/sortOptionsHelpers/sortOptionsHelpers.ts";
import {selectSortSettings} from "@/features/product-filters/model/selectors/productFiltersSelectors.ts";

import {createControllerResult, useAppDispatch} from "@/shared/lib/state";

export const useSortOptionsSelectController = () => {
    const dispatch = useAppDispatch();
    const {sortBy, sortOrder} = useSelector(selectSortSettings);

    const currentSortValue = createSortValue(sortBy, sortOrder);

    const changeSort = useCallback(
        (value: SortOptionValue | SortOptionValue[]) => {
            if (Array.isArray(value)) return;

            const {sortBy: newSortBy, sortOrder: newSortOrder} = parseSortValue(value);

            dispatch(productFiltersActions.setSortBy(newSortBy));
            dispatch(productFiltersActions.setSortOrder(newSortOrder));
        },
        [dispatch],
    );

    return createControllerResult({
        data: {
            currentSortValue,
            options: SORT_OPTIONS,
        },
        actions: {
            changeSort,
        },
    });
};

