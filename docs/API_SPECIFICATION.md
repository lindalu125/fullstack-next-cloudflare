# API_SPECIFICATION.md - Toolsail API Reference

## Overview

This document defines all RESTful API endpoints for Toolsail, including frontend (public) and backend (admin) APIs. All endpoints use JSON for request/response payloads and follow REST principles.

**Base URLs:**
- Frontend: `https://toolsail.top/api`
- Backend: `https://toolsail.top/api/admin`
- Development: `http://localhost:3000/api`

---

## 1. Authentication & Authorization

### 1.1 Authentication Methods

#### JWT Token (Session-Based with Better Auth)
```
Authorization: Bearer <session_token>
```

**Token Lifetime:**
- Session token: 30 days
- Refresh token: 90 days
- Verification token: 24 hours

**Token Structure (JWT):**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "admin",
  "adminRole": "editor",
  "iat": 1694000000,
  "exp": 1696592000
}
```

### 1.2 Authorization Levels

| Level | Required Role | Headers |
|-------|--------------|---------|
| Public | None | - |
| User | `role: 'user'` | `Authorization: Bearer <token>` |
| Admin | `role: 'admin'` + `adminRole: any` | `Authorization: Bearer <token>` |
| Editor | `role: 'admin'` + `adminRole: 'editor'` | `Authorization: Bearer <token>` |
| Moderator | `role: 'admin'` + `adminRole: 'moderator'` | `Authorization: Bearer <token>` |
| Super Admin | `role: 'admin'` + `adminRole: 'admin'` | `Authorization: Bearer <token>` |

### 1.3 Error Responses

**401 Unauthorized** - Invalid or expired token
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

**403 Forbidden** - Insufficient permissions
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource",
  "code": "FORBIDDEN",
  "requiredRole": "editor"
}
```

---

## 2. Common Response Format

### 2.1 Success Response Structure

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 2.2 Error Response Structure

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

### 2.3 Standard Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request parameters |
| UNAUTHORIZED | 401 | Missing or invalid authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists (duplicate) |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## 3. Frontend API (Public Endpoints)

### 3.1 Tools - List

**GET** `/api/tools`

**Authorization:** None

**Query Parameters:**
```
category?    string   - Filter by category slug
search?      string   - Search in name and description
page?        number   - Page number (default: 1)
limit?       number   - Items per page (default: 20, max: 100)
sort?        string   - Sort order: 'featured' | 'newest' | 'popular' (default: 'featured')
featured?    boolean  - Show only featured tools
```

**Request Example:**
```bash
GET /api/tools?category=ai-tools&page=1&limit=20&sort=featured
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "tool_001",
      "name": "ChatGPT",
      "url": "https://chat.openai.com",
      "description": "Advanced AI-powered conversational assistant",
      "logoUrl": "https://example.com/chatgpt.png",
      "category": {
        "id": "cat_001",
        "name": "AI Tools",
        "slug": "ai-tools"
      },
      "isFeatured": true,
      "viewCount": 15420,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation Error",
  "code": "VALIDATION_ERROR",
  "details": {
    "page": "Must be a positive number",
    "limit": "Must be between 1 and 100"
  }
}
```

---

### 3.2 Tools - Detail

**GET** `/api/tools/:id`

**Authorization:** None

**URL Parameters:**
```
id    string (required)  - Tool ID or slug
```

**Request Example:**
```bash
GET /api/tools/tool_001
# or
GET /api/tools/chatgpt
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "tool_001",
    "name": "ChatGPT",
    "url": "https://chat.openai.com",
    "description": "Advanced AI-powered conversational assistant by OpenAI",
    "logoUrl": "https://example.com/chatgpt.png",
    "category": {
      "id": "cat_001",
      "name": "AI Tools",
      "slug": "ai-tools"
    },
    "isFeatured": true,
    "viewCount": 15420,
    "metaDescription": "Free ChatGPT - AI chatbot for writing and coding",
    "metaKeywords": "chatgpt, ai, openai",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-11-15T14:30:00Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Not Found",
  "code": "NOT_FOUND",
  "message": "Tool not found"
}
```

---

### 3.3 Categories - List

**GET** `/api/categories`

**Authorization:** None

**Query Parameters:**
```
parent?   string   - Filter by parent category slug (for subcategories)
```

**Request Example:**
```bash
GET /api/categories
GET /api/categories?parent=ai-tools
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_001",
      "name": "AI Tools",
      "slug": "ai-tools",
      "icon": "cpu",
      "description": "Artificial Intelligence and Machine Learning tools",
      "children": [
        {
          "id": "cat_003",
          "name": "Image Generation",
          "slug": "image-generation",
          "icon": "image",
          "description": "AI-powered image creation"
        }
      ]
    },
    {
      "id": "cat_002",
      "name": "Digital Tools",
      "slug": "digital-tools",
      "icon": "zap",
      "description": "Productivity and creative tools",
      "children": []
    }
  ]
}
```

---

### 3.4 Categories - Detail with Tools

**GET** `/api/categories/:slug/tools`

**Authorization:** None

**URL Parameters:**
```
slug    string (required)  - Category slug
```

**Query Parameters:**
```
page?      number   - Page number (default: 1)
limit?     number   - Items per page (default: 20)
sort?      string   - 'featured' | 'newest' | 'popular'
```

