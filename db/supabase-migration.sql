-- Supabase migration script for Avis Fleet
-- Run this in Supabase SQL Editor after creating the project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  industry TEXT,
  status TEXT DEFAULT 'Active',
  added_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_no TEXT NOT NULL UNIQUE,
  model TEXT,
  year INTEGER,
  mileage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  added_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  assigned_date DATE DEFAULT CURRENT_DATE,
  start_date DATE,
  end_date DATE,
  return_date DATE,
  purpose TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_assignments_vehicle ON assignments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_assignments_client ON assignments(client_id);

-- Enable Row-Level Security (RLS) - Optional but recommended
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Example RLS policy: Allow all public read, authenticated users can modify
-- CREATE POLICY "Allow public read" ON clients FOR SELECT USING (true);
-- CREATE POLICY "Allow authenticated insert" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
