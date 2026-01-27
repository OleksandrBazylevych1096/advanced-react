export interface RangeValue {
    min: number;
    max: number;
}

export interface OptionalRangeValue {
    min?: number;
    max?: number;
}

export const clampValue = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export const clampRange = (
    newMin: number,
    newMax: number,
    minLimit: number,
    maxLimit: number,
    minDistance: number = 0
): RangeValue => {
    let clampedMin = clampValue(newMin, minLimit, maxLimit);
    let clampedMax = clampValue(newMax, minLimit, maxLimit);

    if (clampedMin > clampedMax) {
        [clampedMin, clampedMax] = [clampedMax, clampedMin];
    }

    if (clampedMax - clampedMin < minDistance) {
        const center = (clampedMin + clampedMax) / 2;
        clampedMin = clampValue(center - minDistance / 2, minLimit, maxLimit - minDistance);
        clampedMax = clampValue(center + minDistance / 2, minLimit + minDistance, maxLimit);
    }

    return {min: clampedMin, max: clampedMax};
};

export const clampOptionalRange = (
    current: OptionalRangeValue,
    limits: RangeValue
): OptionalRangeValue => {
    const {min: currentMin, max: currentMax} = current;
    const {min: minLimit, max: maxLimit} = limits;

    const newMin = currentMin !== undefined
        ? clampValue(currentMin, minLimit, maxLimit)
        : undefined;

    const newMax = currentMax !== undefined
        ? clampValue(currentMax, minLimit, maxLimit)
        : undefined;

    if (newMin !== undefined && newMax !== undefined && newMin > newMax) {
        return {min: minLimit, max: maxLimit};
    }

    return {min: newMin, max: newMax};
};