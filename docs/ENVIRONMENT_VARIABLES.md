# ENVIRONMENT_VARIABLES.md - Environment Configuration Guide

## Overview

This document defines all environment variables required for Toolsail development and production. Environment variables are loaded from `.env.local` (development) and configured in Cloudflare (production).

**File Structure:**
- `.env.local` - Development environment (Git-ignored)
- `.env.example` - Template for all variables (Git-tracked)
- Cloudflare Secrets - Production environment (via `wrangler.toml`)

---

## 1. Environment Variables Reference

### 1.1 Next.js Core Configuration

#### `NEXT_PUBLIC_APP_NAME`
- **Type:** String
- **Required:** Yes
- **Description:** Application name for branding
- **Development:** `Toolsail`
- **Production:** `Toolsail`

#### `NEXT_PUBLIC_BASE_URL`
- **Type:** URL
- **Required:** Yes
- **Description:** Public-facing base URL for API and links
- **Development:** `http://localhost:3000`
- **Production:** `https://toolsail.top`
- **Note:** Must include protocol, no trailing slash

#### `NEXT_PUBLIC_API_BASE_URL`
- **Type:** URL
- **Required:** Yes
- **Description:** Base URL for API requests from frontend
- **Development:** `http://localhost:3000/api`
- **Production:** `https://toolsail.top/api`

#### `NODE_ENV`
- **Type:** String (`development` | `production` | `test`)
- **Required:** Yes
- **Description:** Next.js environment mode
- **Development:** `development`
- **Production:** `production`
- **Auto-set:** Usually auto-set by Next.js, but can override

#### `NEXT_PUBLIC_LOG_LEVEL`
- **Type:** String (`debug` | `info` | `warn` | `error`)
- **Required:** No
- **Description:** Client-side logging verbosity
- **Development:** `debug`
- **Production:** `warn`

---

### 1.2 Database Configuration (Cloudflare D1)

#### `DATABASE_URL`
- **Type:** String
- **Required:** Yes
- **Description:** D1 database connection string
- **Development:** `file:./dev.db` (local SQLite)
- **Production:** Configured in `wrangler.toml` binding
- **Format:** `file://path/to/database.db` or Cloudflare binding reference

#### `D1_DATABASE_ID`
- **Type:** String (UUID)
- **Required:** Yes (production only)
- **Description:** Cloudflare D1 database ID
- **Development:** Not needed (use local SQLite)
- **Production:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Source:** Get from `wrangler d1 list` output

#### `CLOUDFLARE_ACCOUNT_ID`
- **Type:** String
- **Required:** Yes (production/deployment)
- **Description:** Cloudflare account ID for authentication
- **Development:** Not needed (local development)
- **Production:** From Cloudflare dashboard
- **File:** Usually in `wrangler.toml`

#### `CLOUDFLARE_API_TOKEN`
- **Type:** String (sensitive)
- **Required:** Yes (for Wrangler deployment)
- **Description:** Cloudflare API token for CLI operations
- **Development:** Not needed (local development)
- **Production:** Generate in Cloudflare dashboard
- **Scope:** Include "D1 Edit" permission

---

### 1.3 Authentication (Better Auth)

#### `BETTER_AUTH_SECRET`
- **Type:** String (64+ characters, cryptographic)
- **Required:** Yes
- **Description:** Secret key for encrypting Better Auth sessions
- **Development:** Generate: `openssl rand -base64 32`
- **Production:** Strong random 64+ char string
- **Security:** Never share, rotate periodically

#### `BETTER_AUTH_URL`
- **Type:** URL
- **Required:** Yes
- **Description:** URL where Better Auth endpoints are hosted
- **Development:** `http://localhost:3000`
- **Production:** `https://toolsail.top`

#### `BETTER_AUTH_SOCIAL_GOOGLE_ID`
- **Type:** String
- **Required:** No (optional, for Google OAuth)
- **Description:** Google OAuth 2.0 Client ID
- **Source:** Google Cloud Console OAuth 2.0 credentials
- **Development:** Optional, test without OAuth
- **Production:** Required for production deployment

