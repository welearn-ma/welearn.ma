# Registration Backend Testing and Frontend Integration

## 1) Configure environment variables

### Backend

1. Copy `backend/.env.example` to `backend/.env`.
2. Set real values:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CORS_ORIGIN` (comma-separated, for example `http://localhost:3000,https://welearn.ma`)

### Frontend

1. Copy `.env.example` to `.env.local`.
2. Keep or update:

- `NEXT_PUBLIC_API_URL=http://localhost:4000`

## 2) Validate Supabase table

Run this SQL in Supabase SQL Editor if needed:

```sql
create table if not exists registration_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  company text,
  position text,
  message text,
  formation_slug text not null,
  formation_title text not null,
  created_at timestamptz default now()
);
```

## 3) Start backend locally

```bash
cd backend
pnpm install
pnpm dev
```

Expected: `Backend running on port 4000`

## 4) Test with Postman

### Option A: Import collection

Import:

- `backend/postman/registrations.postman_collection.json`

Run requests in this order:

1. `Health Check` (expect `200`)
2. `Create Registration - Valid` (expect `201`)
3. `Create Registration - Missing fullName (400)` (expect `400`)

### Option B: Manual request

- Method: `POST`
- URL: `http://localhost:4000/api/registrations`
- Header: `Content-Type: application/json`
- Body:

```json
{
  "fullName": "Test User",
  "email": "test.user@welearn.ma",
  "phone": "+212600112233",
  "company": "WeLearn",
  "position": "Ingenieur",
  "message": "Je souhaite rejoindre la prochaine session.",
  "formationSlug": "bim-foundations",
  "formationTitle": "BIM Foundations"
}
```

## 5) Verify in Supabase

In the `registration_requests` table, confirm a new row exists with matching fields.

## 6) Integrate and test from frontend

1. Start frontend:

```bash
pnpm dev
```

2. Open a formation page, for example:

- `http://localhost:3000/formations/bim-foundations-professional`

3. Submit the form in section `Demander une inscription`.

Expected:

- Success state displayed in the UI.
- New row inserted in Supabase.

## 7) Common issues

- `NEXT_PUBLIC_API_URL is not configured`: create `.env.local` from `.env.example`.
- CORS error in browser: ensure frontend origin is present in `backend/.env` `CORS_ORIGIN`.
- 500 from backend: check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`.
