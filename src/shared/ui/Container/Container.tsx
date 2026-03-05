import type {ComponentPropsWithoutRef, ElementType} from "react";

import {cn} from "@/shared/lib";

import styles from "./Container.module.scss";

type ContainerSize = "content" | "fluid";

interface ContainerOwnProps {
    size?: ContainerSize;
}

type PolymorphicProps<C extends ElementType> = ContainerOwnProps & {
    as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ContainerOwnProps | "as">;

export const Container = <C extends ElementType = "div">(props: PolymorphicProps<C>) => {
    const {as, size = "content", className, children, style, ...rest} = props;
    const Component = as ?? "div";

    return (
        <Component
            className={cn(styles.container, styles[size], className)}
            style={style}
            {...rest}
        >
            {children}
        </Component>
    );
};
