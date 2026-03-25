import * as React from 'react';
import React__default, { ChangeEvent, SyntheticEvent } from 'react';

interface CountryMeta {
    iso2: string;
    name: string;
    dialCode: string;
    minLength: number;
    maxLength: number;
    format: string;
    priority?: number;
    areaCodes?: string[];
}
declare const countries: CountryMeta[];
declare const findCountryByDialCode: (digits: string) => CountryMeta | undefined;
declare const toFlagEmoji: (iso2: string) => string;

type FormatOptions = {
    international?: boolean;
};
declare const formatPhone: (value: string, country?: CountryMeta, options?: FormatOptions) => string;
type ValidationMode = 'strict' | 'loose';
declare const validatePhone: (value: string, country?: CountryMeta, mode?: ValidationMode) => boolean;

interface PhoneInputHookOptions {
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
interface PhoneInputState {
    digits: string;
    display: string;
    country: CountryMeta;
    isValid: boolean;
    mode: ValidationMode;
    format: 'national' | 'international';
}
declare const usePhoneInput: (options?: PhoneInputHookOptions) => {
    state: {
        digits: string;
        display: string;
        country: CountryMeta;
        isValid: boolean;
        mode: ValidationMode;
        format: "national" | "international";
    };
    inputProps: {
        ref: React.RefObject<HTMLInputElement>;
        value: string;
        onChange: (event: ChangeEvent<HTMLInputElement>) => void;
        onSelect: (event: SyntheticEvent<HTMLInputElement>) => void;
        type: string;
    };
    country: CountryMeta;
    setCountry: (iso: string) => void;
    digits: string;
    isValid: boolean;
    mode: ValidationMode;
    format: "national" | "international";
};

interface PhoneInputProps extends Omit<React__default.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
    value?: string;
    defaultValue?: string;
    mode?: 'strict' | 'loose';
    format?: 'national' | 'international';
    label?: string;
    helperText?: string;
    countries?: CountryMeta[];
    defaultCountry?: string;
    country?: string;
    fallbackCountry?: string;
    locale?: string;
    localeDetection?: boolean;
    showFlag?: boolean;
    onValueChange?: (state: PhoneInputState) => void;
    onCountryChange?: (country: CountryMeta) => void;
    className?: string;
    inputClassName?: string;
    dropdownClassName?: string;
}
declare const PhoneInput: React__default.ForwardRefExoticComponent<PhoneInputProps & React__default.RefAttributes<HTMLInputElement>>;

interface UseCountryOptions {
    defaultCountry?: string;
    fallback?: string;
    locale?: string;
    localeDetection?: boolean;
}
declare const useCountry: (options?: UseCountryOptions) => {
    country: CountryMeta;
    setCountry: (iso: string) => void;
};

export { CountryMeta, PhoneInput, PhoneInputHookOptions, PhoneInputProps, PhoneInputState, ValidationMode, countries, findCountryByDialCode, formatPhone, toFlagEmoji, useCountry, usePhoneInput, validatePhone };