**Request Example:**
```bash
GET /api/categories/ai-tools/tools?page=1&limit=20&sort=featured
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_001",
      "name": "AI Tools",
      "slug": "ai-tools",
      "icon": "cpu",
      "description": "Artificial Intelligence tools"
    },
    "tools": [
      {
        "id": "tool_001",
        "name": "ChatGPT",
        "url": "https://chat.openai.com",
        "description": "AI conversational assistant",
        "logoUrl": "https://example.com/chatgpt.png",
        "isFeatured": true
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 450,
    "totalPages": 23
  }
}
```

---

### 3.5 Search - Tools

**GET** `/api/search`

**Authorization:** None

**Query Parameters:**
```
q          string (required)  - Search query
type?      string            - Filter by type: 'tools' | 'blog' | 'all' (default: 'all')
category?  string            - Filter by category slug
page?      number            - Page number (default: 1)
limit?     number            - Items per page (default: 20)
```

**Request Example:**
```bash
GET /api/search?q=image+generation&type=tools&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "tool",
        "id": "tool_005",
        "name": "Midjourney",
        "description": "AI image generator using Discord",
        "logoUrl": "https://example.com/midjourney.png",
        "url": "https://midjourney.com",
        "matchedFields": ["name", "description"]
      },
      {
        "type": "blog",
        "id": "post_001",
        "title": "Top AI Image Generation Tools",
        "excerpt": "Discover the best AI tools for image generation...",
        "slug": "top-ai-image-generation-tools"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5,
    "query": "image generation"
  }
}
```

**Error (400 Bad Request) - Empty query:**
```json
{
  "success": false,
  "error": "Validation Error",
  "code": "VALIDATION_ERROR",
  "details": {
    "q": "Search query is required"
  }
}
```

---

### 3.6 Blog - List Posts

**GET** `/api/blog/posts`

**Authorization:** None

**Query Parameters:**
```
category?  string   - Filter by category slug
tag?       string   - Filter by tag
page?      number   - Page number (default: 1)
limit?     number   - Items per page (default: 10)
sort?      string   - Sort order: 'latest' | 'popular' (default: 'latest')
```

**Request Example:**
```bash
GET /api/blog/posts?category=tutorials&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "post_001",
      "title": "Top 10 AI Tools for Content Creators in 2025",
      "slug": "top-10-ai-tools-content-creators-2025",
      "excerpt": "Discover the best AI tools for content creation",
      "featuredImage": "https://example.com/featured.jpg",
      "category": {
        "id": "blog_cat_001",
        "name": "Tutorials",
        "slug": "tutorials"
      },
      "tags": ["ai", "content-creation", "2025"],
      "author": {
        "id": "user_001",
        "name": "Linda Admin"
      },
      "publishedAt": "2025-11-15T10:00:00Z",
      "viewCount": 2840
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

---

### 3.7 Blog - Detail Post

**GET** `/api/blog/posts/:slug`

**Authorization:** None

**URL Parameters:**
```
slug    string (required)  - Post slug
```

**Request Example:**
```bash
GET /api/blog/posts/top-10-ai-tools-content-creators-2025
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "post_001",
    "title": "Top 10 AI Tools for Content Creators in 2025",
    "slug": "top-10-ai-tools-content-creators-2025",
    "content": "# Top 10 AI Tools\n\nContent creators have more options than ever...",
    "excerpt": "Discover the best AI tools for content creation",
    "featuredImage": "https://example.com/featured.jpg",
    "category": {
      "id": "blog_cat_001",
      "name": "Tutorials",
      "slug": "tutorials"
    },
    "tags": ["ai", "content-creation", "2025"],
    "author": {
      "id": "user_001",
      "name": "Linda Admin",
      "image": "https://example.com/avatar.jpg"
    },
    "publishedAt": "2025-11-15T10:00:00Z",
    "viewCount": 2840,
    "metaDescription": "Best AI tools for content creators",
    "metaKeywords": "ai tools, content creation"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Not Found",
  "code": "NOT_FOUND",
  "message": "Blog post not found"
}
```

---

### 3.8 Submit Tool - Guest/User

**POST** `/api/submissions`

**Authorization:** None (for guests) or User token (for registered users)

**Content-Type:** `application/json`

**Body Parameters (Form):**
```json
{
  "name": "string (required, max: 100)",
  "url": "string (required, valid URL)",
  "description": "string (required, max: 500)",
  "logoUrl": "string (optional, valid image URL)",
  "categoryId": "string (required, existing category ID)",
  "isFeatured": "boolean (optional, default: false)",
  "email": "string (required for guests, forbidden for users)",
  "submittedBy": "string (automatically set from auth, null for guests)"
}
```

**Request Example (Guest):**
```bash
curl -X POST https://toolsail.top/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Claude AI",
    "url": "https://claude.ai",
    "description": "Advanced AI assistant from Anthropic",
    "logoUrl": "https://example.com/claude.png",
    "categoryId": "cat_001",
    "email": "user@example.com"
  }'
