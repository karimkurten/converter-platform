import { describe, it, expect } from 'vitest';
import { formatNumber } from './utils';

describe('formatNumber edge cases', () => {
  it('returns "Invalid" for Infinity (callers must guard before formatting)', () => {
    expect(formatNumber(Infinity)).toBe('Invalid');
    expect(formatNumber(-Infinity)).toBe('Invalid');
  });
  it('returns "Invalid" for NaN', () => {
    expect(formatNumber(NaN)).toBe('Invalid');
  });
  it('returns "0" for zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
  it('uses exponential notation for huge values', () => {
    expect(formatNumber(1e16)).toBe('1.000000e+16');
  });
  it('uses exponential notation for tiny values', () => {
    expect(formatNumber(1e-7)).toBe('1.000000e-7');
  });
  it('formats integers with thousands separators', () => {
    expect(formatNumber(100000)).toBe('100,000');
  });
  it('applies significant figures, not decimal places', () => {
    // precision=6 means 6 significant figures: 1234.5678 → 1234.57
    expect(formatNumber(1234.5678, 6)).toBe('1234.57');
    // 0.0012345678 with 4 significant figures → 0.001235
    expect(formatNumber(0.0012345678, 4)).toBe('0.001235');
  });
});
