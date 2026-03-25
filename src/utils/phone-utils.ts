import { CountryMeta } from '../data/countries';

type FormatOptions = { international?: boolean };

export const sanitizeDigits = (value?: string): string => (value ?? '').replace(/\D/g, '');

export const countDigits = (value: string): number => (value.match(/\d/g) ?? []).length;

const fillTemplate = (template: string, digits: string): string => {
  let result = '';
  let digitIndex = 0;
  for (const char of template) {
    if (char === 'X') {
      if (digitIndex < digits.length) {
        result += digits[digitIndex++];
      } else {
        break;
      }
    } else {
      result += char;
    }
  }
  if (digitIndex < digits.length) {
    result += digits.slice(digitIndex);
  }
  return result;
};

export const formatPhone = (value: string, country?: CountryMeta, options: FormatOptions = {}): string => {
  const digits = sanitizeDigits(value);
  if (!country) {
    return digits;
  }
  const dial = country.dialCode.replace('+', '');
  const includesDial = digits.startsWith(dial);
  const localDigits = includesDial ? digits.slice(dial.length) : digits;
  const template = options.international ? `+${dial} ${country.format}` : country.format;
  const formatted = fillTemplate(template, localDigits);

  if (!options.international) {
    return formatted;
  }

  if (!formatted) {
    return `+${dial}`;
  }

  return formatted;
};

type ValidationMode = 'strict' | 'loose';

export const validatePhone = (value: string, country?: CountryMeta, mode: ValidationMode = 'strict'): boolean => {
  const digits = sanitizeDigits(value);
  if (!country) {
    return digits.length >= 6 && digits.length <= 15;
  }
  const dial = country.dialCode.replace('+', '');
  const local = digits.startsWith(dial) ? digits.slice(dial.length) : digits;
  if (mode === 'strict') {
    return local.length >= country.minLength && local.length <= country.maxLength;
  }
  return local.length >= country.minLength;
};

export { ValidationMode };
