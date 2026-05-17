import { describe, it, expect } from 'vitest';
import { validateBooking } from '../App';

describe('validateBooking', () => {
  it('returns errors for invalid form', () => {
    const errors = validateBooking({
      date: '',
      time: '',
      guests: '0',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });

    expect(errors.date).toBeTruthy();
    expect(errors.time).toBeTruthy();
  });
});
