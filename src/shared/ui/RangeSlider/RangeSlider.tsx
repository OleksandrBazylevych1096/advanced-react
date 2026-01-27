import {
    type MouseEvent as ReactMouseEvent,
    type TouchEvent as ReactTouchEvent,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import {clampRange, clampValue, cn} from "@/shared/lib";

import styles from "./RangeSlider.module.scss";

export type RangeSliderValue = [min: number, max: number]
export type ThumbType = 1 | 0

export interface RangeSliderProps {
    min?: number;
    max?: number;
    step?: number;
    minRange?: number;
    value?: RangeSliderValue;
    defaultValue?: RangeSliderValue;
    disabled?: boolean;
    label?: string;
    tooltip?: "auto" | "always" | "never";
    tooltipPlacement?: "top" | "bottom";
    className?: string;
    onChange?: (value: RangeSliderValue) => void;
    onChangeEnd?: (value: RangeSliderValue) => void;
}

export const RangeSlider = ({
                                min = 0,
                                max = 100,
                                step = 1,
                                minRange = 0,
                                value: controlledValue,
                                defaultValue,
                                disabled = false,
                                label,
                                tooltip = "auto",
                                tooltipPlacement = "top",
                                className,
                                onChange,
                                onChangeEnd,
                            }: RangeSliderProps) => {
    const initialValue = controlledValue ?? defaultValue ?? [0, 0];
    const [value, setValue] = useState<RangeSliderValue>(initialValue);
    const [activeThumb, setActiveThumb] = useState<ThumbType | null>(null);
    const [dragging, setDragging] = useState(false);
    const [showTooltip, setShowTooltip] = useState(tooltip === "always");
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const activeThumbRef = useRef<ThumbType | null>(null);

    useEffect(() => {
        activeThumbRef.current = activeThumb;
    }, [activeThumb]);

    useEffect(() => {
        if (controlledValue) {
            const clamped = clampRange(
                controlledValue[0],
                controlledValue[1],
                min,
                max,
                minRange
            );
            setValue([clamped.min, clamped.max]);

        }
    }, [controlledValue, min, max, minRange]);

    const percent = (v: number) => ((v - min) / (max - min)) * 100;

    const updateValue = useCallback((clientX: number, thumb: ThumbType) => {
        if (disabled || !sliderRef.current) return thumb;

        const rect = sliderRef.current.getBoundingClientRect();
        const ratio = clampValue((clientX - rect.left) / rect.width, 0, 1);

        let next = min + ratio * (max - min);
        next = Math.round(next / step) * step;
        next = clampValue(next, min, max);

        const newMin = thumb === 0 ? next : value[0];
        const newMax = thumb === 1 ? next : value[1];

        const clamped = clampRange(newMin, newMax, min, max, minRange);
        const nextRange: RangeSliderValue = [clamped.min, clamped.max];

        setValue(nextRange);
        onChange?.(nextRange);

        return thumb;
    }, [disabled, max, min, minRange, onChange, step, value]);

    useEffect(() => {
        if (!dragging || activeThumbRef.current === null) return;

        const move = (e: MouseEvent | TouchEvent) => {
            if (e.cancelable) {
                e.preventDefault();
            }

            const x = "touches" in e ? e.touches[0].clientX : e.clientX;
            updateValue(x, activeThumbRef.current!);
        };

        const end = () => {
            setDragging(false);
            setActiveThumb(null);
            activeThumbRef.current = null;
            if (tooltip === "auto") setShowTooltip(false);
            onChangeEnd?.(value);
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", end);
        document.addEventListener("touchmove", move, {passive: false});
        document.addEventListener("touchend", end);

        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", end);
            document.removeEventListener("touchmove", move);
            document.removeEventListener("touchend", end);
        };
    }, [dragging, value, tooltip, onChangeEnd, updateValue]);

    const handleThumbStart = (e: ReactMouseEvent | ReactTouchEvent<HTMLDivElement>, idx: ThumbType) => {
        if (disabled) return;


        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

        setActiveThumb(idx);
        activeThumbRef.current = idx;
        setDragging(true);
        updateValue(clientX, idx);

        if (tooltip === "auto") setShowTooltip(true);
    };

    const renderThumb = (v: number, idx: ThumbType) => (
        <div
            key={idx}
            className={cn(styles.thumb, {
                [styles.active]: activeThumb === idx,
                [styles.disabled]: disabled,
            })}
            style={{left: `${percent(v)}%`}}
            tabIndex={disabled ? -1 : 0}
            onMouseDown={(e) => handleThumbStart(e, idx)}
            onTouchStart={(e) => handleThumbStart(e, idx)}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={v}
        >
            {showTooltip && (
                <div
                    className={cn(styles.tooltip, styles[tooltipPlacement])}
                >
                    {idx === 0 ? Math.floor(v) : Math.ceil(v)}
                </div>
            )}
        </div>
    );

    const getFilledStyle = () => {
        const leftPercent = percent(value[0]);
        const rightPercent = percent(value[1]);
        return {
            left: `${leftPercent}%`,
            width: `${rightPercent - leftPercent}%`,
        };
    };

    return (
        <div className={cn(styles.root, className)}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.sliderWrapper}>
                <div
                    ref={sliderRef}
                    className={cn(styles.track, {
                        [styles.disabled]: disabled,
                    })}
                >
                    <div
                        className={cn(styles.filled, styles.primary)}
                        style={getFilledStyle()}
                    />
                    {renderThumb(value[0], 0)}
                    {renderThumb(value[1], 1)}
                </div>
            </div>
        </div>
    );
}