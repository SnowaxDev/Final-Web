# SeknuTo.cz - Product Requirements Document

## Original Problem Statement
Create a modern, minimalist website for SeknuTo.cz - a local lawn care service from Dvůr Králové, Czech Republic. The site must be simple, fast, and conversion-focused with an integrated booking system.

## Architecture
- **Frontend**: React + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + MongoDB
- **Email**: Resend (ready for configuration)

## User Personas
1. **Homeowner** - Needs regular lawn maintenance
2. **Property Manager** - Manages multiple properties
3. **First-time Customer** - Looking for one-time service

## Core Requirements (Static)
- Multi-page website (Homepage, Services, Pricing, Booking, About, Contact)
- 5-step booking wizard
- Price calculator
- WhatsApp integration (730 588 372)
- Email notifications (Resend)
- Czech language throughout

## What's Been Implemented (January 2026)
- ✅ Complete frontend with 6 pages
- ✅ Header with navigation and mobile menu
- ✅ Footer with contact info and links
- ✅ Hero section with stats card
- ✅ Services overview with 6 service types
- ✅ Pricing page with calculator
- ✅ 5-step booking wizard with date picker
- ✅ Contact form with validation
- ✅ WhatsApp floating button
- ✅ FAQ accordion
- ✅ Backend API: bookings CRUD, pricing calculator, contact form
- ✅ MongoDB integration for data persistence
- ✅ Email templates ready (Resend integration prepared)

## Prioritized Backlog

### P0 (Critical for launch)
- ✅ All pages functional
- ✅ Booking flow complete
- ⏳ Configure Resend API key for email notifications

### P1 (Important)
- GDPR/Privacy policy page
- Admin dashboard for managing bookings
- SMS notifications via Twilio

### P2 (Nice to have)
- Customer reviews/testimonials
- Photo gallery of completed work
- Blog for gardening tips
- Seasonal promotions

## Next Tasks
1. Add RESEND_API_KEY to backend/.env for email notifications
2. Create privacy policy and terms pages
3. Add admin dashboard for booking management
4. Implement Google Analytics tracking
