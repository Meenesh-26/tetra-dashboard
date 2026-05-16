# Architecture & Technical Decisions

This document outlines the high-level architecture and the technical decisions made while building the Tetra Financial Dashboard.

## High-Level Architecture

The project follows a decoupled, three-tier architecture:

1.  **Frontend:** Next.js (deployed on Vercel)
2.  **Backend:** Express.js + Node.js (deployed on Render)
3.  **Database:** PostgreSQL (hosted on Supabase)

```mermaid
graph TD
    Client[Client Browser] -->|HTTP Requests| Vercel[Vercel: Next.js Frontend]
    Vercel -->|REST API Calls (axios)| Render[Render: Express API Backend]
    Render -->|Prisma ORM (TCP)| Supabase[(Supabase: PostgreSQL)]
```

---

## 1. Frontend: Next.js + Tailwind CSS

**Decision:** We chose Next.js with the App Router to build a highly responsive, modern user interface.
**Styling:** Tailwind CSS was selected for rapid, utility-first styling, ensuring a consistent and easily maintainable design system.
**Data Fetching:** We chose `axios` to interact with our custom Express backend because it simplifies intercepting requests to inject JWT auth tokens automatically.
**Deployment:** Vercel was chosen as the hosting provider. Vercel is built by the creators of Next.js, ensuring zero-configuration deployments, global CDN distribution, and immediate build processes upon GitHub commits.

---

## 2. Backend: Express.js + TypeScript

**Decision:** We chose Express.js to maintain full control over our API endpoints, rate limiting, and business logic.
**Security:** 
- **JWT Auth:** JSON Web Tokens are used for stateless authentication.
- **Helmet & CORS:** Helmet sets secure HTTP headers, and CORS is strictly configured to only allow requests from our Vercel frontend URL.
- **Rate Limiting:** `express-rate-limit` prevents brute-force attacks on our `/auth` endpoints.
**Deployment:** Render was selected for hosting the Node.js backend because it provides continuous deployment from GitHub, built-in HTTPS, and excellent logging capabilities for custom server environments.

---

## 3. Database: PostgreSQL + Prisma ORM (Supabase)

**Decision:** We chose PostgreSQL for its robustness in handling financial transaction data.
**Hosting:** Supabase was chosen over AWS RDS or local instances because it provides a managed PostgreSQL database with built-in connection pooling (PgBouncer), which is critical for serverless or autoscaling environments.
**ORM:** Prisma (v7) was chosen to interact with the database. Prisma provides end-to-end type safety.
- **Connection Pooling Challenge:** To connect reliably to Supabase from Render, we utilized the `@prisma/adapter-pg` driver adapter. This ensures Prisma uses the native `pg` Node module, which reliably handles the connection pooler port (6543) provided by Supabase.

---

## 4. Multi-Tenant Strategy

**Decision:** To support multiple organizations, we implemented a straightforward multi-tenant schema using foreign keys.
- The `Org` table is the root.
- Every `User` and `Transaction` contains an `orgId`.
- The Express backend reads the `orgId` from the verified JWT token and filters all database queries to ensure users can only ever view or modify data belonging to their specific organization. This guarantees data isolation without the complexity of managing separate database schemas per tenant.
