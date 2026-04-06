import type {ComponentPropsWithoutRef, ElementType} from "react";
import {useTranslation} from "react-i18next";

import CopyIcon from "@/shared/assets/icons/Copy.svg?react";
import {useToast} from "@/shared/lib/notifications";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";

import styles from "./Typography.module.scss";

type TypographyVariant = "display" | "heading" | "body" | "bodySm" | "caption";
type TypographyTone = "default" | "muted" | "primary" | "danger" | "success";
type TypographyWeight = "regular" | "medium" | "semibold" | "bold";

interface TypographyOwnProps {
    variant?: TypographyVariant;
    tone?: TypographyTone;
    weight?: TypographyWeight;
    copyable?: boolean;
    copiableTextClassName?: string;
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
        copiableTextClassName,
        children,
        copyable = false,
        ...rest
    } = props;
    const Component = as ?? "p";
    const {success} = useToast();
    const {t} = useTranslation();

    const handleCopyOrderNumber = async () => {
        console.log(children);
        await navigator.clipboard.writeText(children);
        success(t("common.copied"));
    };

    const componentClasses: string[] = [
        styles.typography,
        styles[variant],
        styles[tone],
        styles[weight],
        className,
    ];

    const iconSizeVariantMap: Record<TypographyVariant, number> = {
        display: 28,
        heading: 24,
        body: 16,
        bodySm: 14,
        caption: 12,
    };

    if (copyable) {
        return (
            <Component
                onClick={handleCopyOrderNumber}
                className={cn(...componentClasses, styles.copyable)}
                {...rest}
            >
                <AppIcon
                    Icon={CopyIcon}
                    size={iconSizeVariantMap[variant]}
                    className={styles.copyIcon}
                />
                <span className={copiableTextClassName}>{children}</span>
            </Component>
        );
    }

    return (
        <Component className={cn(...componentClasses)} {...rest}>
            {children}
        </Component>
    );
};
