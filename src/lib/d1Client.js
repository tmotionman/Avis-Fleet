/**
 * Cloudflare D1 API Client for Avis Fleet
 * Connects to the Cloudflare Worker API for database operations
 */

// API Base URL - Update this after deploying your worker
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://avis-fleet-api.twizasimwanza.workers.dev';

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
  getAll: () => apiFetch('/api/vehicles'),
  
  getById: (id) => apiFetch(`/api/vehicles/${id}`),
  
  create: (data) => apiFetch('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiFetch(`/api/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiFetch(`/api/vehicles/${id}`, {
    method: 'DELETE',
  }),
};

// ============== CLIENTS ==============
export const clientsApi = {
  getAll: () => apiFetch('/api/clients'),
  
  getById: (id) => apiFetch(`/api/clients/${id}`),
  
  create: (data) => apiFetch('/api/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiFetch(`/api/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiFetch(`/api/clients/${id}`, {
    method: 'DELETE',
  }),
};

// ============== ASSIGNMENTS ==============
export const assignmentsApi = {
  getAll: () => apiFetch('/api/assignments'),
  
  getById: (id) => apiFetch(`/api/assignments/${id}`),
  
  create: (data) => apiFetch('/api/assignments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiFetch(`/api/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiFetch(`/api/assignments/${id}`, {
    method: 'DELETE',
  }),
};

// ============== MAINTENANCE ==============
export const maintenanceApi = {
  getAll: () => apiFetch('/api/maintenance'),
  
  create: (data) => apiFetch('/api/maintenance', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiFetch(`/api/maintenance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiFetch(`/api/maintenance/${id}`, {
    method: 'DELETE',
  }),
};

// ============== USERS ==============
export const usersApi = {
  getAll: () => apiFetch('/api/users'),
  
  login: (email, password) => apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
};

// ============== DASHBOARD ==============
export const dashboardApi = {
  getStats: () => apiFetch('/api/stats'),
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
  healthCheck,
};