#### `BETTER_AUTH_SOCIAL_GOOGLE_SECRET`
- **Type:** String (sensitive)
- **Required:** No (optional)
- **Description:** Google OAuth 2.0 Client Secret
- **Source:** Google Cloud Console
- **Security:** Never commit, use secrets management

#### `BETTER_AUTH_SOCIAL_GITHUB_ID`
- **Type:** String
- **Required:** No (optional)
- **Description:** GitHub OAuth App Client ID
- **Source:** GitHub Developer Settings

#### `BETTER_AUTH_SOCIAL_GITHUB_SECRET`
- **Type:** String (sensitive)
- **Required:** No (optional)
- **Description:** GitHub OAuth App Client Secret
- **Source:** GitHub Developer Settings
- **Security:** Never commit

#### `BETTER_AUTH_SESSION_EXPIRES_IN`
- **Type:** Number
- **Required:** No
- **Description:** Session cookie expiration in seconds
- **Default:** `2592000` (30 days)
- **Development:** `2592000`
- **Production:** `2592000`

#### `BETTER_AUTH_REFRESH_TOKEN_EXPIRES_IN`
- **Type:** Number
- **Required:** No
- **Description:** Refresh token expiration in seconds
- **Default:** `7776000` (90 days)
- **Development:** `7776000`
- **Production:** `7776000`

---

### 1.4 Email Configuration (SendGrid/Resend)

#### `EMAIL_PROVIDER`
- **Type:** String (`sendgrid` | `resend` | `smtp`)
- **Required:** Yes
- **Description:** Email service provider
- **Development:** `resend` (free tier available)
- **Production:** `resend` (recommended) or `sendgrid`

#### `RESEND_API_KEY`
- **Type:** String (sensitive)
- **Required:** If using Resend
- **Description:** Resend.com API key
- **Source:** Resend dashboard
- **Security:** Never commit

#### `SENDGRID_API_KEY`
- **Type:** String (sensitive)
- **Required:** If using SendGrid
- **Description:** SendGrid API key
- **Source:** SendGrid dashboard (Settings > API Keys)
- **Security:** Never commit

#### `SMTP_HOST`
- **Type:** String
- **Required:** If using SMTP
- **Description:** SMTP server hostname
- **Example:** `smtp.gmail.com` or `smtp.office365.com`

#### `SMTP_PORT`
- **Type:** Number
- **Required:** If using SMTP
- **Description:** SMTP server port
- **Development:** `587` (TLS) or `465` (SSL)
- **Production:** `587` (TLS)

#### `SMTP_USER`
- **Type:** String (email)
- **Required:** If using SMTP
- **Description:** SMTP login email
- **Example:** `contact@toolsail.top`

#### `SMTP_PASSWORD`
- **Type:** String (sensitive)
- **Required:** If using SMTP
- **Description:** SMTP password or app-specific password
- **Security:** Never commit

#### `SMTP_FROM_NAME`
- **Type:** String
- **Required:** If using SMTP
- **Description:** Sender display name
- **Development:** `Toolsail Team`
- **Production:** `Toolsail Team`

#### `SMTP_FROM_EMAIL`
- **Type:** String (email)
- **Required:** If using SMTP or Resend/SendGrid
- **Description:** Sender email address
- **Development:** `noreply@toolsail.top`
- **Production:** `noreply@toolsail.top`

#### `EMAIL_SUPPORT_ADDRESS`
- **Type:** String (email)
- **Required:** Yes
- **Description:** Support email address
- **Development:** `support@toolsail.top`
- **Production:** `support@toolsail.top`

#### `EMAIL_CONTACT_ADDRESS`
- **Type:** String (email)
- **Required:** Yes
- **Description:** General contact email
- **Development:** `contact@toolsail.top`
- **Production:** `contact@toolsail.top`

---

### 1.5 Internationalization (i18n)

