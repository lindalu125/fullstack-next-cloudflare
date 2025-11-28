# DATABASE_DESIGN.md - Toolsail Database Architecture

## Overview

This document defines the complete database schema for Toolsail, including all tables, relationships, constraints, indexing strategy, and database technology selection. The design supports the full feature set across frontend (user-facing) and backend (admin) modules.

---

## 1. Database Technology Selection

### 1.1 Technology Comparison

| Aspect | SQLite (D1) | PostgreSQL | MongoDB |
|--------|-----------|-----------|---------|
| **Deployment** | Cloudflare D1 (serverless) | Self-hosted/managed | Atlas (cloud) |
| **Best For** | Edge computing, serverless | Production apps, complex queries | Document storage, flexible schema |
| **ACID Support** | ✅ Full ACID | ✅ Full ACID | ⚠️ Session-level |
| **Relationships** | ✅ Foreign keys | ✅ Foreign keys, better integrity | ❌ Requires denormalization |
| **Scalability** | ⚠️ Limited (Cloudflare-managed) | ✅ Excellent (horizontal) | ✅ Excellent (sharding) |
| **Query Power** | ✅ Good (standard SQL) | ✅✅ Excellent (advanced SQL) | ⚠️ Limited (aggregation pipeline) |
| **Transaction Support** | ✅ Good | ✅✅ Excellent | ⚠️ Multi-document transactions |
| **Cost** | 💰 Included with Workers | 💰💰 Moderate | 💰💰 Depends on usage |
| **Schema Flexibility** | ❌ Rigid schema | ❌ Rigid schema | ✅ Flexible schema |
| **Learning Curve** | ✅ Easy | ✅ Easy | ⚠️ Different paradigm |

### 1.2 Recommendation: SQLite (Cloudflare D1)

**Decision**: Use **SQLite with Cloudflare D1** as the primary database.

**Rationale**:
1. **Deployment Match**: Running on Cloudflare Workers; D1 is native integration
2. **Relational Data**: Strong relationships (tools → categories, submissions → tools, etc.)
3. **ACID Compliance**: Critical for financial transactions (promotions/payments)
4. **Simple Schema**: Clear data model without need for flexibility
5. **Cost Effective**: D1 pricing fits serverless architecture
6. **Drizzle ORM Ready**: Full type-safe ORM support for SQLite

**Considerations for Growth**:
- If traffic scales significantly (>1M DAU), plan migration to PostgreSQL
- D1 handles 100k+ DAU comfortably
- Use read replicas in PostgreSQL when needed

**Alternative Path**:
- Start with D1 (SQLite)
- Migrate to PostgreSQL when analytical queries become complex
- Drizzle ORM makes migration easier (same query API)

---

## 2. Entity Relationship Diagram (ERD)

### 2.1 High-Level Relationship Map

```
┌─────────────────────────────────────────────────────────┐
│                     USERS                               │
│  (id, email, name, role, emailVerified, adminRole)      │
└────────────┬────────────────────────────────────────────┘
             │
      ┌──────┴──────────┬──────────────┐
      │                 │              │
      ↓                 ↓              ↓
┌──────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ TOOLS        │ │ TOOL_SUBMISSIONS │ │ BLOG_POSTS       │
│              │ │                  │ │                  │
│ (id, name,   │ │ (id, name, url,  │ │ (id, title,      │
│  url, desc,  │ │  categoryId,      │ │  slug, content,  │
│  categoryId) │ │  submittedBy)     │ │  categoryId,     │
└──────┬───────┘ └──────┬───────────┘ │  authorId)       │
       │                │              └──────┬──────────┘
       │                │                     │
       │          ┌─────┴─────────────────────┘
       │          │
       │     (User Relationship)
       │
       ├──→ CATEGORIES (id, name, slug, icon)
       │
       ├──→ TOOL_PROMOTIONS (id, toolId, tier, priceUSD)
       │
       └──→ VERIFICATION_TOKENS (token, submissionId, expiresAt)


AUDIT_LOGS (id, adminId, action, entityType, entityId, createdAt)
```

### 2.2 Complete ERD (Text Format)

```
USERS
├── 1:N → TOOLS (submittedBy)
├── 1:N → TOOL_SUBMISSIONS (submittedBy)
├── 1:N → BLOG_POSTS (authorId)
└── 1:N → AUDIT_LOGS (adminId)

CATEGORIES
├── 1:N → TOOLS (categoryId)
└── 1:N → TOOL_SUBMISSIONS (categoryId)

TOOLS
├── 1:N → TOOL_PROMOTIONS (toolId)
├── M:1 → CATEGORIES (categoryId)
└── M:1 → USERS (submittedBy, optional)

TOOL_SUBMISSIONS
├── M:1 → CATEGORIES (categoryId)
├── M:1 → USERS (submittedBy, optional for guests)
├── 1:1 → TOOLS (toolId, after approval)
└── 1:N → VERIFICATION_TOKENS (submissionId)

BLOG_CATEGORIES
└── 1:N → BLOG_POSTS (categoryId)

BLOG_POSTS
├── M:1 → USERS (authorId)
├── M:1 → BLOG_CATEGORIES (categoryId)
└── M:1 → TOOLS (relatedToolIds, optional many-to-many)

TOOL_PROMOTIONS
└── M:1 → TOOLS (toolId)

VERIFICATION_TOKENS
└── M:1 → TOOL_SUBMISSIONS (submissionId)

AUDIT_LOGS
└── M:1 → USERS (adminId)
```

---

## 3. Table Schema Definitions

### 3.1 USERS Table

