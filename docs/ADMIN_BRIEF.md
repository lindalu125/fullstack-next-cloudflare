# ADMIN_BRIEF.md - Backend Administration Guide

## Overview

This document defines the administrative backend structure for Toolsail, including role-based permissions, data management workflows, and module-specific business logic. The admin panel is a protected area exclusively for platform administrators to manage tools, submissions, content, and website settings.

---

## 1. Role-Based Access Control (RBAC)

### 1.1 Admin Role Definition

```typescript
// Database Schema Extension
interface AdminRole {
  id: string;
  userId: string;
  role: 'admin' | 'editor' | 'moderator'; // Three tiers
  permissions: string[]; // Granular permission list
  createdAt: Date;
  updatedAt: Date;
}

// Better Auth Extended User Model
interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified: boolean;
  role: 'admin' | 'user'; // Backend role only (user submissions are for 'user' role)
  adminRole?: 'admin' | 'editor' | 'moderator'; // Tier within admin
  createdAt: Date;
  updatedAt: Date;
}
```

### 1.2 Three-Tier Admin Permission Model

#### Tier 1: Super Admin
- **Access Level**: Full access to all features and settings
- **Responsibility**: System administration, team management, critical settings
- **Permissions**:
  - All editor and moderator permissions
  - User/admin management (add/remove admin users, change roles)
  - Website settings (domain, SEO, analytics keys)
  - AdSense configuration and revenue tracking
  - System logs and audit trails
  - Database backup/recovery operations
  - API key management

#### Tier 2: Editor
- **Access Level**: Content and tool management
- **Responsibility**: Review and publish tools, manage blog content
- **Permissions**:
  - Review and approve/reject tool submissions
  - Manage published tools (create, edit, delete)
  - Manage blog posts (create, edit, publish, delete)
  - Manage categories (create, edit, delete)
  - Batch upload tools (CSV import)
  - View analytics and statistics
  - Create promotions (pricing tiers for paid tools)
  - Cannot access website settings or user management

#### Tier 3: Moderator
- **Access Level**: Review and moderation only
- **Responsibility**: Review submissions, provide feedback
- **Permissions**:
  - View and review tool submissions (read-only on published tools)
  - Add comments/feedback on submissions
  - Approve or reject submissions (but cannot directly publish)
  - View blog posts and comments (read-only)
  - Cannot edit website settings or user data
  - Cannot delete content
  - Cannot manage categories

### 1.3 Permission Matrix

| Feature | Super Admin | Editor | Moderator | Notes |
|---------|-------------|--------|-----------|-------|
| **Tool Management** |
| View all tools | ✅ | ✅ | ❌ |
| Create tool | ✅ | ✅ | ❌ |
| Edit tool | ✅ | ✅ | ❌ |
| Delete tool | ✅ | ✅ | ❌ |
| Batch upload | ✅ | ✅ | ❌ |
| **Submissions** |
| View submissions | ✅ | ✅ | ✅ |
| Approve submission | ✅ | ✅ | ✅ |
| Reject submission | ✅ | ✅ | ✅ |
| Request changes | ✅ | ✅ | ✅ |
| Add feedback comment | ✅ | ✅ | ✅ |
| **Blog Management** |
| Create post | ✅ | ✅ | ❌ |
| Edit post | ✅ | ✅ | ❌ |
| Delete post | ✅ | ✅ | ❌ |
| Publish post | ✅ | ✅ | ❌ |
| View posts | ✅ | ✅ | ✅ |
| **Category Management** |
| Create category | ✅ | ✅ | ❌ |
| Edit category | ✅ | ✅ | ❌ |
| Delete category | ✅ | ✅ | ❌ |
| View categories | ✅ | ✅ | ✅ |
| **Promotion Management** |
| Create promotion | ✅ | ✅ | ❌ |
| Edit promotion | ✅ | ✅ | ❌ |
| Delete promotion | ✅ | ✅ | ❌ |
| View promotions | ✅ | ✅ | ❌ |
| **Website Settings** |
| View settings | ✅ | ❌ | ❌ |
| Edit SEO settings | ✅ | ❌ | ❌ |
| Configure AdSense | ✅ | ❌ | ❌ |
| Configure social media | ✅ | ❌ | ❌ |
| View analytics | ✅ | ✅ | ❌ |
| **Admin Management** |
| Add admin user | ✅ | ❌ | ❌ |
| Remove admin user | ✅ | ❌ | ❌ |
| Change admin role | ✅ | ❌ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |

### 1.4 Authentication Flow

```
1. Admin Login Page (/admin/login)
   ↓
2. Better Auth Session Check
   - Verify user.role === 'admin'
   - Verify user.adminRole exists (editor|moderator)
   ↓
3. Dashboard (/admin)
   - Display based on adminRole
   - Super Admin: Full dashboard
   - Editor: Limited dashboard (no settings)
   - Moderator: Submissions-focused dashboard
   ↓
4. Feature Access Control
   - Each route checks specific permissions
   - Unauthorized access redirects to 403 page
```

---

## 2. Data Management Processes

### 2.1 Tool Submission Workflow

```
GUEST SUBMISSION
┌─────────────────────────────────────────────────────────┐
│ 1. Guest fills form without login                       │
│    - Tool name, URL, description, logo (URL), category  │
│    - Email verification required                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Save to tool_submissions table                       │
│    - status: "pending"                                  │
│    - submittedBy: null (guest)                         │
│    - emailVerified: false initially                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Send verification email                             │
│    - Link with verification token                       │
│    - Token expires in 24 hours                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Guest verifies email (clicks link)                  │
│    - Update emailVerified: true                        │
│    - Submission moves to review queue                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Admin reviews in /admin/submissions                 │
│    - View all pending submissions                      │
│    - Can request changes (status: "changes_requested") │
│    - Can approve (creates tool entry in tools table)   │
│    - Can reject (status: "rejected", reason saved)     │
└─────────────────────────────────────────────────────────┘
                         ↓
        ┌──────────────┬──────────────┐
        ↓              ↓              ↓
    APPROVED      REJECTED    CHANGES_REQUESTED
        │              │              │
        │              │              └─→ Email guest with feedback
        │              │                  Guest can update & resubmit
        │              │
        │              └─→ Email guest with rejection reason
        │
        └─→ Create tool entry in tools table
            - Inherit all data from submission
            - Set isPublished: true
            - Set status: "active"
            - Email guest with confirmation

REGISTERED USER SUBMISSION
┌─────────────────────────────────────────────────────────┐
│ 1. Logged-in user fills form (simpler version)         │
│    - Same fields but no email verification needed      │
│    - Can save as draft before submitting               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Save to tool_submissions table                       │
│    - status: "pending"                                  │
│    - submittedBy: user.id                              │
│    - emailVerified: true (already verified via auth)   │
└─────────────────────────────────────────────────────────┘
                         ↓
         (Continues same as guest from Step 5 above)
```

### 2.2 Tool Management CRUD Workflow