```

**Request Example (Registered User):**
```bash
curl -X POST https://toolsail.top/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Claude AI",
    "url": "https://claude.ai",
    "description": "Advanced AI assistant from Anthropic",
    "logoUrl": "https://example.com/claude.png",
    "categoryId": "cat_001"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "sub_001",
    "name": "Claude AI",
    "url": "https://claude.ai",
    "description": "Advanced AI assistant from Anthropic",
    "logoUrl": "https://example.com/claude.png",
    "categoryId": "cat_001",
    "email": "user@example.com",
    "emailVerified": false,
    "status": "pending",
    "createdAt": "2025-11-16T10:00:00Z"
  },
  "message": "Submission created. A verification email has been sent."
}
```

**Error (400 Bad Request) - Validation:**
```json
{
  "success": false,
  "error": "Validation Error",
  "code": "VALIDATION_ERROR",
  "details": {
    "name": "Name is required",
    "url": "Invalid URL format",
    "email": "Email is required for guest submissions"
  }
}
```

**Error (409 Conflict) - Duplicate URL:**
```json
{
  "success": false,
  "error": "Conflict",
  "code": "CONFLICT",
  "message": "A tool with this URL already exists"
}
```

---

### 3.9 Verify Submission Email

**POST** `/api/submissions/verify`

**Authorization:** None

**Body Parameters:**
```json
{
  "token": "string (required, verification token from email)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/submissions/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456..."
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissionId": "sub_001",
    "emailVerified": true
  },
  "message": "Email verified successfully. Your submission is now in review."
}
```

**Error (400 Bad Request) - Invalid token:**
```json
{
  "success": false,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Invalid or expired verification token"
}
```

---

### 3.10 Check Guest Submission Status

**GET** `/api/submissions/guest/:email`

**Authorization:** None

**URL Parameters:**
```
email    string (required)  - Guest email address
```

**Request Example:**
```bash
GET /api/submissions/guest/user@example.com
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_001",
      "name": "Claude AI",
      "status": "pending",
      "emailVerified": true,
      "createdAt": "2025-11-16T10:00:00Z",
      "reviewedAt": null,
      "rejectionReason": null
    },
    {
      "id": "sub_002",
      "name": "Another Tool",
      "status": "approved",
      "emailVerified": true,
      "createdAt": "2025-11-10T10:00:00Z",
      "reviewedAt": "2025-11-14T15:00:00Z",
      "rejectionReason": null
    }
  ]
}
```

---

### 3.11 Authentication - Register

**POST** `/api/auth/register`

**Authorization:** None

**Content-Type:** `application/json`

**Body Parameters:**
```json
{
  "email": "string (required, unique, valid email)",
  "password": "string (required, min: 8 chars, complexity)",
  "name": "string (required, max: 100)",
  "agreeToTerms": "boolean (required, must be true)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe",
    "agreeToTerms": true
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_003",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-12-16T10:00:00Z"
  },
  "message": "Registration successful"
}
```

**Error (409 Conflict) - Email exists:**
```json
{
  "success": false,
  "error": "Conflict",
  "code": "CONFLICT",
  "message": "Email already registered"
}
```

**Error (400 Bad Request) - Validation:**
```json
{
  "success": false,
  "error": "Validation Error",
  "code": "VALIDATION_ERROR",
  "details": {
    "password": "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character",
    "agreeToTerms": "Must agree to terms"
  }
}
```

---

### 3.12 Authentication - Login

**POST** `/api/auth/login`

**Authorization:** None

**Body Parameters:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_003",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-12-16T10:00:00Z"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "code": "UNAUTHORIZED",
  "message": "Invalid email or password"
}
```

---

### 3.13 Authentication - Logout

**POST** `/api/auth/logout`

**Authorization:** User token required

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 3.14 Authentication - Forgot Password

**POST** `/api/auth/forgot-password`

**Authorization:** None

**Body Parameters:**
```json
{
  "email": "string (required, registered email)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Note:** Even if email doesn't exist, returns 200 to prevent email enumeration

---

### 3.15 Authentication - Reset Password

**POST** `/api/auth/reset-password`

**Authorization:** None

**Body Parameters:**
```json
{
  "token": "string (required, from email link)",
  "password": "string (required, min: 8 chars)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_abc123...",
    "password": "NewSecurePassword123!"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully. Please login with your new password."
}
```

**Error (400 Bad Request) - Invalid token:**
```json
{
  "success": false,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Invalid or expired password reset token"
}
```

---

### 3.16 User Profile - Get

**GET** `/api/user/profile`

**Authorization:** User token required

**Request Example:**
```bash
curl -X GET https://toolsail.top/api/user/profile \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_003",
    "email": "john@example.com",
    "name": "John Doe",
    "image": "https://example.com/avatar.jpg",
    "role": "user",
    "emailVerified": true,
    "createdAt": "2025-11-10T08:00:00Z",
    "updatedAt": "2025-11-15T14:30:00Z"
  }
}
```

---

### 3.17 User Profile - Update

**PUT** `/api/user/profile`

**Authorization:** User token required

**Body Parameters:**
```json
{
  "name": "string (optional)",
  "image": "string (optional, image URL or file upload)",
  "currentPassword": "string (required if changing password)"
}
```

**Request Example:**
```bash
curl -X PUT https://toolsail.top/api/user/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "currentPassword": "CurrentPassword123!"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_003",
    "email": "john@example.com",
    "name": "John Updated",
    "updatedAt": "2025-11-16T10:00:00Z"
  }
}
```

---

### 3.18 User Submissions - List

**GET** `/api/user/submissions`

**Authorization:** User token required

**Query Parameters:**
```
page?    number  - Page number (default: 1)
limit?   number  - Items per page (default: 20)
status?  string  - Filter by status: 'pending' | 'approved' | 'rejected'
```

**Request Example:**
```bash
curl -X GET "https://toolsail.top/api/user/submissions?page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_001",
      "name": "Claude AI",
      "url": "https://claude.ai",
      "description": "Advanced AI assistant",
      "status": "pending",
      "createdAt": "2025-11-16T10:00:00Z",
      "reviewedAt": null,
      "rejectionReason": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

---

## 4. Backend API (Admin Endpoints)

### 4.1 Admin - Dashboard Stats

**GET** `/api/admin/stats/overview`

**Authorization:** Admin token required (any admin role)

