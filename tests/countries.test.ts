import {
  countries,
  findCountryByDialCode,
  getCountryByIso,
  toFlagEmoji,
  detectCountryFromLocale
} from '../src/data/countries';

describe('countries', () => {
  it('exports a non-empty sorted list with required fields', () => {
    expect(countries.length).toBeGreaterThan(100);
    const sample = countries.find((c) => c.iso2 === 'US');
    expect(sample).toMatchObject({
      iso2: 'US',
      dialCode: '+1',
      minLength: 10,
      maxLength: 10
    });
    expect(sample?.format).toContain('X');
  });
});

describe('getCountryByIso', () => {
  it('returns meta for uppercase or lowercase ISO', () => {
    expect(getCountryByIso('de')?.iso2).toBe('DE');
    expect(getCountryByIso('FR')?.name).toBe('France');
  });

  it('returns undefined for unknown or empty', () => {
    expect(getCountryByIso('ZZ')).toBeUndefined();
    expect(getCountryByIso(undefined)).toBeUndefined();
    expect(getCountryByIso('')).toBeUndefined();
  });
});

describe('findCountryByDialCode', () => {
  it('prefers longer dial codes over shorter prefixes', () => {
    const from1268 = findCountryByDialCode('12685550100');
    expect(from1268?.iso2).toBe('AG');
    const from1 = findCountryByDialCode('15551234567');
    expect(from1?.dialCode).toBe('+1');
  });

  it('ignores formatting characters', () => {
    expect(findCountryByDialCode('+44 20 7946 0958')?.iso2).toBe('GB');
  });

  it('returns undefined when no prefix matches', () => {
    expect(findCountryByDialCode('')).toBeUndefined();
    expect(findCountryByDialCode('abc')).toBeUndefined();
  });
});

describe('toFlagEmoji', () => {
  it('maps ISO2 to regional indicator symbols', () => {
    expect(toFlagEmoji('US')).toBe('\uD83C\uDDFA\uD83C\uDDF8');
    expect(toFlagEmoji('gb')).toBe('\uD83C\uDDEC\uD83C\uDDE7');
  });

  it('returns empty string for empty input', () => {
    expect(toFlagEmoji('')).toBe('');
  });
});

describe('detectCountryFromLocale', () => {
  const originalNavigator = globalThis.navigator;

  afterEach(() => {
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true
    });
  });

  it('uses explicit locale region when present', () => {
    expect(detectCountryFromLocale({ locale: 'de-DE', fallback: 'US' }).iso2).toBe('DE');
    expect(detectCountryFromLocale({ locale: 'en_GB', fallback: 'US' }).iso2).toBe('GB');
  });

  it('falls back when locale region is not a country', () => {
    expect(detectCountryFromLocale({ locale: 'en', fallback: 'CA' }).iso2).toBe('CA');
  });

  it('uses navigator.language when locale omitted', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'fr-FR' },
      configurable: true
    });
    expect(detectCountryFromLocale({ fallback: 'US' }).iso2).toBe('FR');
  });

  it('uses fallback ISO when nothing matches', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { language: 'xx-YY' },
      configurable: true
    });
    expect(detectCountryFromLocale({ fallback: 'JP' }).iso2).toBe('JP');
  });
});
