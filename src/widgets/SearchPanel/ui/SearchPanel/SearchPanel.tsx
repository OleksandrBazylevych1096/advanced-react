import {ProductSearch, productSearchReducer} from "@/features/product-search";

import {DynamicModuleLoader} from "@/shared/lib/state";
import {Stack} from "@/shared/ui/Stack";

import {MostPopularSearches} from "../MostPopularSearches/MostPopularSearches.tsx";
import {SearchHistory} from "../SearchHistory/SearchHistory.tsx";

import styles from "./SearchPanel.module.scss";
import {useSearchPanel} from "./useSearchPanel/useSearchPanel.ts";

export const SearchPanel = () => {
    const {
        data: {containerRef, showHistoryDropdown},
    } = useSearchPanel();

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