```sql
CREATE TABLE users (
  -- Identity
  id TEXT PRIMARY KEY,                    -- UUID
  email TEXT NOT NULL UNIQUE,             -- User email, unique
  emailVerified BOOLEAN DEFAULT false,    -- Email verification status

  -- Profile
  name TEXT NOT NULL,                     -- Display name
  image TEXT,                             -- Avatar URL

  -- Authorization
  role TEXT NOT NULL DEFAULT 'user',      -- 'user' | 'admin'
  adminRole TEXT,                         -- 'admin' | 'editor' | 'moderator' (null if role='user')

  -- Account
  password TEXT,                          -- Hashed password (Better Auth manages)
  twoFactorEnabled BOOLEAN DEFAULT false, -- 2FA status

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT role_check CHECK (role IN ('user', 'admin')),
  CONSTRAINT admin_role_check CHECK (
    (role = 'admin' AND adminRole IS NOT NULL) OR
    (role = 'user' AND adminRole IS NULL)
  )
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_createdAt ON users(createdAt DESC);
```

**TypeScript (Better Auth/Drizzle)**:
```typescript
import { text, boolean, timestamp } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false),
  name: text("name").notNull(),
  image: text("image"),
  role: text("role").notNull().default("user"),
  adminRole: text("adminRole"), // 'admin' | 'editor' | 'moderator'
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
```

---

### 3.2 CATEGORIES Table

```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,                    -- UUID
  name TEXT NOT NULL,                     -- Category name (e.g., "AI Tools", "Digital Tools")
  slug TEXT NOT NULL UNIQUE,              -- URL-friendly slug
  icon TEXT NOT NULL,                     -- Lucide icon name (e.g., "cpu", "zap")
  description TEXT,                       -- Category description

  -- Hierarchy
  parentId TEXT,                          -- For subcategories (null for top-level)
  displayOrder INTEGER NOT NULL,          -- Sort order

  -- Soft delete
  deletedAt TIMESTAMP,                    -- null = active, set = archived

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE RESTRICT,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- Indexes
CREATE UNIQUE INDEX idx_categories_slug_active ON categories(slug)
  WHERE deletedAt IS NULL;
CREATE INDEX idx_categories_parent ON categories(parentId);
CREATE INDEX idx_categories_displayOrder ON categories(displayOrder);
```

**TypeScript (Drizzle)**:
```typescript
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(), // Lucide icon name
  description: text("description"),
  parentId: text("parentId").references(() => categories.id),
  displayOrder: integer("displayOrder").notNull(),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
```

---

### 3.3 TOOLS Table

```sql
CREATE TABLE tools (
  -- Identity
  id TEXT PRIMARY KEY,                    -- UUID
  name TEXT NOT NULL,                     -- Tool name
  url TEXT NOT NULL,                      -- Tool website URL
  description TEXT NOT NULL,              -- Tool description
  logoUrl TEXT,                           -- Tool logo (URL or uploaded)

  -- Organization
  categoryId TEXT NOT NULL,               -- Primary category

  -- Status & Publishing
  isPublished BOOLEAN NOT NULL DEFAULT true,  -- Visibility flag
  isFeatured BOOLEAN NOT NULL DEFAULT false,  -- Featured badge (⭐)

  -- Submission tracking
  submissionId TEXT UNIQUE,               -- Link to original submission (if from user)
  submittedBy TEXT,                       -- User ID if submitted (else admin-created)

  -- Metrics
  viewCount INTEGER DEFAULT 0,            -- Total views (tracked but not displayed)
  clickCount INTEGER DEFAULT 0,           -- Outbound clicks

  -- SEO
  metaDescription TEXT,                   -- For search engines
  metaKeywords TEXT,                      -- Comma-separated keywords

  -- Soft delete
  deletedAt TIMESTAMP,                    -- null = active, set = archived

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (submissionId) REFERENCES tool_submissions(id),
  FOREIGN KEY (submittedBy) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT url_valid CHECK (url LIKE 'http://%' OR url LIKE 'https://%')
);

-- Indexes
CREATE INDEX idx_tools_categoryId ON tools(categoryId);
CREATE INDEX idx_tools_isPublished ON tools(isPublished) WHERE isPublished = true;
CREATE INDEX idx_tools_isFeatured ON tools(isFeatured) WHERE isFeatured = true;
CREATE INDEX idx_tools_createdAt ON tools(createdAt DESC);
CREATE INDEX idx_tools_viewCount ON tools(viewCount DESC);
CREATE INDEX idx_tools_submittedBy ON tools(submittedBy);

-- Unique constraint: published tools can't have duplicate URLs
CREATE UNIQUE INDEX idx_tools_url_published ON tools(url, isPublished)
  WHERE isPublished = true AND deletedAt IS NULL;
```

**TypeScript (Drizzle)**:
```typescript
export const tools = sqliteTable("tools", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logoUrl"),
  categoryId: text("categoryId").notNull().references(() => categories.id),
  isPublished: boolean("isPublished").notNull().default(true),
  isFeatured: boolean("isFeatured").notNull().default(false),
  submissionId: text("submissionId").references(() => toolSubmissions.id),
  submittedBy: text("submittedBy").references(() => users.id),
  viewCount: integer("viewCount").default(0),
  clickCount: integer("clickCount").default(0),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
```

---

### 3.4 TOOL_SUBMISSIONS Table

