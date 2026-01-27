# SeknuTo.cz - Product Requirements Document

## Original Problem Statement
Create a modern, minimalist website for SeknuTo.cz - a local lawn care service from Dvůr Králové, Czech Republic. The site must be simple, fast, and conversion-focused with an integrated booking system.

## Architecture
- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + MongoDB
- **Email**: Resend (contacts + email sending)

---

## What's Been Implemented (January 2026)

### Completed Features ✅
- **All 6 pages functional** (Homepage, Services, Pricing, Booking, About, Contact)
- **5-step booking wizard** with:
  - **Collapsible sections** - Basic services, Seasonal packages, Other
  - Service/package selection with visual feedback
  - Property details with dynamic price calculation
  - Calendar date picker (excludes Sundays)
  - Contact form with coupon validation
  - Confirmation page
- **Viewport-optimized design** - Booking form fits in one screen
- **Newsletter popup** - appears immediately, 5% coupon generation
- **Resend integration**:
  - ✅ Email sending (booking confirmations, coupons)
  - ✅ Contacts API (booking emails saved to contacts)
- **Google Analytics component** - ready (needs GA_ID)
- **WhatsApp floating button**
- **Responsive design** - mobile-friendly

### Backend APIs ✅
- `POST /api/bookings` - Create booking + add to Resend Contacts
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/pricing/calculate` - Dynamic price calculation
- `GET /api/availability` - Available dates
- `POST /api/subscribe` - Newsletter subscription + coupon
- `POST /api/coupons/validate` - Coupon validation
- `POST /api/contact` - Contact form

### Testing Status ✅
- Backend: 26/26 tests passing (pytest)
- Frontend: All features verified via Playwright
- Latest test report: `/app/test_reports/iteration_8.json`

---

## Configuration Needed

| Variable | File | Status |
|----------|------|--------|
| `RESEND_API_KEY` | backend/.env | ✅ Configured |
| `ADMIN_EMAIL` | backend/.env | ⏳ Waiting for user |
| `REACT_APP_GA_ID` | frontend/.env | ⏳ Waiting for user |

---

## Prioritized Backlog

### P0 (Critical)
- [x] Booking flow complete
- [x] Collapsible sections in booking form
- [x] Emails saved to Resend Contacts
- [ ] **Google Calendar Integration** - placeholder only

### P1 (Important)
- [ ] Configure admin email
- [ ] Configure Google Analytics
- [ ] Customer testimonials section

### P2 (Nice to have)
- [ ] Admin dashboard
- [ ] Photo gallery
- [ ] Blog

---

## Key Files
- `/app/backend/server.py` - All backend logic
- `/app/frontend/src/pages/BookingPage.jsx` - Booking form with collapsible sections
- `/app/frontend/src/components/EmailPopup.jsx` - Newsletter popup

## Mocked/Placeholder Code
- `addToCalendar()` in server.py - Google Calendar not implemented

---

## Changelog

### 2026-01-27 (Latest)
- Rewrote BookingPage.jsx with collapsible sections
- Fixed Resend Contacts integration (emails from bookings now saved)
- All tests passing (iteration_8.json)

### Previous
- Full application built
- Newsletter popup with coupon system
- Email templates created
