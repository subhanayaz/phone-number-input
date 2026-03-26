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
    overflow: 'visible'
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
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    maxHeight: 240,
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: 6,
    marginTop: 4,
    padding: 8,
    zIndex: 10
  },
  dropdownSearchRow: {
    position: 'sticky',
    top: 0,
    background: '#fff',
    paddingBottom: 6,
    zIndex: 1
  },
  dropdownList: {
    overflow: 'auto',
    maxHeight: 240,
    borderRadius: 6
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
  const [activeCountryIndex, setActiveCountryIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isOpen) {
      setActiveCountryIndex(-1);
      return;
    }

    const selectedIndex = filteredCountries.findIndex((candidate) => candidate.iso2 === selectedCountry.iso2);
    const nextIndex = selectedIndex >= 0 ? selectedIndex : filteredCountries.length > 0 ? 0 : -1;
    setActiveCountryIndex(nextIndex);
  }, [filteredCountries, isOpen, selectedCountry.iso2]);

  useEffect(() => {
    if (!isOpen) return;
    if (activeCountryIndex < 0) return;
    if (!listRef.current) return;

    const activeOption = listRef.current.querySelector<HTMLElement>(`[data-country-index="${activeCountryIndex}"]`);
    activeOption?.scrollIntoView({ block: 'nearest' });
  }, [activeCountryIndex, isOpen]);

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

  const moveActiveCountry = useCallback(
    (direction: 'up' | 'down') => {
      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      if (filteredCountries.length === 0) return;

      setActiveCountryIndex((currentIndex) => {
        const safeIndex = currentIndex >= 0 ? currentIndex : 0;
        const nextIndex = direction === 'down' ? safeIndex + 1 : safeIndex - 1;
        const boundedIndex = Math.max(0, Math.min(filteredCountries.length - 1, nextIndex));
        return boundedIndex;
      });
    },
    [filteredCountries.length, isOpen]
  );

  const pickActiveCountry = useCallback(() => {
    if (!isOpen) return;
    if (activeCountryIndex < 0) return;
    const candidate = filteredCountries[activeCountryIndex];
    if (!candidate) return;
    handleCountryPick(candidate);
  }, [activeCountryIndex, filteredCountries, isOpen]);

  const handleWrapperKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveCountry('down');
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveCountry('up');
    }

    if (event.key === 'Enter' && isOpen) {
      event.preventDefault();
      pickActiveCountry();
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
          <div
            className={dropdownClassName}
            style={{ ...dropdownStyle, display: 'flex', flexDirection: 'column' }}
            role="listbox"
            aria-label="Country list"
            aria-activedescendant={
              activeCountryIndex >= 0 ? `phone-input-country-option-${filteredCountries[activeCountryIndex]?.iso2 ?? 'none'}` : undefined
            }
          >
            <div style={defaultStyles.dropdownSearchRow}>
              <input
                ref={searchInputRef}
                type="search"
                placeholder="Search country"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    moveActiveCountry('down');
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    moveActiveCountry('up');
                  }
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    pickActiveCountry();
                  }
                }}
                style={defaultStyles.searchInput}
              />
            </div>
            <div ref={listRef} style={{ ...defaultStyles.dropdownList, flex: 1, maxHeight: 240 - 44 }}>
              {filteredCountries.map((candidate, index) => {
                const isActive = index === activeCountryIndex;
                const isSelected = candidate.iso2 === selectedCountry.iso2;
                return (
                  <div
                    id={`phone-input-country-option-${candidate.iso2}`}
                    key={candidate.iso2}
                    role="option"
                    aria-selected={isSelected}
                    data-country-index={index}
                    onMouseEnter={() => setActiveCountryIndex(index)}
                    onClick={() => handleCountryPick(candidate)}
                    tabIndex={-1}
                    style={{
                      ...defaultStyles.countryItem,
                      ...(isActive ? defaultStyles.countryFocus : undefined),
                      ...(isSelected && !isActive ? { fontWeight: 600 } : undefined)
                    }}
                  >
                    <span>
                      {showFlag && `${toFlagEmoji(candidate.iso2)} `}
                      {candidate.name}
                    </span>
                    <span>{candidate.dialCode}</span>
                  </div>
                );
              })}
            </div>
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
