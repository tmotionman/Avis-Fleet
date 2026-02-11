-- Database migration for Dashboard Trends
-- Creates a table to store daily snapshots of fleet statistics

CREATE TABLE IF NOT EXISTS stats_snapshots (
  id TEXT PRIMARY KEY,
  snapshot_date TEXT UNIQUE NOT NULL, -- YYYY-MM-DD
  total_vehicles INTEGER DEFAULT 0,
  available_vehicles INTEGER DEFAULT 0,
  on_rent_vehicles INTEGER DEFAULT 0,
  maintenance_vehicles INTEGER DEFAULT 0,
  active_clients INTEGER DEFAULT 0,
  active_assignments INTEGER DEFAULT 0,
  pending_maintenance INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Index for fast lookup by date
CREATE INDEX IF NOT EXISTS idx_stats_snapshot_date ON stats_snapshots(snapshot_date);
