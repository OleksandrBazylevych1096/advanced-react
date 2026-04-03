import {type SortOptionValue} from "@/features/product-filters/config/sortOptions.ts";

import {Select} from "@/shared/ui/Select";

import {useSortOptionsSelect} from "./useSortOptionsSelect/useSortOptionsSelect.ts";

export const SortOptionsSelect = () => {
    const {
        data: {currentSortValue, options},
        actions: {changeSort},
    } = useSortOptionsSelect();
    return (
        <Select<SortOptionValue>
            value={currentSortValue}
            onChange={changeSort}
            options={options}
            placeholder="Sorting"
            theme="outlined"
            aria-label="Product Sorting"
            dropdownAlign={"right"}
        />
    );
};