#### `NEXT_PUBLIC_DEFAULT_LOCALE`
- **Type:** String (`en` | `zh`)
- **Required:** Yes
- **Description:** Default language for the application
- **Development:** `en`
- **Production:** `en`

#### `NEXT_PUBLIC_LOCALES`
- **Type:** String (comma-separated)
- **Required:** Yes
- **Description:** Supported locales
- **Value:** `en,zh`
- **Note:** Used by next-intl for locale configuration

---

### 1.6 Theme Configuration (next-themes)

#### `NEXT_PUBLIC_DEFAULT_THEME`
- **Type:** String (`light` | `dark`)
- **Required:** No
- **Description:** Default color theme
- **Development:** `light`
- **Production:** `light`
- **Note:** Users can override via UI toggle

#### `NEXT_PUBLIC_THEME_COLORS`
- **Type:** JSON string (optional)
- **Required:** No
- **Description:** Custom theme color overrides
- **Example:** `{"primary":"#000000","accent":"#FFFFFF"}`

---

### 1.7 Search & Analytics (Optional)

#### `NEXT_PUBLIC_ANALYTICS_ID`
- **Type:** String
- **Required:** No
- **Description:** Google Analytics Measurement ID
- **Format:** `G-XXXXXXXXXX`
- **Source:** Google Analytics dashboard

#### `NEXT_PUBLIC_SENTRY_DSN`
- **Type:** URL
- **Required:** No
- **Description:** Sentry error tracking DSN
- **Source:** Sentry.io project dashboard
- **Development:** Optional
- **Production:** Recommended for error tracking

---

### 1.8 Google AdSense Configuration

#### `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- **Type:** String
- **Required:** No (optional for monetization)
- **Description:** Google AdSense publisher ID
- **Format:** `ca-pub-xxxxxxxxxxxxxxxx`
- **Source:** Google AdSense account
- **Development:** Optional (testing without ads)
- **Production:** Required for monetization

#### `ADSENSE_SLOT_IDS`
- **Type:** JSON string (optional)
- **Required:** No
- **Description:** Ad unit IDs for different placements
- **Example:** `{"sidebar":"1234567890","content":"0987654321"}`

---

### 1.9 Payment Configuration (Stripe/PayPal)

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Type:** String
- **Required:** No (if using Stripe)
- **Description:** Stripe publishable key (client-side)
- **Format:** `pk_test_...` (development) or `pk_live_...` (production)
- **Source:** Stripe dashboard > API Keys
- **Note:** Safe to expose (starts with `pk_`)

#### `STRIPE_SECRET_KEY`
- **Type:** String (sensitive)
- **Required:** No (if using Stripe)
- **Description:** Stripe secret key (server-side)
- **Format:** `sk_test_...` (development) or `sk_live_...` (production)
- **Source:** Stripe dashboard > API Keys
- **Security:** Never expose to frontend

#### `STRIPE_WEBHOOK_SECRET`
- **Type:** String (sensitive)
- **Required:** No (if using Stripe)
- **Description:** Stripe webhook endpoint secret
- **Source:** Stripe dashboard > Webhooks
- **Security:** Never commit

#### `PAYPAL_CLIENT_ID`
- **Type:** String
- **Required:** No (if using PayPal)
- **Description:** PayPal application client ID
- **Source:** PayPal Developer dashboard

#### `PAYPAL_SECRET`
- **Type:** String (sensitive)
- **Required:** No (if using PayPal)
- **Description:** PayPal application secret
- **Source:** PayPal Developer dashboard
- **Security:** Never expose

---

### 1.10 File Upload Configuration

#### `MAX_FILE_SIZE`
- **Type:** Number (bytes)
- **Required:** No
- **Description:** Maximum file upload size
- **Default:** `5242880` (5MB)
- **Development:** `5242880`
- **Production:** `5242880`

#### `ALLOWED_UPLOAD_TYPES`
- **Type:** String (comma-separated MIME types)
- **Required:** No
- **Description:** Allowed file types for upload
- **Value:** `image/png,image/jpeg,image/webp,image/svg+xml,text/csv`