```
CREATE TOOL (Admin directly)
┌─────────────────────────────────────────────────────────┐
│ 1. Admin clicks "Add Tool" in /admin/tools             │
│    - Opens form modal or separate page                 │
│    - All fields available                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Admin fills form and submits                        │
│    - Validate required fields (name, URL, category)    │
│    - Handle logo upload/URL                            │
│    - Allow featured tag during creation                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Create tool in tools table                          │
│    - Insert with isPublished: true (admin bypass)     │
│    - Set createdAt, updatedAt timestamps              │
│    - Assign to categories                              │
│    - Record in audit log                               │
└─────────────────────────────────────────────────────────┘

EDIT TOOL
┌─────────────────────────────────────────────────────────┐
│ 1. Admin clicks "Edit" on tool in /admin/tools        │
│    - Pre-populate form with current data               │
│    - Show edit history (last edited by, when)          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Admin modifies fields and saves                     │
│    - Validate changes                                   │
│    - Update updatedAt timestamp                        │
│    - Record change in audit log                        │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Changes reflected immediately on frontend           │
│    - No cache delay (or short 5-min cache)            │
│    - Notify if tool is featured (user-facing)         │
└─────────────────────────────────────────────────────────┘

DELETE TOOL (Soft delete recommended)
┌─────────────────────────────────────────────────────────┐
│ 1. Admin clicks "Delete" on tool                       │
│    - Show confirmation dialog                          │
│    - Option: "Keep in archive" or "Permanently delete" │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Soft delete (recommended)                           │
│    - Set deletedAt timestamp                           │
│    - Set isPublished: false                            │
│    - Keep in database for recovery                     │
│    - Record in audit log                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend excludes from display                      │
│    - WHERE isPublished = true AND deletedAt IS NULL   │
│    - Admin can still view in archive                   │
└─────────────────────────────────────────────────────────┘

BATCH UPLOAD TOOLS (CSV Import)
┌─────────────────────────────────────────────────────────┐
│ 1. Admin goes to /admin/tools/batch-upload            │
│    - See import form with step indicator               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 1: Upload CSV File                                │
│    - Accept .csv format                                │
│    - File validation (size, format)                    │
│    - Show file preview (first 5 rows)                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Map Columns                                    │
│    - Show CSV headers                                  │
│    - Map to tool table columns:                        │
│      CSV Column → Tool Field                           │
│      Name → name                                       │
│      URL → url                                         │
│      Description → description                        │
│      Logo → logoUrl                                    │
│      Category → category (dropdown)                    │
│      Featured → isFeatured (checkbox)                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Preview and Validate                           │
│    - Show parsed data                                  │
│    - Check for errors (missing required fields)        │
│    - Show error summary                                │
│    - Allow fixing errors before import                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Import and Confirm                             │
│    - Create tools in database                          │
│    - Show success count and any failed rows            │
│    - Allow re-import of failed rows                    │
│    - Record batch operation in audit log               │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Blog Post Management Workflow

```
CREATE/EDIT BLOG POST
┌─────────────────────────────────────────────────────────┐
│ 1. Admin clicks "New Post" or "Edit Post"             │
│    - Opens rich text editor (/admin/blog/editor)      │
│    - Pre-populate if editing                           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Editor Interface                                    │
│    - Left panel: Content editor (@uiw/react-md-editor)│
│    - Right panel: Preview (react-markdown)             │
│    - Markdown shortcuts support                        │
│    - Inline HTML allowed for colors:                  │
│      <span class="text-primary">colored</span>       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Metadata Input                                      │
│    - Title (required, SEO field)                       │
│    - Slug (auto-generate, allow edit)                  │
│    - Meta description (160 chars, SEO)                │
│    - Featured image (upload or URL)                    │
│    - Category (single select)                          │
│    - Tags (multi-select or create new)                │
│    - Publish settings:                                 │
│      - Status: Draft / Scheduled / Published          │
│      - Publish date (if scheduled)                     │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Save as Draft or Publish                           │
│    - Draft: Save without publishing (isPublished: false)│
│    - Schedule: Set publishedAt for future             │
│    - Publish: Immediate (isPublished: true)           │
│    - Record in audit log                              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Frontend Rendering                                  │
│    - Fetch post where isPublished = true              │
│    - Check publishedAt <= now                         │
│    - Render Markdown with custom styling              │
│    - Cache with 1-hour TTL                            │
└─────────────────────────────────────────────────────────┘

DELETE BLOG POST (Soft delete)
┌─────────────────────────────────────────────────────────┐
│ 1. Admin deletes post                                  │
│    - Set deletedAt timestamp                           │
│    - Set isPublished: false                            │
│    - Keep in database                                  │
│    - Record in audit log                               │
└─────────────────────────────────────────────────────────┘
```

### 2.4 Category Management Workflow

```
CREATE CATEGORY
┌─────────────────────────────────────────────────────────┐
│ 1. Admin goes to /admin/categories                    │
│    - Sees category tree view                           │
│    - Clicks "Add Category"                             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Modal Form                                          │
│    - Name (required, translatable)                     │
│    - Slug (auto-generate)                              │
│    - Parent Category (optional, for subcategories)    │
│    - Icon (from Lucide icon list)                     │
│    - Description (optional)                            │
│    - Display Order (number)                            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Create in Database                                  │
│    - Insert into categories table                      │
│    - If parent_id exists, validate parent exists     │
│    - Record in audit log                              │
│    - Invalidate category cache                         │
└─────────────────────────────────────────────────────────┘

