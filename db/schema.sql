-- PostgreSQL schema for Avis Fleet
-- Creates clients, vehicles and assignments tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  industry TEXT,
  status TEXT,
  added_date DATE DEFAULT CURRENT_DATE
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_no TEXT NOT NULL UNIQUE,
  model TEXT,
  year INTEGER,
  mileage INTEGER DEFAULT 0,
  status TEXT,
  added_date DATE DEFAULT CURRENT_DATE
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  assigned_date DATE DEFAULT CURRENT_DATE,
  start_date DATE,
  end_date DATE,
  return_date DATE,
  purpose TEXT
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_assignments_vehicle ON assignments(vehicle_id);
