# Supabase Setup & Migration Guide

This guide walks you through setting up Avis Fleet with Supabase as your production database.

## Prerequisites

- Supabase account (https://app.supabase.com)
- Node.js 16+ with npm
- `@supabase/supabase-js` package (to be installed)

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click **New project**
3. Fill in:
   - **Name**: `avis-fleet` (or similar)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users (e.g., eu-west-1, us-east-1)
4. Click **Create new project** and wait ~2 min for setup

## Step 2: Get API Credentials

1. Once project is ready, go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://your-project.supabase.co`)
   - **anon (public) key** (starts with `eyJ...`)
3. Paste into `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

## Step 3: Set Up Database Schema

1. In Supabase, go to **SQL Editor**
2. Create a new query
3. Copy the entire content from `db/supabase-migration.sql`
4. Paste it into the SQL Editor and click **Run**
5. Schema is now created on Supabase (clients, vehicles, assignments tables)

## Step 4: Install Supabase Client

```powershell
npm install @supabase/supabase-js
```

The client is already initialized in `src/lib/supabaseClient.js`. You can now import and use it in your components:

```javascript
import { supabase } from '../lib/supabaseClient'

// Example: Fetch vehicles
const { data, error } = await supabase
  .from('vehicles')
  .select('*')
```

## Step 5: Migrate Data (Optional)

To copy existing JSON data to Supabase:

```powershell
# Using Supabase CLI (install first if needed)
npm install -g supabase

# Or manually: Export from local Postgres, import to Supabase via SQL Editor or API
```

For now, you can seed data manually via SQL Editor or through the frontend when you wire up the insert/update functions.

## Step 6: Update Frontend to Use Supabase

Replace local JSON data fetches with Supabase queries. Example for Dashboard:

**Old (using JSON):**
```javascript
import vehiclesData from '../data/vehicles.json'
const totalVehicles = vehiclesData.length
```

**New (using Supabase):**
```javascript
const { data: vehicles } = await supabase.from('vehicles').select('*')
const totalVehicles = vehicles.length
```

## Security Notes

- **anon key**: Used for public/anonymous access. Enable Row-Level Security (RLS) policies in Supabase to restrict access.
- **service_role key**: Has full access. Use only on backend (never expose to frontend).
- Never commit `.env.local` with real credentials.

## Troubleshooting

- **"Missing environment variables"**: Check `.env.local` and verify `VITE_` prefix for Vite.
- **CORS errors**: Supabase auto-allows localhost. For production, configure **Settings → API → CORS** in Supabase.
- **Authentication needed**: If tables require auth, implement Supabase Auth (Google, GitHub, email/password) via `supabase.auth.signUp()` or `supabase.auth.signInWithPassword()`.

## Next Steps

- Connect Dashboard, Fleet List, Reports to live Supabase data
- Add real-time subscriptions using `supabase.on('*', callback)`
- Implement Row-Level Security (RLS) policies for multi-tenant safety
- Use Supabase Auth for user login instead of localStorage
