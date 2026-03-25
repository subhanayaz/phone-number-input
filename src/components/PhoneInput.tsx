import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { PhoneInputState, usePhoneInput } from '../hooks/usePhoneInput';
import { countries, CountryMeta, toFlagEmoji } from '../data/countries';

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
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

const mergeRefs = (...refs: Array<React.Ref<HTMLInputElement> | undefined>) => (node: HTMLInputElement | null) => {
  refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === 'function') {
      ref(node);
    } else {
      // eslint-disable-next-line no-param-reassign
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    }
  });
};

const defaultStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  wrapper: {
    position: 'relative',
    display: 'flex',
    borderRadius: 6,
    border: '1px solid #bbb',
    alignItems: 'center',
    overflow: 'hidden'
  },
  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    minWidth: 90
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 240,
    overflow: 'auto',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: 6,
    marginTop: 4,
    padding: 8,
    zIndex: 10
  },
  countryItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 8px',
    borderRadius: 4,
    cursor: 'pointer'
  },
  countryFocus: {
    background: '#f0f0f0'
  },
  searchInput: {
    width: '100%',
    marginBottom: 6,
    padding: 6,
    borderRadius: 4,
    border: '1px solid #ccc'
  },
  helper: {
    fontSize: 12,
    color: '#464646'
  }
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>((props, forwardedRef) => {
  const {
    value,
    defaultValue,
    onValueChange,
    onCountryChange,
    mode,
    format,
    label,
    helperText,
    countries: customCountries,
    defaultCountry,
    country,
    fallbackCountry,
    locale,
    localeDetection,
    showFlag = true,
    className,
    inputClassName,
    dropdownClassName,
    onChange: userOnChange,
    id,
    ...rest
  } = props;

  const countryList = useMemo(() => (customCountries ?? countries).slice().sort((a, b) => a.name.localeCompare(b.name)), [customCountries]);
  const {
    state,
    inputProps,
    country: selectedCountry,
    setCountry: setHookCountry
  } = usePhoneInput({
    value,
    defaultValue,
    onValueChange,
    mode,
    format,
    defaultCountry,
    country,
    fallbackCountry,
    locale,
    localeDetection,
    onCountryChange
  });

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countryList;
    return countryList.filter((candidate) => candidate.name.toLowerCase().includes(q) || candidate.dialCode.includes(q));
  }, [countryList, search]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleCountryPick = (next: CountryMeta) => {
    setHookCountry(next.iso2);
    setSearch('');
    setIsOpen(false);
  };

  const inputId = useMemo(() => id ?? `phone-input-${Math.random().toString(36).slice(2, 8)}`, [id]);
  const helperId = helperText ? `${inputId}-helper` : undefined;

  const { ref: hookRef, onChange: hookOnChange, ...hookInputRest } = inputProps;
  const mergedRef = mergeRefs(hookRef as React.Ref<HTMLInputElement>, forwardedRef);
  const composedOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    hookOnChange?.(event);
    userOnChange?.(event);
  };

  const inputClass = inputClassName ?? undefined;
  const dropdownStyle = dropdownClassName ? undefined : defaultStyles.dropdown;

  const handleWrapperKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={className} ref={containerRef} style={defaultStyles.container}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 12, fontWeight: 600 }}>
          {label}
        </label>
      )}
      <div style={defaultStyles.wrapper} onKeyDown={handleWrapperKeyDown}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={handleToggle}
          aria-label={`Country selector, current selection ${selectedCountry.name}`}
          style={defaultStyles.toggleButton}
        >
          {showFlag && <span style={{ marginRight: 4 }}>{toFlagEmoji(selectedCountry.iso2)}</span>}
          <span>{selectedCountry.dialCode}</span>
        </button>
        <input
          id={inputId}
          {...rest}
          {...hookInputRest}
          ref={mergedRef}
          onChange={composedOnChange}
          aria-invalid={!state.isValid}
          aria-describedby={helperId}
          className={inputClass}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            padding: '8px 12px'
          }}
        />
        {isOpen && (
          <div className={dropdownClassName} style={dropdownStyle} role="listbox" aria-label="Country list">
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search country"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={defaultStyles.searchInput}
            />
            {filteredCountries.map((candidate) => (
              <div
                key={candidate.iso2}
                role="option"
                aria-selected={candidate.iso2 === selectedCountry.iso2}
                onClick={() => handleCountryPick(candidate)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleCountryPick(candidate);
                  }
                }}
                tabIndex={0}
                style={{
                  ...defaultStyles.countryItem,
                  ...(candidate.iso2 === selectedCountry.iso2 ? defaultStyles.countryFocus : undefined)
                }}
              >
                <span>
                  {showFlag && `${toFlagEmoji(candidate.iso2)} `}
                  {candidate.name}
                </span>
                <span>{candidate.dialCode}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {helperText && (
        <p id={helperId} style={defaultStyles.helper}>
          {helperText}
        </p>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';
