# DEPLOYMENT_CONFIG.md - Cloudflare Deployment Guide

## Overview

This document provides comprehensive instructions for deploying Toolsail to Cloudflare, including:
- **Frontend:** Next.js 15 app deployed to Cloudflare Pages
- **Backend API:** Cloudflare Workers with Next.js API routes
- **Database:** Cloudflare D1 (SQLite)
- **Authentication:** Better Auth sessions
- **Domains:** DNS configuration with Cloudflare

**Architecture:**
```
Domain (toolsail.top)
    ↓
Cloudflare DNS
    ↓
┌─────────────────────────────────────┐
│   Cloudflare Global Network         │
├──────────────────┬──────────────────┤
│  Pages (Frontend)│ Workers + D1     │
│  - React UI      │ - API endpoints  │
│  - Static assets │ - Authentication │
└──────────────────┴──────────────────┘
```

---

## 1. Prerequisites

### 1.1 Required Accounts & Tools

```bash
# 1. Cloudflare Account
- Sign up at https://dash.cloudflare.com
- Domain transferred or added to Cloudflare nameservers

# 2. Git Repository
- GitHub account with project repository
- SSH keys configured for GitHub

# 3. Local Environment
- Node.js 20+ LTS
- pnpm package manager
- Wrangler CLI 3.x+
- Git CLI

# 4. Installation Commands
npm install -g @cloudflare/wrangler@latest
npm install -g @cloudflare/pages-cli@latest
```

### 1.2 Cloudflare Project Setup

**Step 1: Create Cloudflare API Token**
```
Cloudflare Dashboard
  → Account Settings (bottom left)
  → API Tokens
  → Create Token
  → Edit Cloudflare Workers
  → Use Template
  → Continue to summary
  → Create
  → Copy token to safe place
```

**Step 2: Create D1 Database**
```bash
# Login to Cloudflare with Wrangler
wrangler login

# Create D1 database
wrangler d1 create toolsail-db

# Output will show database ID, save it
# D1_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Step 3: Add Nameservers to Domain Registrar**
```
If domain not yet on Cloudflare:
1. Add domain in Cloudflare (free plan)
2. Note the nameservers
3. Go to domain registrar (GoDaddy, Namecheap, etc.)
4. Replace nameservers with Cloudflare nameservers
5. Wait 24-48 hours for DNS propagation
```

---

## 2. Project Structure for Cloudflare Deployment

### 2.1 Required Files

```
toolsail-nextjs-cloudflare/
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml      # GitHub Actions for Pages deployment
│       └── deploy-workers.yml    # GitHub Actions for Workers deployment
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── api/
│   │       ├── health/           # Health check endpoint
│   │       ├── tools/            # Tools API
│   │       ├── auth/             # Authentication endpoints
│   │       └── admin/            # Admin API
│   └── lib/
│       └── db.ts                 # Database client
├── wrangler.toml                 # Wrangler configuration
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript config
├── .env.example                  # Environment template
├── .env.local                    # Development env (Git-ignored)
├── package.json
├── pnpm-lock.yaml
├── public/                       # Static assets
└── drizzle/
    ├── migrations/               # Database migrations
    └── schema.ts                 # Database schema
```

### 2.2 Key Configuration Files

#### wrangler.toml
```toml
name = "toolsail"
type = "service-worker"
main = "dist/index.js"
compatibility_date = "2024-12-19"
compatibility_flags = [ "nodejs_compat" ]

# Environment Variables
[env.production]
vars = { ENVIRONMENT = "production" }

# D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "toolsail-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Secrets (configure via wrangler secret put)
# No secrets in wrangler.toml, configure separately

[build]
command = "npm run build"
cwd = "./"

[site]
bucket = "./dist"
```

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Cloudflare Workers
  experimental: {
    isrMemoryCacheSize: 0,
  },
  // Enable streaming
  reactStrictMode: true,
  // Image optimization for edge
  images: {
    remotePatterns: [
      { hostname: "*.google.com" },
      { hostname: "example.com" },
    ],
  },
};

module.exports = nextConfig;
```

---

## 3. Cloudflare Pages Deployment (Frontend)

### 3.1 Connect GitHub Repository

**Step 1: Link GitHub to Cloudflare**
```
Cloudflare Dashboard
  → Pages
  → Create a project
  → Connect to Git
  → Select GitHub
  → Authorize Cloudflare
  → Select repository: lindalu125/toolsail-nextjs-cloudflare
  → Next
```

