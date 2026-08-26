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
