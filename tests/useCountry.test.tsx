import { renderHook, act } from '@testing-library/react';
import { useCountry } from '../src/hooks/useCountry';

describe('useCountry', () => {
  it('uses defaultCountry when provided', () => {
    const { result } = renderHook(() =>
      useCountry({ defaultCountry: 'fr', localeDetection: false, fallback: 'US' })
    );
    expect(result.current.country.iso2).toBe('FR');
  });

  it('uses fallback when localeDetection is false', () => {
    const { result } = renderHook(() =>
      useCountry({ localeDetection: false, fallback: 'DE' })
    );
    expect(result.current.country.iso2).toBe('DE');
  });

  it('updates ISO when setCountry is called', () => {
    const { result } = renderHook(() =>
      useCountry({ defaultCountry: 'US', localeDetection: false })
    );
    act(() => {
      result.current.setCountry('jp');
    });
    expect(result.current.country.iso2).toBe('JP');
  });

  it('syncs when defaultCountry prop changes', () => {
    const { result, rerender } = renderHook(
      ({ iso }: { iso: string }) =>
        useCountry({ defaultCountry: iso, localeDetection: false, fallback: 'US' }),
      { initialProps: { iso: 'US' } }
    );
    expect(result.current.country.iso2).toBe('US');
    rerender({ iso: 'AU' });
    expect(result.current.country.iso2).toBe('AU');
  });
});
