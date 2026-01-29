import {describe, expect, it} from 'vitest';

import {clampOptionalRange, clampRange, clampValue} from './clampRange.ts';

describe('clampValue', () => {
    it('should return value when within range', () => {
        expect(clampValue(5, 0, 10)).toBe(5);
    });

    it('should clamp to min when value is below min', () => {
        expect(clampValue(-5, 0, 10)).toBe(0);
    });

    it('should clamp to max when value is above max', () => {
        expect(clampValue(15, 0, 10)).toBe(10);
    });

    it('should handle equal min and max', () => {
        expect(clampValue(5, 10, 10)).toBe(10);
    });

    it('should handle negative ranges', () => {
        expect(clampValue(-5, -10, -2)).toBe(-5);
        expect(clampValue(-15, -10, -2)).toBe(-10);
        expect(clampValue(0, -10, -2)).toBe(-2);
    });
});

describe('clampRange', () => {
    it('should return clamped range when values are within limits', () => {
        const result = clampRange(2, 8, 0, 10);
        expect(result).toEqual({min: 2, max: 8});
    });

    it('should clamp both values to limits', () => {
        const result = clampRange(-5, 15, 0, 10);
        expect(result).toEqual({min: 0, max: 10});
    });

    it('should swap min and max if min > max', () => {
        const result = clampRange(8, 2, 0, 10);
        expect(result).toEqual({min: 2, max: 8});
    });

    it('should enforce minimum distance', () => {
        const result = clampRange(5, 6, 0, 10, 5);
        expect(result.max - result.min).toBeGreaterThanOrEqual(5);
    });

    it('should handle minimum distance with center adjustment', () => {
        const result = clampRange(4, 5, 0, 10, 3);
        expect(result.max - result.min).toBe(3);
        expect(result.min).toBeGreaterThanOrEqual(0);
        expect(result.max).toBeLessThanOrEqual(10);
    });

    it('should handle minimum distance at boundaries', () => {
        const result = clampRange(0, 1, 0, 10, 5);
        expect(result).toEqual({min: 0, max: 5});
    });

    it('should handle minimum distance at upper boundary', () => {
        const result = clampRange(9, 10, 0, 10, 5);
        expect(result).toEqual({min: 5, max: 10});
    });

    it('should handle zero minimum distance', () => {
        const result = clampRange(5, 5, 0, 10, 0);
        expect(result).toEqual({min: 5, max: 5});
    });

    it('should handle negative ranges', () => {
        const result = clampRange(-8, -2, -10, 0);
        expect(result).toEqual({min: -8, max: -2});
    });

    it('should handle minimum distance larger than range span', () => {
        const result = clampRange(3, 5, 0, 10, 8);
        const distance = result.max - result.min;
        expect(distance).toBe(8);
        expect(result.min).toBeGreaterThanOrEqual(0);
        expect(result.max).toBeLessThanOrEqual(10);
    });
});

describe('clampOptionalRange', () => {
    it('should clamp both defined values', () => {
        const result = clampOptionalRange(
            {min: -5, max: 15},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: 0, max: 10});
    });

    it('should handle undefined min', () => {
        const result = clampOptionalRange(
            {max: 15},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: undefined, max: 10});
    });

    it('should handle undefined max', () => {
        const result = clampOptionalRange(
            {min: -5},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: 0, max: undefined});
    });

    it('should handle both undefined', () => {
        const result = clampOptionalRange(
            {},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: undefined, max: undefined});
    });

    it('should reset to limits when min > max', () => {
        const result = clampOptionalRange(
            {min: 8, max: 2},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: 0, max: 10});
    });

    it('should not reset when only min is defined', () => {
        const result = clampOptionalRange(
            {min: 8},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: 8, max: undefined});
    });

    it('should not reset when only max is defined', () => {
        const result = clampOptionalRange(
            {max: 2},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: undefined, max: 2});
    });

    it('should handle valid range within limits', () => {
        const result = clampOptionalRange(
            {min: 3, max: 7},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: 3, max: 7});
    });

    it('should handle equal min and max', () => {
        const result = clampOptionalRange(
            {min: 5, max: 5},
            {min: 0, max: 10}
        );
        expect(result).toEqual({min: 5, max: 5});
    });

    it('should handle negative ranges', () => {
        const result = clampOptionalRange(
            {min: -15, max: -5},
            {min: -10, max: 0}
        );
        expect(result).toEqual({min: -10, max: -5});
    });
});