**Step 2: Configure Build Settings**
```
Project name: toolsail
Production branch: main
Framework preset: Next.js
Build command: npm run build
Build output directory: .next

Environment variables: [See Section 1 below]
```

### 3.2 Build Commands for Pages

```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "export": "next export",
    "start": "next start"
  }
}
```

**For Cloudflare Pages:**
```bash
# Build command (configured in Pages settings)
npm run build

# Output directory
.next
```

### 3.3 Environment Variables in Pages

**Set via Cloudflare Dashboard:**
```
Pages → toolsail → Settings → Environment variables

Add for Production:
- NEXT_PUBLIC_BASE_URL = https://toolsail.top
- NEXT_PUBLIC_API_BASE_URL = https://toolsail.top/api
- NEXT_PUBLIC_DEFAULT_LOCALE = en
- NEXT_PUBLIC_LOCALES = en,zh
- NEXT_PUBLIC_DEFAULT_THEME = light
- NEXT_PUBLIC_LOG_LEVEL = warn
- NEXT_PUBLIC_FEATURE_GOOGLE_OAUTH = true
- NEXT_PUBLIC_FEATURE_STRIPE_PAYMENTS = true
- NODE_ENV = production
```

### 3.4 Deploy Pages Manually

```bash
# Option 1: Automatic deployment (recommended)
# Push to main branch, Cloudflare deploys automatically

# Option 2: Manual deployment with Pages CLI
npm install -g wrangler
wrangler pages deploy dist \
  --project-name=toolsail \
  --branch=main

# Option 3: Preview deployment
wrangler pages deploy dist \
  --project-name=toolsail \
  --branch=preview
```

### 3.5 Verify Pages Deployment

```bash
# Check deployment status
wrangler pages project list

# Test site
curl https://toolsail.pages.dev

# View logs
wrangler pages deployment list --project=toolsail
```

---

## 4. Cloudflare Workers Deployment (Backend API)

### 4.1 Create Workers Project

```bash
# 1. Initialize Workers project
wrangler init toolsail-api

# 2. Choose "Yes" for TypeScript
# Choose "Yes" for git repository
# Choose "Yes" for wrangler.toml

# 3. Configure wrangler.toml (see template in section 2.2)

# 4. Install dependencies
pnpm install
```

### 4.2 Configure wrangler.toml

```toml
name = "toolsail"
main = "src/index.ts"
compatibility_date = "2024-12-19"
compatibility_flags = ["nodejs_compat"]

# Environment configuration
[env.development]
vars = { ENVIRONMENT = "development" }

[env.production]
vars = { ENVIRONMENT = "production" }

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "toolsail-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# KV storage for caching (optional)
[[kv_namespaces]]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Migrations
[migrations]
path = "drizzle/migrations"

# Build configuration
[build]
command = "npm run build"
cwd = "./"

# Routes
routes = [
  { pattern = "https://toolsail.top/api/*", zone_name = "toolsail.top" }
]

# Limits
[limits]
cpu_ms = 50000
```

### 4.3 Build Commands for Workers

```bash
# Development
npm run dev

# Production build
npm run build

# Deploy to Cloudflare
wrangler deploy

# Deploy to specific environment
wrangler deploy --env production

# Tail logs in real-time
wrangler tail --env production
```

### 4.4 Store Secrets in Cloudflare

```bash
# Login first
wrangler login

# Set production secrets
wrangler secret put BETTER_AUTH_SECRET --env production
wrangler secret put STRIPE_SECRET_KEY --env production
wrangler secret put SENDGRID_API_KEY --env production
wrangler secret put RESEND_API_KEY --env production

# Verify secrets are set
wrangler secret list --env production

# For development (local .env.local)
# Secrets in .env.local are used by wrangler dev
```

### 4.5 Database Migrations

```bash
# Create migration
wrangler d1 migrations create toolsail-db init

# Run migrations
wrangler d1 migrations apply toolsail-db --remote

# Check migration status
wrangler d1 query toolsail-db "SELECT name FROM sqlite_master WHERE type='table';"

# Seed initial data (if needed)
wrangler d1 execute toolsail-db --remote < seed.sql
```

### 4.6 Deploy Workers