**Request Example:**
```bash
curl -X GET https://toolsail.top/api/admin/stats/overview \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tools": {
      "total": 1250,
      "featured": 45,
      "addedThisMonth": 120
    },
    "submissions": {
      "pending": 45,
      "changesRequested": 12,
      "approved": 520,
      "rejected": 85
    },
    "blog": {
      "totalPosts": 42,
      "published": 40,
      "draft": 2,
      "viewsThisMonth": 15420
    },
    "promotions": {
      "active": 12,
      "monthlyRevenue": 2340.50,
      "totalRevenue": 18750.25
    },
    "users": {
      "totalRegistered": 5240,
      "registeredThisMonth": 280,
      "admins": 3
    }
  }
}
```

---

### 4.2 Admin Tools - List

**GET** `/api/admin/tools`

**Authorization:** Admin/Editor required

**Query Parameters:**
```
page?      number  - Page number (default: 1)
limit?     number  - Items per page (default: 20)
search?    string  - Search by name
category?  string  - Filter by category ID
featured?  boolean - Show only featured
published? boolean - Show only published
sort?      string  - 'newest' | 'oldest' | 'views' | 'featured' (default: 'newest')
```

**Request Example:**
```bash
curl -X GET "https://toolsail.top/api/admin/tools?category=cat_001&page=1&limit=20" \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "tool_001",
      "name": "ChatGPT",
      "url": "https://chat.openai.com",
      "description": "Advanced AI-powered conversational assistant",
      "logoUrl": "https://example.com/chatgpt.png",
      "categoryId": "cat_001",
      "isPublished": true,
      "isFeatured": true,
      "submissionId": null,
      "viewCount": 15420,
      "clickCount": 3240,
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-11-15T14:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63
  }
}
```

---

### 4.3 Admin Tools - Create

**POST** `/api/admin/tools`

**Authorization:** Admin/Editor required

**Body Parameters:**
```json
{
  "name": "string (required, max: 100)",
  "url": "string (required, valid URL, unique)",
  "description": "string (required, max: 500)",
  "logoUrl": "string (optional, valid image URL)",
  "categoryId": "string (required, existing category)",
  "isFeatured": "boolean (optional, default: false)",
  "metaDescription": "string (optional, max: 160)",
  "metaKeywords": "string (optional, comma-separated)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/tools \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Claude AI",
    "url": "https://claude.ai",
    "description": "Advanced AI assistant from Anthropic",
    "logoUrl": "https://example.com/claude.png",
    "categoryId": "cat_001",
    "isFeatured": false,
    "metaDescription": "Claude - AI assistant by Anthropic"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "tool_100",
    "name": "Claude AI",
    "url": "https://claude.ai",
    "description": "Advanced AI assistant from Anthropic",
    "logoUrl": "https://example.com/claude.png",
    "categoryId": "cat_001",
    "isPublished": true,
    "isFeatured": false,
    "createdAt": "2025-11-16T10:00:00Z"
  }
}
```

---

### 4.4 Admin Tools - Update

**PUT** `/api/admin/tools/:id`

**Authorization:** Admin/Editor required

**URL Parameters:**
```
id    string (required)  - Tool ID
```

**Body Parameters:** (Same as Create, all optional)

**Request Example:**
```bash
curl -X PUT https://toolsail.top/api/admin/tools/tool_001 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ChatGPT Updated",
    "isFeatured": true
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "tool_001",
    "name": "ChatGPT Updated",
    "isFeatured": true,
    "updatedAt": "2025-11-16T10:30:00Z"
  }
}
```

---

### 4.5 Admin Tools - Delete (Soft)

**DELETE** `/api/admin/tools/:id`

**Authorization:** Admin/Editor required

**URL Parameters:**
```
id    string (required)  - Tool ID
```

**Query Parameters:**
```
permanent?  boolean  - If true, perform hard delete (default: false, soft delete)
```

