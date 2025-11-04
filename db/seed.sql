-- Optional seed data for local development

INSERT INTO clients (id, name, email, phone, address, city, industry, status, added_date)
VALUES
  (uuid_generate_v4(), 'Acme Corporation', 'contact@acme.example', '+27 21 555 0100', '1 Acme St', 'Cape Town', 'Logistics', 'Active', '2025-01-15'),
  (uuid_generate_v4(), 'Global Logistics Ltd', 'info@globallog.example', '+27 11 444 0200', '200 Global Ave', 'Johannesburg', 'Transport', 'Active', '2025-03-02'),
  (uuid_generate_v4(), 'Durban Services Inc.', 'hello@durban.example', '+27 31 333 0300', '5 Durban Rd', 'Durban', 'Services', 'Active', '2025-05-18');

INSERT INTO vehicles (id, registration_no, model, year, mileage, status, added_date)
VALUES
  (uuid_generate_v4(), 'ABC123GP', 'Toyota Corolla', 2018, 120000, 'Active', '2024-02-10'),
  (uuid_generate_v4(), 'XYZ987MP', 'Ford Ranger', 2020, 90000, 'Active', '2024-08-20');

-- Note: When docker-compose brings up Postgres for the first time, files in /docker-entrypoint-initdb.d are executed.
-- This seed file is optional and helpful for development only.
