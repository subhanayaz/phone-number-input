import {
  PhoneInput,
  usePhoneInput,
  useCountry,
  formatPhone,
  validatePhone,
  countries,
  findCountryByDialCode,
  toFlagEmoji
} from '../src/index';

describe('public API', () => {
  it('exports expected functions and component', () => {
    expect(typeof PhoneInput).toBe('object');
    expect(typeof usePhoneInput).toBe('function');
    expect(typeof useCountry).toBe('function');
    expect(typeof formatPhone).toBe('function');
    expect(typeof validatePhone).toBe('function');
    expect(Array.isArray(countries)).toBe(true);
    expect(typeof findCountryByDialCode).toBe('function');
    expect(typeof toFlagEmoji).toBe('function');
  });
});