**Request Example:**
```bash
curl -X DELETE https://toolsail.top/api/admin/tools/tool_001 \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK) - Soft Delete:**
```json
{
  "success": true,
  "message": "Tool archived successfully",
  "data": {
    "id": "tool_001",
    "deletedAt": "2025-11-16T10:30:00Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Not Found",
  "code": "NOT_FOUND",
  "message": "Tool not found"
}
```

---

### 4.6 Admin Tools - Batch Upload

**POST** `/api/admin/tools/batch-upload`

**Authorization:** Admin/Editor required

**Content-Type:** `multipart/form-data`

**Body Parameters:**
```
file              file (required)        - CSV file (max: 5MB)
categoryId        string (optional)      - Default category for all tools
overwrite         boolean (optional)     - Overwrite existing tools by URL
```

**CSV Format:**
```
Name,URL,Description,Category,Featured
ChatGPT,https://chat.openai.com,AI Assistant,ai-tools,Yes
Midjourney,https://midjourney.com,Image Generator,ai-tools,Yes
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/tools/batch-upload \
  -H "Authorization: Bearer <admin_token>" \
  -F "file=@tools.csv" \
  -F "categoryId=cat_001"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "uploaded": 15,
    "failed": 2,
    "skipped": 0,
    "errors": [
      {
        "row": 5,
        "reason": "Invalid URL format"
      },
      {
        "row": 8,
        "reason": "URL already exists"
      }
    ]
  },
  "message": "Batch upload completed: 15 success, 2 failed"
}
```

---

### 4.7 Admin Submissions - List

**GET** `/api/admin/submissions`

**Authorization:** Admin/Editor/Moderator required

**Query Parameters:**
```
page?      number  - Page number (default: 1)
limit?     number  - Items per page (default: 20)
status?    string  - 'pending' | 'changes_requested' | 'approved' | 'rejected'
category?  string  - Filter by category
search?    string  - Search by tool name or email
sort?      string  - 'newest' | 'oldest' (default: 'newest')
```

**Request Example:**
```bash
curl -X GET "https://toolsail.top/api/admin/submissions?status=pending&page=1" \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sub_001",
      "name": "Claude AI",
      "url": "https://claude.ai",
      "description": "Advanced AI assistant",
      "logoUrl": "https://example.com/claude.png",
      "categoryId": "cat_001",
      "status": "pending",
      "submittedBy": {
        "id": "user_003",
        "email": "john@example.com",
        "name": "John Doe"
      },
      "emailVerified": true,
      "isFeatured": false,
      "feedbackComments": [],
      "createdAt": "2025-11-16T10:00:00Z",
      "reviewedAt": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "stats": {
      "pending": 45,
      "changesRequested": 12,
      "approved": 520,
      "rejected": 85
    }
  }
}
```

---

### 4.8 Admin Submissions - Detail

**GET** `/api/admin/submissions/:id`

**Authorization:** Admin/Editor/Moderator required

**URL Parameters:**
```
id    string (required)  - Submission ID
```

**Request Example:**
```bash
curl -X GET https://toolsail.top/api/admin/submissions/sub_001 \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "sub_001",
    "name": "Claude AI",
    "url": "https://claude.ai",
    "description": "Advanced AI assistant from Anthropic",
    "logoUrl": "https://example.com/claude.png",
    "categoryId": "cat_001",
    "status": "pending",
    "submittedBy": {
      "id": "user_003",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "email": null,
    "emailVerified": true,
    "isFeatured": false,
    "feedbackComments": [],
    "rejectionReason": null,
    "reviewedBy": null,
    "reviewedAt": null,
    "toolId": null,
    "createdAt": "2025-11-16T10:00:00Z",
    "updatedAt": "2025-11-16T10:00:00Z"
  }
}
```

---

### 4.9 Admin Submissions - Approve

**POST** `/api/admin/submissions/:id/approve`

**Authorization:** Admin/Editor/Moderator required

**URL Parameters:**
```
id    string (required)  - Submission ID
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/submissions/sub_001/approve \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissionId": "sub_001",
    "status": "published",
    "toolId": "tool_100",
    "publishedAt": "2025-11-16T10:30:00Z"
  },
  "message": "Tool submission approved and published"
}
```

---

### 4.10 Admin Submissions - Reject

**POST** `/api/admin/submissions/:id/reject`

**Authorization:** Admin/Editor/Moderator required

**Body Parameters:**
```json
{
  "reason": "string (required, max: 500)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/submissions/sub_001/reject \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "URL is not accessible"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissionId": "sub_001",
    "status": "rejected",
    "rejectionReason": "URL is not accessible",
    "rejectedAt": "2025-11-16T10:30:00Z"
  },
  "message": "Submission rejected. Notification sent to submitter."
}
```

---

### 4.11 Admin Submissions - Request Changes

**POST** `/api/admin/submissions/:id/request-changes`

**Authorization:** Admin/Editor/Moderator required

**Body Parameters:**
```json
{
  "feedback": "string (required, max: 500)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/submissions/sub_001/request-changes \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Please update the logo with a higher resolution image"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "submissionId": "sub_001",
    "status": "changes_requested",
    "feedbackComments": [
      {
        "text": "Please update the logo with a higher resolution image",
        "by": "user_001",
        "at": "2025-11-16T10:30:00Z"
      }
    ]
  },
  "message": "Feedback sent to submitter"
}
```

---

### 4.12 Admin Blog - List Posts

**GET** `/api/admin/blog/posts`

**Authorization:** Admin/Editor required

**Query Parameters:**
```
page?      number  - Page number (default: 1)
limit?     number  - Items per page (default: 20)
status?    string  - 'draft' | 'scheduled' | 'published'
author?    string  - Filter by author ID
search?    string  - Search by title
sort?      string  - 'newest' | 'oldest' | 'published' (default: 'newest')
```

**Request Example:**
```bash
curl -X GET "https://toolsail.top/api/admin/blog/posts?status=draft&page=1" \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "post_001",
      "title": "Top 10 AI Tools for Content Creators",
      "slug": "top-10-ai-tools-content-creators",
      "excerpt": "Discover the best AI tools...",
      "status": "published",
      "isPublished": true,
      "publishedAt": "2025-11-15T10:00:00Z",
      "author": {
        "id": "user_001",
        "name": "Linda Admin"
      },
      "category": {
        "id": "blog_cat_001",
        "name": "Tutorials"
      },
      "viewCount": 2840,
      "createdAt": "2025-11-10T08:30:00Z",
      "updatedAt": "2025-11-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

---

### 4.13 Admin Blog - Create Post

**POST** `/api/admin/blog/posts`

**Authorization:** Admin/Editor required

