# Lightphone Input

**Lightphone Input** is a lightweight, tree-shakeable React phone number component designed for modern bundles (targeting <10 KB gzipped without tree-shaking) while supporting 200+ countries. It ships with locale-aware country detection, strict/loose validation modes, as-you-type formatting, and accessible country selection.

## Features
- ✅ Validation against country-specific digit ranges without pulling in `libphonenumber`
- 🌍 Automatic country detection via `navigator.language` or a configurable fallback
- 🧰 Customizable country picker with flags, dial codes, and search
- 🧭 Accessible ARIA-friendly dropdown with keyboard handling
- ✏️ Controlled and uncontrolled inputs with masking that preserves cursor position
- 🔗 Hooks (`usePhoneInput`, `useCountry`) plus helpers for formatting and validation
- 🎯 Fully typed TypeScript entrypoints plus `tsup` build for ESM/CJS

## Install
```bash
npm install lightphone-input
```

The package treats `react`/`react-dom` as peers, so be sure your project provides them.

## Basic Usage
```tsx
import { PhoneInput } from 'lightphone-input';

export default function CheckoutPhone() {
  return (
    <PhoneInput
      label="Mobile number"
      helperText="Enter the number we can reach you on"
      defaultCountry="US"
      format="international"
    />
  );
}
```

## Hooks
```tsx
import { usePhoneInput } from 'lightphone-input';

function ControlledPhoneField() {
  const { inputProps, country, digits, isValid } = usePhoneInput({
    defaultCountry: 'IN',
    mode: 'strict',
    format: 'national'
  });

  return (
    <div>
      <p>{country.name}</p>
      <input {...inputProps} placeholder="Enter number" />
      <p>{isValid ? 'Valid' : 'Invalid'}</p>
    </div>
  );
}
```

### `useCountry`

If you want just the detection + setter logic (for example to wire a custom dropdown), grab `useCountry`:

```tsx
import { useCountry } from 'lightphone-input';

const { country, setCountry } = useCountry({ fallback: 'CA' });
```

## Validation & Formatting utilities
```ts
import { validatePhone, formatPhone } from 'lightphone-input';

const input = '+14155552671';
const isValid = validatePhone(input, undefined, 'strict');
const formatted = formatPhone(input, undefined, { international: true });
```

## `<PhoneInput />` Props
| Prop | Type | Description |
| --- | --- | --- |
| `value` | `string` | Controlled digit string (non-formatted). | 
| `defaultValue` | `string` | Initial numeric value (numbers only). |
| `onValueChange` | `(state) => void` | Receives `{ digits, display, country, isValid, mode, format }` after every keystroke. |
| `mode` | `'strict' | `'loose'` | Validation mode: `strict` enforces min/max digit counts; `loose` only checks minimum. |
| `format` | `'national' | `'international'` | Display format. |
| `defaultCountry` | `string` | ISO-3166 code to seed the picker (falls back to locale). |
| `country` | `string` | Controlled country selection (ISO). |
| `onCountryChange` | `(country) => void` | Notifies when the user selects another country. |
| `locale` | `string` | Overrides `navigator.language` for country detection. |
| `localeDetection` | `boolean` | Toggle automatic detection (defaults to `true`). |
| `helperText` | `string` | Optional helper/validation text rendered below the field. |
| `showFlag` | `boolean` | Toggle flag rendering in the dropdown and toggle button (default `true`). |
| `countries` | `CountryMeta[]` | Custom subset of countries if you need to restrict the picker. |
| `placeholder`, `name`, `disabled`, etc. | (inherited) | Standard `<input>` props pass through. |

## Hook API
### `usePhoneInput(options)`
| Option | Description |
| --- | --- |
| `value` | Controlled digits string. |
| `defaultValue` | Starting digits for uncontrolled mode. |
| `mode` | `'strict'` (default) or `'loose'`. |
| `format` | `'national'` (default) or `'international'`. |
| `defaultCountry`, `country`, `fallbackCountry`, `locale`, `localeDetection` | Same behavior as `<PhoneInput />`. |
| `onCountryChange` | Called after user picks another country. |
| `onValueChange` | Receives the same `{ digits, display, country, isValid, mode, format }`. |

Returns:
- `inputProps` (spread onto a `<input type="tel" />`) with cursor-preserving formatting
- `country` / `setCountry` helpers
- `state` (current digits, rendered display, validation, etc.)
- `isValid`, `digits`, `format`, `mode`

## Supporting 200+ Countries
Metadata is delivered via `src/data/countries.ts`, covering UN member states and territories (≈247 entries) with ISO codes, dial codes, and min/max lengths. Flag emojis are generated via regional indicator pairs for fast rendering.

## Building or Contributing
```bash
npm run build
```
It uses `tsup` to emit CJS/ESM bundles plus `.d.ts` files.

## Example
```tsx
import { PhoneInput, usePhoneInput } from 'lightphone-input';

function Example() {
  const { inputProps, state } = usePhoneInput({ format: 'international', defaultCountry: 'GB' });
  return (
    <div>
      <PhoneInput defaultCountry="GB" onValueChange={(s) => console.log(s)} />
      <pre>{state.digits}</pre>
    </div>
  );
}
```