```sql
CREATE TABLE tool_submissions (
  -- Identity
  id TEXT PRIMARY KEY,                    -- UUID

  -- Tool information
  name TEXT NOT NULL,                     -- Tool name
  url TEXT NOT NULL,                      -- Tool URL
  description TEXT NOT NULL,              -- Tool description
  logoUrl TEXT,                           -- Tool logo
  categoryId TEXT NOT NULL,               -- Intended category

  -- Submission details
  submittedBy TEXT,                       -- User ID (null for guests)
  email TEXT,                             -- Email for guest submissions
  emailVerified BOOLEAN DEFAULT false,    -- Email verification status

  -- Review workflow
  status TEXT NOT NULL DEFAULT 'pending', -- pending | changes_requested | approved | rejected | published
  feedbackComments TEXT,                  -- JSON array of {text, by, at}
  rejectionReason TEXT,                   -- If status=rejected

  -- Featured flag
  isFeatured BOOLEAN DEFAULT false,       -- Requested featured status

  -- Admin review tracking
  reviewedBy TEXT,                        -- Admin ID who approved/rejected
  reviewedAt TIMESTAMP,                   -- When reviewed
  rejectedBy TEXT,                        -- Admin ID who rejected
  rejectedAt TIMESTAMP,                   -- When rejected

  -- Link to created tool
  toolId TEXT UNIQUE,                     -- Reference to created tool (if approved)

  -- Soft delete
  deletedAt TIMESTAMP,                    -- For archiving

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (submittedBy) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewedBy) REFERENCES users(id),
  FOREIGN KEY (rejectedBy) REFERENCES users(id),
  FOREIGN KEY (toolId) REFERENCES tools(id),
  CONSTRAINT status_check CHECK (status IN (
    'pending', 'changes_requested', 'approved', 'rejected', 'published'
  )),
  CONSTRAINT guest_or_user CHECK (
    (submittedBy IS NOT NULL AND email IS NULL) OR
    (submittedBy IS NULL AND email IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX idx_submissions_status ON tool_submissions(status);
CREATE INDEX idx_submissions_submittedBy ON tool_submissions(submittedBy);
CREATE INDEX idx_submissions_email ON tool_submissions(email);
CREATE INDEX idx_submissions_createdAt ON tool_submissions(createdAt DESC);
CREATE INDEX idx_submissions_categoryId ON tool_submissions(categoryId);

-- Pending reviews that need attention
CREATE INDEX idx_submissions_pending ON tool_submissions(status)
  WHERE status IN ('pending', 'changes_requested');
```

**TypeScript (Drizzle)**:
```typescript
export const toolSubmissions = sqliteTable("tool_submissions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logoUrl"),
  categoryId: text("categoryId").notNull().references(() => categories.id),
  submittedBy: text("submittedBy").references(() => users.id),
  email: text("email"),
  emailVerified: boolean("emailVerified").default(false),
  status: text("status").notNull().default("pending"),
  feedbackComments: text("feedbackComments"), // JSON stringified
  rejectionReason: text("rejectionReason"),
  isFeatured: boolean("isFeatured").default(false),
  reviewedBy: text("reviewedBy").references(() => users.id),
  reviewedAt: timestamp("reviewedAt"),
  rejectedBy: text("rejectedBy").references(() => users.id),
  rejectedAt: timestamp("rejectedAt"),
  toolId: text("toolId").references(() => tools.id),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
```

---

### 3.5 BLOG_CATEGORIES Table

```sql
CREATE TABLE blog_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  displayOrder INTEGER NOT NULL,
  deletedAt TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX idx_blog_categories_displayOrder ON blog_categories(displayOrder);
```

**TypeScript (Drizzle)**:
```typescript
export const blogCategories = sqliteTable("blog_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  displayOrder: integer("displayOrder").notNull(),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
```

---

### 3.6 BLOG_POSTS Table

```sql
CREATE TABLE blog_posts (
  -- Identity
  id TEXT PRIMARY KEY,

  -- Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,              -- URL-friendly slug
  content TEXT NOT NULL,                  -- Markdown content (allows inline HTML)
  excerpt TEXT,                           -- Short summary for list view
  featuredImage TEXT,                     -- Hero image URL

  -- Organization
  categoryId TEXT,                        -- Optional blog category
  tags TEXT,                              -- JSON array of tag strings

  -- Author
  authorId TEXT NOT NULL,

  -- Publishing
  status TEXT NOT NULL DEFAULT 'draft',   -- draft | scheduled | published
  isPublished BOOLEAN NOT NULL DEFAULT false,
  publishedAt TIMESTAMP,                  -- Actual publish time (or scheduled)

  -- SEO
  metaDescription TEXT,
  metaKeywords TEXT,

  -- Metrics
  viewCount INTEGER DEFAULT 0,

  -- Soft delete
  deletedAt TIMESTAMP,

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  FOREIGN KEY (categoryId) REFERENCES blog_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT status_check CHECK (status IN ('draft', 'scheduled', 'published')),
  CONSTRAINT published_check CHECK (
    (status = 'published' AND isPublished = true AND publishedAt IS NOT NULL) OR
    (status IN ('draft', 'scheduled') AND (isPublished = false OR publishedAt IS NULL))
  )
);

-- Indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_authorId ON blog_posts(authorId);
CREATE INDEX idx_blog_posts_isPublished ON blog_posts(isPublished)
  WHERE isPublished = true;
CREATE INDEX idx_blog_posts_publishedAt ON blog_posts(publishedAt DESC)
  WHERE isPublished = true AND publishedAt IS NOT NULL;
CREATE INDEX idx_blog_posts_categoryId ON blog_posts(categoryId);
CREATE INDEX idx_blog_posts_createdAt ON blog_posts(createdAt DESC);

-- For searching published posts
CREATE INDEX idx_blog_posts_visible ON blog_posts(publishedAt, isPublished)
  WHERE isPublished = true AND deletedAt IS NULL
  AND publishedAt <= CURRENT_TIMESTAMP;
```

