import { renderHook, act } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { usePhoneInput } from '../src/hooks/usePhoneInput';

function changeEvent(value: string, selectionStart?: number): ChangeEvent<HTMLInputElement> {
  return {
    target: { value, selectionStart: selectionStart ?? value.length }
  } as ChangeEvent<HTMLInputElement>;
}

describe('usePhoneInput', () => {
  it('initializes from defaultValue and formats display', () => {
    const { result } = renderHook(() =>
      usePhoneInput({
        defaultValue: '(555) 123-4567',
        defaultCountry: 'US',
        localeDetection: false
      })
    );
    expect(result.current.digits).toBe('5551234567');
    expect(result.current.state.display).toMatch(/555/);
    expect(result.current.isValid).toBe(true);
  });

  it('updates digits on change when uncontrolled', () => {
    const { result } = renderHook(() =>
      usePhoneInput({ defaultCountry: 'US', localeDetection: false })
    );
    act(() => {
      result.current.inputProps.onChange?.(changeEvent('555-123-4567'));
    });
    expect(result.current.digits).toBe('5551234567');
    expect(result.current.isValid).toBe(true);
  });

  it('uses controlled value and ignores internal updates from typing', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) =>
        usePhoneInput({ value, defaultCountry: 'US', localeDetection: false }),
      { initialProps: { value: '555' } }
    );
    expect(result.current.digits).toBe('555');
    act(() => {
      result.current.inputProps.onChange?.(changeEvent('5559999999'));
    });
    expect(result.current.digits).toBe('555');
    rerender({ value: '5559999999' });
    expect(result.current.digits).toBe('5559999999');
  });

  it('invokes onValueChange when state changes', () => {
    const onValueChange = jest.fn();
    const { result } = renderHook(() =>
      usePhoneInput({
        defaultCountry: 'US',
        localeDetection: false,
        onValueChange
      })
    );
    expect(onValueChange).toHaveBeenCalled();
    const initialCalls = onValueChange.mock.calls.length;
    act(() => {
      result.current.inputProps.onChange?.(changeEvent('5551234567'));
    });
    expect(onValueChange.mock.calls.length).toBeGreaterThan(initialCalls);
    const lastPayload = onValueChange.mock.calls.at(-1)?.[0];
    expect(lastPayload?.digits).toBe('5551234567');
    expect(lastPayload?.isValid).toBe(true);
  });

  it('respects international format option', () => {
    const { result } = renderHook(() =>
      usePhoneInput({
        defaultValue: '5551234567',
        defaultCountry: 'US',
        localeDetection: false,
        format: 'international'
      })
    );
    expect(result.current.state.display.startsWith('+1')).toBe(true);
    expect(result.current.state.format).toBe('international');
  });

  it('allows extra digits beyond max in loose mode for countries with a max length', () => {
    const { result: looseResult } = renderHook(() =>
      usePhoneInput({
        defaultValue: '55119999999999',
        defaultCountry: 'BR',
        localeDetection: false,
        mode: 'loose'
      })
    );
    expect(looseResult.current.isValid).toBe(true);

    const { result: strictResult } = renderHook(() =>
      usePhoneInput({
        defaultValue: '55119999999999',
        defaultCountry: 'BR',
        localeDetection: false,
        mode: 'strict'
      })
    );
    expect(strictResult.current.isValid).toBe(false);
  });

  it('uses controlled country prop', () => {
    const { result } = renderHook(() =>
      usePhoneInput({
        defaultValue: '7911123456',
        country: 'GB',
        localeDetection: false
      })
    );
    expect(result.current.state.country.iso2).toBe('GB');
  });

  it('calls onCountryChange when setCountry succeeds', () => {
    const onCountryChange = jest.fn();
    const { result } = renderHook(() =>
      usePhoneInput({
        defaultCountry: 'US',
        localeDetection: false,
        onCountryChange
      })
    );
    act(() => {
      result.current.setCountry('DE');
    });
    expect(onCountryChange).toHaveBeenCalledWith(
      expect.objectContaining({ iso2: 'DE', dialCode: '+49' })
    );
    expect(result.current.state.country.iso2).toBe('DE');
  });

  it('exposes tel input props', () => {
    const { result } = renderHook(() =>
      usePhoneInput({ defaultCountry: 'US', localeDetection: false })
    );
    expect(result.current.inputProps.type).toBe('tel');
    expect(result.current.inputProps.ref).toBeDefined();
  });
});