UPDATE/DELETE CATEGORY
┌─────────────────────────────────────────────────────────┐
│ - Edit: Update all fields, handle child categories     │
│ - Delete: Check for associated tools                  │
│   - If tools exist: Show warning, prevent deletion    │
│   - If no tools: Allow soft delete (set deletedAt)   │
│ - Record in audit log                                 │
│ - Invalidate cache                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Module Logic and Business Rules

### 3.1 Submission Review Module

```typescript
// Submission Status State Machine
enum SubmissionStatus {
  PENDING = "pending",              // Initial state after submission
  CHANGES_REQUESTED = "changes_requested",  // Admin needs more info
  APPROVED = "approved",            // Ready to create tool
  REJECTED = "rejected",            // Not suitable for platform
  PUBLISHED = "published"           // Tool created and live
}

// Submission Review Workflow Logic
class SubmissionManager {
  // Approve submission: Create tool entry
  async approveSubmission(submissionId: string, adminId: string) {
    const submission = await getSubmission(submissionId);

    // Validate submission
    if (!submission.emailVerified && submission.submittedBy === null) {
      throw new Error("Guest submission must be email verified");
    }

    // Create tool entry
    const tool = await createTool({
      name: submission.name,
      url: submission.url,
      description: submission.description,
      logoUrl: submission.logoUrl,
      categoryId: submission.categoryId,
      isFeatured: submission.isFeatured || false,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update submission status
    await updateSubmission(submissionId, {
      status: SubmissionStatus.PUBLISHED,
      toolId: tool.id,
      reviewedBy: adminId,
      reviewedAt: new Date()
    });

    // Send confirmation email
    await sendApprovalEmail(submission.email || submission.user.email);

    return tool;
  }

  // Request changes: Mark for revision
  async requestChanges(
    submissionId: string,
    feedback: string,
    adminId: string
  ) {
    const submission = await getSubmission(submissionId);

    // Update status
    await updateSubmission(submissionId, {
      status: SubmissionStatus.CHANGES_REQUESTED,
      feedbackComments: [
        ...(submission.feedbackComments || []),
        { text: feedback, by: adminId, at: new Date() }
      ]
    });

    // Send feedback email
    const email = submission.email || submission.user.email;
    await sendFeedbackEmail(email, feedback);
  }

  // Reject submission
  async rejectSubmission(
    submissionId: string,
    reason: string,
    adminId: string
  ) {
    await updateSubmission(submissionId, {
      status: SubmissionStatus.REJECTED,
      rejectionReason: reason,
      rejectedBy: adminId,
      rejectedAt: new Date()
    });

    const submission = await getSubmission(submissionId);
    const email = submission.email || submission.user.email;
    await sendRejectionEmail(email, reason);
  }
}
```

### 3.2 Tool Approval and Publishing Logic

```typescript
// Tool Publishing Rules
class ToolPublishingLogic {
  // Admin-created tools publish immediately
  async createAdminTool(toolData: CreateToolInput): Promise<Tool> {
    return await db.tools.create({
      ...toolData,
      isPublished: true,      // Bypass review for admin
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // User-submitted tools go through review
  async createUserSubmission(
    toolData: CreateToolInput,
    userId: string
  ): Promise<ToolSubmission> {
    return await db.toolSubmissions.create({
      ...toolData,
      submittedBy: userId,
      status: "pending",      // Must be reviewed
      emailVerified: true,
      createdAt: new Date()
    });
  }

  // Featured tag can only be set by editors
  async setFeatured(toolId: string, isFeatured: boolean, adminRole: string) {
    if (adminRole !== 'admin' && adminRole !== 'editor') {
      throw new Error("Only editors can set featured status");
    }

    await db.tools.update(toolId, {
      isFeatured,
      updatedAt: new Date()
    });
  }

  // Tools are only visible when published and not deleted
  getPublishedTools(category?: string) {
    return db.tools.find({
      isPublished: true,
      deletedAt: null,
      ...(category && { categoryId: category })
    });
  }
}
```