**TypeScript (Drizzle)**:
```typescript
export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featuredImage"),
  categoryId: text("categoryId").references(() => blogCategories.id),
  tags: text("tags"), // JSON stringified array
  authorId: text("authorId").notNull().references(() => users.id),
  status: text("status").notNull().default("draft"),
  isPublished: boolean("isPublished").notNull().default(false),
  publishedAt: timestamp("publishedAt"),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  viewCount: integer("viewCount").default(0),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
```

---

### 3.7 TOOL_PROMOTIONS Table

```sql
CREATE TABLE tool_promotions (
  -- Identity
  id TEXT PRIMARY KEY,
  toolId TEXT NOT NULL UNIQUE,            -- One active promotion per tool

  -- Promotion tier
  tier TEXT NOT NULL,                     -- 'featured' | 'premium' | 'standard'
  priceUSD DECIMAL(10, 2) NOT NULL,       -- Monthly price

  -- Duration
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,

  -- Auto-renewal
  autoRenew BOOLEAN DEFAULT false,

  -- Payment
  paymentMethod TEXT,                     -- 'stripe' | 'paypal'
  transactionId TEXT,                     -- For payment tracking

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | active | expired | cancelled

  -- Cancellation
  cancelledAt TIMESTAMP,
  cancellationReason TEXT,

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  FOREIGN KEY (toolId) REFERENCES tools(id) ON DELETE CASCADE,
  CONSTRAINT tier_check CHECK (tier IN ('featured', 'premium', 'standard')),
  CONSTRAINT status_check CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  CONSTRAINT date_check CHECK (endDate > startDate),
  CONSTRAINT price_check CHECK (priceUSD > 0)
);

-- Indexes
CREATE INDEX idx_promotions_toolId ON tool_promotions(toolId);
CREATE INDEX idx_promotions_status ON tool_promotions(status);
CREATE INDEX idx_promotions_tier ON tool_promotions(tier);
CREATE INDEX idx_promotions_endDate ON tool_promotions(endDate)
  WHERE status = 'active';
CREATE INDEX idx_promotions_active ON tool_promotions(status, endDate)
  WHERE status = 'active' AND endDate > CURRENT_TIMESTAMP;

-- For cleanup of expired promotions
CREATE INDEX idx_promotions_expiry ON tool_promotions(endDate)
  WHERE status = 'active' AND endDate <= CURRENT_TIMESTAMP;
```

**TypeScript (Drizzle)**:
```typescript
export const toolPromotions = sqliteTable("tool_promotions", {
  id: text("id").primaryKey(),
  toolId: text("toolId").notNull().unique().references(() => tools.id),
  tier: text("tier").notNull(), // 'featured' | 'premium' | 'standard'
  priceUSD: real("priceUSD").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  autoRenew: boolean("autoRenew").default(false),
  paymentMethod: text("paymentMethod"),
  transactionId: text("transactionId"),
  status: text("status").notNull().default("pending"),
  cancelledAt: timestamp("cancelledAt"),
  cancellationReason: text("cancellationReason"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
```

---

### 3.8 VERIFICATION_TOKENS Table

```sql
CREATE TABLE verification_tokens (
  -- Identity
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,             -- Secure random token

  -- Association
  submissionId TEXT NOT NULL,

  -- Expiration
  expiresAt TIMESTAMP NOT NULL,           -- Token expiry time (24 hours)
  usedAt TIMESTAMP,                       -- When token was used

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  FOREIGN KEY (submissionId) REFERENCES tool_submissions(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_tokens_token ON verification_tokens(token);
CREATE INDEX idx_tokens_submissionId ON verification_tokens(submissionId);
CREATE INDEX idx_tokens_expiresAt ON verification_tokens(expiresAt)
  WHERE usedAt IS NULL;

-- For cleanup of expired tokens
CREATE INDEX idx_tokens_cleanup ON verification_tokens(expiresAt)
  WHERE usedAt IS NULL AND expiresAt < CURRENT_TIMESTAMP;
```

**TypeScript (Drizzle)**:
```typescript
export const verificationTokens = sqliteTable("verification_tokens", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  submissionId: text("submissionId").notNull().references(() => toolSubmissions.id),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

---

### 3.9 AUDIT_LOGS Table

```sql
CREATE TABLE audit_logs (
  -- Identity
  id TEXT PRIMARY KEY,

  -- Who did it
  adminId TEXT NOT NULL,
  adminRole TEXT NOT NULL,                -- Snapshot of role at time of action

  -- What happened
  action TEXT NOT NULL,                   -- e.g., 'tool_created', 'submission_approved'
  entityType TEXT NOT NULL,               -- e.g., 'tool', 'submission', 'user'
  entityId TEXT,                          -- ID of affected entity

  -- Changes
  oldValue TEXT,                          -- JSON of old data
  newValue TEXT,                          -- JSON of new data
  changes TEXT,                           -- JSON array of {field, oldValue, newValue}

  -- Context
  description TEXT,                       -- Human-readable description
  ipAddress TEXT,
  userAgent TEXT,

  -- Timestamps
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE RESTRICT
);

-- Indexes
CREATE INDEX idx_audit_logs_adminId ON audit_logs(adminId);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entityType ON audit_logs(entityType);
CREATE INDEX idx_audit_logs_entityId ON audit_logs(entityId);
CREATE INDEX idx_audit_logs_createdAt ON audit_logs(createdAt DESC);

-- For searching specific entity changes
CREATE INDEX idx_audit_logs_entity ON audit_logs(entityType, entityId, createdAt DESC);

