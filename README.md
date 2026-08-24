# ExpenseFlow – Smart Personal Expense Tracker 💸

> Production-grade, secure, full-stack personal finance and expense tracking web application engineered with strict query-level multi-tenant isolation, real-time MongoDB aggregation analytics, and an accessible, responsive UI.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://www.mongodb.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest%20%26%20Supertest-yellow?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 🌟 Key Features

- **⚡ Sub-15-Second Expense Logging**: Log expenses with predefined category icons, integer-cent currency precision, date picker, and sanitized descriptions.
- **🛡️ 100% Query-Level Tenant Isolation**: Strict scoping (`{ _id: expenseId, userId: req.user._id }`) ensures zero cross-user data leakage. Cross-tenant queries return non-revealing `404 Not Found`.
- **📊 Real-Time MongoDB Aggregations**:
  - **Dashboard Summary**: Total expenditure, today's spending, current week, and current month.
  - **Category Breakdown**: Interactive donut chart & percentage distribution with custom tooltips.
  - **Monthly Spending**: Bar chart tracking expenditure across all 12 months.
  - **Rolling Spending Trend**: Smooth gradient area chart showing 3, 6, or 12-month trajectory.
- **🔍 Multi-Dimensional Filtering & Search**:
  - 300ms debounced search on descriptions.
  - Category filter dropdown.
  - Date-range bounding (`from` and `to`).
  - Sort by Date (newest/oldest), Amount (highest/lowest), or Category.
  - Pagination controls with responsive desktop table and mobile card views.
  - **CSV Export**: One-click export of filtered transaction histories.
- **🔐 Enterprise-Grade Dual-Token Authentication**:
  - 15-minute in-memory JWT Access Tokens.
  - 7-day rotated `httpOnly` secure refresh cookies.
  - Bcrypt password hashing (cost factor 12).
  - Rate limiting on authentication endpoints to prevent brute-force attacks.
- **🌓 Theme & Accessibility**:
  - Dark Mode and Light Mode with system preference detection and localStorage persistence.
  - WCAG 2.1 AA compliant color contrast, ARIA dialogs, and keyboard navigation.
- **🚀 1-Click Recruiter Demo Access**: Instant demo account login pre-seeded with realistic financial records.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 CLIENT LAYER (React 19 + Vite)              │
│  - React Router v7 + TanStack Query v5 + React Hook Form    │
│  - Tailwind CSS + Lucide Icons + Recharts + Sonner Toasts   │
│  - In-Memory Access Token + Axios Auto-Refresh Interceptor  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 API LAYER (Node.js + Express + TS)          │
│  ├── Routes (Express Router, path mounting)                 │
│  ├── Middleware (Auth, RateLimit, Zod Validate, ErrorHandler)│
│  ├── Controllers (HTTP Request parsing & status shaping)    │
│  ├── Services (Business logic, tenant isolation, formulas)  │
│  └── Repositories (Mongoose data access & aggregations)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 DATA LAYER (MongoDB Atlas)                  │
│  - users collection (unique lowercase email index)          │
│  - expenses collection (compound indexes: user+date, etc.)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom Emerald/Slate Fintech Palette
- **Icons**: Lucide React
- **Data Fetching & Cache**: TanStack Query v5
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualizations**: Recharts (Pie/Donut, Bar, Area charts)
- **Notifications**: Sonner (Accessible Toasts)
- **HTTP Client**: Axios with automatic 401 token refresh queue interceptor

### Backend
- **Runtime**: Node.js + TypeScript
- **Web Framework**: Express 4
- **Database ODM**: Mongoose 8
- **Security**: Helmet, CORS, Express-Rate-Limit, Bcrypt.js, JsonWebToken, Cookie-Parser
- **Validation**: Zod (Validating body, params, query)
- **Testing**: Vitest + Supertest + MongoDB Memory Server

---

## 🔒 Security Review & Guarantee Checklist