**Body Parameters:**
```json
{
  "title": "string (required, max: 200)",
  "content": "string (required, markdown)",
  "excerpt": "string (optional, max: 300)",
  "slug": "string (optional, auto-generated if not provided)",
  "featuredImage": "string (optional, image URL)",
  "categoryId": "string (optional)",
  "tags": "array<string> (optional)",
  "status": "string (optional, 'draft' | 'scheduled' | 'published', default: 'draft')",
  "publishedAt": "string (optional, ISO datetime for scheduling)",
  "metaDescription": "string (optional, max: 160)",
  "metaKeywords": "string (optional)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/blog/posts \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Midjourney",
    "content": "# Getting Started\n\nMidjourney is an AI image generator...",
    "excerpt": "A beginner guide to Midjourney",
    "slug": "getting-started-with-midjourney",
    "categoryId": "blog_cat_001",
    "tags": ["midjourney", "ai-art", "tutorial"],
    "status": "draft",
    "metaDescription": "Complete guide to Midjourney"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "post_100",
    "title": "Getting Started with Midjourney",
    "slug": "getting-started-with-midjourney",
    "status": "draft",
    "isPublished": false,
    "author": {
      "id": "user_001",
      "name": "Linda Admin"
    },
    "createdAt": "2025-11-16T10:00:00Z"
  }
}
```

---

### 4.14 Admin Blog - Update Post

**PUT** `/api/admin/blog/posts/:id`

**Authorization:** Admin/Editor required

**URL Parameters:**
```
id    string (required)  - Post ID
```

**Body Parameters:** (Same as Create, all optional)

**Request Example:**
```bash
curl -X PUT https://toolsail.top/api/admin/blog/posts/post_001 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "status": "published"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "post_001",
    "title": "Updated Title",
    "status": "published",
    "isPublished": true,
    "publishedAt": "2025-11-16T10:30:00Z",
    "updatedAt": "2025-11-16T10:30:00Z"
  }
}
```

---

### 4.15 Admin Blog - Delete Post

**DELETE** `/api/admin/blog/posts/:id`

**Authorization:** Admin/Editor required

**URL Parameters:**
```
id    string (required)  - Post ID
```

**Request Example:**
```bash
curl -X DELETE https://toolsail.top/api/admin/blog/posts/post_001 \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog post deleted successfully",
  "data": {
    "id": "post_001",
    "deletedAt": "2025-11-16T10:30:00Z"
  }
}
```

---

### 4.16 Admin Categories - List

**GET** `/api/admin/categories`

**Authorization:** Admin/Editor required

**Query Parameters:**
```
includeDeleted?  boolean  - Include soft-deleted categories (default: false)
```

