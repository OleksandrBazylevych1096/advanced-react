import {clampValue, cn} from "@/shared/lib";

import styles from "./Progress.module.scss";

interface ProgressProps {
    value: number;
    max?: number;
    className?: string;
    trackClassName?: string;
    fillClassName?: string;
    ariaLabel?: string;
}

export const Progress = (props: ProgressProps) => {
    const {value, max = 100, className, trackClassName, fillClassName, ariaLabel} = props;

    const safeMax = max > 0 ? max : 100;
    const safeValue = Number.isFinite(value) ? value : 0;
    const clampedValue = clampValue(safeValue, 0, safeMax);
    const progressPercent = (clampedValue / safeMax) * 100;

    return (
        <div
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={safeMax}
            aria-valuenow={Math.round(clampedValue)}
            className={cn(styles.track, trackClassName, className)}
        >
            <div
                className={cn(styles.fill, fillClassName)}
                style={{width: `${progressPercent}%`}}
            />
        </div>
    );
};
