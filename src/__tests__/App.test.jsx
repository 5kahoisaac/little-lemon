import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import App, { BookingForm, initialForm, validateBooking } from '../App.jsx';

afterEach(() => {
  cleanup();
});

describe('validateBooking', () => {
  it('returns meaningful errors for invalid input', () => {
    const errors = validateBooking({
      date: '',
      time: '',
      guests: '0',
      seating: 'Indoor',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });

    expect(errors.date).toMatch(/choose/i);
    expect(errors.time).toMatch(/choose/i);
    expect(errors.guests).toMatch(/between 1 and 10/i);
    expect(errors.email).toMatch(/valid email/i);
  });
});

describe('BookingForm', () => {
  it('renders available times from parent props and reports validation errors', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event) => event.preventDefault());

    render(
      <BookingForm
        form={initialForm}
        errors={{ date: 'Please choose a reservation date.' }}
        availableTimes={['18:00', '19:00']}
        onUpdate={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByRole('option', { name: '18:00' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '19:00' })).toBeInTheDocument();
    expect(screen.getByText(/please choose a reservation date/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('Little Lemon reservation flow', () => {
  it('shows validation on missing reservation details', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /reserve a table/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByText(/please choose a reservation date/i)).toBeInTheDocument();
    expect(screen.getByText(/please choose an available time/i)).toBeInTheDocument();
  });

  it('completes a valid booking', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /reserve a table/i }));

    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    await user.type(screen.getByLabelText(/date/i), tomorrow);
    await user.selectOptions(screen.getByLabelText(/time/i), '19:00');
    await user.clear(screen.getByLabelText(/number of diners/i));
    await user.type(screen.getByLabelText(/number of diners/i), '3');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.type(screen.getByLabelText(/first name/i), 'Sophia');
    await user.type(screen.getByLabelText(/last name/i), 'Martinez');
    await user.type(screen.getByLabelText(/email/i), 'sophia@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '3125550198');
    await user.click(screen.getByRole('button', { name: /confirm reservation/i }));

    expect(screen.getByRole('heading', { name: /table reserved/i })).toBeInTheDocument();
  });
});