#### `NEXT_PUBLIC_UPLOAD_URL`
- **Type:** URL
- **Required:** No
- **Description:** Public URL for uploaded files
- **Development:** `http://localhost:3000/uploads`
- **Production:** `https://toolsail.top/uploads` or CDN URL

---

### 1.11 Security & CORS

#### `NEXT_PUBLIC_ALLOWED_ORIGINS`
- **Type:** String (comma-separated URLs)
- **Required:** No
- **Description:** Allowed origins for CORS
- **Development:** `http://localhost:3000,http://localhost:3001`
- **Production:** `https://toolsail.top`

#### `RATE_LIMIT_WINDOW_MS`
- **Type:** Number (milliseconds)
- **Required:** No
- **Description:** Rate limit time window
- **Default:** `60000` (1 minute)

#### `RATE_LIMIT_MAX_REQUESTS`
- **Type:** Number
- **Required:** No
- **Description:** Max requests per window
- **Default:** `100` (per IP)

#### `JWT_ALGORITHM`
- **Type:** String (`HS256` | `RS256`)
- **Required:** No
- **Description:** JWT signing algorithm
- **Default:** `HS256`
- **Development:** `HS256`
- **Production:** `HS256` or `RS256` (for RS256, needs keys)

---

### 1.12 Logging & Monitoring

#### `LOG_LEVEL`
- **Type:** String (`debug` | `info` | `warn` | `error`)
- **Required:** No
- **Description:** Server-side logging verbosity
- **Development:** `debug`
- **Production:** `info`

#### `ENABLE_REQUEST_LOGGING`
- **Type:** Boolean (`true` | `false`)
- **Required:** No
- **Description:** Log HTTP requests
- **Development:** `true`
- **Production:** `false` (performance)

#### `DATABASE_QUERY_LOGGING`
- **Type:** Boolean (`true` | `false`)
- **Required:** No
- **Description:** Log database queries (development)
- **Development:** `true`
- **Production:** `false`

---

### 1.13 Cloudflare Workers Configuration

#### `WRANGLER_ENV`
- **Type:** String (`development` | `production`)
- **Required:** No
- **Description:** Wrangler environment
- **Development:** `development`
- **Production:** `production`

#### `WORKERS_ACCOUNT_ID`
- **Type:** String
- **Required:** Yes (in wrangler.toml)
- **Description:** Cloudflare Workers account ID
- **Source:** Cloudflare dashboard

#### `WORKERS_API_TOKEN`
- **Type:** String (sensitive)
- **Required:** Yes (for deployment)
- **Description:** Cloudflare API token for Wrangler
- **Scope:** "Workers Scripts Write" permission

---

### 1.14 SEO & Metadata

#### `NEXT_PUBLIC_SITE_TITLE`
- **Type:** String
- **Required:** No
- **Description:** Site title for SEO
- **Value:** `Toolsail - Best AI & Digital Tools Directory`

#### `NEXT_PUBLIC_SITE_DESCRIPTION`
- **Type:** String
- **Required:** No
- **Description:** Site meta description
- **Value:** `Discover the best AI tools and digital tools for your workflow`

#### `NEXT_PUBLIC_SITE_KEYWORDS`
- **Type:** String (comma-separated)
- **Required:** No
- **Description:** Site meta keywords
- **Value:** `ai tools, digital tools, directory, product discovery`

#### `NEXT_PUBLIC_OG_IMAGE`
- **Type:** URL
- **Required:** No
- **Description:** Open Graph image URL
- **Example:** `https://toolsail.top/og-image.jpg`

---

### 1.15 Feature Flags

#### `NEXT_PUBLIC_FEATURE_GOOGLE_OAUTH`
- **Type:** Boolean (`true` | `false`)
- **Required:** No
- **Description:** Enable Google OAuth login
- **Development:** `false` (unless testing)
- **Production:** `true`

#### `NEXT_PUBLIC_FEATURE_GITHUB_OAUTH`
- **Type:** Boolean (`true` | `false`)
- **Required:** No
- **Description:** Enable GitHub OAuth login
- **Development:** `false`
- **Production:** `true` (optional)

