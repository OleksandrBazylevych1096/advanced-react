import {type SortOptionValue} from "@/features/product-filters/consts/sortOptions.ts";

import {Select} from "@/shared/ui/Select/Select.tsx";

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
