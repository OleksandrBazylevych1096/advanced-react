import {productFiltersActions} from "@/features/productFilters";
import {
    SortOptionsSelect
} from "@/features/productFilters/ui/ProductFiltersControls/SortOptionsSelect/SortOptionsSelect.tsx";

import {useAppDispatch} from "@/shared/lib";
import {Button} from "@/shared/ui";

import styles from './ProductFiltersControls.module.scss'


export const ProductFiltersControls = () => {
    const dispatch = useAppDispatch();

    const handleToggleProductFilters = () => {
        dispatch(productFiltersActions.toggleIsOpen());
    };

    return (
        <div className={styles.container}>
            <Button theme={'outline'} onClick={handleToggleProductFilters}>
                Filters
            </Button>
            <SortOptionsSelect/>
        </div>
    );
}