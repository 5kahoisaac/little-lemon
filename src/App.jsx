import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ChevronLeft, Clock, MapPin, UsersRound } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];

export const initialForm = {
  date: '',
  time: '',
  guests: '2',
  seating: 'Indoor',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  occasion: 'None',
};

const menuItems = [
  { name: 'Greek Salad', description: 'Feta, olives, cucumber, tomato, and lemon dressing.', price: '$12.99', emoji: '🥗' },
  { name: 'Bruschetta', description: 'Grilled bread, garlic, tomato, basil, and olive oil.', price: '$7.99', emoji: '🍅' },
  { name: 'Lemon Pasta', description: 'Fresh pasta with herbs and bright lemon sauce.', price: '$16.50', emoji: '🍝' },
];

export function validateBooking(form) {
  const errors = {};
  if (!form.date) errors.date = 'Please choose a reservation date.';
  else if (form.date < today) errors.date = 'Reservation date cannot be in the past.';

  if (!form.time) errors.time = 'Please choose an available time.';

  const guestCount = Number(form.guests);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    errors.guests = 'Guests must be between 1 and 10.';
  }

  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!/^[0-9+()\-\s]{7,}$/.test(form.phone)) errors.phone = 'Enter a valid phone number.';
  return errors;
}

function Field({ label, id, error, children }) {
  const errorId = `${id}-error`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, {
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && <p className="error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}

function ScreenHeader({ eyebrow, title, titleId, subtitle, onBack }) {
  return (
    <header className="screen-header">
      {onBack && (
        <button className="icon-back" type="button" onClick={onBack} aria-label="Go back">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
      )}
      <p className="eyebrow dark">{eyebrow}</p>
      <h1 id={titleId}>{title}</h1>
      {subtitle && <p className="sub">{subtitle}</p>}
    </header>
  );
}

export function BookingForm({ form, errors, availableTimes, onUpdate, onSubmit }) {
  return (
    <form className="booking-card" onSubmit={onSubmit} noValidate>
      <Field label="Date" id="date" error={errors.date}>
        <input id="date" name="date" type="date" min={today} value={form.date} onChange={(event) => onUpdate('date', event.target.value)} />
      </Field>

      <Field label="Time" id="time" error={errors.time}>
        <select id="time" name="time" value={form.time} onChange={(event) => onUpdate('time', event.target.value)}>
          <option value="">Select a time</option>
          {availableTimes.map((time) => <option key={time} value={time}>{time}</option>)}
        </select>
      </Field>

      <Field label="Number of diners" id="guests" error={errors.guests}>
        <input id="guests" name="guests" type="number" min="1" max="10" inputMode="numeric" value={form.guests} onChange={(event) => onUpdate('guests', event.target.value)} />
      </Field>

      <fieldset>
        <legend>Seating preference</legend>
        <div className="radio-row">
          {['Indoor', 'Outdoor'].map((option) => (
            <label className={`choice ${form.seating === option ? 'selected' : ''}`} key={option}>
              <input type="radio" name="seating" value={option} checked={form.seating === option} onChange={(event) => onUpdate('seating', event.target.value)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button className="primary full" type="submit">Continue</button>
    </form>
  );
}

export default function App() {
  const [step, setStep] = useState('home');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const availableTimes = useMemo(() => ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'], []);

  const update = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const continueToDetails = (event) => {
    event.preventDefault();
    const stepErrors = validateBooking({
      ...form,
      firstName: 'Valid',
      lastName: 'Guest',
      email: 'guest@example.com',
      phone: '1234567',
    });

    const partialErrors = {};
    ['date', 'time', 'guests'].forEach((key) => {
      if (stepErrors[key]) partialErrors[key] = stepErrors[key];
    });

    setErrors(partialErrors);
    if (Object.keys(partialErrors).length === 0) setStep('details');
  };

  const submitBooking = (event) => {
    event.preventDefault();
    const nextErrors = validateBooking(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep('confirmed');
  };

  return (
    <main className="app" aria-label="Little Lemon reserve a table web app">
      {step === 'home' && (
        <article className="phone-frame home-screen" aria-labelledby="home-title">
          <header className="home-hero">
            <nav className="topbar" aria-label="Main navigation">
              <a className="brand" href="#home" aria-label="Little Lemon home">Little Lemon</a>
              <a href="#menu">Menu</a>
              <button type="button" onClick={() => setStep('reserve')}>Reserve</button>
            </nav>

            <section className="hero-content" id="home">
              <div className="hero-copy">
                <p className="eyebrow">Chicago</p>
                <h1 id="home-title">Fresh Mediterranean dining, reserved in minutes.</h1>
                <p>Book a table with clear availability, simple forms, and instant confirmation.</p>
                <button className="primary hero-cta" type="button" onClick={() => setStep('reserve')}>
                  Reserve a table
                </button>
              </div>

              <figure className="hero-photo">
                <span role="img" aria-label="Little Lemon plated dish">🍋</span>
              </figure>
            </section>
          </header>

          <section className="quick-facts" aria-label="Restaurant highlights">
            <div><MapPin size={18} aria-hidden="true" /><span>Chicago</span></div>
            <div><Clock size={18} aria-hidden="true" /><span>5–9 PM</span></div>
            <div><UsersRound size={18} aria-hidden="true" /><span>1–10 guests</span></div>
          </section>

          <section id="menu" className="menu-section" aria-labelledby="menu-title">
            <div className="section-title">
              <div>
                <p className="eyebrow dark">Specials</p>
                <h2 id="menu-title">This week’s favorites</h2>
              </div>
              <button className="ghost" type="button">Online menu</button>
            </div>

            <div className="dish-list">
              {menuItems.map((item) => (
                <article className="dish-card" key={item.name}>
                  <div className="dish-copy">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <strong>{item.price}</strong>
                  </div>
                  <div className="dish-image" aria-hidden="true">{item.emoji}</div>
                </article>
              ))}
            </div>
          </section>
        </article>
      )}

      {step === 'reserve' && (
        <section className="phone-frame form-screen" aria-labelledby="reserve-title">
          <ScreenHeader
            eyebrow="Step 1 of 2"
            title="Reserve a table"
            titleId="reserve-title"
            subtitle="Choose your visit details."
            onBack={() => setStep('home')}
          />

          <BookingForm
            form={form}
            errors={errors}
            availableTimes={availableTimes}
            onUpdate={update}
            onSubmit={continueToDetails}
          />
        </section>
      )}

      {step === 'details' && (
        <section className="phone-frame form-screen" aria-labelledby="details-title">
          <ScreenHeader
            eyebrow="Step 2 of 2"
            title="Your details"
            titleId="details-title"
            subtitle="We’ll send your confirmation here."
            onBack={() => setStep('reserve')}
          />

          <form className="booking-card" onSubmit={submitBooking} noValidate>
            <Field label="First name" id="firstName" error={errors.firstName}>
              <input id="firstName" name="firstName" autoComplete="given-name" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} />
            </Field>

            <Field label="Last name" id="lastName" error={errors.lastName}>
              <input id="lastName" name="lastName" autoComplete="family-name" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} />
            </Field>

            <Field label="Email" id="email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
            </Field>

            <Field label="Phone number" id="phone" error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} />
            </Field>

            <aside className="summary" aria-label="Reservation summary">
              <strong>Reservation summary</strong>
              <span><CalendarDays size={16} aria-hidden="true" /> {form.date || 'Date'} · {form.time || 'Time'} · {form.guests} guests · {form.seating}</span>
            </aside>

            <button className="primary full" type="submit">Confirm reservation</button>
          </form>
        </section>
      )}

      {step === 'confirmed' && (
        <section className="phone-frame confirmation" aria-labelledby="confirmed-title" aria-live="polite">
          <div className="success-mark">
            <CheckCircle2 size={110} aria-hidden="true" />
          </div>
          <h1 id="confirmed-title">Table reserved!</h1>
          <p>
            {form.firstName || 'Guest'}, your table for {form.guests} is confirmed for {form.date} at {form.time}.
            A confirmation was sent to {form.email}.
          </p>
          <button className="primary" type="button" onClick={() => { setForm(initialForm); setErrors({}); setStep('home'); }}>Back to home</button>
        </section>
      )}
    </main>
  );
}
