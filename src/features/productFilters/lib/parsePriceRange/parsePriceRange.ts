import type {PriceRangeType} from "@/entities/product/model/types/Product.ts";

export const parsePriceRange = (minPrice: string | null, maxPrice: string | null): PriceRangeType | null => {
    const minNum = minPrice ? parseFloat(minPrice) : undefined;
    const maxNum = maxPrice ? parseFloat(maxPrice) : undefined;

    const validMin = minNum && !isNaN(minNum) ? minNum : undefined;
    const validMax = maxNum && !isNaN(maxNum) ? maxNum : undefined;

    if (validMin !== undefined && validMax !== undefined && validMin > validMax) {
        return null;
    }

    return {min: validMin, max: validMax};
};
