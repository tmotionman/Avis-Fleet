/**
 * Avis Fleet API - Cloudflare Worker with D1 Database
 * Provides REST API endpoints for fleet management
 */

// Get allowed origins from environment variable and parse them
const getAllowedOrigins = (corsOriginConfig) => {
  if (corsOriginConfig === '*') {
    return '*';
  }
  return corsOriginConfig.split(',').map(o => o.trim());
};

// Check if origin is allowed
const isOriginAllowed = (origin, allowedOrigins) => {
  if (allowedOrigins === '*') {
    return '*';
  }
  if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
    return origin;
  }
  // Allow localhost for development
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    return origin;
  }
  return allowedOrigins[0] || '*';
};

// CORS headers helper
const corsHeaders = (origin, allowedOrigins) => ({
  'Access-Control-Allow-Origin': isOriginAllowed(origin, allowedOrigins),
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
});

// JSON response helper
const jsonResponse = (data, status = 200, origin, allowedOrigins) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin, allowedOrigins),
    },
  });
};

// Error response helper
const errorResponse = (message, status = 400, origin, allowedOrigins) => {
  return jsonResponse({ error: message }, status, origin, allowedOrigins);
};

// Generate unique ID
const generateId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};

// Main request handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const requestOrigin = request.headers.get('origin') || '';
    const corsOriginConfig = env.CORS_ORIGIN || '*';
    const allowedOrigins = getAllowedOrigins(corsOriginConfig);
    const allowedOrigin = isOriginAllowed(requestOrigin, allowedOrigins);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowedOrigin, allowedOrigins),
      });
    }

    try {
      // Route handling
      // ============== VEHICLES ==============
      if (path === '/api/vehicles' && method === 'GET') {
        return await getVehicles(env.DB, allowedOrigin, allowedOrigins);
      }
      if (path === '/api/vehicles' && method === 'POST') {
        return await createVehicle(request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/vehicles\/[\w-]+$/) && method === 'GET') {
        const id = path.split('/').pop();
        return await getVehicle(id, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/vehicles\/[\w-]+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        return await updateVehicle(id, request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/vehicles\/[\w-]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        return await deleteVehicle(id, env.DB, allowedOrigin, allowedOrigins);
      }

      // ============== CLIENTS ==============
      if (path === '/api/clients' && method === 'GET') {
        return await getClients(env.DB, allowedOrigin, allowedOrigins);
      }
      if (path === '/api/clients' && method === 'POST') {
        return await createClient(request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/clients\/[\w-]+$/) && method === 'GET') {
        const id = path.split('/').pop();
        return await getClient(id, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/clients\/[\w-]+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        return await updateClient(id, request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/clients\/[\w-]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        return await deleteClient(id, env.DB, allowedOrigin, allowedOrigins);
      }

      // ============== ASSIGNMENTS ==============
      if (path === '/api/assignments' && method === 'GET') {
        return await getAssignments(env.DB, allowedOrigin, allowedOrigins);
      }
      if (path === '/api/assignments' && method === 'POST') {
        return await createAssignment(request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/assignments\/[\w-]+$/) && method === 'GET') {
        const id = path.split('/').pop();
        return await getAssignment(id, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/assignments\/[\w-]+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        return await updateAssignment(id, request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/assignments\/[\w-]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        return await deleteAssignment(id, env.DB, allowedOrigin, allowedOrigins);
      }

      // ============== MAINTENANCE ==============
      if (path === '/api/maintenance' && method === 'GET') {
        return await getMaintenanceRecords(env.DB, allowedOrigin, allowedOrigins);
      }
      if (path === '/api/maintenance' && method === 'POST') {
        return await createMaintenanceRecord(request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/maintenance\/[\w-]+$/) && method === 'PUT') {
        const id = path.split('/').pop();
        return await updateMaintenanceRecord(id, request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path.match(/^\/api\/maintenance\/[\w-]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        return await deleteMaintenanceRecord(id, env.DB, allowedOrigin, allowedOrigins);
      }

      // ============== USERS ==============
      if (path === '/api/users' && method === 'GET') {
        return await getUsers(env.DB, allowedOrigin, allowedOrigins);
      }
      if (path === '/api/auth/login' && method === 'POST') {
        return await loginUser(request, env.DB, allowedOrigin, allowedOrigins);
      }
      if (path === '/api/auth/signup' && method === 'POST') {
        return await signupUser(request, env.DB, allowedOrigin, allowedOrigins);
      }

      // ============== DASHBOARD STATS ==============
      if (path === '/api/stats' && method === 'GET') {
        return await getDashboardStats(env.DB, allowedOrigin, allowedOrigins);
      }

      // Health check
      if (path === '/api/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() }, 200, allowedOrigin, allowedOrigins);
      }

      // 404 for unmatched routes
      return errorResponse('Not Found', 404, allowedOrigin, allowedOrigins);

    } catch (error) {
      console.error('API Error:', error);
      return errorResponse(error.message || 'Internal Server Error', 500, allowedOrigin, allowedOrigins);
    }
  },
};

// ============== VEHICLE HANDLERS ==============
async function getVehicles(db, allowedOrigin, allowedOrigins) {
  const { results } = await db.prepare(`
    SELECT id, registration_no as registrationNo, model, year, mileage, 
           status, last_service_date as lastServiceDate, location, 
           assigned_to as assignedTo, added_date as addedDate
    FROM vehicles ORDER BY created_at DESC
  `).all();
  return jsonResponse(results, 200, allowedOrigin, allowedOrigins);
}

async function getVehicle(id, db, allowedOrigin, allowedOrigins) {
  const result = await db.prepare(`
    SELECT id, registration_no as registrationNo, model, year, mileage, 
           status, last_service_date as lastServiceDate, location, 
           assigned_to as assignedTo, added_date as addedDate
    FROM vehicles WHERE id = ?
  `).bind(id).first();
  
  if (!result) return errorResponse('Vehicle not found', 404, allowedOrigin, allowedOrigins);
  return jsonResponse(result, 200, allowedOrigin, allowedOrigins);
}

async function createVehicle(request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  const id = generateId('VEH');
  
  await db.prepare(`
    INSERT INTO vehicles (id, registration_no, model, year, mileage, status, last_service_date, location, assigned_to)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    data.registrationNo,
    data.model,
    data.year || null,
    data.mileage || 0,
    data.status || 'Available',
    data.lastServiceDate || null,
    data.location || null,
    data.assignedTo || null
  ).run();
  
  return jsonResponse({ id, ...data, message: 'Vehicle created successfully' }, 201, allowedOrigin, allowedOrigins);
}

async function updateVehicle(id, request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  
  await db.prepare(`
    UPDATE vehicles SET
      registration_no = COALESCE(?, registration_no),
      model = COALESCE(?, model),
      year = COALESCE(?, year),
      mileage = COALESCE(?, mileage),
      status = COALESCE(?, status),
      last_service_date = COALESCE(?, last_service_date),
      location = COALESCE(?, location),
      assigned_to = COALESCE(?, assigned_to),
      updated_at = datetime('now')
    WHERE id = ?
  `).bind(
    data.registrationNo || null,
    data.model || null,
    data.year || null,
    data.mileage || null,
    data.status || null,
    data.lastServiceDate || null,
    data.location || null,
    data.assignedTo || null,
    id
  ).run();
  
  return jsonResponse({ id, message: 'Vehicle updated successfully' }, 200, allowedOrigin, allowedOrigins);
}

async function deleteVehicle(id, db, allowedOrigin, allowedOrigins) {
  await db.prepare('DELETE FROM vehicles WHERE id = ?').bind(id).run();
  return jsonResponse({ message: 'Vehicle deleted successfully' }, 200, allowedOrigin, allowedOrigins);
}

// ============== CLIENT HANDLERS ==============
async function getClients(db, allowedOrigin, allowedOrigins) {
  const { results } = await db.prepare(`
    SELECT id, name, email, phone, address, city, industry, status, 
           added_date as addedDate
    FROM clients ORDER BY created_at DESC
  `).all();
  return jsonResponse(results, 200, allowedOrigin, allowedOrigins);
}

async function getClient(id, db, allowedOrigin, allowedOrigins) {
  const result = await db.prepare(`
    SELECT id, name, email, phone, address, city, industry, status, 
           added_date as addedDate
    FROM clients WHERE id = ?
  `).bind(id).first();
  
  if (!result) return errorResponse('Client not found', 404, allowedOrigin, allowedOrigins);
  return jsonResponse(result, 200, allowedOrigin, allowedOrigins);
}

async function createClient(request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  const id = generateId('CLI');
  
  await db.prepare(`
    INSERT INTO clients (id, name, email, phone, address, city, industry, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    data.name,
    data.email || null,
    data.phone || null,
    data.address || null,
    data.city || null,
    data.industry || null,
    data.status || 'Active'
  ).run();
  
  return jsonResponse({ id, ...data, message: 'Client created successfully' }, 201, allowedOrigin, allowedOrigins);
}

async function updateClient(id, request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  
  await db.prepare(`
    UPDATE clients SET
      name = COALESCE(?, name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      address = COALESCE(?, address),
      city = COALESCE(?, city),
      industry = COALESCE(?, industry),
      status = COALESCE(?, status),
      updated_at = datetime('now')
    WHERE id = ?
  `).bind(
    data.name || null,
    data.email || null,
    data.phone || null,
    data.address || null,
    data.city || null,
    data.industry || null,
    data.status || null,
    id
  ).run();
  
  return jsonResponse({ id, message: 'Client updated successfully' }, 200, allowedOrigin, allowedOrigins);
}

async function deleteClient(id, db, allowedOrigin, allowedOrigins) {
  await db.prepare('DELETE FROM clients WHERE id = ?').bind(id).run();
  return jsonResponse({ message: 'Client deleted successfully' }, 200, allowedOrigin, allowedOrigins);
}

// ============== ASSIGNMENT HANDLERS ==============
async function getAssignments(db, allowedOrigin, allowedOrigins) {
  const { results } = await db.prepare(`
    SELECT 
      a.id, a.vehicle_id as vehicleId, a.client_id as clientId,
      a.assigned_date as assignedDate, a.start_date as startDate,
      a.end_date as endDate, a.return_date as returnDate,
      a.purpose, a.status,
      v.registration_no as vehicleRegistration, v.model as vehicleModel,
      c.name as clientName
    FROM assignments a
    LEFT JOIN vehicles v ON a.vehicle_id = v.id
    LEFT JOIN clients c ON a.client_id = c.id
    ORDER BY a.created_at DESC
  `).all();
  return jsonResponse(results, 200, allowedOrigin, allowedOrigins);
}

async function getAssignment(id, db, allowedOrigin, allowedOrigins) {
  const result = await db.prepare(`
    SELECT 
      a.id, a.vehicle_id as vehicleId, a.client_id as clientId,
      a.assigned_date as assignedDate, a.start_date as startDate,
      a.end_date as endDate, a.return_date as returnDate,
      a.purpose, a.status,
      v.registration_no as vehicleRegistration, v.model as vehicleModel,
      c.name as clientName
    FROM assignments a
    LEFT JOIN vehicles v ON a.vehicle_id = v.id
    LEFT JOIN clients c ON a.client_id = c.id
    WHERE a.id = ?
  `).bind(id).first();
  
  if (!result) return errorResponse('Assignment not found', 404, allowedOrigin, allowedOrigins);
  return jsonResponse(result, 200, allowedOrigin, allowedOrigins);
}

async function createAssignment(request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  const id = generateId('ASN');
  
  await db.prepare(`
    INSERT INTO assignments (id, vehicle_id, client_id, start_date, end_date, purpose, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    data.vehicleId,
    data.clientId,
    data.startDate || null,
    data.endDate || null,
    data.purpose || null,
    data.status || 'Active'
  ).run();
  
  // Update vehicle status to "On Rent"
  if (data.vehicleId) {
    await db.prepare(`UPDATE vehicles SET status = 'On Rent' WHERE id = ?`).bind(data.vehicleId).run();
  }
  
  return jsonResponse({ id, ...data, message: 'Assignment created successfully' }, 201, allowedOrigin, allowedOrigins);
}

async function updateAssignment(id, request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  
  await db.prepare(`
    UPDATE assignments SET
      vehicle_id = COALESCE(?, vehicle_id),
      client_id = COALESCE(?, client_id),
      start_date = COALESCE(?, start_date),
      end_date = COALESCE(?, end_date),
      return_date = COALESCE(?, return_date),
      purpose = COALESCE(?, purpose),
      status = COALESCE(?, status),
      updated_at = datetime('now')
    WHERE id = ?
  `).bind(
    data.vehicleId || null,
    data.clientId || null,
    data.startDate || null,
    data.endDate || null,
    data.returnDate || null,
    data.purpose || null,
    data.status || null,
    id
  ).run();
  
  // If assignment is completed, update vehicle status
  if (data.status === 'Completed' && data.vehicleId) {
    await db.prepare(`UPDATE vehicles SET status = 'Available' WHERE id = ?`).bind(data.vehicleId).run();
  }
  
  return jsonResponse({ id, message: 'Assignment updated successfully' }, 200, allowedOrigin, allowedOrigins);
}

async function deleteAssignment(id, db, allowedOrigin, allowedOrigins) {
  // Get vehicle ID before deleting
  const assignment = await db.prepare('SELECT vehicle_id FROM assignments WHERE id = ?').bind(id).first();
  
  await db.prepare('DELETE FROM assignments WHERE id = ?').bind(id).run();
  
  // Update vehicle status back to Available
  if (assignment?.vehicle_id) {
    await db.prepare(`UPDATE vehicles SET status = 'Available' WHERE id = ?`).bind(assignment.vehicle_id).run();
  }
  
  return jsonResponse({ message: 'Assignment deleted successfully' }, 200, allowedOrigin, allowedOrigins);
}

// ============== MAINTENANCE HANDLERS ==============
async function getMaintenanceRecords(db, allowedOrigin, allowedOrigins) {
  const { results } = await db.prepare(`
    SELECT 
      m.id, m.vehicle_id as vehicleId, m.service_type as serviceType,
      m.description, m.cost, m.service_date as serviceDate,
      m.next_service_date as nextServiceDate, m.odometer_reading as odometerReading,
      m.performed_by as performedBy, m.status,
      v.registration_no as vehicleRegistration, v.model as vehicleModel
    FROM maintenance_records m
    LEFT JOIN vehicles v ON m.vehicle_id = v.id
    ORDER BY m.service_date DESC
  `).all();
  return jsonResponse(results, 200, allowedOrigin, allowedOrigins);
}

async function createMaintenanceRecord(request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  const id = generateId('MNT');
  
  await db.prepare(`
    INSERT INTO maintenance_records (id, vehicle_id, service_type, description, cost, service_date, next_service_date, odometer_reading, performed_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    data.vehicleId,
    data.serviceType,
    data.description || null,
    data.cost || 0,
    data.serviceDate || null,
    data.nextServiceDate || null,
    data.odometerReading || null,
    data.performedBy || null,
    data.status || 'Completed'
  ).run();
  
  // Update vehicle status if maintenance is in progress
  if (data.status === 'In Progress' && data.vehicleId) {
    await db.prepare(`UPDATE vehicles SET status = 'Maintenance' WHERE id = ?`).bind(data.vehicleId).run();
  }
  
  return jsonResponse({ id, ...data, message: 'Maintenance record created successfully' }, 201, allowedOrigin, allowedOrigins);
}

async function updateMaintenanceRecord(id, request, db, allowedOrigin, allowedOrigins) {
  const data = await request.json();
  
  await db.prepare(`
    UPDATE maintenance_records SET
      vehicle_id = COALESCE(?, vehicle_id),
      service_type = COALESCE(?, service_type),
      description = COALESCE(?, description),
      cost = COALESCE(?, cost),
      service_date = COALESCE(?, service_date),
      next_service_date = COALESCE(?, next_service_date),
      odometer_reading = COALESCE(?, odometer_reading),
      performed_by = COALESCE(?, performed_by),
      status = COALESCE(?, status),
      updated_at = datetime('now')
    WHERE id = ?
  `).bind(
    data.vehicleId || null,
    data.serviceType || null,
    data.description || null,
    data.cost || null,
    data.serviceDate || null,
    data.nextServiceDate || null,
    data.odometerReading || null,
    data.performedBy || null,
    data.status || null,
    id
  ).run();
  
  // Update vehicle status based on maintenance status
  if (data.vehicleId) {
    if (data.status === 'Completed') {
      await db.prepare(`UPDATE vehicles SET status = 'Available', last_service_date = date('now') WHERE id = ?`).bind(data.vehicleId).run();
    } else if (data.status === 'In Progress') {
      await db.prepare(`UPDATE vehicles SET status = 'Maintenance' WHERE id = ?`).bind(data.vehicleId).run();
    }
  }
  
  return jsonResponse({ id, message: 'Maintenance record updated successfully' }, 200, allowedOrigin, allowedOrigins);
}

async function deleteMaintenanceRecord(id, db, allowedOrigin, allowedOrigins) {
  await db.prepare('DELETE FROM maintenance_records WHERE id = ?').bind(id).run();
  return jsonResponse({ message: 'Maintenance record deleted successfully' }, 200, allowedOrigin, allowedOrigins);
}

// ============== USER HANDLERS ==============
async function getUsers(db, allowedOrigin, allowedOrigins) {
  const { results } = await db.prepare(`
    SELECT id, name, email, role, avatar_url as avatarUrl, created_at as createdAt
    FROM users ORDER BY created_at DESC
  `).all();
  return jsonResponse(results, 200, allowedOrigin, allowedOrigins);
}

async function loginUser(request, db, allowedOrigin, allowedOrigins) {
  const { email, password } = await request.json();
  
  // For demo purposes, accept any valid email format
  // In production, you'd verify password_hash
  const user = await db.prepare(`
    SELECT id, name, email, role, avatar_url as avatarUrl
    FROM users WHERE email = ?
  `).bind(email).first();
  
  if (!user) {
    // Create user on first login (demo mode)
    const id = generateId('USR');
    const name = email.split('@')[0];
    
    await db.prepare(`
      INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)
    `).bind(id, name, email, 'User').run();
    
    return jsonResponse({
      id,
      name,
      email,
      role: 'User',
      message: 'Login successful'
    }, 200, allowedOrigin, allowedOrigins);
  }
  
  return jsonResponse({
    ...user,
    message: 'Login successful'
  }, 200, allowedOrigin, allowedOrigins);
}

async function signupUser(request, db, allowedOrigin, allowedOrigins) {
  const { name, email, password } = await request.json();
  
  if (!name || !email || !password) {
    return errorResponse('Name, email, and password are required', 400, allowedOrigin, allowedOrigins);
  }
  
  // Check if user already exists
  const existingUser = await db.prepare(`
    SELECT id FROM users WHERE email = ?
  `).bind(email).first();
  
  if (existingUser) {
    return errorResponse('User with this email already exists', 409, allowedOrigin, allowedOrigins);
  }
  
  // Create new user
  const id = generateId('USR');
  try {
    await db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)
    `).bind(id, name, email, password, 'User').run();
    
    return jsonResponse({
      id,
      name,
      email,
      role: 'User',
      message: 'User created successfully'
    }, 201, allowedOrigin, allowedOrigins);
  } catch (error) {
    return errorResponse('Failed to create user: ' + error.message, 500, allowedOrigin, allowedOrigins);
  }
}

// ============== DASHBOARD STATS ==============
async function getDashboardStats(db, allowedOrigin, allowedOrigins) {
  const [vehicles, clients, assignments, maintenance] = await Promise.all([
    db.prepare('SELECT COUNT(*) as total, status FROM vehicles GROUP BY status').all(),
    db.prepare('SELECT COUNT(*) as total FROM clients WHERE status = "Active"').first(),
    db.prepare('SELECT COUNT(*) as total FROM assignments WHERE status = "Active"').first(),
    db.prepare('SELECT COUNT(*) as total FROM maintenance_records WHERE status = "In Progress"').first(),
  ]);
  
  const vehicleStats = vehicles.results.reduce((acc, row) => {
    acc[row.status.toLowerCase().replace(' ', '_')] = row.total;
    acc.total = (acc.total || 0) + row.total;
    return acc;
  }, {});
  
  return jsonResponse({
    vehicles: vehicleStats,
    activeClients: clients?.total || 0,
    activeAssignments: assignments?.total || 0,
    pendingMaintenance: maintenance?.total || 0,
  }, 200, allowedOrigin, allowedOrigins);
}