**Request Example:**
```bash
curl -X GET https://toolsail.top/api/admin/categories \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_001",
      "name": "AI Tools",
      "slug": "ai-tools",
      "icon": "cpu",
      "description": "Artificial Intelligence tools",
      "parentId": null,
      "displayOrder": 1,
      "children": [
        {
          "id": "cat_003",
          "name": "Image Generation",
          "slug": "image-generation",
          "displayOrder": 1
        }
      ],
      "toolCount": 340,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

### 4.17 Admin Categories - Create

**POST** `/api/admin/categories`

**Authorization:** Admin/Editor required

**Body Parameters:**
```json
{
  "name": "string (required, max: 100)",
  "slug": "string (required, unique, lowercase)",
  "icon": "string (required, Lucide icon name)",
  "description": "string (optional, max: 500)",
  "parentId": "string (optional, for subcategories)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/categories \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Text Generation",
    "slug": "text-generation",
    "icon": "type",
    "description": "AI tools for text generation",
    "parentId": "cat_001"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "cat_010",
    "name": "Text Generation",
    "slug": "text-generation",
    "icon": "type",
    "parentId": "cat_001",
    "createdAt": "2025-11-16T10:00:00Z"
  }
}
```

---

### 4.18 Admin Categories - Update

**PUT** `/api/admin/categories/:id`

**Authorization:** Admin/Editor required

**Body Parameters:** (Same as Create, all optional)

**Request Example:**
```bash
curl -X PUT https://toolsail.top/api/admin/categories/cat_001 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Tools Updated",
    "description": "Updated description"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cat_001",
    "name": "AI Tools Updated",
    "description": "Updated description",
    "updatedAt": "2025-11-16T10:30:00Z"
  }
}
```

---

### 4.19 Admin Categories - Delete

**DELETE** `/api/admin/categories/:id`

**Authorization:** Admin/Editor required

**Request Example:**
```bash
curl -X DELETE https://toolsail.top/api/admin/categories/cat_010 \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully (soft delete)"
}
```

**Error (409 Conflict) - Has associated tools:**
```json
{
  "success": false,
  "error": "Conflict",
  "code": "CONFLICT",
  "message": "Cannot delete category with associated tools",
  "data": {
    "toolCount": 340
  }
}
```

---

### 4.20 Admin Promotions - List

**GET** `/api/admin/promotions`

**Authorization:** Admin/Editor required

**Query Parameters:**
```
page?      number  - Page number (default: 1)
limit?     number  - Items per page (default: 20)
status?    string  - 'pending' | 'active' | 'expired' | 'cancelled'
tier?      string  - 'featured' | 'premium' | 'standard'
sort?      string  - 'newest' | 'oldest' | 'ending-soon' (default: 'newest')
```

**Request Example:**
```bash
curl -X GET "https://toolsail.top/api/admin/promotions?status=active" \
  -H "Authorization: Bearer <admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "promo_001",
      "tool": {
        "id": "tool_001",
        "name": "ChatGPT"
      },
      "tier": "featured",
      "priceUSD": 199.99,
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2025-12-01T00:00:00Z",
      "status": "active",
      "autoRenew": true,
      "daysRemaining": 15,
      "createdAt": "2025-10-28T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1,
    "monthlyRevenue": 2340.50
  }
}
```

---

### 4.21 Admin Promotions - Create

**POST** `/api/admin/promotions`

**Authorization:** Admin/Editor required

**Body Parameters:**
```json
{
  "toolId": "string (required)",
  "tier": "string (required, 'featured' | 'premium' | 'standard')",
  "durationMonths": "number (required, 1-12)",
  "autoRenew": "boolean (optional, default: false)"
}
```

**Request Example:**
```bash
curl -X POST https://toolsail.top/api/admin/promotions \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "toolId": "tool_002",
    "tier": "premium",
    "durationMonths": 2,
    "autoRenew": false
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "promo_002",
    "toolId": "tool_002",
    "tier": "premium",
    "priceUSD": 199.98,
    "startDate": "2025-11-16T00:00:00Z",
    "endDate": "2026-01-16T00:00:00Z",
    "status": "active",
    "createdAt": "2025-11-16T10:00:00Z"
  }
}
```

---

### 4.22 Admin Promotions - Cancel

**DELETE** `/api/admin/promotions/:id`

**Authorization:** Admin/Editor required

**Body Parameters:**
```json
{
  "reason": "string (optional)"
}
```

**Request Example:**
```bash
curl -X DELETE https://toolsail.top/api/admin/promotions/promo_001 \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Tool no longer maintains quality standards"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "promo_001",
    "status": "cancelled",
    "cancelledAt": "2025-11-16T10:30:00Z"
  },
  "message": "Promotion cancelled"
}
```

---

### 4.23 Admin Website Settings - Get

**GET** `/api/admin/settings`

**Authorization:** Super Admin required

**Request Example:**
```bash
curl -X GET https://toolsail.top/api/admin/settings \
  -H "Authorization: Bearer <super_admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "seo": {
      "siteTitle": "Toolsail - Best AI & Digital Tools Directory",
      "siteDescription": "Discover the best AI tools and digital tools for your workflow",
      "ogImage": "https://example.com/og-image.jpg"
    },
    "contact": {
      "email": "contact@toolsail.top",
      "supportEmail": "support@toolsail.top"
    },
    "social": {
      "twitter": "https://twitter.com/toolsail",
      "linkedin": "https://linkedin.com/company/toolsail",
      "github": "https://github.com/toolsail"
    },
    "adsense": {
      "publisherId": "ca-pub-xxxxxxxxxxxx",
      "enabled": true
    },
    "theme": {
      "primaryColor": "#000000",
      "accentColor": "#FFFFFF"
    }
  }
}
```

---

### 4.24 Admin Website Settings - Update

**PUT** `/api/admin/settings`

**Authorization:** Super Admin required

**Body Parameters:** (All optional)
```json
{
  "seo": { "siteTitle": "...", "siteDescription": "...", "ogImage": "..." },
  "contact": { "email": "...", "supportEmail": "..." },
  "social": { "twitter": "...", "linkedin": "...", "github": "..." },
  "adsense": { "publisherId": "...", "enabled": true },
  "theme": { "primaryColor": "...", "accentColor": "..." }
}
```

**Request Example:**
```bash
curl -X PUT https://toolsail.top/api/admin/settings \
  -H "Authorization: Bearer <super_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "seo": {
      "siteTitle": "New Title"
    },
    "contact": {
      "email": "newemail@toolsail.top"
    }
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "updatedFields": ["seo.siteTitle", "contact.email"],
    "updatedAt": "2025-11-16T10:30:00Z"
  }
}
```

---

### 4.25 Admin Users - List

**GET** `/api/admin/users`

**Authorization:** Super Admin required

**Query Parameters:**
```
page?      number  - Page number (default: 1)
limit?     number  - Items per page (default: 20)
role?      string  - Filter by role: 'admin' | 'user'
adminRole? string  - Filter by admin role: 'admin' | 'editor' | 'moderator'
search?    string  - Search by email or name
```

**Request Example:**
```bash
curl -X GET "https://toolsail.top/api/admin/users?role=admin" \
  -H "Authorization: Bearer <super_admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_001",
      "email": "admin@toolsail.top",
      "name": "Linda Admin",
      "role": "admin",
      "adminRole": "admin",
      "emailVerified": true,
      "createdAt": "2025-01-01T10:00:00Z",
      "lastLogin": "2025-11-16T09:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1
  }
}
```

---

### 4.26 Admin Users - Change Role

**PUT** `/api/admin/users/:id/role`

**Authorization:** Super Admin required

**URL Parameters:**
```
id    string (required)  - User ID
```

**Body Parameters:**
```json
{
  "adminRole": "string (required, 'admin' | 'editor' | 'moderator')"
}
```

**Request Example:**
```bash
curl -X PUT https://toolsail.top/api/admin/users/user_002/role \
  -H "Authorization: Bearer <super_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "adminRole": "moderator"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "user_002",
    "email": "editor@toolsail.top",
    "adminRole": "moderator",
    "updatedAt": "2025-11-16T10:30:00Z"
  },
  "message": "User role updated to moderator"
}
```

---

### 4.27 Admin Users - Remove

**DELETE** `/api/admin/users/:id`

**Authorization:** Super Admin required

**URL Parameters:**
```
id    string (required)  - User ID
```

**Request Example:**
```bash
curl -X DELETE https://toolsail.top/api/admin/users/user_002 \
  -H "Authorization: Bearer <super_admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin user removed successfully"
}
```

**Error (409 Conflict) - Last admin:**
```json
{
  "success": false,
  "error": "Conflict",
  "code": "CONFLICT",
  "message": "Cannot remove the last super admin"
}
```

---

### 4.28 Admin Audit Logs

**GET** `/api/admin/logs`

**Authorization:** Super Admin required

**Query Parameters:**
```
page?       number  - Page number (default: 1)
limit?      number  - Items per page (default: 50)
adminId?    string  - Filter by admin user
action?     string  - Filter by action type
entityType? string  - Filter by entity type: 'tool' | 'submission' | 'user' | etc.
entityId?   string  - Filter by entity ID
startDate?  string  - ISO datetime for range start
endDate?    string  - ISO datetime for range end
```

**Request Example:**
```bash
curl -X GET "https://toolsail.top/api/admin/logs?action=submission_approved&page=1" \
  -H "Authorization: Bearer <super_admin_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_001",
      "adminId": "user_001",
      "adminRole": "admin",
      "action": "submission_approved",
      "entityType": "tool_submission",
      "entityId": "sub_002",
      "description": "Approved tool submission: Figma Design System",
      "ipAddress": "192.168.1.1",
      "createdAt": "2025-11-15T14:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 2450,
    "totalPages": 49
  }
}
```

---

## 5. Error Handling Guide

### 5.1 Error Code Reference

```
400 - VALIDATION_ERROR
      Body parameters validation failed
      Details provided in 'details' object

