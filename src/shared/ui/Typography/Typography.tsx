import type {ComponentPropsWithoutRef, ElementType} from "react";

import {cn} from "@/shared/lib/styling";

import styles from "./Typography.module.scss";

type TypographyVariant = "display" | "heading" | "body" | "bodySm" | "caption";
type TypographyTone = "default" | "muted" | "primary" | "danger" | "success";
type TypographyWeight = "regular" | "medium" | "semibold" | "bold";

interface TypographyOwnProps {
    variant?: TypographyVariant;
    tone?: TypographyTone;
    weight?: TypographyWeight;
}

type PolymorphicProps<C extends ElementType> = TypographyOwnProps & {
    as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof TypographyOwnProps | "as">;

export const Typography = <C extends ElementType = "p">(props: PolymorphicProps<C>) => {
    const {
        as,
        variant = "body",
        tone = "default",
        weight = "regular",
        className,
        children,
        ...rest
    } = props;
    const Component = as ?? "p";

    return (
        <Component
            className={cn(
                styles.typography,
                styles[variant],
                styles[tone],
                styles[weight],
                className,
            )}
            {...rest}
        >
            {children}
        </Component>
    );
};