```bash
# Step 1: Build the project
npm run build

# Step 2: Set all required secrets
wrangler secret put BETTER_AUTH_SECRET --env production
wrangler secret put STRIPE_SECRET_KEY --env production
wrangler secret put SENDGRID_API_KEY --env production

# Step 3: Apply database migrations
wrangler d1 migrations apply toolsail-db --remote

# Step 4: Deploy
wrangler deploy --env production

# Step 5: Verify deployment
curl https://toolsail.top/api/health
```

---

## 5. Build Commands Complete Reference

### 5.1 Local Development

```bash
# Install dependencies
pnpm install

# Run development server (http://localhost:3000)
npm run dev

# Run with Wrangler (includes Workers simulation)
wrangler dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### 5.2 Pre-Deployment Checks

```bash
# Build for production
npm run build

# Type check
npm run type-check

# Lint check
npm run lint

# Run tests (if configured)
npm run test

# Security audit
pnpm audit

# All checks
npm run ci
```

### 5.3 Build Scripts (package.json)

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:workers": "wrangler dev",
    "build": "next build",
    "build:pages": "next build",
    "build:workers": "wrangler build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "lint": "biome lint .",
    "format": "biome format --write .",
    "db:push": "drizzle-kit push:sqlite",
    "db:generate": "drizzle-kit generate:sqlite",
    "db:seed": "tsx ./drizzle/seed.ts",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "ci": "npm run type-check && npm run lint && npm run build && npm run test"
  }
}
```

---

## 6. Environment Variables Setup Methods

### 6.1 Development Environment (.env.local)

```bash
# Create .env.local
cp .env.example .env.local

# Edit with your values
nano .env.local

# For local development, use:
BETTER_AUTH_SECRET=your_local_secret_key
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# ... other local values
```

### 6.2 Cloudflare Pages Environment Variables

**Via Dashboard:**
```
Cloudflare Dashboard
  → Pages
  → toolsail
  → Settings
  → Environment variables

Add:
Name: NEXT_PUBLIC_BASE_URL
Value: https://toolsail.top
Environments: Production

[Repeat for each variable]
```

**Via Wrangler CLI:**
```bash
# List environment variables
wrangler pages project list

# Set via CLI (if available)
# Note: Pages uses dashboard for env vars, not CLI
```

### 6.3 Cloudflare Workers Secrets

```bash
# Set secrets (interactive prompt)
wrangler secret put BETTER_AUTH_SECRET --env production

# Paste secret value and press Enter

# Set from command line
echo "secret_value" | wrangler secret put MY_SECRET --env production

# List secrets
wrangler secret list --env production

# Delete secret
wrangler secret delete SOME_SECRET --env production
```

### 6.4 Bulk Import Secrets

```bash
# Create secrets.json
cat > secrets.json << 'EOF'
{
  "BETTER_AUTH_SECRET": "your_secret_key",
  "STRIPE_SECRET_KEY": "sk_live_xxx",
  "SENDGRID_API_KEY": "SG.xxx"
}
EOF

# Import via script
for key in $(jq -r 'keys[]' secrets.json); do
  value=$(jq -r ".[$key]" secrets.json)
  echo "Setting $key..."
  echo "$value" | wrangler secret put $key --env production
done

# Clean up
rm secrets.json
```

### 6.5 Environment Variables Checklist

**Before Pages Deployment:**
- [ ] NEXT_PUBLIC_BASE_URL = https://toolsail.top
- [ ] NEXT_PUBLIC_API_BASE_URL = https://toolsail.top/api
- [ ] NODE_ENV = production
- [ ] NEXT_PUBLIC_LOG_LEVEL = warn
- [ ] NEXT_PUBLIC_DEFAULT_LOCALE = en
- [ ] All NEXT_PUBLIC_* variables set

**Before Workers Deployment:**
- [ ] BETTER_AUTH_SECRET stored in secrets
- [ ] STRIPE_SECRET_KEY stored in secrets
- [ ] SENDGRID_API_KEY stored in secrets
- [ ] RESEND_API_KEY stored in secrets
- [ ] Database binding configured in wrangler.toml
- [ ] D1_DATABASE_ID set correctly
- [ ] All non-public variables as secrets

---

## 7. Domain & DNS Configuration

### 7.1 Add Domain to Cloudflare

**Step 1: Add Domain**
```
Cloudflare Dashboard
  → Websites
  → Add a domain
  → Enter: toolsail.top
  → Next
  → Select Plan (Free is fine for start)
  → Continue Setup
```

