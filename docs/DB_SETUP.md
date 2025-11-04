Local PostgreSQL (Docker) setup for Avis Fleet

This project includes a simple Postgres setup using Docker Compose for local development.

Quick start (PowerShell):

```powershell
# Start Postgres container (first run will execute schema and seed scripts)
docker-compose up -d

# Verify container is running
docker-compose ps

# Connect to DB using psql (from host, requires psql installed)
psql "host=localhost port=5432 user=avis_user password=avis_password dbname=avis_fleet"

# If you need to re-run schema/seed, you can copy files into the container or run psql from host:
# psql -h localhost -U avis_user -d avis_fleet -f ./db/schema.sql
# psql -h localhost -U avis_user -d avis_fleet -f ./db/seed.sql
```

Notes:
- The docker-compose file mounts the `./db` folder into the container's `/docker-entrypoint-initdb.d` path. On a fresh volume initialization, Postgres will automatically run any `*.sql` files placed there (this is how `schema.sql` and `seed.sql` will be applied).
- The `.env.example` contains connection details for local development. Do not commit real production credentials.

Next steps (optional):
- Add a small backend service (Express/Koa/Fastify) to expose REST endpoints and connect to Postgres using `node-postgres` (`pg`).
- Add a migration tool (e.g., `node-pg-migrate` or `Flyway`) if you expect schema changes.