| Security Requirement | Implementation | Status |
|---|---|:---:|
| **Password Storage** | Bcrypt with cost factor 12; never logged or serialized to JSON | ✅ Passed |
| **Token Safety** | Short-lived Access Token in-memory; Refresh Token in `httpOnly` cookie | ✅ Passed |
| **Tenant Isolation** | Scoped queries (`{ _id, userId }`) returning `404` to prevent ID enumeration | ✅ Passed |
| **Brute Force Defense** | IP & Email rate limiting on `/api/auth/login` and `/api/auth/register` | ✅ Passed |
| **Input Validation** | Strict Zod schemas on all mutating endpoints | ✅ Passed |
| **Injection Protection** | Escaped regex filters; Mongoose parameterized queries | ✅ Passed |
| **HTTP Headers** | Helmet security headers + locked CORS origin | ✅ Passed |
| **Error Handling** | Centralized error handler masking stack traces in production | ✅ Passed |

---

## 📁 Project Structure

```text
Expense Tracker/
├── backend/
│   ├── src/
│   │   ├── config/          # db.ts, env.ts (Zod validation)
│   │   ├── constants/       # categories.ts (metadata & colors)
│   │   ├── controllers/     # auth.controller.ts, expense.controller.ts
│   │   ├── middleware/      # auth, error, rateLimit, validate
│   │   ├── models/          # User.ts, Expense.ts
│   │   ├── repositories/    # user.repository.ts, expense.repository.ts
│   │   ├── routes/          # auth.routes.ts, expense.routes.ts, index.ts
│   │   ├── services/        # auth.service.ts, expense.service.ts
│   │   ├── types/           # auth.types.ts, expense.types.ts
│   │   ├── validations/     # auth.validation.ts, expense.validation.ts
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entrypoint
│   ├── tests/
│   │   ├── setup.ts         # In-memory MongoDB lifecycle
│   │   ├── unit/            # validation.test.ts
│   │   └── integration/     # auth.test.ts, expense.test.ts, tenant-isolation.test.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/
│   ├── src/
│   │   ├── api/             # client.ts (Axios + auto-refresh interceptor)
│   │   ├── components/
│   │   │   ├── charts/      # CategoryPieChart, MonthlyBarChart, SpendingTrendChart
│   │   │   ├── common/      # Button, Input, Select, Modal, ConfirmDialog, Badge, Skeleton, EmptyState
│   │   │   ├── dashboard/   # StatCard, RecentExpensesTable
│   │   │   ├── expense/     # ExpenseForm, ExpenseFilters, ExpenseTable, ExpenseRow, ExpenseFormModal
│   │   │   └── layout/      # Navbar, Sidebar, AppLayout, ThemeToggle
│   │   ├── context/         # AuthContext.tsx, ThemeContext.tsx
│   │   ├── lib/             # utils.ts, constants.ts
│   │   ├── pages/           # LandingPage, LoginPage, RegisterPage, DashboardPage, ExpensesPage, AnalyticsPage, NotFoundPage
│   │   ├── routes/          # ProtectedRoute.tsx, PublicRoute.tsx
│   │   ├── types/           # index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── render.yaml              # Render 1-click cloud deployment blueprint
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
npm install
```
Edit `.env` if using a remote MongoDB Atlas connection string:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/expenseflow
JWT_ACCESS_SECRET=your_32_character_super_secret_access_key
JWT_REFRESH_SECRET=your_32_character_super_secret_refresh_key
CLIENT_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```

### 3. Configure Frontend
Open a new terminal window:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

ExpenseFlow includes a comprehensive automated test suite testing validation schemas, authentication lifecycles, expense CRUD, aggregations, and multi-tenant data isolation using Vitest and Supertest over an in-memory MongoDB server.

```bash
cd backend
npm test
```

### Test Coverage Highlights:
- **Unit Tests**: Zod registration, login, amount constraints, date parsers.
- **Auth Integration Tests**: Registration, duplicate rejection (409), login, cookie rotation, token version invalidation.
- **Expense CRUD Tests**: Creation, listing, category filters, updates, deletions.
- **Tenant Isolation Security Test**: Asserts that User B receives `404 Not Found` when trying to fetch, modify, or delete User A's expense by exact ID.

---

## 🌐 MongoDB Atlas Setup Guide

1. Sign up / log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. **Database Access**: Under *Security -> Database Access*, click **Add New Database User**. Choose *Password Authentication* and grant `readWriteAnyDatabase` privileges.
4. **Network Access**: Under *Security -> Network Access*, click **Add IP Address** and add `0.0.0.0/0` (allow access from anywhere) so cloud providers like Render can connect.
5. **Connection String**: Click **Connect** on your cluster -> **Drivers (Node.js)** -> copy the connection string. Replace `<password>` with your database user password and specify `/expenseflow` as the database name.

---

## ☁️ Deployment to Render

ExpenseFlow includes a unified `render.yaml` blueprint that deploys both the backend API and frontend static site automatically.

### Option A: 1-Click Blueprint (Recommended)
1. Push your repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your repository and select `render.yaml`.
5. Enter your `MONGO_URI` from MongoDB Atlas.
6. Click **Apply** — Render will build and deploy both services!

### Option B: Manual Setup
- **Backend**:
  - Service Type: *Web Service*
  - Root Directory: `backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Add Environment Variables (`MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`).