**Step 2: Update Nameservers at Registrar**
```
Cloudflare will show 2 nameservers:
  ns1.cloudflare.com
  ns2.cloudflare.com

Go to domain registrar (GoDaddy, Namecheap, etc.)
  → Domain Settings
  → Nameservers
  → Replace with Cloudflare nameservers
  → Save

⚠️ Wait 24-48 hours for DNS propagation
```

**Step 3: Verify Domain**
```bash
# Check if nameservers are updated
nslookup toolsail.top

# Should show Cloudflare nameservers
# Once confirmed, Cloudflare dashboard shows checkmark
```

### 7.2 DNS Records Configuration

**Required DNS Records:**

```
Type: CNAME
Name: toolsail.top (or @)
Target: toolsail.pages.dev
Status: Proxied (orange cloud)
Comment: Pages deployment

Type: CNAME
Name: www
Target: toolsail.pages.dev
Status: Proxied (orange cloud)
Comment: www subdomain

Type: TXT
Name: _acme-challenge
Value: [Auto-populated by Cloudflare]
Status: DNS only (gray cloud)
Comment: SSL/TLS challenge
```

**Optional DNS Records:**

```
Type: MX
Name: toolsail.top
Priority: 10
Target: mail.protonmail.ch
Status: DNS only (gray cloud)
Comment: Email (if using ProtonMail)

Type: CNAME
Name: mail
Target: mailbox.protonmail.com
Status: DNS only (gray cloud)
Comment: Mail server

Type: TXT
Name: toolsail.top (or @)
Value: v=spf1 include:protonmail.ch ~all
Status: DNS only (gray cloud)
Comment: SPF record for email
```

### 7.3 DNS Configuration via Cloudflare Dashboard

```
Cloudflare Dashboard
  → Websites
  → toolsail.top
  → DNS
  → Records

Add each record from section 7.2 above

After adding all:
  → Wait for "Active nameserver" status
  → Test with: nslookup toolsail.top
```

### 7.4 SSL/TLS Configuration

**Cloudflare automatically provides SSL (free plan):**

```
Cloudflare Dashboard
  → Websites
  → toolsail.top
  → SSL/TLS

Encryption mode: Full (recommended)
  → Ensures HTTPS between user and Cloudflare
  → Cloudflare to origin (Pages) doesn't need cert

Minimum TLS Version: TLS 1.2
  → Ensures compatibility

Always Use HTTPS: ON
  → Redirect all HTTP to HTTPS
```

### 7.5 DNS Verification Commands

```bash
# Check A/AAAA records
nslookup toolsail.top

# Check CNAME records
nslookup www.toolsail.top

# Check all records
dig toolsail.top +short

# Check MX records
nslookup -type=mx toolsail.top

# Verify SSL
curl -I https://toolsail.top
# Should return: HTTP/2 200

# Full DNS propagation check
nslookup toolsail.top 8.8.8.8  # Google DNS
nslookup toolsail.top 1.1.1.1  # Cloudflare DNS
```

### 7.6 Custom Domain for Workers (API)

**If using separate workers.toolsail.top:**

```
DNS Record:
Name: workers
Type: CNAME
Target: toolsail.workers.dev
Status: Proxied

Then in Cloudflare:
  → Workers
  → toolsail
  → Settings
  → Domains & Routes
  → Add custom domain
  → workers.toolsail.top
  → Verify TXT record
```

---

## 8. Deployment Checklist

### 8.1 Pre-Deployment Checklist

#### Code Quality
- [ ] All TypeScript types are correct (`npm run type-check` passes)
- [ ] Linting passes (`npm run lint` passes)
- [ ] No console errors or warnings
- [ ] No TODO or FIXME comments without issues
- [ ] All tests pass (`npm run test` passes)
- [ ] Code formatted consistently (`npm run format`)
- [ ] No security vulnerabilities (`pnpm audit`)

#### Configuration
- [ ] wrangler.toml configured correctly
- [ ] next.config.js optimized for Cloudflare
- [ ] .env.example includes all variables
- [ ] No secrets in environment template
- [ ] All required secrets identified

#### Database
- [ ] Drizzle schema finalized
- [ ] All migrations created
- [ ] Seed data prepared (if needed)
- [ ] Database locally tested
- [ ] Backup strategy planned

