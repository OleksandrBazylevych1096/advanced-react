import {useCallback} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

import {SORT_OPTIONS, type SortOptionValue} from "@/features/product-filters/config/sortOptions.ts";
import {
    createSortValue,
    parseSortValue,
} from "@/features/product-filters/lib/sortOptionsHelpers/sortOptionsHelpers.ts";
import {selectSortSettings} from "@/features/product-filters/model/selectors/productFiltersSelectors.ts";
import {productFiltersActions} from "@/features/product-filters/model/slice/productFiltersSlice";

import {useAppDispatch} from "@/shared/lib/state";

export const useSortOptionsSelect = () => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {sortBy, sortOrder} = useSelector(selectSortSettings);

    const currentSortValue = createSortValue(sortBy, sortOrder);
    const options = SORT_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey),
    }));

    const changeSort = useCallback(
        (value: SortOptionValue | SortOptionValue[]) => {
            if (Array.isArray(value)) return;

            const {sortBy: newSortBy, sortOrder: newSortOrder} = parseSortValue(value);

            dispatch(productFiltersActions.setSortBy(newSortBy));
            dispatch(productFiltersActions.setSortOrder(newSortOrder));
        },
        [dispatch],
    );

    return {
        data: {
            currentSortValue,
            options,
        },
        actions: {
            changeSort,
        },
    };
};