### 3.3 Submission Email Verification Logic

```typescript
// Email verification for guest submissions
class SubmissionVerification {
  // Generate verification token
  async generateToken(submissionId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.verificationTokens.create({
      token,
      submissionId,
      expiresAt
    });

    return token;
  }

  // Send verification email
  async sendVerificationEmail(
    email: string,
    submissionId: string,
    name: string
  ) {
    const token = await this.generateToken(submissionId);
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/submissions/verify?token=${token}`;

    const emailContent = `
      Hi ${name},

      Please verify your email to complete your tool submission:
      ${verifyUrl}

      This link expires in 24 hours.
    `;

    await sendEmail({
      to: email,
      subject: "Verify your Toolsail submission",
      body: emailContent
    });
  }

  // Verify email token
  async verifyEmail(token: string) {
    const verificationRecord = await db.verificationTokens.findOne({ token });

    if (!verificationRecord) {
      throw new Error("Invalid or expired token");
    }

    if (new Date() > verificationRecord.expiresAt) {
      throw new Error("Token expired");
    }

    // Mark submission as verified
    await db.toolSubmissions.update(verificationRecord.submissionId, {
      emailVerified: true
    });

    // Delete used token
    await db.verificationTokens.delete(verificationRecord.id);

    return verificationRecord.submissionId;
  }
}
```

### 3.4 Blog Publishing and Scheduling Logic

```typescript
// Blog post scheduling and publishing
class BlogPublishingLogic {
  // Schedule post for future publishing
  async schedulePost(
    postId: string,
    publishDate: Date,
    adminId: string
  ) {
    if (publishDate < new Date()) {
      throw new Error("Publish date must be in the future");
    }

    await db.blogPosts.update(postId, {
      status: "scheduled",
      publishedAt: publishDate,
      updatedBy: adminId,
      updatedAt: new Date()
    });

    // Schedule job to auto-publish
    await scheduleJob({
      type: "publish_blog_post",
      postId,
      executeAt: publishDate
    });
  }

  // Auto-publish scheduled posts (runs daily or via cron)
  async publishScheduledPosts() {
    const postsToPublish = await db.blogPosts.find({
      status: "scheduled",
      publishedAt: { $lte: new Date() }
    });

    for (const post of postsToPublish) {
      await db.blogPosts.update(post.id, {
        status: "published",
        isPublished: true,
        publishedAt: new Date()
      });
    }
  }

  // Get visible blog posts for frontend
  getVisiblePosts() {
    return db.blogPosts.find({
      isPublished: true,
      publishedAt: { $lte: new Date() },
      deletedAt: null
    });
  }
}
```

### 3.5 Tool Logo Handling Logic

```typescript
// Logo URL validation and fallback
class LogoHandling {
  // Accept both URL and uploaded file
  async processLogoInput(
    logoInput: string | File
  ): Promise<string> {
    if (typeof logoInput === 'string') {
      // URL provided
      const isValid = await this.validateLogoUrl(logoInput);
      if (!isValid) {
        throw new Error("Invalid or inaccessible logo URL");
      }
      return logoInput;
    } else {
      // File uploaded
      const uploadedUrl = await this.uploadFile(logoInput);
      return uploadedUrl;
    }
  }

  // Validate URL is accessible
  private async validateLogoUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && response.headers.get('content-type')?.includes('image');
    } catch (e) {
      return false;
    }
  }

  // Auto-fetch favicon if no logo provided (optional)
  async fetchFaviconFallback(toolUrl: string): Promise<string | null> {
    try {
      const domain = new URL(toolUrl).hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

      // Verify favicon exists
      const response = await fetch(faviconUrl);
      return response.ok ? faviconUrl : null;
    } catch (e) {
      return null;
    }
  }
}
```

### 3.6 Promotion Management Logic

```typescript
// Paid promotion/listing feature
interface ToolPromotion {
  id: string;
  toolId: string;
  tier: 'featured' | 'premium' | 'standard';
  priceUSD: number; // Monthly price
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: 'stripe' | 'paypal';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

class PromotionManager {
  // Create promotion order
  async createPromotionOrder(
    toolId: string,
    tier: PromotionTier,
    durationMonths: number,
    userId: string
  ) {
    const tool = await db.tools.findOne({ id: toolId });

    if (!tool) {
      throw new Error("Tool not found");
    }

    if (tool.userId !== userId) {
      throw new Error("Can only promote own tools");
    }

    const price = this.getTierPrice(tier) * durationMonths;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);

