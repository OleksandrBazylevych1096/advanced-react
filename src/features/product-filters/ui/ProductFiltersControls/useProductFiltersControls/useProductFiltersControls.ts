import {useCallback} from "react";

import {productFiltersActions} from "@/features/product-filters/model/slice/productFiltersSlice";

import {useAppDispatch} from "@/shared/lib/state";

export const useProductFiltersControls = () => {
    const dispatch = useAppDispatch();

    const toggleProductFilters = useCallback(() => {
        dispatch(productFiltersActions.toggleIsOpen());
    }, [dispatch]);

    return {
        actions: {toggleProductFilters},
    };
};
