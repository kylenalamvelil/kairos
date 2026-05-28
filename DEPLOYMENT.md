# Kairos Deployment

## Overview

- **kairos-core** → Railway (Docker + PostgreSQL)
- **kairos-web** → Vercel (Next.js)

---

## 1. Deploy kairos-core to Railway

### Prerequisites
- Railway account: https://railway.app
- Railway CLI: `npm install -g @railway/cli`

### Steps

```bash
# Login
railway login

# Create new project
cd kairos-core
railway init

# Add PostgreSQL service (Railway UI → New Service → Database → PostgreSQL)
# Railway automatically sets DATABASE_URL in your environment

# Deploy
railway up
```

Railway will:
1. Detect the Dockerfile
2. Build and deploy the container
3. Set `DATABASE_URL` automatically from the Postgres service
4. Use `railway.json` startCommand with `$PORT`
5. Hit `/health` to confirm deployment

### Environment variables to set in Railway

| Variable | Value |
|----------|-------|
| `ENVIRONMENT` | `production` |
| `KAIROS_API_KEY` | your-secret-key |
| `DATABASE_URL` | (set automatically by Railway Postgres) |

### Get the deployed API URL

In Railway dashboard → your service → Settings → Networking → Public URL.

It will look like: `https://kairos-core-production.up.railway.app`

### Seed production data (once only)

```bash
# Set your Railway API URL
export KAIROS_API_URL=https://your-api.railway.app

# Run seed against production
cd kairos-core
python seed.py
```

Edit `seed.py` line 9 temporarily:
```python
BASE = "https://your-api.railway.app/v1"
```

Run `python seed.py` then revert.

### Verify

```bash
curl https://your-api.railway.app/health
curl https://your-api.railway.app/v1/workflows
curl https://your-api.railway.app/docs  # API docs
```

---

## 2. Deploy kairos-web to Vercel

### Prerequisites
- Vercel account: https://vercel.com
- Vercel CLI: `npm install -g vercel`

### Steps

```bash
cd kairos-web
vercel
```

When prompted:
- Framework: Next.js (auto-detected)
- Root directory: `./` (default)
- Build command: `npm run build` (default)

### Environment variable

In Vercel dashboard → your project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_KAIROS_API_URL` | `https://your-api.railway.app` |

Or set it via CLI before deploying:

```bash
vercel env add NEXT_PUBLIC_KAIROS_API_URL
# Enter: https://your-api.railway.app
```

Then redeploy:

```bash
vercel --prod
```

### Verify

- `https://your-project.vercel.app` — landing page
- `https://your-project.vercel.app/app` — dashboard (should show live executions)

---

## 3. Update CORS for production

Once you have your Vercel URL, tighten CORS in `kairos-core/app/main.py`:

```python
allow_origins=[
    "https://your-project.vercel.app",
    "http://localhost:3000",  # keep for local dev
],
```

Then redeploy kairos-core: `railway up`

---

## 4. Update kairos-web to point at production

Update `kairos-web/.env.local` with your Railway URL:

```
NEXT_PUBLIC_KAIROS_API_URL=https://your-api.railway.app
```

For local dev this keeps the dashboard connected to production data.

---

## Troubleshooting

**`asyncpg` connection error on Railway**
- Railway provides `postgres://` URLs — the config auto-converts to `postgresql+asyncpg://`
- If still failing, check the DATABASE_URL in Railway → your Postgres service → Variables

**`$PORT` not found**
- Railway injects `$PORT` at runtime via `railway.json` startCommand
- Do not hardcode port 8000 in production

**Vercel build fails**
- Run `npm run build` locally first to catch errors
- Ensure `NEXT_PUBLIC_KAIROS_API_URL` is set before the build runs

**Dashboard shows "API offline"**
- Check Railway service is deployed and healthy
- Check CORS allows your Vercel domain
- Check `NEXT_PUBLIC_KAIROS_API_URL` matches the Railway URL exactly (no trailing slash)
