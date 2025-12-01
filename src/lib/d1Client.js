/**
 * Cloudflare D1 API Client for Avis Fleet
 * Connects to the Cloudflare Worker API for database operations
 */

// API Base URL - Update this after deploying your worker
// For local development, use the dev environment with open CORS
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? 'https://avis-fleet-api.twizasimwanza.workers.dev'  // Still use production for localhost
  : (import.meta.env.VITE_API_URL || 'https://avis-fleet-api.twizasimwanza.workers.dev');

// Generic fetch wrapper with error handling
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// ============== VEHICLES ==============
export const vehiclesApi = {
  getAll: (userId) => userId 
    ? apiFetch(`/api/vehicles?userId=${userId}`)
    : apiFetch('/api/vehicles'),
  
  getById: (id, userId) => userId
    ? apiFetch(`/api/vehicles/${id}?userId=${userId}`)
    : apiFetch(`/api/vehicles/${id}`),
  
  create: (data, userId) => apiFetch('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  update: (id, data, userId) => apiFetch(`/api/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  delete: (id, userId) => userId
    ? apiFetch(`/api/vehicles/${id}?userId=${userId}`, { method: 'DELETE' })
    : apiFetch(`/api/vehicles/${id}`, { method: 'DELETE' }),
};

// ============== CLIENTS ==============
export const clientsApi = {
  getAll: (userId) => userId
    ? apiFetch(`/api/clients?userId=${userId}`)
    : apiFetch('/api/clients'),
  
  getById: (id, userId) => userId
    ? apiFetch(`/api/clients/${id}?userId=${userId}`)
    : apiFetch(`/api/clients/${id}`),
  
  create: (data, userId) => apiFetch('/api/clients', {
    method: 'POST',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  update: (id, data, userId) => apiFetch(`/api/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  delete: (id, userId) => userId
    ? apiFetch(`/api/clients/${id}?userId=${userId}`, { method: 'DELETE' })
    : apiFetch(`/api/clients/${id}`, { method: 'DELETE' }),
};

// ============== ASSIGNMENTS ==============
export const assignmentsApi = {
  getAll: (userId) => userId
    ? apiFetch(`/api/assignments?userId=${userId}`)
    : apiFetch('/api/assignments'),
  
  getById: (id, userId) => userId
    ? apiFetch(`/api/assignments/${id}?userId=${userId}`)
    : apiFetch(`/api/assignments/${id}`),
  
  create: (data, userId) => apiFetch('/api/assignments', {
    method: 'POST',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  update: (id, data, userId) => apiFetch(`/api/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  delete: (id, userId) => userId
    ? apiFetch(`/api/assignments/${id}?userId=${userId}`, { method: 'DELETE' })
    : apiFetch(`/api/assignments/${id}`, { method: 'DELETE' }),
};

// ============== MAINTENANCE ==============
export const maintenanceApi = {
  getAll: (userId) => userId
    ? apiFetch(`/api/maintenance?userId=${userId}`)
    : apiFetch('/api/maintenance'),
  
  create: (data, userId) => apiFetch('/api/maintenance', {
    method: 'POST',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  update: (id, data, userId) => apiFetch(`/api/maintenance/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, userId }),
  }),
  
  delete: (id, userId) => userId
    ? apiFetch(`/api/maintenance/${id}?userId=${userId}`, { method: 'DELETE' })
    : apiFetch(`/api/maintenance/${id}`, { method: 'DELETE' }),
};

// ============== USERS ==============
export const usersApi = {
  getAll: () => apiFetch('/api/users'),
  
  login: (email, password) => apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  signup: (name, email, password) => apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),
  
  updateProfile: (id, data) => apiFetch(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// ============== DASHBOARD ==============
export const dashboardApi = {
  getStats: () => apiFetch('/api/stats'),
};

// ============== EXCHANGE RATES ==============
export const exchangeRatesApi = {
  getRates: () => apiFetch('/api/exchange-rates'),
};

// ============== HEALTH CHECK ==============
export const healthCheck = () => apiFetch('/api/health');

// Default export with all APIs
export default {
  vehicles: vehiclesApi,
  clients: clientsApi,
  assignments: assignmentsApi,
  maintenance: maintenanceApi,
  users: usersApi,
  dashboard: dashboardApi,
  exchangeRates: exchangeRatesApi,
  healthCheck,
};
