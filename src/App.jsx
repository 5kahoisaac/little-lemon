import React, { useMemo, useState } from 'react';
import { CheckCircle, ChevronLeft } from 'lucide-react';

const today = new Date().toISOString().split('T')[0];
const initialForm = { date: '', time: '', guests: '2', seating: 'Indoor', firstName: '', lastName: '', email: '', phone: '', occasion: 'None' };

export function validateBooking(form) {
  const errors = {};
  if (!form.date) errors.date = 'Please choose a reservation date.';
  else if (form.date < today) errors.date = 'Reservation date cannot be in the past.';
  if (!form.time) errors.time = 'Please choose an available time.';
  const guestCount = Number(form.guests);
  if (!guestCount || guestCount < 1 || guestCount > 10) errors.guests = 'Guests must be between 1 and 10.';
  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!/^[0-9+()\-\s]{7,}$/.test(form.phone)) errors.phone = 'Enter a valid phone number.';
  return errors;
}

function Field({ label, id, error, children }) {
  return <div className="field"><label htmlFor={id}>{label}</label>{children}{error && <p className="error" role="alert">{error}</p>}</div>;
}

export default function App() {
  const [step, setStep] = useState('home');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const times = useMemo(() => ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'], []);
  const update = (key, value) => { setForm(prev => ({ ...prev, [key]: value })); setErrors(prev => ({ ...prev, [key]: undefined })); };
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateBooking(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep('confirmed');
  };

  return <main className="app" aria-label="Little Lemon reservation app">
    {step !== 'home' && step !== 'confirmed' && <button className="back" onClick={() => setStep(step === 'details' ? 'reserve' : 'home')} aria-label="Go back"><ChevronLeft size={18}/> Back</button>}
    {step === 'home' && <section className="screen hero" aria-labelledby="home-title">
      <nav className="topbar" aria-label="Main navigation"><strong>Little Lemon</strong><a href="#menu">Menu</a><a href="#reserve">Reservations</a></nav>
      <div className="hero-card"><div><p className="eyebrow">Chicago</p><h1 id="home-title">Fresh Mediterranean food, made for modern nights out.</h1><p>Reserve a table in less than two minutes with clear availability and instant confirmation.</p><button id="reserve" className="primary" onClick={() => setStep('reserve')}>Reserve a table</button></div><div className="photo" role="img" aria-label="Colorful Little Lemon Mediterranean dish illustration">🍋</div></div>
      <section id="menu" className="menu" aria-label="Popular dishes"><h2>Popular dishes</h2>{['Greek salad', 'Bruschetta', 'Lemon pasta'].map((dish, i) => <article className="dish" key={dish}><div><h3>{dish}</h3><p>Fresh, seasonal Little Lemon favorite.</p></div><span aria-hidden="true">{['🥗','🍅','🍝'][i]}</span></article>)}</section>
    </section>}

    {step === 'reserve' && <section className="screen" aria-labelledby="reserve-title"><h1 id="reserve-title">Reserve a table</h1><p className="sub">Choose your visit details.</p><form className="card" onSubmit={(e)=>{e.preventDefault(); const partial={}; ['date','time','guests'].forEach(k=>{if(validateBooking({...form,firstName:'A',lastName:'B',email:'a@b.com',phone:'1234567'})[k]) partial[k]=validateBooking({...form,firstName:'A',lastName:'B',email:'a@b.com',phone:'1234567'})[k]}); setErrors(partial); if(Object.keys(partial).length===0) setStep('details');}} noValidate>
      <Field label="Date" id="date" error={errors.date}><input id="date" type="date" min={today} value={form.date} onChange={e=>update('date', e.target.value)} aria-invalid={Boolean(errors.date)} /></Field>
      <Field label="Time" id="time" error={errors.time}><select id="time" value={form.time} onChange={e=>update('time', e.target.value)} aria-invalid={Boolean(errors.time)}><option value="">Select a time</option>{times.map(time => <option key={time}>{time}</option>)}</select></Field>
      <Field label="Number of diners" id="guests" error={errors.guests}><input id="guests" type="number" min="1" max="10" value={form.guests} onChange={e=>update('guests', e.target.value)} aria-invalid={Boolean(errors.guests)} /></Field>
      <fieldset><legend>Seating preference</legend><div className="radio-row">{['Indoor','Outdoor'].map(option => <label className={`choice ${form.seating===option?'selected':''}`} key={option}><input type="radio" name="seating" value={option} checked={form.seating===option} onChange={e=>update('seating', e.target.value)} />{option}</label>)}</div></fieldset>
      <button className="primary full" type="submit">Continue</button></form></section>}

    {step === 'details' && <section className="screen" aria-labelledby="details-title"><h1 id="details-title">Your details</h1><p className="sub">We will send your confirmation here.</p><form className="card" onSubmit={submit} noValidate>
      <Field label="First name" id="firstName" error={errors.firstName}><input id="firstName" value={form.firstName} onChange={e=>update('firstName', e.target.value)} aria-invalid={Boolean(errors.firstName)} /></Field>
      <Field label="Last name" id="lastName" error={errors.lastName}><input id="lastName" value={form.lastName} onChange={e=>update('lastName', e.target.value)} aria-invalid={Boolean(errors.lastName)} /></Field>
      <Field label="Email" id="email" error={errors.email}><input id="email" type="email" value={form.email} onChange={e=>update('email', e.target.value)} aria-invalid={Boolean(errors.email)} /></Field>
      <Field label="Phone" id="phone" error={errors.phone}><input id="phone" type="tel" value={form.phone} onChange={e=>update('phone', e.target.value)} aria-invalid={Boolean(errors.phone)} /></Field>
      <Field label="Occasion" id="occasion"><select id="occasion" value={form.occasion} onChange={e=>update('occasion', e.target.value)}><option>None</option><option>Birthday</option><option>Anniversary</option><option>Date night</option></select></Field>
      <aside className="summary" aria-label="Reservation summary">{form.date || 'Date'} • {form.time || 'Time'} • {form.guests} guests • {form.seating}</aside><button className="primary full" type="submit">Confirm reservation</button></form></section>}

    {step === 'confirmed' && <section className="screen confirmation" aria-labelledby="confirmed-title"><CheckCircle size={96} aria-hidden="true"/><h1 id="confirmed-title">Table reserved!</h1><p>{form.firstName || 'Guest'}, your table for {form.guests} is confirmed for {form.date} at {form.time}. A confirmation was sent to {form.email}.</p><button className="primary" onClick={()=>{setForm(initialForm);setStep('home');}}>Back to home</button></section>}
  </main>;
}