    const promotion = await db.toolPromotions.create({
      toolId,
      tier,
      priceUSD: price,
      startDate: new Date(),
      endDate,
      autoRenew: false,
      status: 'pending',
      createdAt: new Date()
    });

    return promotion;
  }

  // Check if tool has active promotion
  hasActivePromotion(toolId: string): boolean {
    const promotion = db.toolPromotions.findOne({
      toolId,
      status: 'active',
      endDate: { $gte: new Date() }
    });

    return !!promotion;
  }

  // Get promotion display priority (featured > premium > standard)
  getPromotionTier(toolId: string): PromotionTier {
    const promotion = db.toolPromotions.findOne({
      toolId,
      status: 'active'
    });

    return promotion?.tier || 'standard';
  }

  // Cleanup expired promotions (runs daily)
  async cleanupExpiredPromotions() {
    const expiredPromotions = await db.toolPromotions.find({
      status: 'active',
      endDate: { $lt: new Date() }
    });

    for (const promo of expiredPromotions) {
      if (promo.autoRenew) {
        // Process renewal payment
        await this.processRenewal(promo);
      } else {
        // Mark as expired
        await db.toolPromotions.update(promo.id, {
          status: 'expired'
        });
      }
    }
  }
}
```

### 3.7 Analytics and Metrics Tracking

```typescript
// Track tool and submission metrics
class AnalyticsTracking {
  // Track tool view
  async trackToolView(toolId: string, context: { userAgent?: string; ip?: string }) {
    await db.toolViews.create({
      toolId,
      viewedAt: new Date(),
      userAgent: context.userAgent,
      ipAddress: context.ip
    });

    // Increment tool view count cache
    await updateCache(`tool:${toolId}:views`, (count) => count + 1);
  }

  // Get submission statistics for dashboard
  async getSubmissionStats() {
    return {
      pending: await db.toolSubmissions.count({ status: 'pending' }),
      changesRequested: await db.toolSubmissions.count({ status: 'changes_requested' }),
      approved: await db.toolSubmissions.count({ status: 'approved' }),
      rejected: await db.toolSubmissions.count({ status: 'rejected' }),
      totalThisMonth: await db.toolSubmissions.count({
        createdAt: { $gte: getMonthStart() }
      })
    };
  }

