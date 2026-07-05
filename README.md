# SiteBazar — AI Website & Landing Page Generator

A full-stack SaaS platform that generates websites and landing pages using AI, with a neomorphic (soft UI) design, a header with Website / Landing Page categories, an auto-sliding offers banner, and Razorpay payments.

## Pricing (enforced server-side)

| Plan | Price | What it unlocks |
|---|---|---|
| First Landing Page | **Free** | Generate + download one landing page, no payment |
| One Website | **₹399** | Source code download for one business/portfolio/restaurant site |
| One Landing Page | **₹49** | Source code download for one additional landing page |
| Unlimited Monthly | **₹999/month** | Unlimited generations + downloads for 30 days |

Websites can always be **generated and previewed** for free — payment is only required to **download the source code** (except the very first landing page, which is fully free).

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL via Supabase (pg driver), JWT, Razorpay SDK, Axios
- **Frontend:** React 18, Vite, React Router, Tailwind CSS, lucide-react icons
- **AI:** Provider-agnostic — works with any OpenAI-compatible `/chat/completions` API (NVIDIA NIM, Groq, OpenRouter, Gemini, etc.)
- **Payments:** Razorpay
- **Hosting:** Vercel (two separate projects — backend as serverless functions, frontend as a static build)

## Project Structure

```
sitebazar/
├── backend/
│   ├── app.js              # shared Express app config
│   ├── server.js           # local dev entry (app.listen)
│   ├── index.js            # Vercel serverless entry
│   ├── vercel.json
│   ├── db/pool.js          # Postgres connection (Supabase)
│   ├── db/schema.sql       # run once in Supabase SQL Editor
│   ├── models/             # userModel, websiteModel (plain SQL queries)
│   ├── services/aiService.js
│   ├── middleware/         # auth, checkAccess, errorHandler
│   ├── controllers/
│   └── routes/
└── frontend/
    ├── src/
    │   ├── components/     # Header, OffersSlider, PricingModal, Toast, Footer
    │   ├── templates/      # TemplateBusiness/Portfolio/Restaurant/LandingPage
    │   ├── pages/           # Home, Builder, Preview
    │   ├── context/AppContext.jsx
    │   └── utils/           # api.js, exportHtml.js
    └── vite.config.js
```

## 1. Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# fill in .env (see below)
npm run dev
```
Runs at `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000
# VITE_RAZORPAY_KEY_ID=your_test_key_id
npm run dev
```
Runs at `http://localhost:5173`.

## 2. Environment Variables

### Backend (`backend/.env` locally, Vercel dashboard in production)
```
DATABASE_URL=your_supabase_connection_string
AI_API_KEY=your_ai_provider_key
AI_BASE_URL=https://integrate.api.nvidia.com/v1
AI_MODEL_NAME=meta/llama-3.1-70b-instruct
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=a_long_random_string
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_EMAILS=your@gmail.com
```

You can swap `AI_BASE_URL` / `AI_MODEL_NAME` for Groq, OpenRouter, or Gemini's OpenAI-compatible endpoint — no code changes needed. Examples are commented in `backend/services/aiService.js`.

### Frontend (`frontend/.env` locally, Vercel dashboard in production)
```
VITE_API_URL=https://your-backend.vercel.app
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Important:** `RAZORPAY_KEY_SECRET` must ONLY ever be set on the backend. Never put it in the frontend env or commit it.

## 3. Getting Your Keys

- **Supabase** (free, no credit card): supabase.com → New Project → wait for it to provision → **Settings → Database → Connection string → URI** (use the "Connection pooling" string if given one, port 6543) → this is your `DATABASE_URL`
  - After creating the project, go to **SQL Editor → New Query**, paste the contents of `backend/db/schema.sql`, and click **Run** once to create the tables
- **AI Provider** (pick any one):
  - NVIDIA NIM (free): build.nvidia.com → get API key
  - Groq (free): console.groq.com
  - OpenRouter (free models available): openrouter.ai
- **Razorpay**: dashboard.razorpay.com → Settings → API Keys (use Test Mode keys first; switch to Live keys + complete KYC before accepting real payments)

## 4. Deploying to Vercel

1. Push this repo to GitHub.
2. **Backend:** Import the `/backend` folder as a new Vercel project → add all backend env vars in **Settings → Environment Variables** → deploy. Note the deployed URL.
3. **Frontend:** Import the `/frontend` folder as a separate Vercel project → set `VITE_API_URL` to the backend's deployed URL and `VITE_RAZORPAY_KEY_ID` → deploy.
4. Go back to the backend project's env vars and set `FRONTEND_URL` to the frontend's deployed URL (needed for CORS), then redeploy the backend.
5. Whenever you change an environment variable in Vercel, you must **redeploy** for it to take effect.

## 5. How the Paywall Works

- Every request to generate or download a website is tied to a `User` document identified by email (no password — a JWT is issued after the first email submission and stored in the browser).
- `checkGenerationAccess` middleware lets generation through freely (so people can preview before paying).
- `checkDownloadAccess` middleware is the real gate: it checks (in order) active subscription → free landing-page quota → previously unlocked website → otherwise returns `402 Payment Required`, which the frontend catches to open the pricing modal.
- Razorpay order amounts are always calculated **server-side** from a fixed price table — the frontend never sends the amount.
- Payment signatures are verified server-side using HMAC-SHA256 with `RAZORPAY_KEY_SECRET` before any access is granted.

## 6. Pages

- `/login` — free email-only sign in (no Google/OAuth, no third-party auth cost)
- `/dashboard` — a logged-in user's own websites, free-quota status, and subscription state
- `/admin` — internal panel (users, websites, stats) restricted to emails listed in `ADMIN_EMAILS`. Visiting `/admin` while logged in as a non-admin email redirects back to `/dashboard`.

## 7. Notes & Next Steps

- The AI service has a graceful fallback: if the AI provider key is missing or a call fails twice, it returns clean placeholder content instead of crashing, so the demo always works end-to-end.
- Razorpay Test Mode lets you fully test the payment flow with test card numbers (listed in Razorpay's docs) before going live.
- For production, consider adding OTP email verification before issuing the JWT, and a cron job (or Vercel Cron) to double-check expired subscriptions.
