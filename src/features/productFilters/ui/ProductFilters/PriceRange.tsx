import {selectAvailablePriceRange} from "@/features/productFilters/model/selectors/productFiltersSelectors.ts";

import type {PriceRangeType} from "@/entities/product/model/types/Product";

import {useAppSelector} from "@/shared/lib";
import {RangeSlider} from "@/shared/ui";

interface PriceRangeProps {
    value: PriceRangeType;
    onChange: (value: PriceRangeType) => void;
}

export const PriceRange = ({value, onChange}: PriceRangeProps) => {
    const available = useAppSelector(selectAvailablePriceRange);

    if (!available || available.min === undefined || available.max === undefined) {
        return null;
    }

    const minLimit = available.min;
    const maxLimit = available.max;

    // Використовуємо значення з пропсів або дефолтні з available
    const effectiveMin = value.min ?? minLimit;
    const effectiveMax = value.max ?? maxLimit;

    const handleChange = (min: number, max: number) => {
        onChange({
            min: Math.max(min, minLimit),
            max: Math.min(max, maxLimit),
        });
    };

    return (
        <RangeSlider
            min={minLimit}
            max={maxLimit}
            step={1}
            value={{min: effectiveMin, max: effectiveMax}}
            onChange={handleChange}
        />
    );
};