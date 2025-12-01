-- Seed data for Cloudflare D1 - Avis Fleet
-- Run after schema creation: wrangler d1 execute avis-fleet-db --file=./db/d1-seed.sql

-- Insert Users
INSERT INTO users (id, name, email, role) VALUES
  ('USR001', 'Admin User', 'admin@avisfleet.com', 'Admin'),
  ('USR002', 'John Smith', 'john.smith@avisfleet.com', 'Fleet Manager'),
  ('USR003', 'Sarah Johnson', 'sarah.johnson@avisfleet.com', 'User');

-- Insert Clients
INSERT INTO clients (id, name, email, phone, address, city, industry, status, added_date) VALUES
  ('CLI001', 'Zamtel Communications', 'contact@zamtel.co.zm', '+260-21-100-1000', '123 Cairo Road, Lusaka', 'Lusaka', 'Technology', 'Active', '2024-01-15'),
  ('CLI002', 'Zambia Copper Supplies', 'info@zcs.co.zm', '+260-29-200-2000', '456 Industrial Zone, Ndola', 'Ndola', 'Mining & Supplies', 'Active', '2024-02-20'),
  ('CLI003', 'Livingstone Tourism Board', 'sales@lstourim.co.zm', '+260-31-300-3000', '789 Tourist Street, Livingstone', 'Livingstone', 'Tourism', 'Active', '2024-03-10'),
  ('CLI004', 'ZESCO Distribution Ltd', 'fleet@zesco.co.zm', '+260-21-400-4000', '500 Energy Way, Lusaka', 'Lusaka', 'Utilities', 'Active', '2024-04-05'),
  ('CLI005', 'Kitwe Manufacturing Corp', 'logistics@kitwe.co.zm', '+260-29-500-5000', '200 Industrial Park, Kitwe', 'Kitwe', 'Manufacturing', 'Active', '2024-05-12');

-- Insert Vehicles
INSERT INTO vehicles (id, registration_no, model, year, mileage, status, last_service_date, location, assigned_to, added_date) VALUES
  ('VEH001', 'ZMB 215 ZM', 'Toyota Corolla 1.6', 2023, 45000, 'Available', '2025-10-15', 'Lusaka', 'John Smith', '2024-01-10'),
  ('VEH002', 'ZMB 216 ZM', 'Hyundai i20 1.4', 2023, 32000, 'On Rent', '2025-09-20', 'Ndola', 'Sarah Johnson', '2024-02-15'),
  ('VEH003', 'ZMB 217 ZM', 'Nissan Qashqai 1.6', 2022, 58000, 'Available', '2025-08-10', 'Kitwe', 'Mike Davis', '2024-01-20'),
  ('VEH004', 'ZMB 218 ZM', 'Renault Sandero 1.0', 2023, 28000, 'Available', '2025-10-01', 'Lusaka', 'Emma Wilson', '2024-03-05'),
  ('VEH005', 'ZMB 219 ZM', 'Hyundai Tucson 2.0', 2022, 67000, 'Maintenance', '2025-10-10', 'Livingstone', NULL, '2024-02-28'),
  ('VEH006', 'ZMB 220 ZM', 'Toyota Yaris 1.5', 2021, 85000, 'Maintenance', '2025-07-15', 'Lusaka', NULL, '2023-11-10'),
  ('VEH007', 'ZMB 221 ZM', 'Nissan NV200 1.6', 2023, 22000, 'Available', '2025-10-08', 'Ndola', 'Robert Brown', '2024-04-12'),
  ('VEH008', 'ZMB 222 ZM', 'Hyundai Elantra 1.6', 2023, 38000, 'Available', '2025-09-25', 'Kitwe', 'Lisa Anderson', '2024-05-01');

-- Insert Assignments
INSERT INTO assignments (id, vehicle_id, client_id, assigned_date, start_date, end_date, purpose, status) VALUES
  ('ASN001', 'VEH002', 'CLI001', '2025-11-01', '2025-11-01', '2025-12-31', 'Corporate fleet for IT team', 'Active'),
  ('ASN002', 'VEH001', 'CLI004', '2025-10-15', '2025-10-15', '2025-11-15', 'Field operations support', 'Completed'),
  ('ASN003', 'VEH003', 'CLI002', '2025-09-01', '2025-09-01', '2025-10-31', 'Mining site transportation', 'Completed'),
  ('ASN004', 'VEH007', 'CLI003', '2025-11-15', '2025-11-15', '2026-01-15', 'Tourism shuttle service', 'Active');

-- Insert Maintenance Records
INSERT INTO maintenance_records (id, vehicle_id, service_type, description, cost, service_date, next_service_date, odometer_reading, performed_by, status) VALUES
  ('MNT001', 'VEH005', 'Engine Repair', 'Engine overhaul and timing belt replacement', 2500.00, '2025-11-20', '2026-02-20', 67000, 'Lusaka Auto Service', 'In Progress'),
  ('MNT002', 'VEH006', 'Brake Service', 'Front and rear brake pad replacement', 450.00, '2025-11-18', '2026-05-18', 85000, 'Avis Workshop', 'In Progress'),
  ('MNT003', 'VEH001', 'Oil Change', 'Regular oil change and filter replacement', 150.00, '2025-10-15', '2026-01-15', 45000, 'Avis Workshop', 'Completed'),
  ('MNT004', 'VEH002', 'Tire Rotation', 'Tire rotation and alignment check', 80.00, '2025-09-20', '2026-03-20', 32000, 'Ndola Tire Center', 'Completed');
