import {useTranslation} from 'react-i18next';
import {AutoSizer, Grid, WindowScroller, type WindowScrollerChildProps} from 'react-virtualized';

import {CATALOG_PRODUCT_CARDS_SKELETON_COUNT, ROW_HEIGHT} from "@/widgets/Catalog/consts/defaults.ts";
import {getColumnCount, getRowCount} from "@/widgets/Catalog/lib/gridHelpers.ts";
import {useCatalog} from "@/widgets/Catalog/model/services/useCatalog.ts";
import {CellRenderer} from "@/widgets/Catalog/ui/CellRenderer.tsx";

import {type Product, ProductCardSkeleton} from "@/entities/product";

import {EmptyState, ErrorState} from "@/shared/ui";

import styles from './Catalog.module.scss';


export type CatalogItem = Product | undefined;


export const Catalog = () => {
    const {t} = useTranslation();
    const {isFetchingNextPage, hasNextPage, isLoading, error, products, handleLoadMore, gridRef, refetch} = useCatalog();

    if (isLoading) {
        return (
            <div className={styles.grid} data-testid="catalog-loading">
                {Array.from({length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT}).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-${index}`}/>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <ErrorState
                message={t('products.unexpectedError')}
                onRetry={refetch}
                data-testid="catalog-error"
            />
        );
    }

    if (!products || products.length === 0) {
        return (
            <EmptyState title={t('products.noProducts')} data-testid="catalog-empty"/>
        );
    }

    const allItems: CatalogItem[] = [
        ...products,
        ...(isFetchingNextPage
            ? Array.from<undefined>({
                length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT,
            }).fill(undefined)
            : [])]

    return (
        <div data-testid="catalog-grid">
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