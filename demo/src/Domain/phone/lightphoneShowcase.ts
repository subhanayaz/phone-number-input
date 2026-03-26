import type { CountryMeta } from 'lightphone-input'
import { countries as allCountries } from 'lightphone-input'

type ValueChangeState = {
  digits: string
  display: string
  country: CountryMeta
  isValid: boolean
  mode: 'strict' | 'loose'
  format: 'national' | 'international'
}

export function stringifyValueChangeState(state: ValueChangeState): string {
  const formattedCountry = `${state.country.name} (${state.country.iso2}) +${state.country.dialCode}`

  return JSON.stringify(
    {
      digits: state.digits,
      display: state.display,
      isValid: state.isValid,
      country: formattedCountry,
      mode: state.mode,
      format: state.format,
      minLength: state.country.minLength,
      maxLength: state.country.maxLength,
    },
    null,
    2,
  )
}

export function getCountrySubsetForDemo(): CountryMeta[] {
  const allowedIsoSet = new Set(['US', 'CA', 'GB', 'DE', 'FR', 'IN', 'JP', 'AU'])
  return allCountries.filter((country) => allowedIsoSet.has(country.iso2))
}

export function buildPhoneUtilityPreview(preview: {
  input: string
  strictValid: boolean
  looseValid: boolean
  international: string
  national: string
}): string {
  return [
    `input: ${preview.input}`,
    '',
    `validatePhone(input, undefined, 'strict') => ${String(preview.strictValid)}`,
    `validatePhone(input, undefined, 'loose')  => ${String(preview.looseValid)}`,
    '',
    `formatPhone(input, undefined, { international: true })  => ${preview.international}`,
    `formatPhone(input, undefined, { international: false }) => ${preview.national}`,
  ].join('\n')
}