-- For recent admin activity
CREATE INDEX idx_audit_logs_admin_recent ON audit_logs(adminId, createdAt DESC);
```

**TypeScript (Drizzle)**:
```typescript
export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  adminId: text("adminId").notNull().references(() => users.id),
  adminRole: text("adminRole").notNull(),
  action: text("action").notNull(),
  entityType: text("entityType").notNull(),
  entityId: text("entityId"),
  oldValue: text("oldValue"), // JSON
  newValue: text("newValue"), // JSON
  changes: text("changes"), // JSON array
  description: text("description"),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

---

## 4. Sample Data

### 4.1 Sample USERS Records

```json
{
  "users": [
    {
      "id": "user_001",
      "email": "admin@toolsail.top",
      "emailVerified": true,
      "name": "Linda Admin",
      "image": "https://avatars.example.com/admin.jpg",
      "role": "admin",
      "adminRole": "admin",
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    },
    {
      "id": "user_002",
      "email": "editor@toolsail.top",
      "emailVerified": true,
      "name": "Editor User",
      "image": null,
      "role": "admin",
      "adminRole": "editor",
      "createdAt": "2025-01-05T14:30:00Z",
      "updatedAt": "2025-01-05T14:30:00Z"
    },
    {
      "id": "user_003",
      "email": "john@example.com",
      "emailVerified": true,
      "name": "John Doe",
      "image": "https://avatars.example.com/john.jpg",
      "role": "user",
      "adminRole": null,
      "createdAt": "2025-01-10T08:00:00Z",
      "updatedAt": "2025-01-10T08:00:00Z"
    }
  ]
}
```

### 4.2 Sample CATEGORIES Records