  // Get tool statistics
  async getToolStats() {
    return {
      totalTools: await db.tools.count({ isPublished: true, deletedAt: null }),
      featuredTools: await db.tools.count({ isFeatured: true, isPublished: true }),
      addedThisMonth: await db.tools.count({
        createdAt: { $gte: getMonthStart() }
      }),
      totalViews: await db.toolViews.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 }
          }
        }
      ])
    };
  }

  // Get revenue/promotion statistics
  async getRevenueStats() {
    return {
      activePromotions: await db.toolPromotions.count({
        status: 'active',
        endDate: { $gte: new Date() }
      }),
      monthlyRevenueUSD: await db.toolPromotions.aggregate([
        {
          $match: {
            status: 'active',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$priceUSD' }
          }
        }
      ]),
      totalRevenueUSD: await db.toolPromotions.aggregate([
        {
          $match: { status: 'active' }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$priceUSD' }
          }
        }
      ])
    };
  }
}
```

---

## 4. Submission Review State Diagram

```
                           START
                             ↓
                    ┌────────────────┐
                    │   GUEST/USER    │
                    │   SUBMISSION    │
                    └────────────────┘
                             ↓
                  ┌──────────────────────┐
                  │ EMAIL VERIFICATION?  │
                  │ (Guests only)        │
                  └──────────────────────┘
                    ↓                    ↓
                  YES                   NO
                   ↓                  (Registered)
        ┌────────────────────┐        ↓
        │ SEND EMAIL LINK    │   VERIFIED ✓
        │ emailVerified=false│        ↓
        └────────────────────┘    ┌─────────────────┐
                ↓                  │ PENDING REVIEW  │
        ┌──────────────────┐       │ status=pending  │
        │ WAITING FOR      │       └─────────────────┘
        │ VERIFICATION     │                ↓
        └──────────────────┘      ┌─────────────────────────────┐
                ↓                  │ ADMIN REVIEW OPTIONS        │
        ┌──────────────────┐       │ 1. Approve                  │
        │ VERIFY LINK      │       │ 2. Request Changes         │
        │ CLICKED?         │       │ 3. Reject                   │
        └──────────────────┘       └─────────────────────────────┘
                ↓                         ↓  ↓  ↓
        ┌──────────────────┐      ┌──────┴──┴──┴──┐
        │ emailVerified    │      │               │
        │ =true            │      │               │
        └──────────────────┘      ↓               ↓
                ↓           ┌──────────┐  ┌───────────┐
        ┌──────────────────┐│ CHANGES  │  │ REJECTED  │
        │ PENDING REVIEW   ││REQUESTED │  │           │
        │ status=pending   │└──────────┘  └───────────┘
        └──────────────────┘      ↓             ↓
                ↓           ┌──────────────┐ ┌────────┐
        (Merges with      │ EMAIL GUEST  │ │ EMAIL  │
         Registered)      │ WITH CHANGES │ │ REASON │
                ↓           └──────────────┘ └────────┘
        ┌──────────────────┐      ↓             ↓
        │ ADMIN REVIEW     │ EDIT & RESUBMIT  REJECTED
        │ (All same)       │      ↓             (END)
        └──────────────────┘    PENDING (loop)
                ↓
    ┌───────────────────┐
    │      APPROVED     │
    │ status=approved   │
    └───────────────────┘
            ↓
    ┌───────────────────┐
    │ CREATE TOOL ENTRY │
    │ isPublished=true  │
    │ status=active     │
    └───────────────────┘
            ↓
    ┌───────────────────┐
    │ TOOL LIVE ON      │
    │ FRONTEND          │
    │ status=published  │
    └───────────────────┘
            ↓
         (END)
```

---

## 5. Access Control Implementation Pattern

```typescript
// Middleware pattern for route protection
const adminOnlyMiddleware = async (
  request: NextRequest,
  context: any,
  handler: Function
) => {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 403 });
  }

  return handler(request, context);
};

