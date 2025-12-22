import {type ChangeEvent} from 'react';

import {cn} from "@/shared/lib";
import {Input} from '@/shared/ui';

import styles from './RangeSlider.module.scss';

interface RangeSliderProps {
    min: number;
    max: number;
    value: {
        min: number;
        max: number;
    };
    step?: number;
    onChange: (min: number, max: number) => void;
}

export const RangeSlider = ({
                                min,
                                max,
                                value,
                                step = 1,
                                onChange,
                            }: RangeSliderProps) => {
    const {min: minValue, max: maxValue} = value;

    const handleMinSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newMin = Number(e.target.value);

        if (newMin <= maxValue - step) {
            onChange(newMin, maxValue);
        }
    };

    const handleMaxSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newMax = Number(e.target.value);

        if (newMax >= minValue + step) {
            onChange(minValue, newMax);
        }
    };

    const handleMinInputChange = (value: string) => {
        const num = Number(value);

        if (isNaN(num)) return;

        const clampedMin = Math.max(min, Math.min(num, maxValue - step));
        onChange(clampedMin, maxValue);
    };

    const handleMaxInputChange = (value: string) => {
        const num = Number(value);

        if (isNaN(num)) return;

        const clampedMax = Math.min(max, Math.max(num, minValue + step));
        onChange(minValue, clampedMax);
    };

    const getPercentage = (value: number) => {
        if (min === max) return 0;
        return ((value - min) / (max - min)) * 100;
    };

    return (
        <div className={styles.rangeSlider}>
            <div className={styles.inputs}>
                <div className={styles.inputGroup}>
                    <Input
                        label={'From'}
                        type="number"
                        className={styles.input}
                        value={String(minValue)}
                        min={min}
                        max={maxValue - step}
                        onChange={handleMinInputChange}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <Input
                        label={'To'}
                        type="number"
                        className={styles.input}
                        value={String(maxValue)}
                        min={minValue + step}
                        max={max}
                        onChange={handleMaxInputChange}
                    />
                </div>
            </div>

            <div className={styles.sliderContainer}>
                <div className={styles.track}>
                    <div
                        className={styles.range}
                        style={{
                            left: `${getPercentage(minValue)}%`,
                            width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
                        }}
                    />
                </div>

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={minValue}
                    onChange={handleMinSliderChange}
                    className={cn(styles.slider, styles.min)}
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={maxValue}
                    onChange={handleMaxSliderChange}
                    className={cn(styles.slider, styles.max)}
                />
            </div>
        </div>
    );
};