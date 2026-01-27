# SeknuTo.cz - Product Requirements Document

## Original Problem Statement
Create a modern, minimalist website for SeknuTo.cz - a local lawn care service from Dvůr Králové, Czech Republic. The site must be simple, fast, and conversion-focused with an integrated booking system.

## Architecture
- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + MongoDB
- **Email**: Resend (configured and working)

## User Personas
1. **Homeowner** - Needs regular lawn maintenance
2. **Property Manager** - Manages multiple properties
3. **First-time Customer** - Looking for one-time service

## Core Requirements
- Multi-page website (Homepage, Services, Pricing, Booking, About, Contact)
- 5-step booking wizard with dynamic price calculation
- Newsletter popup with 5% coupon
- WhatsApp integration (730 588 372)
- Email notifications (Resend)
- Czech language throughout

---

## What's Been Implemented (January 2026)

### Completed Features ✅
- **All 6 pages functional** (Homepage, Services, Pricing, Booking, About, Contact)
- **5-step booking wizard** with:
  - Service/package selection (basic services + seasonal packages)
  - Property details with dynamic price calculation
  - Calendar date picker (excludes Sundays)
  - Contact information with coupon validation
  - Confirmation page
- **Newsletter popup** - appears immediately, 5% coupon generation
- **Email templates** - Customer confirmation + Admin notification
- **Resend integration** - API key configured, emails working
- **Google Analytics component** - ready (needs GA_ID)
- **WhatsApp floating button**
- **Responsive design** - mobile-friendly

### Backend APIs ✅
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings` - List all bookings
- `POST /api/pricing/calculate` - Dynamic price calculation
- `GET /api/availability` - Available dates (next 30 days, no Sundays)
- `POST /api/subscribe` - Newsletter subscription + coupon generation
- `POST /api/coupons/validate` - Coupon validation
- `POST /api/contact` - Contact form submission

### Testing Status ✅
- Backend: 26/26 tests passing (pytest)
- Frontend: All features verified via Playwright
- Last test report: `/app/test_reports/iteration_7.json`

---

## Configuration Needed (User Action Required)

### Required for full functionality:
| Variable | File | Purpose | Status |
|----------|------|---------|--------|
| `ADMIN_EMAIL` | backend/.env | Receive booking notifications | ⏳ Waiting |
| `REACT_APP_GA_ID` | frontend/.env | Google Analytics tracking | ⏳ Waiting |
| `RESEND_AUDIENCE_ID` | backend/.env | Newsletter contact management | ⏳ Optional |

### Already Configured:
| Variable | Status |
|----------|--------|
| `RESEND_API_KEY` | ✅ Working |
| `SENDER_EMAIL` | ✅ onboarding@resend.dev |
| `MONGO_URL` | ✅ Connected |

---

## Prioritized Backlog

### P0 (Critical for launch)
- [x] All pages functional
- [x] Booking flow complete
- [x] Email notifications working
- [ ] **Google Calendar Integration** - `addToCalendar` is placeholder, needs API credentials

### P1 (Important)
- [ ] Configure admin email for notifications
- [ ] Configure Google Analytics ID
- [ ] GDPR/Privacy policy page
- [ ] Customer testimonials section

### P2 (Nice to have)
- [ ] Admin dashboard for managing bookings
- [ ] Photo gallery of completed work
- [ ] Images on services page
- [ ] Blog for gardening tips
- [ ] Seasonal promotions

### Future (V2)
- [ ] Customer portal with booking history
- [ ] Online payment integration
- [ ] SMS notifications via Twilio

---

## Technical Notes

### File Structure
```
/app/
├── backend/
│   ├── .env              # API keys, MongoDB URL
│   ├── requirements.txt  # Python dependencies
│   ├── server.py         # All API routes and logic
│   └── tests/            # Pytest test files
├── frontend/
│   ├── .env              # REACT_APP_BACKEND_URL
│   ├── src/
│   │   ├── App.js        # Router + layout
│   │   ├── components/   # Reusable components
│   │   └── pages/        # Page components
└── memory/
    └── PRD.md            # This file
```

### Key Files
- `/app/backend/server.py` - All backend logic (593 lines)
- `/app/frontend/src/pages/BookingPage.jsx` - Booking form (1122 lines)
- `/app/frontend/src/components/EmailPopup.jsx` - Newsletter popup
- `/app/frontend/src/components/GoogleAnalytics.jsx` - GA tracking

### Known Mocked/Placeholder Code
- `addToCalendar()` in server.py - Google Calendar integration not implemented

---

## Changelog

### 2026-01-27
- Verified all features working (100% test pass rate)
- Confirmed newsletter popup appears immediately
- Confirmed Resend email integration working
- Google Analytics component ready (needs GA_ID)

### Previous Sessions
- Full application built with React + FastAPI + MongoDB
- 5-step booking form implemented
- Newsletter popup with coupon system
- Resend email templates created
- Design improvements for contrast and mobile
