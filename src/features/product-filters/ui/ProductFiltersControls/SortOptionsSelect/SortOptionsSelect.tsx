import {type SortOptionValue} from "@/features/product-filters/config/sortOptions.ts";

import {Select} from "@/shared/ui/Select";

import {useSortOptionsSelectController} from "../../../model/controllers/useSortOptionsSelectController/useSortOptionsSelectController";

export const SortOptionsSelect = () => {
    const {
        data: {currentSortValue, options},
        actions: {changeSort},
    } = useSortOptionsSelectController();
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
