-- Migration: Add user_id to vehicles, clients, and assignments tables
-- This enables multi-user support where each user has their own data

-- Add user_id column to vehicles table
ALTER TABLE vehicles ADD COLUMN user_id TEXT;

-- Add user_id column to clients table
ALTER TABLE clients ADD COLUMN user_id TEXT;

-- Add user_id column to assignments table
ALTER TABLE assignments ADD COLUMN user_id TEXT;

-- Create indexes for user_id queries
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);

-- Foreign key constraint to users table (if using enforced foreign keys)
-- ALTER TABLE vehicles ADD CONSTRAINT fk_vehicles_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE clients ADD CONSTRAINT fk_clients_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- ALTER TABLE assignments ADD CONSTRAINT fk_assignments_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