#### APIs & Authentication
- [ ] All API endpoints tested locally
- [ ] Authentication flow works end-to-end
- [ ] CORS configured correctly
- [ ] Rate limiting configured
- [ ] Error handling comprehensive

#### Frontend
- [ ] All pages render correctly
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Images optimized
- [ ] Static assets minified
- [ ] Dark/light theme switching works
- [ ] Language switching works (en/zh)

#### Performance
- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Bundle size optimized

#### Security
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

#### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment steps documented
- [ ] Troubleshooting guide created
- [ ] Contributing guide ready

### 8.2 Deployment Day Checklist

#### Before Pushing to Production
- [ ] Final build succeeds: `npm run build`
- [ ] No build warnings or errors
- [ ] All tests pass one final time
- [ ] Backup of current production (if applicable)
- [ ] Rollback plan documented
- [ ] Team notified of deployment

#### Cloudflare Pages Deployment
- [ ] GitHub main branch is clean
- [ ] All PRs merged and reviewed
- [ ] Cloudflare Pages build settings verified
- [ ] Environment variables double-checked
- [ ] Preview deployment tested
- [ ] Production deployment triggered

#### Cloudflare Workers Deployment
- [ ] All secrets set in Cloudflare
- [ ] wrangler.toml has correct database ID
- [ ] Migrations prepared
- [ ] Build succeeds locally: `npm run build`
- [ ] Deploy command ready: `wrangler deploy --env production`

#### DNS Configuration
- [ ] Domain pointing to Cloudflare nameservers
- [ ] CNAME records created for both root and www
- [ ] SSL/TLS mode set to "Full"
- [ ] Always Use HTTPS enabled
- [ ] DNS propagation verified globally

### 8.3 Post-Deployment Verification Checklist

#### Immediate Checks (first 30 minutes)
- [ ] Site loads at https://toolsail.top
- [ ] No 404 or 500 errors
- [ ] API health check returns 200: `curl https://toolsail.top/api/health`
- [ ] Database connection working
- [ ] Authentication login flow works
- [ ] Pages render without JavaScript errors

#### Functional Tests (30 minutes - 1 hour)
- [ ] Homepage loads and renders correctly
- [ ] Category page works: `/categories/ai-tools`
- [ ] Tool detail page works: `/tools/chatgpt`
- [ ] Search functionality works: `/search?q=test`
- [ ] Blog list works: `/blog`
- [ ] User registration works
- [ ] User login works
- [ ] Tool submission flow works

#### Admin Panel Tests
- [ ] Admin dashboard loads: `/admin`
- [ ] Submissions list shows data
- [ ] Can approve a submission
- [ ] Can create a tool
- [ ] Batch upload CSV works
- [ ] Blog editor works
- [ ] Settings page accessible

#### Performance Checks
- [ ] Lighthouse score acceptable (> 80)
- [ ] Page loads within 3 seconds
- [ ] API responses < 500ms
- [ ] No console errors in browser
- [ ] Mobile view works properly
- [ ] Dark theme works
- [ ] Language switching works

#### Security Verification
- [ ] HTTPS enforced (no mixed content)
- [ ] Security headers present:
  ```bash
  curl -I https://toolsail.top
  # Check for: X-Content-Type-Options, X-Frame-Options, etc.
  ```
- [ ] Rate limiting active (test with rapid requests)
- [ ] CORS allows correct origins
- [ ] Authentication tokens working

#### Monitoring & Logs
- [ ] Cloudflare Analytics dashboard loading
- [ ] Error tracking working (Sentry if enabled)
- [ ] Real User Monitoring showing data
- [ ] Worker logs accessible: `wrangler tail --env production`
- [ ] Database queries executing correctly

#### Third-party Services
- [ ] Email sending works (test submission verification)
- [ ] Analytics tracking working (GA if enabled)
- [ ] AdSense ads rendering (if enabled)
- [ ] Payment processing ready (Stripe if enabled)

### 8.4 Post-Deployment Monitoring (24 hours)

- [ ] Monitor error rates (target: < 0.1%)
- [ ] Monitor 404 errors (target: < 1%)
- [ ] Monitor API response times (target: < 500ms)
- [ ] Monitor database query times
- [ ] Check CPU usage on Workers
- [ ] Verify no spike in 5xx errors
- [ ] Monitor user feedback channels
- [ ] Review Cloudflare Analytics dashboard