#### `NEXT_PUBLIC_FEATURE_STRIPE_PAYMENTS`
- **Type:** Boolean (`true` | `false`)
- **Required:** No
- **Description:** Enable Stripe payments for promotions
- **Development:** `false`
- **Production:** `true`

#### `NEXT_PUBLIC_FEATURE_PAYPAL_PAYMENTS`
- **Type:** Boolean (`true` | `false`)
- **Required:** No
- **Description:** Enable PayPal payments
- **Development:** `false`
- **Production:** `true` (optional)

#### `NEXT_PUBLIC_FEATURE_EMAIL_VERIFICATION`
- **Type:** Boolean (`true` | `false`)
- **Required:** No
- **Description:** Require email verification for submissions
- **Development:** `false` (for testing)
- **Production:** `true`

---

## 2. Environment-Specific Configurations

### 2.1 Development Environment (.env.local)

**Characteristics:**
- Local SQLite database
- Relaxed security constraints
- Verbose logging
- Feature flags disabled (except for testing)
- Test OAuth credentials (optional)

**Setup Steps:**
```bash
# 1. Copy template
cp .env.example .env.local

# 2. Generate secrets
openssl rand -base64 32  # for BETTER_AUTH_SECRET

# 3. Initialize local database
npm run db:setup
```

---

### 2.2 Production Environment

**Characteristics:**
- Cloudflare D1 database
- Strict security (HTTPS only)
- Minimal logging
- All features enabled
- Real OAuth credentials
- Real payment credentials

**Setup via Wrangler:**
```bash
# Store in Cloudflare Secrets
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put SENDGRID_API_KEY
# ... other secrets
```

---

## 3. .env.example Template

```bash
# ============================================
# Next.js Core Configuration
# ============================================
NEXT_PUBLIC_APP_NAME=Toolsail
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
NEXT_PUBLIC_LOG_LEVEL=debug

# ============================================
# Database Configuration (Cloudflare D1)
# ============================================
DATABASE_URL=file:./dev.db
# D1_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  # Production only
# CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Production only
# CLOUDFLARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Production only

# ============================================
# Authentication (Better Auth)
# ============================================
BETTER_AUTH_SECRET=your_super_secret_key_here_min_32_chars
BETTER_AUTH_URL=http://localhost:3000
# BETTER_AUTH_SOCIAL_GOOGLE_ID=your_google_client_id
# BETTER_AUTH_SOCIAL_GOOGLE_SECRET=your_google_client_secret
# BETTER_AUTH_SOCIAL_GITHUB_ID=your_github_client_id
# BETTER_AUTH_SOCIAL_GITHUB_SECRET=your_github_client_secret
BETTER_AUTH_SESSION_EXPIRES_IN=2592000
BETTER_AUTH_REFRESH_TOKEN_EXPIRES_IN=7776000

# ============================================
# Email Configuration
# ============================================
EMAIL_PROVIDER=resend
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASSWORD=your_app_specific_password
# SMTP_FROM_NAME=Toolsail Team
SMTP_FROM_EMAIL=noreply@toolsail.top
EMAIL_SUPPORT_ADDRESS=support@toolsail.top
EMAIL_CONTACT_ADDRESS=contact@toolsail.top

# ============================================
# Internationalization (i18n)
# ============================================
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_LOCALES=en,zh

# ============================================
# Theme Configuration
# ============================================
NEXT_PUBLIC_DEFAULT_THEME=light
# NEXT_PUBLIC_THEME_COLORS={"primary":"#000000","accent":"#FFFFFF"}

# ============================================
# Analytics & Error Tracking
# ============================================
# NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/123456

# ============================================
# Google AdSense
# ============================================
# NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
# ADSENSE_SLOT_IDS={"sidebar":"1234567890","content":"0987654321"}

# ============================================
# Payment Configuration
# ============================================
# Stripe
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
# STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# PayPal
# PAYPAL_CLIENT_ID=AexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxD
# PAYPAL_SECRET=EQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# File Upload Configuration
# ============================================
MAX_FILE_SIZE=5242880
ALLOWED_UPLOAD_TYPES=image/png,image/jpeg,image/webp,image/svg+xml,text/csv
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3000/uploads

# ============================================
# Security & CORS
# ============================================
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
JWT_ALGORITHM=HS256

# ============================================
# Logging & Monitoring
# ============================================
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true
DATABASE_QUERY_LOGGING=true

# ============================================
# Cloudflare Workers Configuration
# ============================================
WRANGLER_ENV=development
# WORKERS_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# WORKERS_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# SEO & Metadata
# ============================================
NEXT_PUBLIC_SITE_TITLE=Toolsail - Best AI & Digital Tools Directory
NEXT_PUBLIC_SITE_DESCRIPTION=Discover the best AI tools and digital tools for your workflow
NEXT_PUBLIC_SITE_KEYWORDS=ai tools, digital tools, directory, product discovery
# NEXT_PUBLIC_OG_IMAGE=https://toolsail.top/og-image.jpg

# ============================================
# Feature Flags
# ============================================
NEXT_PUBLIC_FEATURE_GOOGLE_OAUTH=false
NEXT_PUBLIC_FEATURE_GITHUB_OAUTH=false
NEXT_PUBLIC_FEATURE_STRIPE_PAYMENTS=false
NEXT_PUBLIC_FEATURE_PAYPAL_PAYMENTS=false
NEXT_PUBLIC_FEATURE_EMAIL_VERIFICATION=false
```

