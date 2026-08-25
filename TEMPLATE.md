# Multi-Tenant Vendor Dashboard

> A complex architectural template showcasing multi-tenancy. Allows businesses to manage their B2B suppliers, complete with role-based access control (RBAC), data isolation, and API integration endpoints.

<div dir="rtl"><b>لوحة تحكم الموردين متعددة الشركات</b> — قالب معماري متقدم يعرض نظام تعدد الشركات (Multi-tenancy). يتيح للشركات إدارة مورديها (B2B)، ومزود بنظام تحكم في الوصول بناءً على الصلاحيات (RBAC)، وعزل للبيانات، ونقاط ربط برمجية (APIs).</div>

`multi-tenant-vendor-dashboard` · real-estate · 29 files · generated from the CodeSky template gallery

## What this is

A multi-tenant vendor dashboard template for businesses managing B2B suppliers across multiple client companies. It demonstrates architectural patterns for tenant isolation, role-based access control, and supplier relationship management. The template targets teams building SaaS platforms where each tenant needs secure, isolated supplier data and order tracking. Developers familiar with React and TypeScript can spin this up as a foundation for procurement or vendor management systems.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.2.0 + Vite |
| Backend | — |
| Database | SQL schema included |
| Tests | none |
| Container | none |

## Architecture

The frontend is a React 18.2 application built with Vite, using Tailwind CSS for styling and react-router-dom for navigation. It includes form handling via react-hook-form, data visualization with recharts, and API calls through axios. The client communicates with a backend via services defined in apiService.ts, though mockData.ts currently provides sample supplier and order data for development. The backend is a TypeScript Node.js application using Express (inferred from controller and route structure). It connects to a relational database through a configuration in database.ts, with models for Supplier and controllers for dashboard and supplier operations. The database schema defines six tables: companies hold tenant records, users store accounts with tenant associations, suppliers and company_suppliers enable per-tenant supplier catalogs, and orders with order_items track purchases. Environment variables control database credentials, JWT tokens for authentication, CORS policies, rate limiting, and logging. Currently only health-check and info endpoints are fully wired; supplier and dashboard routes exist in code but are not yet exposed.

### Layout

```
backend/.env.example
backend/README.md
backend/package.json
backend/src/app.ts
backend/src/config/database.ts
backend/src/controllers/dashboardController.ts
backend/src/controllers/supplierController.ts
backend/src/models/Supplier.ts
backend/src/routes/index.ts
backend/src/server.ts
backend/tsconfig.json
database/README.md
database/schema.sql
database/seed.sql
frontend/index.html
frontend/package.json
frontend/postcss.config.js
frontend/src/App.tsx
frontend/src/api/client.ts
frontend/src/api/mockData.ts
frontend/src/index.css
frontend/src/main.tsx
frontend/src/services/apiService.ts
frontend/src/types/index.ts
frontend/src/utils/rtl.ts
frontend/tailwind.config.js
frontend/tsconfig.json
frontend/tsconfig.node.json
frontend/vite.config.ts
```

### Data model

Tables defined in the SQL schema:

- `companies`
- `company_suppliers`
- `order_items`
- `orders`
- `suppliers`
- `users`

### API surface

```
GET    /
GET    /health
GET    /info
```

## Running it

```bash
# frontend
cd frontend && npm install && npm run dev
```

Configuration is read from an `.env` file. Copy `.env.example` and set:

- `CORS_CREDENTIALS`
- `CORS_METHODS`
- `CORS_ORIGIN`
- `DB_HOST`
- `DB_NAME`
- `DB_PASSWORD`
- `DB_PORT`
- `DB_USER`
- `JWT_EXPIRES_IN`
- `JWT_SECRET`
- `LOG_FORMAT`
- `LOG_LEVEL`
- `NODE_ENV`
- `PORT`
- `RATE_LIMIT_MAX_REQUESTS`
- `RATE_LIMIT_WINDOW_MS`

## What is next

1. **Implement authentication and authorization middleware** — JWT environment variables exist but no login, registration, or token validation endpoints are present, leaving RBAC claims unenforced.
2. **Wire supplier and dashboard API routes** — Controllers and models are defined but only health and info endpoints are active, so the frontend cannot fetch real supplier or order data.
3. **Replace mock data with live API integration** — The frontend currently uses mockData.ts for all supplier and order information instead of calling the backend services.
4. **Add automated tests for multi-tenancy isolation** — No test suite exists to verify that users can only access their own company's suppliers and orders, a critical security requirement.
5. **Create Docker Compose setup** — No containerization is present, making it harder for new developers to spin up the database and backend consistently.
6. **Externalize hardcoded configuration** — Rate limit values, CORS origins, and JWT expiry are in environment variables but lack validation or fallback logic in the codebase.
7. **Build CI pipeline for linting and type checking** — Frontend has lint and build scripts but no automated checks run on pull requests to catch type errors or style violations.

### Markers left in the code

Found by scanning for TODO/FIXME/placeholder:

```
frontend/src/api/mockData.ts: // تصدير البيانات التجريبية - Mock Data Export
```

---

<sub>Exported from the CodeSky template gallery. Generated code — review before production use. <a href="https://codesky.ai">codesky.ai</a></sub>
