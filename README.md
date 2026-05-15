# Tetra Financial Dashboard

A modern, multi-tenant financial transaction tracking dashboard.

## Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Express, TypeScript, Prisma ORM, PostgreSQL
- **Security:** JWT Authentication, bcrypt, helmet, rate-limiting, CORS

## Project Structure
This is a monorepo setup using npm workspaces.
- `/api` - The backend Express server and database models.
- `/web` - The frontend Next.js application.

## Local Development

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432`. Create a database named `tetra_dev` and a user `postgres` with the password configured in your `.env`.

### 2. Backend Setup
```bash
cd api
npm install
# Set up the .env file with DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd web
npm install
npm run dev
```

## Features
- **Multi-tenant Architecture:** Organizations are isolated, and users only see data for their specific organization.
- **Transactions Management:** Add, delete, and view categorized income/expenses.
- **Dashboard Analytics:** Live calculation of Total Balance, Income, and Expenses.
- **CSV Export:** Download all transaction history directly to CSV.
- **CI/CD Pipeline:** Fully configured GitHub Actions for testing and building.
