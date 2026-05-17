import React, { useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

const initialForm = {
  date: '',
  time: '',
  guests: '2',
  seating: 'Indoor',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export function validateBooking(form) {
  const errors = {};

  if (!form.date) errors.date = 'Please choose a reservation date.';
  if (!form.time) errors.time = 'Please choose a reservation time.';

  const guests = Number(form.guests);

  if (guests < 1 || guests > 10) {
    errors.guests = 'Guests must be between 1 and 10.';
  }

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email.';
  }

  if (!/^[0-9+()\-\s]{7,}$/.test(form.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  return errors;
}

function Field({ label, id, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('home');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const times = useMemo(() => ['17:00','17:30','18:00','18:30','19:00'], []);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    const nextErrors = validateBooking(form);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStep('confirmed');
    }
  };

  return (
    <main className="app">
      {step === 'home' && (
        <section className="hero">
          <header>
            <nav className="topbar">
              <strong>Little Lemon</strong>
              <a href="#menu">Menu</a>
              <a href="#reserve">Reservations</a>
            </nav>
          </header>

          <div className="hero-card">
            <div>
              <p className="eyebrow">Chicago</p>

              <h1>
                Fresh Mediterranean food,
                made for modern nights out.
              </h1>

              <p>Reserve a table in less than two minutes.</p>

              <button
                className="primary"
                onClick={() => setStep('reserve')}
              >
                Reserve a table
              </button>
            </div>

            <div className="photo">🍋</div>
          </div>
        </section>
      )}

      {step === 'reserve' && (
        <section className="screen">
          <h1>Reserve a table</h1>

          <form className="card">
            <Field label="Date" id="date" error={errors.date}>
              <input
                id="date"
                type="date"
                min={today}
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
              />
            </Field>

            <Field label="Time" id="time" error={errors.time}>
              <select
                id="time"
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
              >
                <option value="">Select time</option>

                {times.map((time) => (
                  <option key={time}>{time}</option>
                ))}
              </select>
            </Field>

            <button
              className="primary"
              type="button"
              onClick={() => setStep('details')}
            >
              Continue
            </button>
          </form>
        </section>
      )}

      {step === 'details' && (
        <section className="screen">
          <h1>Your details</h1>

          <form className="card" onSubmit={submit}>
            <Field label="First name" id="firstName" error={errors.firstName}>
              <input
                id="firstName"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
              />
            </Field>

            <Field label="Last name" id="lastName" error={errors.lastName}>
              <input
                id="lastName"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
              />
            </Field>

            <Field label="Email" id="email" error={errors.email}>
              <input
                id="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </Field>

            <Field label="Phone" id="phone" error={errors.phone}>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </Field>

            <button className="primary">
              Confirm reservation
            </button>
          </form>
        </section>
      )}

      {step === 'confirmed' && (
        <section className="confirmation">
          <CheckCircle size={96} />
          <h1>Table reserved!</h1>
          <p>Your reservation has been confirmed.</p>
        </section>
      )}
    </main>
  );
}
