import {useEffect, useRef} from "react";

import {
    productSearchReducer,
    ProductSearch,
    selectProductSearchShowHistoryDropdown,
    productSearchActions,
} from "@/features/product-search";

import {DynamicModuleLoader, useAppDispatch, useAppSelector} from "@/shared/lib/state";
import {Stack} from "@/shared/ui/Stack";

import {MostPopularSearches} from "./MostPopularSearches";
import {SearchHistory} from "./SearchHistory";
import styles from "./SearchPanel.module.scss";

export const SearchPanel = () => {
    const dispatch = useAppDispatch();
    const containerRef = useRef<HTMLDivElement>(null);
    const showHistoryDropdown = useAppSelector(selectProductSearchShowHistoryDropdown);

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                dispatch(productSearchActions.setFocused(false));
            }
        };

        document.addEventListener("mousedown", closeOnOutsideClick);

        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
        };
    }, [dispatch]);

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={{productSearch: productSearchReducer}}>
            <div className={styles.wrapper} ref={containerRef}>
                <ProductSearch />

                {showHistoryDropdown && (
                    <div
                        className={styles.dropdown}
                        data-testid="header-product-search-history-dropdown"
                    >
                        <Stack gap={16}>
                            <SearchHistory />
                            <Stack gap={12}>
                                <MostPopularSearches />
                            </Stack>
                        </Stack>
                    </div>
                )}
            </div>
        </DynamicModuleLoader>
    );
};
