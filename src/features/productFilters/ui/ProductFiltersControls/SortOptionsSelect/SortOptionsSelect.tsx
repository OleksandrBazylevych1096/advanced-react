import {useSelector} from "react-redux";

import {productFiltersActions} from "@/features/productFilters";
import {SORT_OPTIONS, type SortOptionValue} from "@/features/productFilters/consts/sortOptions.ts";
import {createSortValue, parseSortValue} from "@/features/productFilters/lib/sortOptionsHelpers/sortOptionsHelpers.ts";
import {selectSortSettings} from "@/features/productFilters/model/selectors/productFiltersSelectors.ts";

import {useAppDispatch} from "@/shared/lib";
import {Select} from "@/shared/ui/Select/Select.tsx";

export const SortOptionsSelect = () => {
    const dispatch = useAppDispatch();
    const {sortBy, sortOrder} = useSelector(selectSortSettings);

    const currentSortValue = createSortValue(sortBy, sortOrder);
    const handleSortChange = (value: SortOptionValue | SortOptionValue[]) => {
        if (Array.isArray(value)) return;

        const {sortBy: newSortBy, sortOrder: newSortOrder} = parseSortValue(value);

        dispatch(productFiltersActions.setSortBy(newSortBy));
        dispatch(productFiltersActions.setSortOrder(newSortOrder));
    };
    return <Select<SortOptionValue>
        value={currentSortValue}
        onChange={handleSortChange}
        options={SORT_OPTIONS}
        placeholder="Sorting"
        theme="outlined"
        aria-label="Product Sorting"
        dropdownAlign={'right'}
    />
}