---

## 4. Production Environment Values Example

```bash
# ============================================
# Next.js Core Configuration
# ============================================
NEXT_PUBLIC_APP_NAME=Toolsail
NEXT_PUBLIC_BASE_URL=https://toolsail.top
NEXT_PUBLIC_API_BASE_URL=https://toolsail.top/api
NODE_ENV=production
NEXT_PUBLIC_LOG_LEVEL=warn

# ============================================
# Database Configuration (Cloudflare D1)
# ============================================
# DATABASE_URL is configured in wrangler.toml as a binding
D1_DATABASE_ID=abc12345-67cd-89ef-0123-456789abcdef
CLOUDFLARE_ACCOUNT_ID=abc1234567890def1234567890abcdef
CLOUDFLARE_API_TOKEN=v1.c3f1234567890abc1234567890abcdef1234567890

# ============================================
# Authentication (Better Auth)
# ============================================
BETTER_AUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx
BETTER_AUTH_URL=https://toolsail.top
BETTER_AUTH_SOCIAL_GOOGLE_ID=123456789-abc1234567890def1234567890ab.apps.googleusercontent.com
BETTER_AUTH_SOCIAL_GOOGLE_SECRET=GOCSPX-abc1234567890def12345
BETTER_AUTH_SOCIAL_GITHUB_ID=Iv1.abc1234567890def
BETTER_AUTH_SOCIAL_GITHUB_SECRET=abc123def456ghi789jkl012mno345pqr
BETTER_AUTH_SESSION_EXPIRES_IN=2592000
BETTER_AUTH_REFRESH_TOKEN_EXPIRES_IN=7776000

# ============================================
# Email Configuration
# ============================================
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_abc123def456ghi789jkl012mno3456
SMTP_FROM_EMAIL=noreply@toolsail.top
EMAIL_SUPPORT_ADDRESS=support@toolsail.top
EMAIL_CONTACT_ADDRESS=contact@toolsail.top

# ============================================
# Internationalization (i18n)
# ============================================
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_LOCALES=en,zh

# ============================================
# Theme Configuration
# ============================================
NEXT_PUBLIC_DEFAULT_THEME=light

# ============================================
# Analytics & Error Tracking
# ============================================
NEXT_PUBLIC_ANALYTICS_ID=G-ABC1234XYZ
NEXT_PUBLIC_SENTRY_DSN=https://abc123def456@sentry.io/123456789

# ============================================
# Google AdSense
# ============================================
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-abc123def456ghi7
ADSENSE_SLOT_IDS={"sidebar":"1234567890","homepage":"0987654321","detail":"1122334455"}

# ============================================
# Payment Configuration
# ============================================
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_SECRET=your_paypal_secret_here

# ============================================
# File Upload Configuration
# ============================================
MAX_FILE_SIZE=5242880
ALLOWED_UPLOAD_TYPES=image/png,image/jpeg,image/webp,image/svg+xml,text/csv
NEXT_PUBLIC_UPLOAD_URL=https://cdn.toolsail.top/uploads

# ============================================
# Security & CORS
# ============================================
NEXT_PUBLIC_ALLOWED_ORIGINS=https://toolsail.top,https://www.toolsail.top
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1000
JWT_ALGORITHM=HS256

# ============================================
# Logging & Monitoring
# ============================================
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=false
DATABASE_QUERY_LOGGING=false

# ============================================
# Cloudflare Workers Configuration
# ============================================
WRANGLER_ENV=production
WORKERS_ACCOUNT_ID=abc1234567890def1234567890abcdef
WORKERS_API_TOKEN=v1.abc123def456ghi789jkl012mno345pqr678

# ============================================
# SEO & Metadata
# ============================================
NEXT_PUBLIC_SITE_TITLE=Toolsail - Best AI & Digital Tools Directory
NEXT_PUBLIC_SITE_DESCRIPTION=Discover the best AI tools and digital tools for your workflow
NEXT_PUBLIC_SITE_KEYWORDS=ai tools, digital tools, directory, product discovery
NEXT_PUBLIC_OG_IMAGE=https://toolsail.top/og-image.jpg

# ============================================
# Feature Flags
# ============================================
NEXT_PUBLIC_FEATURE_GOOGLE_OAUTH=true
NEXT_PUBLIC_FEATURE_GITHUB_OAUTH=true
NEXT_PUBLIC_FEATURE_STRIPE_PAYMENTS=true
NEXT_PUBLIC_FEATURE_PAYPAL_PAYMENTS=true
NEXT_PUBLIC_FEATURE_EMAIL_VERIFICATION=true
```

