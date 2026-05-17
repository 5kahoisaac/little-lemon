import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import App, { validateBooking } from '../App.jsx';

describe('validateBooking', () => {
  it('returns meaningful errors for empty form', () => {
    const errors = validateBooking({ date: '', time: '', guests: '0', seating: 'Indoor', firstName: '', lastName: '', email: '', phone: '' });
    expect(errors.date).toMatch(/choose/i);
    expect(errors.time).toMatch(/choose/i);
    expect(errors.guests).toMatch(/between 1 and 10/i);
    expect(errors.email).toMatch(/valid email/i);
  });
});

describe('Little Lemon app', () => {
  it('shows reservation validation when required fields are missing', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /reserve a table/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/please choose a reservation date/i)).toBeInTheDocument();
    expect(screen.getByText(/please choose an available time/i)).toBeInTheDocument();
  });

  it('can complete a booking flow', async () => {
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
    await user.type(screen.getByLabelText(/phone/i), '3125550198');
    await user.click(screen.getByRole('button', { name: /confirm reservation/i }));
    expect(screen.getByRole('heading', { name: /table reserved/i })).toBeInTheDocument();
  });
});
