# Fullstack Application Implementation Plan

## Goal Description

Build a multi‑tenant financial transaction dashboard application using the locked tech stack:
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui, React Hook Form + Zod, TanStack Query, error boundaries, toast notifications.
- **Backend:** Express.js, Prisma ORM, PostgreSQL (Supabase), JWT authentication, pino logging, helmet security, global rate limiting, CORS whitelist.
- **CI/CD:** GitHub Actions pipeline for lint, build, test, and Prisma migration check.
- **Deployment:** Frontend on Vercel, backend on Render, managed PostgreSQL via Supabase.
- **Deliverables:** Live URLs, architecture documentation, README, environment variable list, clean Git history, and a tagged release.

The user supplied a detailed hour‑by‑hour schedule; the plan below organizes those actions into logical phases, enumerates required files, and outlines verification steps.

---

## User Review Required

> [!IMPORTANT]
> The plan follows the user‑provided timeline verbatim. Review the listed file structure and any optional cut‑list items. Confirm if any phases should be re‑ordered or if additional constraints (e.g., test coverage, style guides) are needed.

---

## Open Questions

> [!NOTE]
> - Do you require unit/integration tests beyond the manual testing steps outlined?
> - Should we include a Dockerfile for local development or rely on `npm` scripts only?
> - Is there a preferred naming convention for Git branches and tags?
>
> Please confirm or provide guidance on these items.

---

## Proposed Changes

### 1. Repository Initialization

- **[NEW] `README.md`** – Project overview, setup instructions, environment variables (without secrets).
- **[NEW] `.github/workflows/ci.yml`** – CI pipeline (checkout, install, lint, build, Prisma migrate status).
- **[NEW] `package.json` (root)** – Workspace configuration for `api` and `web` sub‑projects.
- **[NEW] `turbo.json`** (optional) – Monorepo task runner.

### 2. Backend (`api/`)

- **[NEW] `api/package.json`** – Express, Prisma, pino, helmet, rate‑limit, cors, dotenv.
- **[NEW] `api/src/server.ts`** – Express app bootstrap with middleware stack:
  - helmet (CSP, HSTS, X‑Frame‑Options)
  - cors (whitelist frontend URL)
  - rate‑limit (global & auth‑specific limits)
  - pino logger (JSON, replace console.log)
  - centralized error handler (no stack traces)
  - auth routes (login, register, token refresh)
  - organization & transaction routes (tenant‑scoped via `orgId`).
- **[NEW] `api/src/middleware/`** – Separate files for helmet config, rate limiting, CORS, error handling, and logging.
- **[NEW] `api/prisma/schema.prisma`** – `User`, `Org`, `Transaction` models with relations and indexes.
- **[NEW] `api/.env.example`** – `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`.
- **[NEW] `api/src/utils/pino.ts`** – pino instance export.
- **[NEW] `api/src/routes/`** – Auth, org, transaction, dashboard, CSV export (streaming).
- **[NEW] `api/src/tests/`** – Optional manual test scripts for endpoint verification.

### 3. Frontend (`web/`)

- **[NEW] `web/package.json`** – Next.js 14, Tailwind, shadcn/ui, react‑hook‑form, zod, @tanstack/react‑query, axios, react‑toastify.
- **[NEW] `web/next.config.js`** – Environment variable handling.
- **[NEW] `web/tailwind.config.js`** – Tailwind setup.
- **[NEW] `web/src/app/layout.tsx`** – Global providers (React Query client, Auth context).
- **[NEW] `web/src/app/auth/login/page.tsx`** – Login UI with RHF + Zod, HTTP‑only cookie handling.
- **[NEW] `web/src/app/auth/register/page.tsx`** – Registration UI with org creation flow.
- **[NEW] `web/src/hooks/useAuth.ts`** – Auth status check, token refresh logic.
- **[NEW] `web/src/components/RouteGuard.tsx`** – Redirect unauthenticated users.
- **[NEW] `web/src/app/dashboard/page.tsx`** – Dashboard cards, simple bar chart (e.g., recharts basic).
- **[NEW] `web/src/components/TransactionList.tsx`** – React Query list with cursor pagination, filters.
- **[NEW] `web/src/components/TransactionForm.tsx`** – Modal/page for create/edit with validation.
- **[NEW] `web/src/components/ExportButton.tsx`** – Calls backend CSV export endpoint.
- **[NEW] `web/src/components/ErrorBoundary.tsx`** – Global error boundary logging to backend.
- **[NEW] `web/src/components/LoadingSkeleton.tsx`** – Skeleton UI for dashboard.
- **[NEW] `web/src/components/ToastProvider.tsx`** – Toast notifications for success/error.
- **[NEW] `web/.env.local.example`** – `NEXT_PUBLIC_API_URL`.

### 4. CI/CD & Deployment

- **[MODIFY] `.github/workflows/ci.yml`** – Add steps for Prisma generate and migrate status, separate builds for `api` and `web`.
- **[NEW] `vercel.json`** (optional) – Route rewrites to backend API.
- **[NEW] Render service configuration** – (documented in README) – link to GitHub repo, set env vars, deploy command `npm run start`.

### 5. Final Testing & Documentation

- **[NEW] `docs/architecture.md`** – 1‑page tech stack diagram, multi‑tenant flow, auth strategy, deployment diagram.
- **[NEW] `docs/checklist.md`** – Hour‑by‑hour checklist reproduced for reference.
- **[NEW] `docs/performance.md`** – Simple load‑test script using `k6` or `ab` commands (optional).
- **[NEW] `docs/security.md`** – Verification of helmet headers, rate limiting, CORS.
- **[NEW] `LICENSE`** – MIT or appropriate open source license.

---

## Verification Plan

### Automated Tests
- Run `npm run lint` for both `api` and `web`.
- Execute `npm run build` for both projects in CI.
- Run `npx prisma migrate status` to ensure DB schema consistency.
- (Optional) Add a simple Jest/Supertest suite for auth endpoints.

### Manual Verification
- **Backend:** Use Postman or curl to hit each endpoint, confirm rate‑limit headers, helmet headers, CORS behavior, and proper error JSON format.
- **Frontend:** End‑to‑end flow:
  1. Register a new organization and user.
  2. Login, ensure HTTP‑only cookie is set.
  3. Navigate to dashboard, verify aggregates.
  4. Create, edit, delete transactions; observe optimistic UI updates and toast feedback.
  5. Export CSV and confirm download.
  6. Test route guards (unauthenticated redirect).
  7. Simulate error (e.g., fetch invalid endpoint) and verify Error Boundary UI and backend logging.
- **CI/CD:** Push a commit, ensure GitHub Actions passes all steps.
- **Deployment:** Verify live URLs, environment variable injection, and that backend URLs are reachable from frontend.
- **Performance:** Fire 100 concurrent GET `/api/dashboard` requests; response time <200 ms.
- **Security:** Inspect response headers for CSP, HSTS, X‑Frame‑Options, and verify rate‑limit blocks after exceeding thresholds.

---

## Cut‑List Prioritization (if behind schedule)
1. CSV Export → JSON Export.
2. Dashboard Charts → Plain numeric cards.
3. Role‑Based UI → API‑only enforcement.
4. Error Boundaries → Basic try/catch.
5. React Query Caching → Simple fetch with `useEffect`.
6. Refresh Token Rotation → Long‑lived access token.

Never cut multi‑tenancy, password hashing, org filtering, DB transactions, or helmet security.

---

*This plan is ready for your review. Please confirm or provide any additional constraints or preferences.*
