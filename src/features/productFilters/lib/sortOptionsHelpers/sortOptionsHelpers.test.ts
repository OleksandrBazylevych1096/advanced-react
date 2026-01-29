import {describe, expect, it} from 'vitest';

import {
    type SortOptionValue,
    VALID_SORT_BY_VALUES,
    VALID_SORT_ORDER_VALUES
} from "@/features/productFilters/consts/sortOptions.ts";
import type {OrderType, SortType} from "@/features/productFilters/model/types/productFiltersSchema.ts";

import {createSortValue, isValidSortBy, isValidSortOrder, parseSortValue} from './sortOptionsHelpers.ts';

describe('createSortValue', () => {
    it('should create sort value from sortBy and sortOrder', () => {
        const result = createSortValue('price' as SortType, 'asc' as OrderType);
        expect(result).toBe('price-asc');
    });

    it('should create sort value with desc order', () => {
        const result = createSortValue('name' as SortType, 'desc' as OrderType);
        expect(result).toBe('name-desc');
    });

    it('should create sort value with different sortBy types', () => {
        const result = createSortValue('date' as SortType, 'asc' as OrderType);
        expect(result).toBe('date-asc');
    });

    it('should handle all valid sortBy values', () => {
        VALID_SORT_BY_VALUES.forEach(sortBy => {
            const result = createSortValue(sortBy, 'asc' as OrderType);
            expect(result).toBe(`${sortBy}-asc`);
        });
    });

    it('should handle all valid sortOrder values', () => {
        VALID_SORT_ORDER_VALUES.forEach(order => {
            const result = createSortValue('price' as SortType, order);
            expect(result).toBe(`price-${order}`);
        });
    });
});

describe('parseSortValue', () => {
    it('should parse sort value into sortBy and sortOrder', () => {
        const result = parseSortValue('price-asc');
        expect(result).toEqual({sortBy: 'price', sortOrder: 'asc'});
    });

    it('should parse sort value with desc order', () => {
        const result = parseSortValue('name-desc');
        expect(result).toEqual({sortBy: 'name', sortOrder: 'desc'});
    });

    it('should handle all valid combinations', () => {
        VALID_SORT_BY_VALUES.forEach(sortBy => {
            VALID_SORT_ORDER_VALUES.forEach(order => {
                const value = `${sortBy}-${order}` as SortOptionValue;
                const result = parseSortValue(value);
                expect(result).toEqual({sortBy, sortOrder: order});
            });
        });
    });

    it('should correctly parse value created by createSortValue', () => {
        const sortBy = 'price' as SortType;
        const sortOrder = 'asc' as OrderType;
        const sortValue = createSortValue(sortBy, sortOrder);
        const parsed = parseSortValue(sortValue);

        expect(parsed.sortBy).toBe(sortBy);
        expect(parsed.sortOrder).toBe(sortOrder);
    });
});

describe('isValidSortBy', () => {
    it('should return true for valid sortBy values', () => {
        VALID_SORT_BY_VALUES.forEach(value => {
            expect(isValidSortBy(value)).toBe(true);
        });
    });

    it('should return false for null', () => {
        expect(isValidSortBy(null)).toBe(false);
    });

    it('should return false for invalid string', () => {
        expect(isValidSortBy('invalid')).toBe(false);
    });

    it('should return false for empty string', () => {
        expect(isValidSortBy('')).toBe(false);
    });

    it('should return false for undefined as string', () => {
        expect(isValidSortBy('undefined')).toBe(false);
    });

    it('should return false for numeric string if not in valid values', () => {
        expect(isValidSortBy('123')).toBe(false);
    });

    it('should return false for string with whitespace', () => {
        expect(isValidSortBy('price ')).toBe(false);
        expect(isValidSortBy(' price')).toBe(false);
    });

    it('should be case-sensitive', () => {
        if (VALID_SORT_BY_VALUES.includes('price' as SortType)) {
            expect(isValidSortBy('price')).toBe(true);
            expect(isValidSortBy('PRICE')).toBe(false);
            expect(isValidSortBy('Price')).toBe(false);
        }
    });
});

describe('isValidSortOrder', () => {
    it('should return true for valid sortOrder values', () => {
        VALID_SORT_ORDER_VALUES.forEach(value => {
            expect(isValidSortOrder(value)).toBe(true);
        });
    });

    it('should return false for null', () => {
        expect(isValidSortOrder(null)).toBe(false);
    });

    it('should return false for invalid string', () => {
        expect(isValidSortOrder('invalid')).toBe(false);
    });

    it('should return false for empty string', () => {
        expect(isValidSortOrder('')).toBe(false);
    });

    it('should return false for undefined as string', () => {
        expect(isValidSortOrder('undefined')).toBe(false);
    });

    it('should return false for numeric string if not in valid values', () => {
        expect(isValidSortOrder('123')).toBe(false);
    });

    it('should return false for string with whitespace', () => {
        expect(isValidSortOrder('asc ')).toBe(false);
        expect(isValidSortOrder(' asc')).toBe(false);
    });

    it('should be case-sensitive', () => {
        if (VALID_SORT_ORDER_VALUES.includes('asc' as OrderType)) {
            expect(isValidSortOrder('asc')).toBe(true);
            expect(isValidSortOrder('ASC')).toBe(false);
            expect(isValidSortOrder('Asc')).toBe(false);
        }
    });
});

describe('combined', () => {
    it('should create and parse sort value correctly (round-trip)', () => {
        VALID_SORT_BY_VALUES.forEach(sortBy => {
            VALID_SORT_ORDER_VALUES.forEach(order => {
                const created = createSortValue(sortBy, order);
                const parsed = parseSortValue(created);

                expect(parsed.sortBy).toBe(sortBy);
                expect(parsed.sortOrder).toBe(order);
            });
        });
    });

    it('should validate parsed values from created sort value', () => {
        const sortValue = createSortValue('price' as SortType, 'asc' as OrderType);
        const {sortBy, sortOrder} = parseSortValue(sortValue);

        expect(isValidSortBy(sortBy)).toBe(true);
        expect(isValidSortOrder(sortOrder)).toBe(true);
    });

    it('should work with all combinations of valid values', () => {
        VALID_SORT_BY_VALUES.forEach(sortBy => {
            VALID_SORT_ORDER_VALUES.forEach(order => {
                expect(isValidSortBy(sortBy)).toBe(true);
                expect(isValidSortOrder(order)).toBe(true);

                const sortValue = createSortValue(sortBy, order);
                expect(sortValue).toContain('-');

                const parsed = parseSortValue(sortValue);
                expect(isValidSortBy(parsed.sortBy)).toBe(true);
                expect(isValidSortOrder(parsed.sortOrder)).toBe(true);
            });
        });
    });
});