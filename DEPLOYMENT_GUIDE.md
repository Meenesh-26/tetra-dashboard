# Tetra Financial Dashboard — Deployment Guide

## Architecture
```
[Vercel] → Frontend (Next.js)
    ↓ API calls via axios
[Render] → Backend (Express + Prisma)
    ↓ PostgreSQL connection via pg Pool
[Supabase] → Database (PostgreSQL)
```

---

## Prerequisites
- GitHub repo: `Meenesh-26/tetra-dashboard`
- Supabase project created (ID: `tavnxbuiuomhgdthzeky`)
- Render account
- Vercel account (connected to GitHub)

---

## Step 1: Supabase Database (DONE ✅)

Tables `Org`, `User`, and `Transaction` already exist in Supabase.

Your Supabase connection strings:
- **Pooler (for runtime):** `postgresql://postgres.tavnxbuiuomhgdthzeky:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`
- **Direct (for Prisma CLI):** `postgresql://postgres.tavnxbuiuomhgdthzeky:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`

---

## Step 2: Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo `tetra-dashboard`
3. Configure:
   - **Name:** `tetra-api`
   - **Root Directory:** `api`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
4. **Environment Variables** (add ALL of these):

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres.tavnxbuiuomhgdthzeky:viratvel1826@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET` | `tetra_prod_secret_99` |
| `FRONTEND_URL` | `*` |
| `NODE_VERSION` | `20` |

5. Click **Create Web Service** → wait for "Your service is live 🎉"
6. Copy your URL (e.g. `https://tetra-api-kumo.onrender.com`)

---

## Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import `tetra-dashboard` from GitHub
3. Configure:
   - **Framework:** Next.js (auto-detected)
   - **Root Directory:** `web`
4. **Environment Variable:**

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://tetra-api-kumo.onrender.com/api` |

5. Click **Deploy** → wait for success

---

## Step 4: Lock Down CORS (After Both Are Live)

Go back to **Render** → your `tetra-api` service → **Environment** → change:
- `FRONTEND_URL` from `*` to your Vercel URL (e.g. `https://tetra-dashboard.vercel.app`)

This restricts the API to only accept requests from your website.

---

## Done! 🎉
Visit your Vercel URL and register your first organization.
