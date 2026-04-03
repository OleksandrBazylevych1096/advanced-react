import {MIN_SEARCH_QUERY_LENGTH, SEARCH_QUERY_PARAM} from "./config/constants";
import {
    selectProductSearchIsFocused,
    selectProductSearchIsQueryValid,
    selectProductSearchQuery,
    selectProductSearchShowHistoryDropdown,
    selectProductSearchSubmittedEvent,
} from "./model/selectors/productSearchSelectors";
import {productSearchActions, productSearchReducer} from "./model/slice/productSearchSlice";
import type {
    ProductSearchSchema,
    ProductSearchSubmittedEvent,
} from "./model/types/productSearchSchema";
import {ProductSearch} from "./ui/ProductSearch/ProductSearch";

export {
    ProductSearch,
    productSearchActions,
    productSearchReducer,
    selectProductSearchQuery,
    selectProductSearchIsFocused,
    selectProductSearchIsQueryValid,
    selectProductSearchSubmittedEvent,
    selectProductSearchShowHistoryDropdown,
    SEARCH_QUERY_PARAM,
    MIN_SEARCH_QUERY_LENGTH,
};

export type {ProductSearchSchema, ProductSearchSubmittedEvent};
