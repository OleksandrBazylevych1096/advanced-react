import {useCallback} from "react";

import {productFiltersActions} from "@/features/product-filters";

import {createControllerResult, useAppDispatch} from "@/shared/lib";

export const useProductFiltersControlsController = () => {
    const dispatch = useAppDispatch();

    const toggleProductFilters = useCallback(() => {
        dispatch(productFiltersActions.toggleIsOpen());
    }, [dispatch]);

    return createControllerResult({
        actions: {toggleProductFilters},
    });
};
