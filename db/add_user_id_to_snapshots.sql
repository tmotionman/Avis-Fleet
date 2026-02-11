-- Migration: Add user_id to stats_snapshots and update unique constraint
-- This enables per-user historical trends in the dashboard

-- 1. Create a temporary table with the correct schema
CREATE TABLE stats_snapshots_new (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  snapshot_date TEXT NOT NULL, -- YYYY-MM-DD
  total_vehicles INTEGER DEFAULT 0,
  available_vehicles INTEGER DEFAULT 0,
  on_rent_vehicles INTEGER DEFAULT 0,
  maintenance_vehicles INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  active_assignments INTEGER DEFAULT 0,
  pending_maintenance INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, snapshot_date)
);

-- 2. Drop the old table (historical global data is not easily attributable, so we start fresh)
-- Alternatively, we could copy data if we had a default user, but for now, fresh starts are cleaner.
DROP TABLE IF EXISTS stats_snapshots;

-- 3. Rename new table to original name
ALTER TABLE stats_snapshots_new RENAME TO stats_snapshots;

-- 4. Re-create index for fast lookup by user and date
CREATE INDEX IF NOT EXISTS idx_stats_snapshot_user_date ON stats_snapshots(user_id, snapshot_date);