```json
{
  "categories": [
    {
      "id": "cat_001",
      "name": "AI Tools",
      "slug": "ai-tools",
      "icon": "cpu",
      "description": "Artificial Intelligence and Machine Learning tools",
      "parentId": null,
      "displayOrder": 1,
      "deletedAt": null,
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    },
    {
      "id": "cat_002",
      "name": "Digital Tools",
      "slug": "digital-tools",
      "icon": "zap",
      "description": "Productivity and creative tools",
      "parentId": null,
      "displayOrder": 2,
      "deletedAt": null,
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    },
    {
      "id": "cat_003",
      "name": "Image Generation",
      "slug": "image-generation",
      "icon": "image",
      "description": "AI-powered image creation",
      "parentId": "cat_001",
      "displayOrder": 1,
      "deletedAt": null,
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### 4.3 Sample TOOLS Records

```json
{
  "tools": [
    {
      "id": "tool_001",
      "name": "ChatGPT",
      "url": "https://chat.openai.com",
      "description": "Advanced AI-powered conversational assistant by OpenAI",
      "logoUrl": "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
      "categoryId": "cat_001",
      "isPublished": true,
      "isFeatured": true,
      "submissionId": null,
      "submittedBy": null,
      "viewCount": 15420,
      "clickCount": 3240,
      "metaDescription": "Free ChatGPT by OpenAI - AI chatbot for writing, coding, and analysis",
      "metaKeywords": "chatgpt, ai, openai, chatbot",
      "deletedAt": null,
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-11-15T14:30:00Z"
    },
    {
      "id": "tool_002",
      "name": "Midjourney",
      "url": "https://www.midjourney.com",
      "description": "AI image generator using Discord for creating stunning artwork",
      "logoUrl": "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
      "categoryId": "cat_003",
      "isPublished": true,
      "isFeatured": true,
      "submissionId": null,
      "submittedBy": null,
      "viewCount": 12350,
      "clickCount": 2880,
      "metaDescription": "Midjourney - AI art generator for creating beautiful images",
      "metaKeywords": "midjourney, ai image generator, art",
      "deletedAt": null,
      "createdAt": "2025-01-02T11:00:00Z",
      "updatedAt": "2025-11-15T14:30:00Z"
    }
  ]
}
```

### 4.4 Sample TOOL_SUBMISSIONS Records

```json
{
  "toolSubmissions": [
    {
      "id": "sub_001",
      "name": "Claude AI",
      "url": "https://claude.ai",
      "description": "Advanced AI assistant from Anthropic",
      "logoUrl": "https://example.com/claude-logo.png",
      "categoryId": "cat_001",
      "submittedBy": "user_003",
      "email": null,
      "emailVerified": true,
      "status": "pending",
      "feedbackComments": "[]",
      "rejectionReason": null,
      "isFeatured": false,
      "reviewedBy": null,
      "reviewedAt": null,
      "rejectedBy": null,
      "rejectedAt": null,
      "toolId": null,
      "deletedAt": null,
      "createdAt": "2025-11-15T09:30:00Z",
      "updatedAt": "2025-11-15T09:30:00Z"
    },
    {
      "id": "sub_002",
      "name": "Figma Design System",
      "url": "https://figma.com",
      "description": "Collaborative design tool for UI/UX teams",
      "logoUrl": "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
      "categoryId": "cat_002",
      "submittedBy": null,
      "email": "designer@company.com",
      "emailVerified": true,
      "status": "approved",
      "feedbackComments": "[{\"text\": \"Great submission!\", \"by\": \"user_002\", \"at\": \"2025-11-14T15:00:00Z\"}]",
      "rejectionReason": null,
      "isFeatured": false,
      "reviewedBy": "user_002",
      "reviewedAt": "2025-11-14T15:00:00Z",
      "rejectedBy": null,
      "rejectedAt": null,
      "toolId": "tool_003",
      "deletedAt": null,
      "createdAt": "2025-11-10T14:20:00Z",
      "updatedAt": "2025-11-14T15:00:00Z"
    }
  ]
}
```

### 4.5 Sample BLOG_POSTS Records

```json
{
  "blogPosts": [
    {
      "id": "post_001",
      "title": "Top 10 AI Tools for Content Creators in 2025",
      "slug": "top-10-ai-tools-content-creators-2025",
      "content": "# Top 10 AI Tools for Content Creators\n\nAI is revolutionizing content creation... [markdown content]",
      "excerpt": "Discover the best AI tools that content creators are using in 2025",
      "featuredImage": "https://example.com/featured/ai-tools.jpg",
      "categoryId": "blog_cat_001",
      "tags": "[\"ai\", \"content-creation\", \"tools\", \"2025\"]",
      "authorId": "user_001",
      "status": "published",
      "isPublished": true,
      "publishedAt": "2025-11-15T10:00:00Z",
      "metaDescription": "Best AI tools for content creators - ChatGPT, Midjourney, and more",
      "metaKeywords": "ai tools, content creation, 2025",
      "viewCount": 2840,
      "deletedAt": null,
      "createdAt": "2025-11-10T08:30:00Z",
      "updatedAt": "2025-11-15T10:00:00Z"
    },
    {
      "id": "post_002",
      "title": "Getting Started with Midjourney",
      "slug": "getting-started-with-midjourney",
      "content": "# Getting Started with Midjourney\n\nMidjourney is an AI image generator... [markdown content]",
      "excerpt": "A beginner's guide to creating amazing AI art with Midjourney",
      "featuredImage": "https://example.com/featured/midjourney.jpg",
      "categoryId": "blog_cat_001",
      "tags": "[\"midjourney\", \"ai-art\", \"tutorial\"]",
      "authorId": "user_002",
      "status": "draft",
      "isPublished": false,
      "publishedAt": null,
      "metaDescription": "Complete guide to using Midjourney for AI art generation",
      "metaKeywords": "midjourney, ai art, tutorial",
      "viewCount": 0,
      "deletedAt": null,
      "createdAt": "2025-11-14T15:30:00Z",
      "updatedAt": "2025-11-14T15:30:00Z"
    }
  ]
}
```

### 4.6 Sample TOOL_PROMOTIONS Records

```json
{
  "toolPromotions": [
    {
      "id": "promo_001",
      "toolId": "tool_001",
      "tier": "featured",
      "priceUSD": 199.99,
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2025-12-01T00:00:00Z",
      "autoRenew": true,
      "paymentMethod": "stripe",
      "transactionId": "ch_1234567890",
      "status": "active",
      "cancelledAt": null,
      "cancellationReason": null,
      "createdAt": "2025-10-28T12:00:00Z",
      "updatedAt": "2025-11-01T00:00:00Z"
    },
    {
      "id": "promo_002",
      "toolId": "tool_002",
      "tier": "premium",
      "priceUSD": 99.99,
      "startDate": "2025-11-10T00:00:00Z",
      "endDate": "2025-12-10T00:00:00Z",
      "autoRenew": false,
      "paymentMethod": "stripe",
      "transactionId": "ch_0987654321",
      "status": "active",
      "cancelledAt": null,
      "cancellationReason": null,
      "createdAt": "2025-11-08T10:30:00Z",
      "updatedAt": "2025-11-10T00:00:00Z"
    }
  ]
}
```

### 4.7 Sample AUDIT_LOGS Records

```json
{
  "auditLogs": [
    {
      "id": "log_001",
      "adminId": "user_001",
      "adminRole": "admin",
      "action": "submission_approved",
      "entityType": "tool_submission",
      "entityId": "sub_002",
      "oldValue": "{\"status\": \"pending\"}",
      "newValue": "{\"status\": \"approved\"}",
      "changes": "[{\"field\": \"status\", \"oldValue\": \"pending\", \"newValue\": \"approved\"}]",
      "description": "Approved tool submission: Figma Design System",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-11-15T14:30:00Z"
    },
    {
      "id": "log_002",
      "adminId": "user_002",
      "adminRole": "editor",
      "action": "blog_post_published",
      "entityType": "blog_post",
      "entityId": "post_001",
      "oldValue": "{\"isPublished\": false}",
      "newValue": "{\"isPublished\": true}",
      "changes": "[{\"field\": \"isPublished\", \"oldValue\": false, \"newValue\": true}]",
      "description": "Published blog post: Top 10 AI Tools for Content Creators",
      "ipAddress": "192.168.1.2",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-11-15T10:00:00Z"
    }
  ]
}
```

---

## 5. Indexing Strategy

### 5.1 Index Categories

| Category | Purpose | Example |
|----------|---------|---------|
| **Primary Key** | Unique identifier | `id` on all tables |
| **Foreign Key** | Join operations | `categoryId`, `submittedBy`, `toolId` |
| **Search** | WHERE clause filtering | `email`, `slug`, `status` |
| **Sort** | ORDER BY operations | `createdAt`, `displayOrder`, `viewCount` |
| **Composite** | Combined filters | `(status, endDate)` for active promotions |
| **Filtered** | Conditional lookups | `isPublished` where true only |
| **Unique** | Prevent duplicates | `email`, `slug`, `token` |

### 5.2 Recommended Indexes by Access Pattern

#### Tools Table - Most Critical
```sql
-- Frontend display (very frequent)
CREATE INDEX idx_tools_published_category ON tools(isPublished, categoryId, createdAt DESC)
  WHERE isPublished = true AND deletedAt IS NULL;

-- Featured tools display
CREATE INDEX idx_tools_featured_created ON tools(isFeatured, createdAt DESC)
  WHERE isFeatured = true AND isPublished = true;

-- Search/filter
CREATE INDEX idx_tools_full_text ON tools(name, description);
```

#### Tool Submissions - High Priority
```sql
-- Admin dashboard
CREATE INDEX idx_submissions_status_date ON tool_submissions(status, createdAt DESC)
  WHERE status IN ('pending', 'changes_requested');

