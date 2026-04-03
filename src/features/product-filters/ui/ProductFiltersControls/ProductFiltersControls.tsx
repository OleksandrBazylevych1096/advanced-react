import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";

import {SortOptionsSelect} from "../SortOptionsSelect/SortOptionsSelect";

import styles from "./ProductFiltersControls.module.scss";
import {useProductFiltersControls} from "./useProductFiltersControls/useProductFiltersControls.ts";

export const ProductFiltersControls = () => {
    const {
        actions: {toggleProductFilters},
    } = useProductFiltersControls();

    return (
        <Stack className={styles.container} direction="row" align="center" justify="space-between">
            <Button theme={"outline"} onClick={toggleProductFilters}>
                Filters
            </Button>
            <SortOptionsSelect />
        </Stack>
    );
};
