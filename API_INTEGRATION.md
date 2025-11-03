# 🔗 API Integration Guide

This guide explains how to connect the Avis Fleet Management System to your backend API.

## 📋 Table of Contents
1. [Setup](#setup)
2. [Example Endpoints](#example-endpoints)
3. [Service Layer](#service-layer)
4. [Integration Examples](#integration-examples)
5. [Error Handling](#error-handling)
6. [Authentication](#authentication)

---

## 🔧 Setup

### Step 1: Create `.env` File

```env
# .env
VITE_API_URL=https://api.avisfleet.com
VITE_API_PORT=3000
VITE_API_TIMEOUT=5000
VITE_AUTH_TOKEN=your_auth_token_here
```

### Step 2: Create API Service Layer

**File: `src/services/api.js`**

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 5000

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`
  
  const config = {
    timeout: TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
    ...options,
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default apiCall
```

---

## 📡 Example Endpoints

### Vehicles API

```javascript
// GET: Fetch all vehicles
GET /api/vehicles

// Response:
{
  "data": [
    {
      "id": "VEH001",
      "registrationNo": "GAU 215 GP",
      "model": "Toyota Corolla 1.6",
      "mileage": 15420,
      "status": "Active",
      ...
    }
  ],
  "total": 8,
  "page": 1,
  "pageSize": 10
}

// GET: Fetch single vehicle
GET /api/vehicles/:id

// POST: Create vehicle
POST /api/vehicles
Body: {
  "registrationNo": "GAU 215 GP",
  "model": "Toyota Corolla 1.6",
  "mileage": 15420,
  "status": "Active"
}

// PUT: Update vehicle
PUT /api/vehicles/:id
Body: { ...updated fields }

// DELETE: Delete vehicle
DELETE /api/vehicles/:id
```

### Maintenance API

```javascript
// GET: Fetch all maintenance records
GET /api/maintenance

// POST: Create maintenance record
POST /api/maintenance
Body: {
  "vehicleId": "VEH001",
  "serviceType": "Oil Change",
  "date": "2025-10-15",
  "cost": 450,
  "notes": "Regular oil change"
}

// PUT: Update maintenance
PUT /api/maintenance/:id

// DELETE: Delete maintenance
DELETE /api/maintenance/:id
```

### Fuel API

```javascript
// GET: Fetch all fuel transactions
GET /api/fuel

// POST: Create fuel transaction
POST /api/fuel
Body: {
  "vehicleId": "VEH001",
  "date": "2025-10-20",
  "amount": 450,
  "liters": 50
}
```

### Users API

```javascript
// GET: Fetch all users
GET /api/users

// POST: Create user
POST /api/users
Body: {
  "name": "John Smith",
  "email": "john@avisfleet.com",
  "role": "Employee",
  "region": "Johannesburg"
}

// PUT: Update user
PUT /api/users/:id

// DELETE: Delete user
DELETE /api/users/:id
```

---

## 🛠️ Service Layer

### File: `src/services/vehicleService.js`

```javascript
import apiCall from './api'

const vehicleService = {
  // Get all vehicles
  async getAllVehicles(params = {}) {
    try {
      const query = new URLSearchParams(params).toString()
      const endpoint = `/api/vehicles${query ? `?${query}` : ''}`
      return await apiCall(endpoint)
    } catch (error) {
      throw new Error(`Failed to fetch vehicles: ${error.message}`)
    }
  },

  // Get single vehicle
  async getVehicle(id) {
    return await apiCall(`/api/vehicles/${id}`)
  },

  // Create vehicle
  async createVehicle(vehicleData) {
    return await apiCall('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    })
  },

  // Update vehicle
  async updateVehicle(id, vehicleData) {
    return await apiCall(`/api/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    })
  },

  // Delete vehicle
  async deleteVehicle(id) {
    return await apiCall(`/api/vehicles/${id}`, {
      method: 'DELETE',
    })
  },

  // Search vehicles
  async searchVehicles(query) {
    return await apiCall(`/api/vehicles/search?q=${query}`)
  },

  // Filter vehicles
  async filterVehicles(status) {
    return await apiCall(`/api/vehicles?status=${status}`)
  },
}

export default vehicleService
```

### File: `src/services/maintenanceService.js`

```javascript
import apiCall from './api'

const maintenanceService = {
  async getAllRecords() {
    return await apiCall('/api/maintenance')
  },

  async getRecord(id) {
    return await apiCall(`/api/maintenance/${id}`)
  },

  async createRecord(data) {
    return await apiCall('/api/maintenance', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateRecord(id, data) {
    return await apiCall(`/api/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  async deleteRecord(id) {
    return await apiCall(`/api/maintenance/${id}`, {
      method: 'DELETE',
    })
  },

  async getRecordsByVehicle(vehicleId) {
    return await apiCall(`/api/maintenance/vehicle/${vehicleId}`)
  },
}

export default maintenanceService
```

---

## 💻 Integration Examples

### Example 1: Replace Vehicles State with API

**Before (using mock data):**
```javascript
import vehiclesData from '../data/vehicles.json'

const [vehicles, setVehicles] = useState(vehiclesData)
```

**After (using API):**
```javascript
import vehicleService from '../services/vehicleService'
import { useEffect, useState } from 'react'

export default function FleetList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const response = await vehicleService.getAllVehicles()
        setVehicles(response.data || response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    // ... component JSX
  )
}
```

### Example 2: Add Vehicle with API

**Before:**
```javascript
const handleSave = () => {
  setVehicles([...vehicles, { id: `VEH${vehicles.length + 1}`, ...formData }])
  setShowModal(false)
}
```

**After:**
```javascript
const [loading, setLoading] = useState(false)

const handleSave = async () => {
  try {
    setLoading(true)
    const response = await vehicleService.createVehicle(formData)
    setVehicles([...vehicles, response.data])
    setShowModal(false)
    // Optional: Show success message
    alert('Vehicle added successfully!')
  } catch (error) {
    console.error('Failed to add vehicle:', error)
    alert(`Error: ${error.message}`)
  } finally {
    setLoading(false)
  }
}
```

### Example 3: Delete Vehicle with API

```javascript
const handleDelete = async (id) => {
  if (!window.confirm('Are you sure?')) return

  try {
    await vehicleService.deleteVehicle(id)
    setVehicles(vehicles.filter(v => v.id !== id))
  } catch (error) {
    console.error('Failed to delete vehicle:', error)
    alert(`Error: ${error.message}`)
  }
}
```

---

## ⚠️ Error Handling

### Global Error Handler

**File: `src/utils/errorHandler.js`**

```javascript
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiError'
  }
}

export const handleApiError = (error) => {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 401:
        // Redirect to login
        window.location.href = '/login'
        return 'Authentication failed'
      case 403:
        return 'Access denied'
      case 404:
        return 'Resource not found'
      case 500:
        return 'Server error'
      default:
        return error.message
    }
  }
  return 'An unexpected error occurred'
}
```

### Usage in Components

```javascript
import { handleApiError } from '../utils/errorHandler'

try {
  const data = await vehicleService.getAllVehicles()
} catch (error) {
  const message = handleApiError(error)
  // Show error to user
  setErrorMessage(message)
}
```

---

## 🔐 Authentication

### Setup JWT Authentication

**File: `src/services/authService.js`**

```javascript
import apiCall from './api'

const authService = {
  async login(email, password) {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  },

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!this.getToken()
  },
}

export default authService
```

### Protected Routes

```javascript
import { useEffect } from 'react'
import authService from '../services/authService'

function ProtectedRoute({ component: Component, requiredRole }) {
  const user = authService.getUser()

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login'
    }
  }, [])

  if (requiredRole && user?.role !== requiredRole) {
    return <div>Access Denied</div>
  }

  return <Component />
}

export default ProtectedRoute
```

---

## 📊 Pagination

### API Service with Pagination

```javascript
const vehicleService = {
  async getVehicles(page = 1, pageSize = 10) {
    return await apiCall(`/api/vehicles?page=${page}&pageSize=${pageSize}`)
  },
}

// Usage in component
const [page, setPage] = useState(1)
const [pageSize] = useState(10)

useEffect(() => {
  const fetchData = async () => {
    const response = await vehicleService.getVehicles(page, pageSize)
    setVehicles(response.data)
    setTotalPages(Math.ceil(response.total / pageSize))
  }
  fetchData()
}, [page, pageSize])
```

---

## 🚀 Best Practices

1. **Always handle errors** - Use try/catch blocks
2. **Use loading states** - Show spinners while fetching
3. **Centralize API calls** - Keep service layer clean
4. **Cache when possible** - Reduce API calls
5. **Set timeouts** - Prevent hanging requests
6. **Use environment variables** - Manage endpoints safely
7. **Log errors** - For debugging in production
8. **Validate data** - Before sending to API
9. **Use TypeScript** - For type safety (future upgrade)
10. **Rate limit requests** - Prevent abuse

---

## 📚 Sample Backend API (Node.js/Express)

```javascript
// server.js
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// Mock database
let vehicles = []

// GET vehicles
app.get('/api/vehicles', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query
  const start = (page - 1) * pageSize
  const paginated = vehicles.slice(start, start + pageSize)
  
  res.json({
    data: paginated,
    total: vehicles.length,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
  })
})

// POST vehicle
app.post('/api/vehicles', (req, res) => {
  const vehicle = {
    id: `VEH${vehicles.length + 1}`,
    ...req.body,
    createdAt: new Date(),
  }
  vehicles.push(vehicle)
  res.json({ data: vehicle })
})

// PUT vehicle
app.put('/api/vehicles/:id', (req, res) => {
  const index = vehicles.findIndex(v => v.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Not found' })
  }
  vehicles[index] = { ...vehicles[index], ...req.body }
  res.json({ data: vehicles[index] })
})

// DELETE vehicle
app.delete('/api/vehicles/:id', (req, res) => {
  vehicles = vehicles.filter(v => v.id !== req.params.id)
  res.json({ success: true })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

---

## 🔗 Resources

- [REST API Best Practices](https://restfulapi.net)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [JWT Authentication](https://jwt.io)
- [Error Handling Patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

---

**Ready to connect to your backend? Start with the service layer and integrate endpoint by endpoint! 🚀**