-- Email verification
CREATE INDEX idx_submissions_email_verified ON tool_submissions(email, emailVerified)
  WHERE submittedBy IS NULL;
```

#### Blog Posts - High Priority
```sql
-- Frontend listing
CREATE INDEX idx_blog_posts_published_date ON blog_posts(isPublished, publishedAt DESC)
  WHERE isPublished = true AND publishedAt <= CURRENT_TIMESTAMP AND deletedAt IS NULL;

-- Author's posts
CREATE INDEX idx_blog_posts_author_date ON blog_posts(authorId, createdAt DESC)
  WHERE deletedAt IS NULL;
```

#### Tool Promotions - Medium Priority
```sql
-- Check active promotions
CREATE INDEX idx_promotions_active_expiry ON tool_promotions(status, endDate)
  WHERE status = 'active';
```

### 5.3 Query Performance Optimization

```typescript
// Example: Fetch published tools by category with sorting
// Query: SELECT * FROM tools WHERE categoryId = ? AND isPublished = true AND deletedAt IS NULL ORDER BY createdAt DESC
// Index: idx_tools_published_category

// Example: Find pending submissions for review
// Query: SELECT * FROM tool_submissions WHERE status IN ('pending', 'changes_requested') ORDER BY createdAt DESC
// Index: idx_submissions_status_date

// Example: Check for email verification
// Query: SELECT * FROM verification_tokens WHERE token = ? AND usedAt IS NULL
// Index: idx_tokens_token, idx_tokens_cleanup

// Example: Get published blog posts
// Query: SELECT * FROM blog_posts WHERE isPublished = true AND publishedAt <= NOW() AND deletedAt IS NULL ORDER BY publishedAt DESC
// Index: idx_blog_posts_published_date
```

---

## 6. Constraints and Validations

### 6.1 Referential Integrity

| Relationship | Constraint | Action on Delete |
|--------------|-----------|-----------------|
| tools → categories | FK(categoryId) | RESTRICT (prevent delete) |
| tools → users | FK(submittedBy) | SET NULL (allow delete) |
| tools → tool_submissions | FK(submissionId) | CASCADE (delete promotion) |
| tool_submissions → categories | FK(categoryId) | RESTRICT (prevent delete) |
| tool_submissions → users | FK(submittedBy) | CASCADE (delete submission) |
| tool_submissions → verification_tokens | FK(submissionId) | CASCADE (clean up tokens) |
| tool_promotions → tools | FK(toolId) | CASCADE (delete promotion) |
| blog_posts → users | FK(authorId) | RESTRICT (prevent delete) |
| blog_posts → blog_categories | FK(categoryId) | SET NULL (allow delete) |
| audit_logs → users | FK(adminId) | RESTRICT (preserve history) |
| verification_tokens → tool_submissions | FK(submissionId) | CASCADE (clean up) |

### 6.2 Data Validation Rules

```typescript
// URL validation
CONSTRAINT url_valid CHECK (url LIKE 'http://%' OR url LIKE 'https://%')

// Slug format (lowercase, hyphens only)
CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')

// Role validation
CONSTRAINT role_check CHECK (role IN ('user', 'admin'))
CONSTRAINT admin_role_check CHECK (
  (role = 'admin' AND adminRole IS NOT NULL) OR
  (role = 'user' AND adminRole IS NULL)
)

// Submission status
CONSTRAINT status_check CHECK (status IN (
  'pending', 'changes_requested', 'approved', 'rejected', 'published'
))

// Guest or registered user (not both)
CONSTRAINT guest_or_user CHECK (
  (submittedBy IS NOT NULL AND email IS NULL) OR
  (submittedBy IS NULL AND email IS NOT NULL)
)

// Blog post status
CONSTRAINT published_check CHECK (
  (status = 'published' AND isPublished = true AND publishedAt IS NOT NULL) OR
  (status IN ('draft', 'scheduled') AND (isPublished = false OR publishedAt IS NULL))
)

// Promotion date range
CONSTRAINT date_check CHECK (endDate > startDate)
CONSTRAINT price_check CHECK (priceUSD > 0)

// Promotion tier
CONSTRAINT tier_check CHECK (tier IN ('featured', 'premium', 'standard'))

// Promotion status
CONSTRAINT status_check CHECK (status IN ('pending', 'active', 'expired', 'cancelled'))
```

---

## 7. Growth and Scaling Considerations

### 7.1 Expected Data Volume

| Entity | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| **Tools** | ~5,000 | ~20,000 | ~50,000 |
| **Submissions** | ~10,000 | ~40,000 | ~100,000 |
| **Blog Posts** | ~50 | ~150 | ~300 |
| **Users** | ~5,000 | ~20,000 | ~50,000 |
| **Audit Logs** | ~50,000 | ~200,000 | ~500,000 |

### 7.2 Migration Path (SQLite → PostgreSQL)

```
Phase 1: SQLite on Cloudflare D1
├─ Months 0-6: Perfect for initial launch
├─ Metrics: <100k DAU, <1M tools
└─ Pros: Simple, built-in, low cost

Phase 2: PostgreSQL with Replication
├─ Months 6-12: Scale to 1M+ DAU
├─ Setup: Primary + read replicas
├─ Drizzle ORM handles migration seamlessly
└─ Tools remain unchanged (same SQL dialect)

Phase 3: Database Sharding (if needed)
├─ Years 2+: Horizontal scaling by category/region
└─ Requires application-level routing
```

### 7.3 Performance Tips

```typescript
// 1. Pagination (never SELECT without LIMIT)
const tools = await db
  .select()
  .from(tools)
  .where(eq(tools.isPublished, true))
  .orderBy(desc(tools.createdAt))
  .limit(20)
  .offset(page * 20);

