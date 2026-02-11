-- Migration: Create notification_states table
-- This table stores whether a notification has been read or dismissed by a specific user.

CREATE TABLE IF NOT EXISTS notification_states (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  notification_id TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  is_dismissed BOOLEAN DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, notification_id)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notification_states(user_id);
