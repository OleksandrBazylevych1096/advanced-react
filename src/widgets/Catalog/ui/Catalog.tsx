import {AutoSizer, Grid, WindowScroller, type WindowScrollerChildProps} from 'react-virtualized';

import {CATALOG_PRODUCT_CARDS_SKELETON_COUNT, ROW_HEIGHT} from "@/widgets/Catalog/consts/defaults.ts";
import {getColumnCount, getRowCount} from "@/widgets/Catalog/lib/gridHelpers.ts";
import {useCatalog} from "@/widgets/Catalog/model/services/useCatalog.ts";
import {CellRenderer} from "@/widgets/Catalog/ui/CellRenderer.tsx";

import {type Product, ProductCardSkeleton} from "@/entities/product";

import styles from './Catalog.module.scss';


export type CatalogItem = Product | undefined;


export const Catalog = () => {
    const {isFetchingNextPage, hasNextPage, isLoading, error, products, handleLoadMore, gridRef} = useCatalog();

    if (isLoading) {
        return (
            <div className={styles.grid}>
                {Array.from({length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT}).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-${index}`}/>
                ))}
            </div>
        );
    }

    if (error) {
        return <div>error</div>;
    }

    if (!products || products.length === 0) {
        return <div>No data</div>;
    }

    const allItems: CatalogItem[] = [
        ...products,
        ...(isFetchingNextPage
            ? Array.from<undefined>({
                length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT,
            }).fill(undefined)
            : [])]

    return (
        <div>
            <WindowScroller>
                {({height, isScrolling, onChildScroll, scrollTop}: WindowScrollerChildProps) => (
                    <AutoSizer disableHeight>
                        {({width}: { width: number }) => {
                            const columnsCount = getColumnCount(width)
                            const rowsCount = getRowCount(columnsCount, allItems.length)

                            return (
                                <Grid
                                    ref={gridRef}
                                    autoHeight
                                    height={height}
                                    width={width}
                                    rowHeight={ROW_HEIGHT}
                                    columnWidth={width / columnsCount}
                                    rowCount={rowsCount}
                                    columnCount={columnsCount}
                                    cellRenderer={(props) => CellRenderer({...props, allItems})}
                                    isScrolling={isScrolling}
                                    onScroll={onChildScroll}
                                    scrollTop={scrollTop}
                                    overscanRowCount={2}
                                    onSectionRendered={({rowStopIndex}) => {
                                        if (hasNextPage) {
                                            handleLoadMore({
                                                rowsCount,
                                                stopIndex: rowStopIndex,
                                                threshold: 0.2
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