// 2. Use indexes for filtering
const submissions = await db
  .select()
  .from(toolSubmissions)
  .where(inArray(toolSubmissions.status, ['pending', 'changes_requested']))
  .orderBy(desc(toolSubmissions.createdAt));

// 3. Eager load related data
const toolsWithCategory = await db
  .select()
  .from(tools)
  .innerJoin(categories, eq(tools.categoryId, categories.id))
  .where(eq(tools.isPublished, true));

// 4. Cache frequently accessed data
// - Categories (rarely change)
// - Featured tools (updated daily)
// - Blog posts (published content)

// 5. Archive old audit logs
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
await db.delete(auditLogs).where(lt(auditLogs.createdAt, thirtyDaysAgo));
```

---

## 8. Database Initialization (Drizzle Schema)

```typescript
// drizzle/schema.ts - Complete schema file
import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  primaryKey,
  uniqueIndex,
  index,
  foreignKey,
} from "drizzle-orm/sqlite-core";

// Users Table
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").default(false),
    name: text("name").notNull(),
    image: text("image"),
    role: text("role").notNull().default("user"),
    adminRole: text("adminRole"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    roleIdx: index("idx_users_role").on(table.role),
    createdAtIdx: index("idx_users_createdAt").on(table.createdAt),
  })
);

// Categories Table
export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull(),
    description: text("description"),
    parentId: text("parentId"),
    displayOrder: integer("displayOrder").notNull(),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    parentIdFk: foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }),
    slugIdx: index("idx_categories_slug").on(table.slug),
    parentIdx: index("idx_categories_parent").on(table.parentId),
  })
);

// Tools Table
export const tools = sqliteTable(
  "tools",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description").notNull(),
    logoUrl: text("logoUrl"),
    categoryId: text("categoryId").notNull(),
    isPublished: boolean("isPublished").notNull().default(true),
    isFeatured: boolean("isFeatured").notNull().default(false),
    submissionId: text("submissionId").unique(),
    submittedBy: text("submittedBy"),
    viewCount: integer("viewCount").default(0),
    clickCount: integer("clickCount").default(0),
    metaDescription: text("metaDescription"),
    metaKeywords: text("metaKeywords"),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    categoryIdFk: foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
    }),
    submittedByFk: foreignKey({
      columns: [table.submittedBy],
      foreignColumns: [users.id],
    }),
    categoryIdx: index("idx_tools_categoryId").on(table.categoryId),
    publishedIdx: index("idx_tools_isPublished").on(table.isPublished),
    featuredIdx: index("idx_tools_isFeatured").on(table.isFeatured),
    createdAtIdx: index("idx_tools_createdAt").on(table.createdAt),
    submittedByIdx: index("idx_tools_submittedBy").on(table.submittedBy),
  })
);

// [Remaining tables follow same pattern...]
// Tool Submissions, Blog Posts, Promotions, etc.

export const schema = {
  users,
  categories,
  tools,
  // ... all other tables
};
```

---

## 9. Backup and Recovery Strategy

### 9.1 Backup Schedule

| Backup Type | Frequency | Retention | Purpose |
|------------|-----------|-----------|---------|
| Automatic (D1) | Continuous | 30 days | Cloudflare-managed |
| Daily | Nightly | 30 days | Point-in-time recovery |
| Weekly | Every Sunday | 90 days | Long-term archive |
| Monthly | 1st of month | 1 year | Compliance |

### 9.2 Recovery Procedures

```bash
# List available backups
wrangler d1 info <database-name> --json

# Restore from specific backup
wrangler d1 restore <database-name> <timestamp>

# Manual export
wrangler d1 execute <database-name> --command ".dump" > backup.sql

# Manual import
wrangler d1 execute <database-name> < backup.sql
```

---

## 10. Database Monitoring

### 10.1 Key Metrics to Monitor

```
Query Performance:
├─ Slow query threshold: > 100ms
├─ Query count per minute
├─ Average query latency
└─ P95/P99 latency

Data Health:
├─ Row count growth by table
├─ Index fragmentation
├─ Constraint violations
└─ Orphaned records

Resource Usage:
├─ Database size
├─ Storage growth rate
├─ CPU usage
└─ Bandwidth consumption
```

### 10.2 Example Monitoring Queries

```sql
-- Largest tables
SELECT
  tbl_name,
  (SELECT COUNT(*) FROM tool_submissions) as row_count
FROM sqlite_master
WHERE type = 'table'
ORDER BY row_count DESC;

-- Index usage (SQLite)
SELECT * FROM sqlite_stat1 ORDER BY stat DESC;

-- Recent slow queries
SELECT * FROM query_logs
WHERE duration_ms > 100
ORDER BY createdAt DESC
LIMIT 100;
```

---

## Summary

This DATABASE_DESIGN.md provides:

1. **9 Tables** with complete schema definitions:
   - Users, Categories, Tools, Tool Submissions
   - Blog Posts/Categories, Tool Promotions
   - Verification Tokens, Audit Logs

2. **Complete Drizzle ORM integration** with TypeScript types for type-safe queries

3. **Sample data** for 7 key tables showing realistic records

4. **Strategic indexing** optimized for both reads and writes with specific query patterns

5. **Database selection analysis** recommending SQLite (D1) for initial launch with clear path to PostgreSQL

6. **Growth and scaling strategy** from 0-100k DAU with migration path

7. **Referential integrity** with appropriate CASCADE/RESTRICT/SET NULL rules

8. **Validation constraints** ensuring data consistency

9. **Backup and monitoring** procedures for production reliability

The schema is normalized (3NF) for data integrity while optimized for the specific query patterns of Toolsail's frontend and backend features.
