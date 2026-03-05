import {productFiltersActions, productFiltersReducer} from "./model/slice/productFiltersSlice";
import {selectActiveFilters} from "./model/selectors/productFiltersSelectors";
import type {ProductFiltersSchema} from "./model/types/productFiltersSchema";
import {ProductFilters} from "./ui/ProductFilters/ProductFilters";
import {ProductFiltersControls} from "./ui/ProductFiltersControls/ProductFiltersControls";

export {
    ProductFilters,
    ProductFiltersControls,
    productFiltersActions,
    productFiltersReducer,
    selectActiveFilters,
};

export type {ProductFiltersSchema};