401 - UNAUTHORIZED
      Missing or invalid authentication token
      Action: Refresh token or re-login

403 - FORBIDDEN
      Authenticated but insufficient permissions
      Action: Check user role requirements

404 - NOT_FOUND
      Resource not found
      Action: Verify correct ID/slug

409 - CONFLICT
      Resource already exists (duplicate)
      Action: Check uniqueness constraints

429 - RATE_LIMITED
      Too many requests from same IP/user
      Retry-After header included

500 - INTERNAL_ERROR
      Server error (unexpected)
      Action: Contact support, provide request ID

503 - SERVICE_UNAVAILABLE
      Server under maintenance
      Retry-After header included
```

### 5.2 Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation Error",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**Permission Error (403):**
```json
{
  "success": false,
  "error": "Forbidden",
  "code": "FORBIDDEN",
  "message": "Only editors can approve submissions",
  "requiredRole": "editor"
}
```

**Rate Limit (429):**
```json
{
  "success": false,
  "error": "Rate Limited",
  "code": "RATE_LIMITED",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

---

## 6. API Usage Examples

### 6.1 Frontend User Journey

```bash
# 1. Register
curl -X POST https://toolsail.top/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!","name":"User","agreeToTerms":true}'

# 2. Get categories
curl https://toolsail.top/api/categories

# 3. Search tools
curl "https://toolsail.top/api/search?q=image+generation"

# 4. View tool detail
curl https://toolsail.top/api/tools/tool_001

# 5. Submit a tool
curl -X POST https://toolsail.top/api/submissions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"MyTool","url":"https://mytool.com","description":"...","categoryId":"cat_001"}'

# 6. Check submission status
curl "https://toolsail.top/api/user/submissions" \
  -H "Authorization: Bearer <token>"
```

### 6.2 Admin Workflow

```bash
# 1. Login (done via Better Auth)
# Token obtained from auth system

# 2. View pending submissions
curl "https://toolsail.top/api/admin/submissions?status=pending" \
  -H "Authorization: Bearer <admin_token>"

# 3. Approve a submission
curl -X POST https://toolsail.top/api/admin/submissions/sub_001/approve \
  -H "Authorization: Bearer <admin_token>"

# 4. Create a tool directly
curl -X POST https://toolsail.top/api/admin/tools \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"NewTool","url":"...","description":"...","categoryId":"cat_001"}'

# 5. Batch upload tools
curl -X POST https://toolsail.top/api/admin/tools/batch-upload \
  -H "Authorization: Bearer <admin_token>" \
  -F "file=@tools.csv" \
  -F "categoryId=cat_001"

# 6. Create blog post
curl -X POST https://toolsail.top/api/admin/blog/posts \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"...","content":"...","status":"draft"}'

# 7. View analytics
curl https://toolsail.top/api/admin/stats/overview \
  -H "Authorization: Bearer <admin_token>"
```

---

## 7. Rate Limiting

**Global Rate Limits:**
- Public endpoints: 100 requests/minute per IP
- Authenticated endpoints: 500 requests/minute per user
- Admin endpoints: 1000 requests/minute per admin
- File uploads: 10 uploads/hour per user

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1694000000
```

---

## 8. Response Caching

**Cacheable Endpoints:**
```
GET /api/categories                    - 1 hour
GET /api/categories/:slug/tools        - 30 minutes
GET /api/tools                         - 15 minutes
GET /api/tools/:id                     - 1 hour
GET /api/blog/posts                    - 30 minutes
GET /api/blog/posts/:slug              - 1 hour
GET /api/search                        - No cache
```

**Cache Headers:**
```
Cache-Control: public, max-age=3600
ETag: "abc123..."
```

---

## Summary

This API_SPECIFICATION.md provides:

1. **28 Frontend API Endpoints** for:
   - Tools (list, detail, category browsing)
   - Search functionality
   - Blog (list, detail)
   - Submissions (create, verify, status check)
   - Authentication (register, login, reset password)
   - User profile management

2. **28 Backend/Admin API Endpoints** for:
   - Tools management (CRUD, batch upload, feature toggle)
   - Submissions review (list, detail, approve, reject, request changes)
   - Blog management (CRUD, publish, schedule)
   - Categories management
   - Promotions management
   - Website settings
   - User management
   - Audit logging
   - Dashboard statistics

3. **Complete Documentation** including:
   - Authentication/authorization strategies
   - Request/response formats
   - Error codes and handling
   - Query parameters for filtering/sorting
   - Real-world examples (curl commands)
   - Rate limiting and caching strategies

All endpoints follow REST principles with consistent JSON formatting and error handling.
