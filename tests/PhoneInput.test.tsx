import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneInput } from '../src/components/PhoneInput';
import { getCountryByIso } from '../src/data/countries';

describe('PhoneInput', () => {
  it('renders label, country control, and input', () => {
    render(
      <PhoneInput
        id="test-phone"
        label="Mobile"
        defaultCountry="US"
        localeDetection={false}
        defaultValue="5551234567"
      />
    );
    expect(screen.getByLabelText('Mobile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Country selector/ })).toBeInTheDocument();
  });

  it('shows helper text linked with aria-describedby', () => {
    render(
      <PhoneInput
        id="p1"
        helperText="We will text you a code."
        defaultCountry="US"
        localeDetection={false}
      />
    );
    const input = screen.getByRole('textbox');
    expect(screen.getByText('We will text you a code.')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-describedby', 'p1-helper');
  });

  it('marks input invalid when number does not meet validation', () => {
    render(
      <PhoneInput defaultCountry="US" localeDetection={false} defaultValue="555" id="inv" />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('opens country list and filters by search', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="US" localeDetection={false} id="dd" />);
    await user.click(screen.getByRole('button', { name: /Country selector/ }));
    const listbox = screen.getByRole('listbox', { name: 'Country list' });
    expect(listbox).toBeInTheDocument();
    const search = within(listbox).getByPlaceholderText('Search country');
    await user.type(search, 'Germ');
    expect(within(listbox).getByRole('option', { name: /\bGermany\b/ })).toBeInTheDocument();
  });

  it('selects a country from the list', async () => {
    const user = userEvent.setup();
    const onCountryChange = jest.fn();
    render(
      <PhoneInput
        defaultCountry="US"
        localeDetection={false}
        onCountryChange={onCountryChange}
        id="pick"
      />
    );
    await user.click(screen.getByRole('button', { name: /Country selector/ }));
    const listbox = screen.getByRole('listbox', { name: 'Country list' });
    await user.click(within(listbox).getByRole('option', { name: /\bFrance\b/ }));
    expect(onCountryChange).toHaveBeenCalledWith(expect.objectContaining({ iso2: 'FR' }));
    expect(screen.getByRole('button', { name: /Country selector/ })).toHaveTextContent('+33');
  });

  it('respects custom countries list', async () => {
    const user = userEvent.setup();
    const subset = [getCountryByIso('US')!, getCountryByIso('CA')!];
    render(<PhoneInput countries={subset} defaultCountry="US" localeDetection={false} id="sub" />);
    await user.click(screen.getByRole('button', { name: /Country selector/ }));
    const listbox = screen.getByRole('listbox', { name: 'Country list' });
    expect(within(listbox).getByRole('option', { name: /\bUnited States\b/ })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /\bCanada\b/ })).toBeInTheDocument();
    expect(within(listbox).queryByRole('option', { name: /\bGermany\b/ })).not.toBeInTheDocument();
  });

  it('hides flag when showFlag is false', () => {
    render(
      <PhoneInput defaultCountry="US" localeDetection={false} showFlag={false} id="nf" />
    );
    const button = screen.getByRole('button', { name: /Country selector/ });
    expect(button.textContent?.replace(/\s/g, '')).toMatch(/^\+1$/);
  });

  it('closes the country list on Escape', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="US" localeDetection={false} id="esc" />);
    await user.click(screen.getByRole('button', { name: /Country selector/ }));
    expect(screen.getByRole('listbox', { name: 'Country list' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox', { name: 'Country list' })).not.toBeInTheDocument();
  });

  it('invokes user onChange after hook onChange', async () => {
    const user = userEvent.setup();
    const userOnChange = jest.fn();
    render(
      <PhoneInput
        defaultCountry="US"
        localeDetection={false}
        onChange={userOnChange}
        id="oc"
      />
    );
    await user.type(screen.getByRole('textbox'), '5');
    expect(userOnChange).toHaveBeenCalled();
  });
});
