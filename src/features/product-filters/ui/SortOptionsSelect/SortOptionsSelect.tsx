import {useTranslation} from "react-i18next";

import {type SortOptionValue} from "@/features/product-filters/config/sortOptions.ts";

import {Select} from "@/shared/ui/Select";

import {useSortOptionsSelect} from "./useSortOptionsSelect/useSortOptionsSelect.ts";

export const SortOptionsSelect = () => {
    const {t} = useTranslation();
    const {
        data: {currentSortValue, options},
        actions: {changeSort},
    } = useSortOptionsSelect();
    return (
        <Select<SortOptionValue>
            value={currentSortValue}
            onChange={changeSort}
            options={options}
            placeholder={t("productFilters.orderBy")}
            theme="outlined"
            aria-label={t("productFilters.orderByAria")}
            dropdownAlign={"right"}
        />
    );
};