### 8.5 Rollback Preparation

```bash
# If critical issues found:

# 1. Revert Cloudflare Pages to previous deployment
Cloudflare Dashboard
  → Pages
  → toolsail
  → Deployments
  → Select previous deployment
  → Click "Rollback"

# 2. Revert Cloudflare Workers
git revert HEAD
wrangler deploy --env production

# 3. Verify rollback successful
curl https://toolsail.top/api/health
```

---

## 9. Deployment Troubleshooting

### 9.1 Common Deployment Issues

#### Build Fails

**Issue:** `npm run build` fails locally

**Solutions:**
```bash
# 1. Clear caches
rm -rf node_modules .next dist
pnpm install

# 2. Check for TypeScript errors
npm run type-check

# 3. Check for circular dependencies
npm run lint

# 4. Verify environment variables
cat .env.local | grep -v "^#" | wc -l
```

#### Pages Deployment Fails

**Issue:** Cloudflare Pages build fails

**Solutions:**
```
Check in Cloudflare Dashboard:
  → Pages
  → toolsail
  → Deployments
  → Failed deployment
  → View build log

Common issues:
- Missing environment variables (set in Settings → Environment variables)
- Incorrect build command (should be: npm run build)
- Incorrect output directory (should be: .next)
- Node.js version mismatch (use Node 20 LTS)
```

**Fix:**
```bash
# 1. Test build locally
npm run build

# 2. Check output directory exists
ls -la .next

# 3. Verify environment variables in Cloudflare
# Dashboard → Pages → Settings → Environment variables

# 4. Redeploy
git push origin main
```

#### Workers Deployment Fails

**Issue:** `wrangler deploy` fails

**Solutions:**
```bash
# 1. Check authentication
wrangler whoami

# 2. Verify wrangler.toml syntax
wrangler publish --dry-run

# 3. Check database binding
grep -A 3 "d1_databases" wrangler.toml

# 4. Verify secrets are set
wrangler secret list --env production

# 5. Deploy with verbose logging
wrangler deploy --env production --verbose
```

#### DNS Not Resolving

**Issue:** `nslookup toolsail.top` fails or shows wrong IP

**Solutions:**
```bash
# 1. Check nameservers are updated
nslookup toolsail.top

# 2. Verify at registrar that nameservers are Cloudflare's:
# ns1.cloudflare.com
# ns2.cloudflare.com

# 3. If still wrong, update at registrar again
# Wait 24-48 hours for global propagation

# 4. Test with Google's public DNS
nslookup toolsail.top 8.8.8.8
nslookup toolsail.top 8.8.4.4

# 5. Force DNS flush (macOS)
sudo dscacheutil -flushcache

# 6. Force DNS flush (Linux)
sudo systemctl restart systemd-resolved
```

#### Certificate Issues

**Issue:** "SSL certificate error" or mixed content warnings

**Solutions:**
```
Cloudflare Dashboard:
  → Website
  → toolsail.top
  → SSL/TLS

1. Set to "Full" mode (not "Flexible")
2. Enable "Always Use HTTPS"
3. Set Minimum TLS Version to "TLS 1.2"
4. Wait 10 minutes for certificate generation

Check with:
curl -I https://toolsail.top
```

#### Database Connection Issues

**Issue:** "D1 database not found" or connection timeout

**Solutions:**
```bash
# 1. Verify database was created
wrangler d1 list

# 2. Get correct database ID
# Copy the ID and update in wrangler.toml

# 3. Test database connection
wrangler d1 query toolsail-db "SELECT 1"

# 4. Check database is in same region
# (Cloudflare D1 is global, so location doesn't matter)

# 5. Verify binding in wrangler.toml
grep -A 2 "d1_databases" wrangler.toml
```

### 9.2 Monitoring Logs

```bash
# View Cloudflare Pages build logs
Cloudflare Dashboard → Pages → toolsail → Deployments → View Log

# Stream Workers logs in real-time
wrangler tail --env production

# View with specific filters
wrangler tail --env production --format json

# Download full logs (up to 30 days)
wrangler tail --env production > logs.txt

# View database query logs
wrangler d1 insights toolsail-db
```

### 9.3 Performance Debugging

