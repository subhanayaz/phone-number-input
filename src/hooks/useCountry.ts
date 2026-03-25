import { useState, useMemo, useEffect } from 'react';
import { CountryMeta, detectCountryFromLocale, getCountryByIso } from '../data/countries';

export interface UseCountryOptions {
  defaultCountry?: string;
  fallback?: string;
  locale?: string;
  localeDetection?: boolean;
}

export const useCountry = (options?: UseCountryOptions): {
  country: CountryMeta;
  setCountry: (iso: string) => void;
} => {
  const {
    defaultCountry,
    fallback = 'US',
    locale,
    localeDetection = true
  } = options ?? {};

  const [iso, setIso] = useState(() => {
    if (defaultCountry) return defaultCountry.toUpperCase();
    if (localeDetection) {
      return detectCountryFromLocale({ locale, fallback }).iso2;
    }
    return fallback.toUpperCase();
  });

  useEffect(() => {
    if (defaultCountry) {
      setIso(defaultCountry.toUpperCase());
      return;
    }
    if (localeDetection) {
      setIso(detectCountryFromLocale({ locale, fallback }).iso2);
    } else {
      setIso(fallback.toUpperCase());
    }
  }, [defaultCountry, fallback, locale, localeDetection]);

  const country = useMemo(() => {
    const maybe = getCountryByIso(iso);
    if (maybe) {
      return maybe;
    }
    return detectCountryFromLocale({ fallback });
  }, [iso, fallback]);

  const setCountry = (next: string) => {
    setIso(next.toUpperCase());
  };

  return { country, setCountry };
};
