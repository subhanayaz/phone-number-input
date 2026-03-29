import {
  sanitizeDigits,
  countDigits,
  formatPhone,
  validatePhone
} from '../src/utils/phone-utils';
import { getCountryByIso } from '../src/data/countries';

describe('sanitizeDigits', () => {
  it('strips non-digits', () => {
    expect(sanitizeDigits('(555) 123-4567')).toBe('5551234567');
  });

  it('handles undefined and empty', () => {
    expect(sanitizeDigits(undefined)).toBe('');
    expect(sanitizeDigits('')).toBe('');
  });

  it('preserves only digits from mixed unicode', () => {
    expect(sanitizeDigits('+44 \u00a0 20 7946 0958')).toBe('442079460958');
  });
});

describe('countDigits', () => {
  it('counts digit characters only', () => {
    expect(countDigits('(555) 1')).toBe(4);
    expect(countDigits('abc')).toBe(0);
  });
});

describe('formatPhone', () => {
  const unitedStates = getCountryByIso('US');
  const unitedKingdom = getCountryByIso('GB');

  it('returns sanitized digits when country is omitted', () => {
    expect(formatPhone('abc 12-34')).toBe('1234');
  });

  it('formats national template for local digits', () => {
    const national = formatPhone('5551234567', unitedStates);
    expect(national.replace(/\D/g, '')).toBe('5551234567');
    expect(national).toMatch(/555/);
    expect(national).toMatch(/123/);
  });

  it('strips country dial from value when digits include it', () => {
    const national = formatPhone('15551234567', unitedStates);
    const withoutDial = formatPhone('5551234567', unitedStates);
    expect(national).toBe(withoutDial);
  });

  it('formats international mode with dial prefix', () => {
    const formatted = formatPhone('5551234567', unitedStates, { international: true });
    expect(formatted.startsWith('+1')).toBe(true);
    expect(formatted).toMatch(/555/);
  });

  it('handles UK dial code in international form', () => {
    const local = '7911123456';
    const withDial = formatPhone(`44${local}`, unitedKingdom, { international: true });
    expect(withDial.startsWith('+44')).toBe(true);
  });

  it('appends extra digits after template when longer than format', () => {
    const brazil = getCountryByIso('BR');
    expect(brazil).toBeDefined();
    const longLocal = '119999999999';
    const out = formatPhone(longLocal, brazil!);
    expect(out.replace(/\D/g, '').length).toBeGreaterThanOrEqual(longLocal.length);
  });
});

describe('validatePhone', () => {
  const unitedStates = getCountryByIso('US');
  const brazil = getCountryByIso('BR');

  it('validates length without country (ITU-style bounds)', () => {
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('123456')).toBe(true);
    expect(validatePhone('1'.repeat(15))).toBe(true);
    expect(validatePhone('1'.repeat(16))).toBe(false);
  });

  it('strict mode enforces country min and max length', () => {
    expect(validatePhone('5551234567', unitedStates, 'strict')).toBe(true);
    expect(validatePhone('555123456', unitedStates, 'strict')).toBe(false);
    expect(validatePhone('55512345678', unitedStates, 'strict')).toBe(false);
  });

  it('loose mode requires only minimum length', () => {
    expect(validatePhone('5511999999999', brazil, 'loose')).toBe(true);
    expect(validatePhone('5511999999', brazil, 'loose')).toBe(false);
  });

  it('treats leading dial code as local strip for validation', () => {
    expect(validatePhone('15551234567', unitedStates, 'strict')).toBe(true);
  });

  it('defaults to strict mode', () => {
    expect(validatePhone('555', unitedStates)).toBe(false);
  });
});
