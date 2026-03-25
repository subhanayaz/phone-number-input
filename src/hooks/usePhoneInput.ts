import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { CountryMeta, getCountryByIso } from '../data/countries';
import { formatPhone, sanitizeDigits, validatePhone, countDigits, ValidationMode } from '../utils/phone-utils';
import { useCountry } from './useCountry';

export interface PhoneInputHookOptions {
  value?: string;
  defaultValue?: string;
  onValueChange?: (state: PhoneInputState) => void;
  mode?: ValidationMode;
  format?: 'national' | 'international';
  defaultCountry?: string;
  country?: string;
  fallbackCountry?: string;
  locale?: string;
  localeDetection?: boolean;
  onCountryChange?: (country: CountryMeta) => void;
}

export interface PhoneInputState {
  digits: string;
  display: string;
  country: CountryMeta;
  isValid: boolean;
  mode: ValidationMode;
  format: 'national' | 'international';
}

const mapDigitsToCursor = (formatted: string, digitsBefore: number): number => {
  if (digitsBefore <= 0) return 0;
  let digitsSeen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      digitsSeen += 1;
      if (digitsSeen >= digitsBefore) {
        return i + 1;
      }
    }
  }
  return formatted.length;
};

export const usePhoneInput = (options?: PhoneInputHookOptions) => {
  const {
    value,
    defaultValue,
    onValueChange,
    mode = 'strict',
    format = 'national',
    defaultCountry,
    fallbackCountry,
    locale,
    localeDetection,
    onCountryChange,
    country: controlledCountry
  } = options ?? {};

  const { country: detectedCountry, setCountry: setDetectedCountry } = useCountry({
    defaultCountry,
    fallback: fallbackCountry,
    locale,
    localeDetection
  });

  const [internalDigits, setInternalDigits] = useState(() => sanitizeDigits(defaultValue));

  useEffect(() => {
    if (value === undefined && defaultValue !== undefined) {
      setInternalDigits(sanitizeDigits(defaultValue));
    }
  }, [defaultValue, value]);

  const digits = value !== undefined ? sanitizeDigits(value) : internalDigits;

  const selectedCountry = useMemo(() => {
    if (controlledCountry) {
      const match = getCountryByIso(controlledCountry);
      if (match) return match;
    }
    return detectedCountry;
  }, [controlledCountry, detectedCountry]);

  const state = useMemo(() => {
    const display = formatPhone(digits, selectedCountry, { international: format === 'international' });
    const isValid = validatePhone(digits, selectedCountry, mode);
    return { digits, display, country: selectedCountry, isValid, mode, format };
  }, [digits, selectedCountry, format, mode]);

  useEffect(() => {
    onValueChange?.(state);
  }, [state, onValueChange]);

  const inputRef = useRef<HTMLInputElement>(null);
  const cursorDigits = useRef(0);

  const handleCountryChange = useCallback(
    (iso: string) => {
      const normalized = iso?.toUpperCase?.() ?? iso;
      if (!normalized) return;
      const next = getCountryByIso(normalized);
      if (next) {
        setDetectedCountry(normalized);
        onCountryChange?.(next);
      }
    },
    [onCountryChange, setDetectedCountry]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value: rawValue, selectionStart } = event.target;
      const sanitized = sanitizeDigits(rawValue);
      cursorDigits.current = countDigits(rawValue.slice(0, selectionStart ?? rawValue.length));
      if (value === undefined) {
        setInternalDigits(sanitized);
      }
    },
    [value]
  );

  const handleSelect = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
    const target = event.currentTarget as HTMLInputElement;
    cursorDigits.current = countDigits(target.value.slice(0, target.selectionStart ?? target.value.length));
  }, []);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const cursor = mapDigitsToCursor(state.display, cursorDigits.current);
    el.setSelectionRange(cursor, cursor);
  }, [state.display]);

  return {
    state,
    inputProps: {
      ref: inputRef,
      value: state.display,
      onChange: handleChange,
      onSelect: handleSelect,
      type: 'tel'
    },
    country: state.country,
    setCountry: handleCountryChange,
    digits: state.digits,
    isValid: state.isValid,
    mode: state.mode,
    format: state.format
  };
};