```bash
# Test site performance
curl -w "@curl-format.txt" -o /dev/null -s https://toolsail.top

# Check Time to First Byte (TTFB)
curl -o /dev/null -s -w "%{time_connect},%{time_starttransfer},%{time_total}\n" https://toolsail.top

# Test API performance
curl -w "@curl-format.txt" -o /dev/null -s https://toolsail.top/api/tools

# Check Worker CPU usage
wrangler analytics engine dashboard
```

---

## 10. Post-Deployment Operations

### 10.1 Continuous Monitoring

**Set up alerts:**
```
Cloudflare Dashboard:
  → Notifications
  → Notification Policies
  → Create Policy

Monitor:
- Page Rules triggered
- Workers errors (HTTP 5xx)
- Cache hit ratio drop
- Origin response time
```

### 10.2 Scheduled Tasks

**Daily:**
- [ ] Check error logs: `wrangler tail --env production`
- [ ] Monitor Cloudflare Analytics
- [ ] Review user submissions

**Weekly:**
- [ ] Check database performance
- [ ] Review performance metrics
- [ ] Monitor API response times
- [ ] Check security logs

**Monthly:**
- [ ] Rotate secrets if needed
- [ ] Review and update dependencies
- [ ] Check Lighthouse scores
- [ ] Plan improvements

### 10.3 Backup Strategy

```bash
# Daily backup of D1 database
# Set up scheduled job (GitHub Actions or external service):

schedule:
  - cron: '0 2 * * *'  # 2 AM UTC daily

steps:
  - name: Backup D1 Database
    run: |
      wrangler d1 execute toolsail-db --remote ".dump" > backup-$(date +%Y%m%d).sql
      # Upload to secure storage
```

### 10.4 Scaling Considerations

**Monitor these metrics:**
- Requests per minute (target: < 1000)
- Database query count (target: < 100/sec)
- Worker CPU time (target: < 50ms per request)
- Memory usage (target: < 100MB)

**When to scale:**
- RPM consistently > 1000
- DB query time > 100ms
- Worker CPU time > 50ms
- Error rate > 0.1%

**How to scale:**
- D1 database: Automatic (Cloudflare managed)
- Workers: Automatic (Cloudflare managed)
- Pages: Automatic (Cloudflare managed)
- No manual scaling needed initially

---

## 11. Deployment Reference Checklists

### Quick Deployment Script

```bash
#!/bin/bash
set -e

echo "🔨 Building..."
npm run build

echo "✅ Type checking..."
npm run type-check

echo "🧹 Linting..."
npm run lint

echo "🧪 Testing..."
npm run test

echo "📦 Setting secrets in Cloudflare..."
# These should be done manually once or via environment variable
# wrangler secret put BETTER_AUTH_SECRET --env production

echo "🚀 Deploying to Pages (via git push)..."
git push origin main

echo "🚀 Deploying to Workers..."
wrangler deploy --env production

echo "🔍 Verifying deployment..."
sleep 30
curl -f https://toolsail.top/api/health || exit 1

echo "✨ Deployment complete!"
echo "Check: https://toolsail.top"
```

### One-Liner Deployments

```bash
# Full deploy after code changes
npm run build && npm run type-check && npm run lint && npm run test && wrangler deploy --env production

# Quick Pages deployment (git auto-deploys)
git push origin main && echo "Pages deploying... check Cloudflare dashboard"

# Quick Workers deployment
wrangler deploy --env production && wrangler tail --env production

# Verify all systems
curl https://toolsail.top && curl https://toolsail.top/api/health && echo "✅ All systems operational"
```

---

## Summary

This DEPLOYMENT_CONFIG.md provides:

1. **Complete Setup Guide** - From prerequisites to initial configuration
2. **Pages Deployment** - Step-by-step frontend deployment to Cloudflare Pages
3. **Workers Deployment** - Backend API deployment with D1 database
4. **Build Commands** - All build, test, and deployment commands
5. **Environment Management** - Setting variables for development and production
6. **DNS Configuration** - Domain setup with Cloudflare (CNAME, SSL/TLS)
7. **Deployment Checklist** - 50+ items to verify before, during, and after deployment
8. **Troubleshooting** - Solutions for 10+ common issues
9. **Monitoring** - Post-deployment monitoring and maintenance
10. **Reference Scripts** - Bash scripts for automated deployments

**Typical deployment takes:**
- First deployment: 1-2 hours (setup + configuration)
- Subsequent deployments: 10-15 minutes (code changes only)
- DNS propagation: 24-48 hours (one-time, domain setup)