---

## 5. Setup Instructions

### 5.1 Development Setup

```bash
# 1. Clone repository
git clone https://github.com/lindalu125/toolsail-nextjs-cloudflare.git
cd toolsail-nextjs-cloudflare

# 2. Install dependencies
pnpm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Generate BETTER_AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and paste into .env.local

# 5. Initialize database
npm run db:push

# 6. Seed database (optional)
npm run db:seed

# 7. Start development server
npm run dev

# Open http://localhost:3000
```

### 5.2 Production Deployment

```bash
# 1. Build the project
npm run build

# 2. Set Cloudflare Secrets
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put SENDGRID_API_KEY
wrangler secret put RESEND_API_KEY
# ... other secrets

# 3. Create D1 database
wrangler d1 create toolsail-db

# 4. Update wrangler.toml with database binding
# See wrangler.toml for configuration

# 5. Apply migrations
wrangler d1 migrations apply toolsail-db

# 6. Deploy to Cloudflare
wrangler deploy

# 7. Verify deployment
curl https://toolsail.top/api/health
```

---

## 6. Variable Validation Checklist

### Before Development

- [ ] `.env.local` file exists (Git-ignored)
- [ ] `BETTER_AUTH_SECRET` is 32+ characters
- [ ] `DATABASE_URL` points to correct SQLite file
- [ ] `NEXT_PUBLIC_BASE_URL` matches localhost port
- [ ] Email provider is configured
- [ ] Feature flags are set appropriately

### Before Production

- [ ] All secrets are in Cloudflare Secrets Manager
- [ ] `NEXT_PUBLIC_BASE_URL` is HTTPS
- [ ] Database is on Cloudflare D1
- [ ] Email service is operational
- [ ] Payment credentials are validated
- [ ] CORS origins are restricted
- [ ] Logging level is set to `info` or `warn`
- [ ] Analytics and error tracking are enabled
- [ ] AdSense ID is valid (if using)
- [ ] OAuth credentials are production keys