- **Frontend**:
  - Service Type: *Static Site*
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
  - Add Environment Variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`
  - Add Rewrite Rule: `/*` -> `/index.html`.

---

## 📚 API Reference

All API responses follow the standard JSON envelope:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

### Authentication Endpoints
| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | No | Register new user account |
| `POST` | `/api/auth/login` | No | Authenticate user & issue tokens |
| `POST` | `/api/auth/refresh` | Cookie | Silent session refresh & token rotation |
| `POST` | `/api/auth/logout` | Yes | Revoke refresh token & clear cookies |
| `GET` | `/api/auth/me` | Yes | Get authenticated user profile |

### Expenses Endpoints
| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `GET` | `/api/expenses/categories` | No | List 11 fixed category enum items & metadata |
| `POST` | `/api/expenses` | Yes | Create a new expense |
| `GET` | `/api/expenses` | Yes | Query expenses (`category`, `from`, `to`, `search`, `page`, `limit`, `sortBy`, `sortOrder`) |
| `GET` | `/api/expenses/:id` | Yes | Get single expense (404 if not owned) |
| `PUT` | `/api/expenses/:id` | Yes | Update expense (404 if not owned) |
| `DELETE` | `/api/expenses/:id` | Yes | Delete expense (404 if not owned) |
| `GET` | `/api/expenses/dashboard/summary` | Yes | Get total, today, week, and month spending |
| `GET` | `/api/expenses/analytics/category` | Yes | Category breakdown aggregation pipeline |
| `GET` | `/api/expenses/analytics/monthly` | Yes | Annual monthly spending aggregation |
| `GET` | `/api/expenses/analytics/trend` | Yes | Rolling trend aggregation (`?months=6`) |
| `POST` | `/api/expenses/seed` | Yes | Load realistic demo financial records |

---

## 🔮 Known Limitations & Future Roadmap

*Documented for engineering maturity and portfolio evaluation:*

1. **Multi-Currency Conversion**: v1 stores amounts in minor-unit integers (cents) assuming USD as default. Future iterations will integrate real-time exchange rates (e.g. Open Exchange Rates API) for multi-currency conversion.
2. **Receipt OCR Scanning**: Uploading paper receipt photos and extracting amounts/merchants automatically via Tesseract OCR or Vision LLMs.
3. **Recurring Subscriptions Engine**: Background cron job scheduling recurring bills (e.g. rent, Netflix) automatically on their monthly renewal date.
4. **Shared / Household Budgets**: Multi-user workspaces with role-based permissions (Viewer, Contributor, Admin) for splitting group expenses.
5. **AI Budget Advisor**: Personalized monthly spending anomaly detection and smart savings recommendations.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
