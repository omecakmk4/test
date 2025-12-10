# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies (Already Done)
```bash
cd esim-platform
npm install
```

### 2. Environment Variables

The \`.env.local\` file has been pre-configured with Supabase credentials. You need to add:

#### Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your publishable key and secret key
3. Update these in \`.env.local\`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key
   STRIPE_SECRET_KEY=sk_test_your_actual_key
   ```

#### Email Configuration (For Gmail)
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update \`.env.local\`:
   ```env
   SMTP_USER=your.email@gmail.com
   SMTP_PASSWORD=your_16_character_app_password
   ```

### 3. Create Admin User

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/register

3. Register with:
   - Email: admin@esimplatform.com
   - Password: admin123456
   - Name: Admin User

4. After registration, you'll be redirected to login. **Don't login yet!**

5. Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to "Authentication" → "Users"
   - Find your newly registered user
   - Copy the User ID (UUID)

6. Go to "SQL Editor"
   - Run this query (replace USER_ID with your copied UUID):
   ```sql
   INSERT INTO admin_users (user_id, role, is_active)
   VALUES ('YOUR_USER_ID_HERE', 'superadmin', true);
   ```

7. Now you can login at http://localhost:3000/login

8. Access admin panel at http://localhost:3000/admin

### 4. Setup Stripe Webhooks (For Testing)

#### Option A: Use Stripe CLI (Recommended for Development)
```bash
# Install Stripe CLI
# Mac: brew install stripe/stripe-cli/stripe
# Windows: Download from https://github.com/stripe/stripe-cli/releases

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Copy the webhook secret (starts with \`whsec_\`) and add to \`.env.local\`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

#### Option B: Skip Webhooks for Now
You can test the platform without webhooks, but orders won't be auto-completed. You can manually test the flow.

### 5. Test the Application

1. **Browse Plans**: Visit http://localhost:3000/plans
2. **Test Purchase**: Click on a plan
3. **Use Test Card**: Use Stripe test card:
   - Card: 4242 4242 4242 4242
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

4. **Check Email**: Email will be logged to console if SMTP not configured
5. **View Dashboard**: Check your orders at http://localhost:3000/dashboard
6. **Admin Panel**: View order in admin at http://localhost:3000/admin

## Quick Test Without Full Setup

If you want to quickly see the platform without setting up Stripe and Email:

1. Start dev server: \`npm run dev\`
2. Browse plans: http://localhost:3000/plans
3. View how-it-works: http://localhost:3000/how-it-works
4. See the UI and navigation

Note: Payment and email features won't work without proper configuration.

## Common Issues

### "No plans found"
- Plans were automatically added to the database
- Check Supabase dashboard → Table Editor → plans table

### "Cannot access admin panel"
- Make sure you created the admin_users entry
- Verify the user_id matches your authenticated user
- Check is_active is true

### "Email not sending"
- Emails will be logged to console if SMTP not configured
- For production, configure SMTP properly

### "Stripe webhook error"
- Make sure Stripe CLI is running
- Verify STRIPE_WEBHOOK_SECRET is correct
- Check webhook logs at http://localhost:3000/admin/webhooks

## Production Deployment Checklist

- [ ] Get production Stripe keys
- [ ] Configure production email service
- [ ] Set up Stripe production webhooks
- [ ] Update NEXT_PUBLIC_APP_URL
- [ ] Enable Supabase production mode
- [ ] Configure custom domain
- [ ] Test all payment flows
- [ ] Monitor webhook logs

## Need Help?

Check these resources:
- README.md - Full documentation
- Supabase Dashboard - Database and auth logs
- Stripe Dashboard - Payment logs
- Admin Panel - Webhook logs at /admin/webhooks