---

## 7. Security Best Practices

### 7.1 Secret Management

```bash
# ✅ DO: Use Cloudflare Secrets for production
wrangler secret put MY_SECRET_KEY

# ✅ DO: Store locally in .env.local for development
echo "MY_SECRET_KEY=value" >> .env.local

# ✅ DO: Use strong, random secrets
openssl rand -base64 32

# ❌ DON'T: Commit .env.local to Git
# Add to .gitignore:
.env.local
.env.*.local

# ❌ DON'T: Use same secrets for dev and production
# Keep separate credentials for each environment
```

### 7.2 Environment Variable Naming

```bash
# ✅ Public variables (exposed to frontend)
NEXT_PUBLIC_*

# ✅ Private variables (server-side only)
STRIPE_SECRET_KEY
SENDGRID_API_KEY
DATABASE_PASSWORD

# ✅ Cloudflare-specific
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

### 7.3 Rotation Schedule

| Secret | Rotation Frequency |
|--------|-------------------|
| BETTER_AUTH_SECRET | Every 6 months or after breach |
| STRIPE_SECRET_KEY | Quarterly (or when rotated in Stripe) |
| SENDGRID_API_KEY | Quarterly |
| OAuth secrets | When keys are compromised |
| Database password | Annually or when staff changes |

---

## 8. Troubleshooting

### Missing Environment Variables

**Error:** `Error: BETTER_AUTH_SECRET is not defined`

**Solution:**
```bash
# Check .env.local exists
ls -la .env.local

# Check variable is present
grep BETTER_AUTH_SECRET .env.local

# Restart dev server
npm run dev
```

### Database Connection Issues

**Error:** `Error: SQLITE_CANTOPEN: unable to open database file`

**Solution:**
```bash
# Ensure DATABASE_URL is correct
echo $DATABASE_URL  # Should be: file:./dev.db

# Create dev.db if missing
touch dev.db

# Run migrations
npm run db:push
```

### OAuth Not Working

**Error:** `Error: Invalid client_id`

**Solution:**
- Verify OAuth credentials match your provider (Google/GitHub)
- Check redirect URIs match `BETTER_AUTH_URL`
- Ensure feature flag is enabled: `NEXT_PUBLIC_FEATURE_GOOGLE_OAUTH=true`

### Email Sending Issues

**Error:** `Error: Failed to send email`

**Solution:**
```bash
# Verify email provider is configured
echo $EMAIL_PROVIDER

# Test with Resend (easier to set up)
# EMAIL_PROVIDER=resend
# RESEND_API_KEY=your_key

# Check from email is correct
echo $SMTP_FROM_EMAIL
```

---

## 9. Environment Variable Reference Table

| Variable | Type | Req | Dev | Prod | Notes |
|----------|------|-----|-----|------|-------|
| NEXT_PUBLIC_BASE_URL | URL | ✅ | localhost | HTTPS | Critical for links |
| BETTER_AUTH_SECRET | String | ✅ | Random | Random | 32+ chars |
| DATABASE_URL | URL | ✅ | local SQLite | D1 | Never expose |
| EMAIL_PROVIDER | String | ✅ | resend | resend | or sendgrid |
| STRIPE_SECRET_KEY | String | ❌ | - | sk_live | Never public |
| PAYPAL_SECRET | String | ❌ | - | - | Never public |
| LOG_LEVEL | String | ❌ | debug | warn | Balance verbosity |
| NODE_ENV | String | ✅ | development | production | Auto-set usually |

---

## Summary

This ENVIRONMENT_VARIABLES.md provides:

1. **46 environment variables** with full documentation
2. **Development vs. Production** values for each
3. **Complete .env.example template** ready to use
4. **Security best practices** for secrets management
5. **Setup instructions** for development and production
6. **Troubleshooting guide** for common issues
7. **Validation checklist** before going live

All variables are organized by feature area for easy reference and implementation.
