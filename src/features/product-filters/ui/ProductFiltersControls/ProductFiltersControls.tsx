import {Button, Stack} from "@/shared/ui";

import {useProductFiltersControlsController} from "../../model/controllers/useProductFiltersControlsController/useProductFiltersControlsController";
import styles from "./ProductFiltersControls.module.scss";
import {SortOptionsSelect} from "./SortOptionsSelect/SortOptionsSelect";

export const ProductFiltersControls = () => {
    const {
        actions: {toggleProductFilters},
    } = useProductFiltersControlsController();

    return (
        <Stack className={styles.container} direction="row" align="center" justify="space-between">
            <Button theme={"outline"} onClick={toggleProductFilters}>
                Filters
            </Button>
            <SortOptionsSelect />
        </Stack>
    );
};
