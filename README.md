# Little Lemon Reserve a Table

A responsive React implementation of the Little Lemon mobile reserve-a-table feature. The project follows the UX/UI assignment requirements with a functional booking flow, accessible form labels, validation, meaningful errors, and unit tests.

## Features

- Mobile-first Little Lemon reservation flow
- Home, reservation details, customer details, and confirmation screens
- Functional date, time, guest count, seating, and contact fields
- Validation for required fields, past dates, guest limits, email, and phone
- Accessible semantic HTML, labels, fieldsets, alerts, focus states, and ARIA attributes
- Responsive layout for mobile and desktop
- Unit tests using Vitest and React Testing Library

## Setup

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Tests

```bash
npm run test:run
```

## Build

```bash
npm run build
```

## Git submission

After downloading and unzipping:

```bash
git init
git add .
git commit -m "Build Little Lemon reservation app"
```

Then push to your GitHub repository.

## Project structure

```text
src/
  App.jsx                 Main app, screens, validation, booking flow
  main.jsx                React entry point
  style.css               Responsive styling and accessibility focus states
  __tests__/App.test.jsx  Validation and booking-flow tests
```
