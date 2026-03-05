import type {ComponentPropsWithoutRef, CSSProperties, ElementType} from "react";

import {cn} from "@/shared/lib";
import type {StackSpace} from "@/shared/ui/Stack/Stack";

import styles from "./Grid.module.scss";

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface GridOwnProps {
    cols?: GridCols;
    gap?: StackSpace;
    rowGap?: StackSpace;
    columnGap?: StackSpace;
    align?: CSSProperties["alignItems"];
    justify?: CSSProperties["justifyItems"];
    flow?: CSSProperties["gridAutoFlow"];
}

type PolymorphicProps<C extends ElementType> = GridOwnProps & {
    as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof GridOwnProps | "as">;

export const Grid = <C extends ElementType = "div">(props: PolymorphicProps<C>) => {
    const {
        as,
        cols,
        gap,
        rowGap,
        columnGap,
        align,
        justify,
        flow,
        className,
        children,
        style,
        ...rest
    } = props;
    const Component = as ?? "div";

    const gridStyle: CSSProperties = {
        gridTemplateColumns: cols ? `repeat(${cols}, minmax(0, 1fr))` : undefined,
        alignItems: align,
        justifyItems: justify,
        gridAutoFlow: flow,
        rowGap: rowGap ?? gap,
        columnGap: columnGap ?? gap,
        ...style,
    };

    return (
        <Component className={cn(styles.grid, className)} style={gridStyle} {...rest}>
            {children}
        </Component>
    );
};
