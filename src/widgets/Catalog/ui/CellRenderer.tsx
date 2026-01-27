import type {CSSProperties, ReactNode} from "react";
import type {GridCellProps} from "react-virtualized";

import {COLUMN_GAP, COLUMN_WIDTH, ROW_GAP} from "@/widgets/Catalog/consts/defaults.ts";
import type {CatalogItem} from "@/widgets/Catalog/ui/Catalog.tsx";

import {type Product, ProductCard, ProductCardSkeleton} from "@/entities/product";

interface CellRendererProps extends GridCellProps {
    allItems: CatalogItem[]
}

export const CellRenderer = ({
                                 columnIndex,
                                 key,
                                 rowIndex,
                                 style,
                                 parent,
                                 allItems
                             }: CellRendererProps): ReactNode => {
    const columnsCount = Math.floor(
        parent.props.width / (COLUMN_WIDTH + COLUMN_GAP)
    );

    const index = rowIndex * columnsCount + columnIndex;

    if (index >= allItems.length) {
        return null;
    }

    const item = allItems[index];
    const isProduct = (item: CatalogItem): item is Product => {
        return item !== undefined && typeof item === 'object' && 'id' in item;
    };

    const adjustedStyle: CSSProperties = {
        ...style,
        left: (style.left as number) + COLUMN_GAP / 2,
        top: (style.top as number) + ROW_GAP / 2,
        width: (style.width as number) - COLUMN_GAP,
        height: (style.height as number) - ROW_GAP,
    };

    return (
        <div key={key} style={adjustedStyle}>
            {isProduct(item) ? (
                <ProductCard product={item}/>
            ) : (
                <ProductCardSkeleton/>
            )}
        </div>
    );
};