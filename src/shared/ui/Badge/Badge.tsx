import type {ComponentPropsWithoutRef} from "react";

import {cn} from "@/shared/lib/styling";

import styles from "./Badge.module.scss";

type BadgeTone = "primary" | "success" | "danger";
type BadgeSize = "md" | "lg";

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
    tone?: BadgeTone;
    size?: BadgeSize;
}

export const Badge = (props: BadgeProps) => {
    const {tone = "primary", size = "md", className, children, ...rest} = props;

    return (
        <span className={cn(styles.badge, styles[tone], styles[size], className)} {...rest}>
            {children}
        </span>
    );
};
