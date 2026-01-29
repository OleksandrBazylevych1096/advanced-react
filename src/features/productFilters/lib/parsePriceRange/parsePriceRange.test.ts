import {describe, expect, it} from 'vitest';

import {parsePriceRange} from './parsePriceRange.ts';

describe('parsePriceRange', () => {
    it('should parse valid min and max prices', () => {
        const result = parsePriceRange('100', '500');
        expect(result).toEqual({min: 100, max: 500});
    });

    it('should handle null min price', () => {
        const result = parsePriceRange(null, '500');
        expect(result).toEqual({min: undefined, max: 500});
    });

    it('should handle null max price', () => {
        const result = parsePriceRange('100', null);
        expect(result).toEqual({min: 100, max: undefined});
    });

    it('should handle both null prices', () => {
        const result = parsePriceRange(null, null);
        expect(result).toEqual({min: undefined, max: undefined});
    });

    it('should parse decimal values', () => {
        const result = parsePriceRange('99.99', '199.50');
        expect(result).toEqual({min: 99.99, max: 199.50});
    });

    it('should handle zero values', () => {
        const result = parsePriceRange('0', '100');
        expect(result).toEqual({min: undefined, max: 100});
    });

    it('should return null when min > max', () => {
        const result = parsePriceRange('500', '100');
        expect(result).toBeNull();
    });

    it('should handle invalid min price (NaN)', () => {
        const result = parsePriceRange('abc', '500');
        expect(result).toEqual({min: undefined, max: 500});
    });

    it('should handle invalid max price (NaN)', () => {
        const result = parsePriceRange('100', 'xyz');
        expect(result).toEqual({min: 100, max: undefined});
    });

    it('should handle both invalid prices', () => {
        const result = parsePriceRange('abc', 'xyz');
        expect(result).toEqual({min: undefined, max: undefined});
    });

    it('should handle empty strings', () => {
        const result = parsePriceRange('', '');
        expect(result).toEqual({min: undefined, max: undefined});
    });

    it('should handle whitespace strings', () => {
        const result = parsePriceRange('  ', '  ');
        expect(result).toEqual({min: undefined, max: undefined});
    });

    it('should parse strings with leading/trailing whitespace', () => {
        const result = parsePriceRange('  100  ', '  500  ');
        expect(result).toEqual({min: 100, max: 500});
    });

    it('should handle negative values', () => {
        const result = parsePriceRange('-10', '100');
        expect(result).toEqual({min: -10, max: 100});
    });

    it('should return null when both values are valid but min > max', () => {
        const result = parsePriceRange('1000.50', '999.99');
        expect(result).toBeNull();
    });

    it('should handle equal min and max values', () => {
        const result = parsePriceRange('100', '100');
        expect(result).toEqual({min: 100, max: 100});
    });

    it('should handle very large numbers', () => {
        const result = parsePriceRange('999999999', '9999999999');
        expect(result).toEqual({min: 999999999, max: 9999999999});
    });

    it('should handle very small decimal numbers', () => {
        const result = parsePriceRange('0.01', '0.99');
        expect(result).toEqual({min: 0.01, max: 0.99});
    });

    it('should handle scientific notation', () => {
        const result = parsePriceRange('1e2', '1e3');
        expect(result).toEqual({min: 100, max: 1000});
    });

    it('should not return null when only min is defined and valid', () => {
        const result = parsePriceRange('100', null);
        expect(result).toEqual({min: 100, max: undefined});
    });

    it('should not return null when only max is defined and valid', () => {
        const result = parsePriceRange(null, '500');
        expect(result).toEqual({min: undefined, max: 500});
    });

    it('should handle string "0" as falsy but valid number', () => {
        const result = parsePriceRange('0', '0');
        expect(result).toEqual({min: undefined, max: undefined});
    });
});