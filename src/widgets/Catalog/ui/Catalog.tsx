import {useTranslation} from "react-i18next";
import {
    AutoSizer,
    Grid as VirtualizedGrid,
    WindowScroller,
    type WindowScrollerChildProps,
} from "react-virtualized";

import {
    CATALOG_PRODUCT_CARDS_SKELETON_COUNT,
    ROW_HEIGHT,
} from "@/widgets/Catalog/config/defaults.ts";
import {getColumnCount, getRowCount} from "@/widgets/Catalog/lib/gridHelpers.ts";
import {useCatalogController} from "@/widgets/Catalog/model/controllers/useCatalogController.ts";
import {CellRenderer} from "@/widgets/Catalog/ui/CellRenderer.tsx";

import {type Product, ProductCardSkeleton} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";
import {Grid} from "@/shared/ui/Grid";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";

import styles from "./Catalog.module.scss";

export type CatalogItem = Product | undefined;

interface CatalogProps {
    categoryId?: string;
}

export const Catalog = ({categoryId}: CatalogProps) => {
    const {t} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const {
        data: {products, hasNextPage},
        status: {isFetchingNextPage, isLoading, error},
        actions: {loadMore, refetch},
        refs: {gridRef},
    } = useCatalogController({categoryId});

    if (isLoading) {
        return (
            <Grid className={styles.grid} gap={16} data-testid="catalog-loading">
                {Array.from({length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT}).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-${index}`} />
                ))}
            </Grid>
        );
    }

    if (error) {
        return (
            <ErrorState
                message={t("products.unexpectedError")}
                onRetry={refetch}
                data-testid="catalog-error"
            />
        );
    }

    if (!products || products.length === 0) {
        return <EmptyState title={t("products.noProducts")} data-testid="catalog-empty" />;
    }

    const allItems: CatalogItem[] = [
        ...products,
        ...(isFetchingNextPage
            ? Array.from<undefined>({
                  length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT,
              }).fill(undefined)
            : []),
    ];

    return (
        <div data-testid="catalog-grid">
            <WindowScroller>
                {({height, isScrolling, onChildScroll, scrollTop}: WindowScrollerChildProps) => (
                    <AutoSizer disableHeight>
                        {({width}: {width: number}) => {
                            const columnsCount = getColumnCount(width);
                            const rowsCount = getRowCount(columnsCount, allItems.length);

                            return (
                                <VirtualizedGrid
                                    ref={gridRef}
                                    autoHeight
                                    height={height}
                                    width={width}
                                    rowHeight={ROW_HEIGHT}
                                    columnWidth={width / columnsCount}
                                    rowCount={rowsCount}
                                    columnCount={columnsCount}
                                    cellRenderer={(props) =>
                                        CellRenderer({...props, allItems, currency})
                                    }
                                    isScrolling={isScrolling}
                                    onScroll={onChildScroll}
                                    scrollTop={scrollTop}
                                    overscanRowCount={2}
                                    onSectionRendered={({rowStopIndex}) => {
                                        if (hasNextPage) {
                                            loadMore({
                                                rowsCount,
                                                stopIndex: rowStopIndex,
                                                threshold: 0.2,
                                            });
                                        }
                                    }}
                                />
                            );
                        }}
                    </AutoSizer>
                )}
            </WindowScroller>
        </div>
    );
};