// Permission check function
const requirePermission = (requiredPermission: string) => {
  return async (request: NextRequest, context: any, handler: Function) => {
    const session = await auth();
    const adminUser = session?.user?.adminRole;

    if (!adminUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const permissions = PERMISSION_MATRIX[adminUser];
    if (!permissions.includes(requiredPermission)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    return handler(request, context);
  };
};

// Usage in API routes
export const POST = requirePermission('tool:create')(async (req) => {
  // Create tool
});
```

---

## 6. Dashboard Role-Specific Views

### Super Admin Dashboard
```
┌─────────────────────────────────────────┐
│ Dashboard (Super Admin)                  │
├─────────────────────────────────────────┤
│ Key Metrics:                             │
│ ├─ Total Tools: 1,234                   │
│ ├─ Pending Submissions: 45              │
│ ├─ Active Promotions: 12                │
│ ├─ Monthly Revenue: $2,340              │
│                                         │
│ Recent Activity Log:                     │
│ ├─ [User] approved "Tool X"             │
│ ├─ [System] published scheduled post    │
│ ├─ [User] created new category          │
│                                         │
│ Quick Actions:                           │
│ ├─ [Button] Add Tool                    │
│ ├─ [Button] Review Submissions          │
│ ├─ [Button] Manage Admins               │
│ ├─ [Button] Website Settings            │
│                                         │
│ Manage Team:                             │
│ ├─ Current Admins (count)               │
│ ├─ [Link] Add/Remove Users              │
└─────────────────────────────────────────┘
```

### Editor Dashboard
```
┌─────────────────────────────────────────┐
│ Dashboard (Editor)                       │
├─────────────────────────────────────────┤
│ Key Metrics:                             │
│ ├─ Total Tools: 1,234                   │
│ ├─ Pending Submissions: 45              │
│ ├─ Published Posts: 127                 │
│                                         │
│ Pending Submissions:                     │
│ ├─ [Table] 45 submissions waiting       │
│ └─ [Link] Review All                    │
│                                         │
│ Quick Actions:                           │
│ ├─ [Button] Add Tool                    │
│ ├─ [Button] Write Blog Post             │
│ ├─ [Button] Batch Upload Tools          │
│                                         │
│ Recent Changes:                          │
│ ├─ [List] Last 10 edits by you         │
└─────────────────────────────────────────┘
```

### Moderator Dashboard
```
┌─────────────────────────────────────────┐
│ Dashboard (Moderator)                    │
├─────────────────────────────────────────┤
│ Submissions to Review:                   │
│ ├─ Pending: 45                          │
│ ├─ Needs Changes: 12                    │
│ ├─ [Table] List all submissions         │
│                                         │
│ Quick Actions:                           │
│ ├─ [Button] Review Submission           │
│ ├─ [Button] Add Comment                 │
│                                         │
│ My Reviews:                              │
│ ├─ Approved this month: 23              │
│ ├─ Rejected this month: 5               │
│ ├─ Requested changes: 8                 │
└─────────────────────────────────────────┘
```

---

## 7. Audit Logging

All admin actions should be logged for accountability:

```typescript
interface AuditLog {
  id: string;
  adminId: string;           // Who performed the action
  adminRole: string;         // Their role at time of action
  action: string;            // Action type
  entityType: string;        // What was modified (tool, submission, post, etc.)
  entityId: string;          // ID of modified entity
  changes: {                  // What changed
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Log examples
// - "tool_created" + toolId + {name, url, category}
// - "submission_approved" + submissionId + {status: pending→approved}
// - "blog_published" + postId + {isPublished: false→true}
// - "user_role_changed" + userId + {role: user→editor}
// - "admin_deleted_tool" + toolId + {reason, deletedAt}
```

---

## 8. Database Consistency Rules

```typescript
// Constraints to enforce data integrity
export const DatabaseConstraints = {
  // Tool must have valid category
  tool_category_fk: {
    table: 'tools',
    column: 'categoryId',
    references: 'categories(id)',
    onDelete: 'RESTRICT'  // Cannot delete category with tools
  },

  // Submission can't exist without category
  submission_category_fk: {
    table: 'tool_submissions',
    column: 'categoryId',
    references: 'categories(id)',
    onDelete: 'RESTRICT'
  },

  // Published tool from submission must track origin
  tool_submission_link: {
    table: 'tools',
    column: 'submissionId',
    references: 'tool_submissions(id)',
    nullable: true,
    note: 'NULL if admin-created; Set if from user submission'
  },

  // Promotion can't exist for deleted tool
  promotion_tool_fk: {
    table: 'tool_promotions',
    column: 'toolId',
    references: 'tools(id)',
    onDelete: 'CASCADE'
  },

  // Blog post must have valid category (nullable for uncategorized)
  post_category_fk: {
    table: 'blog_posts',
    column: 'categoryId',
    references: 'blog_categories(id)',
    onDelete: 'SET NULL'
  }
};
```

---

## Summary

This ADMIN_BRIEF.md document provides:

1. **Three-tier RBAC system** with specific permissions for Super Admin, Editor, and Moderator roles
2. **Detailed workflow diagrams** for submissions, tool management, blog publishing, and promotions
3. **Business logic implementations** including approval workflows, email verification, scheduling, and analytics
4. **Database consistency rules** to maintain data integrity
5. **Audit logging patterns** for admin accountability
6. **Access control patterns** for protecting routes and operations
7. **Role-specific dashboard views** showing different information per tier

All logic flows support the mixed submission model where both guests (with email verification) and registered users can submit tools, all requiring admin approval before publishing.
