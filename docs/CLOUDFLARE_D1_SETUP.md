# Cloudflare D1 Database Setup Guide

This guide walks you through setting up Cloudflare D1 database for the Avis Fleet Management System.

## Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **Node.js** - Version 18 or later
3. **Wrangler CLI** - Cloudflare's command-line tool

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Authenticate with Cloudflare

```bash
wrangler login
```

This will open a browser window for authentication.

## Step 3: Create the D1 Database

Navigate to the workers/api directory and create the database:

```bash
cd workers/api
npm install
npm run db:create
```

This creates a new D1 database named `avis-fleet-db`. You'll receive output like:

```
✅ Successfully created DB 'avis-fleet-db'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Step 4: Update wrangler.toml

Copy the `database_id` from the output and update `workers/api/wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "avis-fleet-db"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Paste here
```

## Step 5: Initialize the Database Schema

Run the schema migration:

```bash
npm run db:schema
```

This creates all the tables (users, clients, vehicles, assignments, maintenance_records).

## Step 6: Seed Initial Data (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

## Step 7: Deploy the Worker API

Deploy to Cloudflare:

```bash
npm run deploy
```

You'll receive a URL like: `https://avis-fleet-api.YOUR_SUBDOMAIN.workers.dev`

## Step 8: Update Frontend Configuration

Create or update your `.env` file in the project root:

```env
VITE_API_URL=https://avis-fleet-api.YOUR_SUBDOMAIN.workers.dev
```

## Step 9: Update CORS Settings

In `workers/api/wrangler.toml`, update the CORS origin to match your Cloudflare Pages URL:

```toml
[vars]
CORS_ORIGIN = "https://your-project.pages.dev"
```

Then redeploy:

```bash
npm run deploy
```

## Local Development

### Run Worker Locally

```bash
npm run dev
```

This starts a local server at `http://localhost:8787`

### Use Local Database

For local development with a local D1 instance:

```bash
npm run db:schema:local
npm run db:seed:local
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | List all vehicles |
| POST | `/api/vehicles` | Create vehicle |
| GET | `/api/vehicles/:id` | Get vehicle by ID |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Create client |
| GET | `/api/clients/:id` | Get client by ID |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |
| GET | `/api/assignments` | List all assignments |
| POST | `/api/assignments` | Create assignment |
| PUT | `/api/assignments/:id` | Update assignment |
| DELETE | `/api/assignments/:id` | Delete assignment |
| GET | `/api/maintenance` | List maintenance records |
| POST | `/api/maintenance` | Create maintenance record |
| PUT | `/api/maintenance/:id` | Update maintenance record |
| DELETE | `/api/maintenance/:id` | Delete maintenance record |
| GET | `/api/users` | List all users |
| POST | `/api/auth/login` | User login |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/health` | Health check |

## Database Schema

### Tables

- **users** - User accounts and authentication
- **clients** - Client/company information
- **vehicles** - Fleet vehicle records
- **assignments** - Vehicle-to-client assignments
- **maintenance_records** - Vehicle service history

### Relationships

```
vehicles ──┬── assignments ──── clients
           │
           └── maintenance_records
```

## Troubleshooting

### "Database not found" error
Ensure the `database_id` in `wrangler.toml` matches the one from `wrangler d1 create`.

### CORS errors
Update `CORS_ORIGIN` in `wrangler.toml` to match your frontend URL exactly.

### Authentication issues
Run `wrangler login` again to refresh your credentials.

## Production Checklist

- [ ] Database created with `wrangler d1 create`
- [ ] Schema applied with `npm run db:schema`
- [ ] Seed data loaded (if needed) with `npm run db:seed`
- [ ] Worker deployed with `npm run deploy`
- [ ] `VITE_API_URL` set in frontend environment
- [ ] CORS configured for production domain
- [ ] Custom domain configured (optional)

## Resources

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
