import { describe, it, expect } from 'vitest';
import { formatNumber, sanitizeDecimalInput } from './utils';

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

describe('sanitizeDecimalInput', () => {
  it('passes through ordinary amounts untouched', () => {
    expect(sanitizeDecimalInput('512')).toBe('512');
    expect(sanitizeDecimalInput('0.5')).toBe('0.5');
    expect(sanitizeDecimalInput('1234.5678')).toBe('1234.5678');
  });
  it('preserves the partial states the converter treats specially', () => {
    expect(sanitizeDecimalInput('')).toBe('');
    expect(sanitizeDecimalInput('-')).toBe('-');
    expect(sanitizeDecimalInput('.')).toBe('.');
    expect(sanitizeDecimalInput('-.')).toBe('-.');
    expect(sanitizeDecimalInput('512.')).toBe('512.');
  });
  it('keeps a leading minus and drops any later ones', () => {
    expect(sanitizeDecimalInput('-42.5')).toBe('-42.5');
    expect(sanitizeDecimalInput('4-2')).toBe('42');
    expect(sanitizeDecimalInput('--7')).toBe('-7');
  });
  it('keeps only the first decimal separator', () => {
    expect(sanitizeDecimalInput('1.2.3')).toBe('1.23');
  });
  it('normalises a decimal comma to a point (French/CA iOS keyboards)', () => {
    expect(sanitizeDecimalInput('4,50')).toBe('4.50');
    expect(sanitizeDecimalInput('-1,5')).toBe('-1.5');
  });
  it('strips letters, spaces and grouping separators', () => {
    expect(sanitizeDecimalInput('abc')).toBe('');
    expect(sanitizeDecimalInput('1 000')).toBe('1000');
    expect(sanitizeDecimalInput('$512')).toBe('512');
  });
});
