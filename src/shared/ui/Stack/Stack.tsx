import type {ComponentPropsWithoutRef, CSSProperties, ElementType} from "react";

import {cn} from "@/shared/lib";

import styles from "./Stack.module.scss";

type StackDirection = "row" | "column";
export type StackSpace = 0 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 60 | 64 | 80 | 140;

interface StackOwnProps {
    direction?: StackDirection;
    gap?: StackSpace;
    rowGap?: StackSpace;
    columnGap?: StackSpace;
    align?: CSSProperties["alignItems"];
    justify?: CSSProperties["justifyContent"];
    wrap?: CSSProperties["flexWrap"];
}

type PolymorphicProps<C extends ElementType> = StackOwnProps & {
    as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof StackOwnProps | "as">;


export const Stack = <C extends ElementType = "div">(props: PolymorphicProps<C>) => {
    const {
        as,
        direction = "column",
        gap,
        rowGap,
        columnGap,
        align,
        justify,
        wrap,
        className,
        children,
        style,
        ...rest
    } = props;
    const Component = as ?? "div";

    const stackStyle: CSSProperties = {
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        rowGap: rowGap ?? gap,
        columnGap: columnGap ?? gap,
        ...style,
    };

    return (
        <Component
            className={cn(styles.stack, styles[direction], className)}
            style={stackStyle}
            {...rest}
        >
            {children}
        </Component>
    );
};
