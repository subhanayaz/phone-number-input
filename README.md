# lightphone-input

Lightweight, tree‑shakeable **React phone number input** with:

- **200+ countries** (dial codes + min/max lengths)
- **As‑you‑type formatting** (national or international)
- **Strict / loose validation** without `libphonenumber`
- **Country picker** (flag, dial code, search)
- **Typed API** + hook-first core (`usePhoneInput`)

## Install

```bash
npm install lightphone-input
```

`react` and `react-dom` are **peer dependencies** (React 18+).

## Quick start

```tsx
import { useMemo, useState } from 'react';
import { PhoneInput, type PhoneInputState, countries } from 'lightphone-input';

export function CheckoutPhone() {
  const [latestState, setLatestState] = useState<PhoneInputState | null>(null);

  const helperText = useMemo(() => {
    if (!latestState) return 'Type a phone number';
    return latestState.isValid ? `Valid (${latestState.country.iso2})` : `Invalid (${latestState.country.iso2})`;
  }, [latestState]);

  return (
    <PhoneInput
      label="Phone number"
      placeholder="(555) 123-4567"
      defaultCountry="US"
      format="national"
      mode="strict"
      countries={countries}
      helperText={helperText}
      onValueChange={setLatestState}
    />
  );
}
```

## Common recipes

### Controlled input

```tsx
import { useState } from 'react';
import { PhoneInput } from 'lightphone-input';

export function ControlledPhone() {
  const [digits, setDigits] = useState('');

  return (
    <PhoneInput
      label="Phone"
      value={digits}
      onValueChange={(nextState) => setDigits(nextState.digits)}
      defaultCountry="GB"
      format="international"
    />
  );
}
```

### Restrict the country list

```tsx
import { PhoneInput, countries } from 'lightphone-input';

const allowedCountries = countries.filter((country) => ['US', 'CA', 'MX'].includes(country.iso2));

export function NorthAmericaOnly() {
  return <PhoneInput label="Phone" defaultCountry="US" countries={allowedCountries} />;
}
```

### Locale-based default country

```tsx
import { PhoneInput } from 'lightphone-input';

export function LocaleDefault() {
  return <PhoneInput label="Phone" localeDetection fallbackCountry="US" />;
}
```

### “Loose” validation (accept partial numbers)

```tsx
import { PhoneInput } from 'lightphone-input';

export function LeadCapture() {
  return <PhoneInput label="Phone" mode="loose" />;
}
```

## API

### `<PhoneInput />` props

All standard `<input>` props are supported (except `value` / `defaultValue`, which are redefined).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` | Controlled digits value. |
| `defaultValue` | `string` | `undefined` | Uncontrolled starting digits value. |
| `onValueChange` | `(state: PhoneInputState) => void` | `undefined` | Called on every change with the full computed state. |
| `mode` | `'strict' \| 'loose'` | `'strict'` | Validation mode. `strict` enforces min/max lengths; `loose` only enforces minimum. |
| `format` | `'national' \| 'international'` | `'national'` | Display formatting mode. |
| `countries` | `CountryMeta[]` | `countries` | Provide a custom subset to restrict the picker. |
| `defaultCountry` | `string` | (detected) | Initial ISO‑3166 alpha‑2 (e.g. `'US'`). Used when `country` is not controlled. |
| `country` | `string` | `undefined` | Controlled country ISO‑3166 alpha‑2. |
| `fallbackCountry` | `string` | `'US'` | Used when locale detection can’t map to a supported country. |
| `onCountryChange` | `(country: CountryMeta) => void` | `undefined` | Called when the user picks a new country. |
| `locale` | `string` | `undefined` | Override locale (defaults to `navigator.language` when available). |
| `localeDetection` | `boolean` | `false` | If `true`, tries to pick a default country from the locale. |
| `label` | `string` | `undefined` | Optional label rendered above the input. |
| `helperText` | `string` | `undefined` | Optional text rendered below the input. |
| `showFlag` | `boolean` | `true` | Show/hide flag emoji in the toggle and list. |
| `inputClassName` | `string` | `undefined` | Class applied to the `<input />`. |
| `dropdownClassName` | `string` | `undefined` | Class applied to the dropdown container (when provided, inline dropdown styles are not used). |

### `PhoneInputState`

`onValueChange` receives:

- `digits`: normalized digits (no formatting)
- `display`: formatted string shown to the user
- `country`: selected `CountryMeta`
- `isValid`: boolean based on `mode` and country length rules

### Hook: `usePhoneInput(options)`

Use this when you want to build your own UI but reuse the parsing/formatting/validation logic.

```tsx
import { usePhoneInput } from 'lightphone-input';

export function CustomField() {
  const { inputProps, country, state, setCountry } = usePhoneInput({
    defaultCountry: 'IN',
    mode: 'strict',
    format: 'national'
  });

  return (
    <div>
      <div>Country: {country.name}</div>
      <input {...inputProps} placeholder="Phone number" />
      <div>Digits: {state.digits}</div>
      <button type="button" onClick={() => setCountry('US')}>
        Switch to US
      </button>
    </div>
  );
}
```

## Styling

`PhoneInput` supports three styling entry points:

- `className`: applied to the outer container
- `inputClassName`: applied to the `<input />`
- `dropdownClassName`: applied to the country dropdown

### Example

```tsx
import { PhoneInput } from 'lightphone-input';
import './phone-field.css';

export function StyledPhoneField() {
  return (
    <PhoneInput
      label="Phone number"
      defaultCountry="US"
      className="phoneField"
      inputClassName="phoneFieldInput"
      dropdownClassName="phoneFieldDropdown"
    />
  );
}
```

```css
.phoneField {
  max-width: 360px;
}

.phoneFieldInput {
  font-size: 14px;
  color: #111827;
}

.phoneFieldDropdown {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  background: #ffffff;
}
```

If you pass `dropdownClassName`, your class controls dropdown styling instead of the built-in inline dropdown styles.

## Utilities

```ts
import { formatPhone, validatePhone } from 'lightphone-input';

validatePhone('+14155552671', 'US', 'strict');
formatPhone('+14155552671', 'US', { international: true });
```

## Data set

Country metadata ships with the package and is exposed as `countries`. It includes ISO codes, dial codes, and min/max digit lengths.
