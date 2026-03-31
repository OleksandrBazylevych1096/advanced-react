import type {ComponentPropsWithoutRef, CSSProperties, ReactElement} from "react";

import {cn} from "@/shared/lib/styling";
import {Box} from "@/shared/ui/Box";

import styles from "./Skeleton.module.scss";

interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
    borderRadius?: CSSProperties["borderRadius"];
    animated?: boolean;
    shape?: "rect" | "circle";
}

export const Skeleton = ({
    width,
    height,
    borderRadius,
    animated = true,
    shape = "rect",
    className,
    style,
    ...rest
}: SkeletonProps): ReactElement => {
    const skeletonStyle: CSSProperties = {
        width,
        height,
        borderRadius: shape === "circle" ? undefined : borderRadius,
        ...style,
    };

    return (
        <Box
            className={cn(
                styles.skeleton,
                {[styles.static]: !animated},
                {[styles.circle]: shape === "circle"},
                className,
            )}
            style={skeletonStyle}
            {...rest}
        />
    );
};
