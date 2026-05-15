# Tetra Finance — Production Deployment Guide

Follow these steps to take your project from your local machine to the live internet.

## 1. Database Setup (Supabase)

1. **Create Project:** Sign up at [Supabase](https://supabase.com) and create a new project.
2. **Get Connection String:** 
   - Go to **Project Settings** > **Database**.
   - Copy the **Connection String (URI)**.
   - It should look like: `postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres`
3. **Initialize Database:**
   Run this from your local machine to create the tables on Supabase:
   ```powershell
   cd api
   # Replace with your real Supabase URL
   $env:DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres"
   npx prisma db push
   ```

## 2. Backend Deployment (Railway or Render)

1. **Connect GitHub:** Create an account on [Railway.app](https://railway.app) and connect your repository.
2. **Set Root Directory:** Set the root directory to `api`.
3. **Configure Environment Variables:**
   - `DATABASE_URL`: (Your Supabase URI)
   - `JWT_SECRET`: (A strong random string, e.g., `456789123asdfghjkl`)
   - `FRONTEND_URL`: (The URL of your Vercel frontend, e.g., `https://tetra-web.vercel.app`)
   - `PORT`: `4000` (Railway/Render usually provide this automatically)

## 3. Frontend Deployment (Vercel)

1. **Connect GitHub:** Create an account on [Vercel](https://vercel.com) and import your repository.
2. **Set Root Directory:** Set the root directory to `web`.
3. **Configure Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: (The URL of your backend, e.g., `https://tetra-api.up.railway.app/api`)
4. **Deploy:** Vercel will automatically detect Next.js and deploy it.

## 4. Final Verification

1. Go to your Vercel URL.
2. Register a new account.
3. Check **Supabase Dashboard** > **Table Editor** to see your new user and organization appearing in the live cloud database!

---

## Troubleshooting

- **CORS Errors:** Ensure the `FRONTEND_URL` in your Backend settings exactly matches your Vercel URL (including `https://` and no trailing slash).
- **Prisma Connection:** If Supabase is slow, ensure you are using the **Connection Pooler** URI (usually port 6543) and append `?pgbouncer=true` to the end of the URL.
