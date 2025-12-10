# eSIM Platform - Complete Sales Platform

A modern, production-ready eSIM sales platform built with Next.js 14, Supabase, Stripe, and Tailwind CSS.

## Features

### Customer Features
- 🌍 Browse eSIM plans by country and region
- 💳 Secure Stripe V3 checkout integration
- 📱 Instant QR code delivery via email
- 👤 User dashboard with order history
- 📊 View and manage eSIMs
- 🔐 Secure authentication with Supabase Auth

### Admin Panel
- 📈 Dashboard with sales analytics
- 📦 Order management
- 🗂️ Plan management (CRUD operations)
- 👥 User management
- 💰 Payment tracking
- 🔔 Webhook logs monitoring

### Technical Features
- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 🗄️ Supabase for database and auth
- 💳 Stripe V3 for payments
- 📧 Email notifications with Nodemailer
- 🔒 Row Level Security (RLS)
- 🎯 TypeScript for type safety

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account
- SMTP server for emails (Gmail, SendGrid, etc.)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Configure Environment Variables

Edit `.env.local` with your credentials. See `SETUP.md` for detailed instructions.

### 4. Create Admin User

Follow the step-by-step instructions in `SETUP.md` to create your first admin user.

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Quick Links

- **Frontend**: http://localhost:3000
- **Plans**: http://localhost:3000/plans
- **Dashboard**: http://localhost:3000/dashboard
- **Admin Panel**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login

## Documentation

- `README.md` - This file (overview and installation)
- `SETUP.md` - Detailed setup instructions
- `.env.example` - Environment variables template

## Project Structure

```
esim-platform/
├── app/                       # Next.js app directory
│   ├── api/                  # API routes
│   ├── admin/                # Admin panel
│   ├── dashboard/            # User dashboard
│   ├── plans/                # Plans pages
│   └── ...
├── components/               # React components
├── lib/                      # Utilities and services
├── types/                    # TypeScript types
└── middleware.ts            # Route protection
```

## Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe V3
- **Styling**: Tailwind CSS
- **Email**: Nodemailer
- **Language**: TypeScript

## Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Supabase Auth for authentication
- ✅ Stripe webhook signature verification
- ✅ Secure password hashing
- ✅ Protected admin routes

## Support

For detailed setup instructions, see `SETUP.md`.

For troubleshooting, check the README sections on common issues.

## License

MIT License
