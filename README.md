# Tetra Financial Dashboard

A production-ready, multi-tenant financial transaction tracking dashboard built for a university capstone project.

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | Next.js 14 (App Router), Tailwind CSS   |
| Backend      | Express.js, TypeScript, Prisma ORM v7   |
| Database     | PostgreSQL 18                           |
| Auth         | JWT (Bearer tokens), bcryptjs           |
| Security     | Helmet, CORS, express-rate-limit        |
| Logging      | Pino (structured JSON)                  |
| CI/CD        | GitHub Actions                          |

## Project Structure

```
tetra-dashboard/
├── api/                          # Express backend
│   ├── prisma/
│   │   └── schema.prisma         # Org, User, Transaction models
│   ├── src/
│   │   ├── server.ts             # App entry point
│   │   ├── db.ts                 # Prisma client (pg adapter)
│   │   ├── middleware/            # helmet, cors, rateLimit, auth, logger, errorHandler
│   │   └── routes/               # auth.ts, transactions.ts
│   ├── prisma.config.ts          # Prisma 7 connection config
│   └── .env.example              # Required env vars
│
├── web/                          # Next.js 14 frontend
│   ├── src/app/
│   │   ├── login/page.tsx        # Login form
│   │   ├── register/page.tsx     # Registration form
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Sidebar + auth guard
│   │   │   └── page.tsx          # Dashboard with cards, list, modal
│   │   └── layout.tsx            # Root layout
│   ├── src/lib/api.ts            # Axios instance with JWT interceptor
│   └── .env.local.example        # Required env vars
│
├── docs/architecture.md          # Architecture overview
├── .github/workflows/ci.yml      # CI pipeline
└── package.json                  # Monorepo workspace config
```

## Features

- **Multi-Tenant Architecture** — Organizations are fully isolated via `orgId` filtering
- **Role-Based Access** — `ADMIN` and `USER` roles via Prisma enum
- **Transaction Management** — Create, view, and delete income/expense records
- **Dashboard Analytics** — Live Total Balance, Income, and Expense calculations
- **CSV Export** — Download all transaction history as CSV
- **Security** — Helmet headers, CORS whitelist, rate limiting, bcrypt password hashing
- **CI/CD** — Automated build, lint, and type-check on every push

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL 18

### 1. Clone & Install
```bash
git clone https://github.com/Meenesh-26/tetra-dashboard.git
cd tetra-dashboard
npm install
```

### 2. Backend Setup
```bash
cd api
cp .env.example .env          # Edit with your database credentials
npx prisma migrate dev        # Create database tables
npx prisma generate           # Generate Prisma client
npm run dev                   # Starts on http://localhost:4000
```

### 3. Frontend Setup
```bash
cd web
npm run dev                   # Starts on http://localhost:3000
```

### 4. Test the API
```bash
# Register a new organization
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"orgName":"Acme Corp","email":"admin@acme.com","password":"password123"}'
```

## Environment Variables

### Backend (`api/.env`)
| Variable       | Description                      | Example                                              |
|----------------|----------------------------------|------------------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string     | `postgresql://postgres:pwd@127.0.0.1:5432/tetra_dev` |
| `PORT`         | Express server port              | `4000`                                               |
| `FRONTEND_URL` | Frontend URL for CORS whitelist  | `http://localhost:3000`                               |
| `JWT_SECRET`   | Secret key for signing JWTs      | `your_secret_key`                                    |

### Frontend (`web/.env.local`)
| Variable               | Description       | Example                          |
|------------------------|--------------------|----------------------------------|
| `NEXT_PUBLIC_API_URL`  | Backend API URL    | `http://localhost:4000/api`      |

## API Endpoints

| Method | Endpoint                     | Auth     | Description                    |
|--------|------------------------------|----------|--------------------------------|
| POST   | `/api/auth/register`         | Public   | Create org + admin user        |
| POST   | `/api/auth/login`            | Public   | Login, returns JWT             |
| GET    | `/api/transactions`          | Bearer   | List org transactions          |
| POST   | `/api/transactions`          | Bearer   | Create a transaction           |
| DELETE | `/api/transactions/:id`      | Bearer   | Delete a transaction           |
| GET    | `/api/transactions/export`   | Bearer   | Download CSV export            |
| GET    | `/health`                    | Public   | Health check                   |

## License

MIT
