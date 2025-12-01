import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FleetList from './pages/FleetList'
import FleetAssignment from './pages/FleetAssignment'
import Clients from './pages/Clients'
import Reports from './pages/Reports'
import UserManagement from './pages/UserManagement'
import Help from './pages/Help'
import vehiclesData from './data/vehicles.json'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const flag = localStorage.getItem('avis_isAuthenticated') === 'true'
      const raw = localStorage.getItem('avis_currentUser')
      return flag && !!raw
    } catch (e) {
      return false
    }
  })
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('avis_currentUser')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  // Centralized vehicle state - persisted to localStorage
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('avis_vehicles')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Migration: Update old statuses to new ones
        return parsed.map(v => ({
          ...v,
          status: v.status === 'Active' ? 'Available' : 
                 v.status === 'In Service' ? 'On Rent' : 
                 v.status === 'Retired' ? 'Maintenance' : v.status
        }))
      }
      // Clear old localStorage data on first load with new data
      localStorage.removeItem('avis_vehicles')
      return vehiclesData
    } catch (e) {
      localStorage.removeItem('avis_vehicles')
      return vehiclesData
    }
  })

  // Centralized assignments state - persisted to localStorage
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('avis_assignments')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  // Persist vehicles to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('avis_vehicles', JSON.stringify(vehicles))
    } catch (e) {
      // ignore storage errors
    }
  }, [vehicles])

  // Persist assignments to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('avis_assignments', JSON.stringify(assignments))
    } catch (e) {
      // ignore storage errors
    }
  }, [assignments])

  // Handler: Assign vehicle to client (changes status to "On Rent")
  const handleAssignVehicle = (assignment) => {
    // Update vehicle status to "On Rent"
    setVehicles(prev => prev.map(v => 
      v.id === assignment.vehicleId 
        ? { ...v, status: 'On Rent', assignedTo: assignment.clientName || 'Assigned' }
        : v
    ))
    // Add assignment
    setAssignments(prev => [...prev, assignment])
  }

  // Handler: Return vehicle (changes status back to "Available")
  const handleReturnVehicle = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (assignment) {
      // Update vehicle status back to "Available"
      setVehicles(prev => prev.map(v => 
        v.id === assignment.vehicleId 
          ? { ...v, status: 'Available', assignedTo: 'Unassigned' }
          : v
      ))
      // Mark assignment as returned
      setAssignments(prev => prev.map(a =>
        a.id === assignmentId
          ? { ...a, returnDate: new Date().toISOString().split('T')[0] }
          : a
      ))
    }
  }

  // Handler: Update assignment details
  const handleUpdateAssignment = (assignmentId, updates) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId ? { ...a, ...updates } : a
    ))
  }

  // Handler: Delete assignment
  const handleDeleteAssignment = (assignmentId) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId))
  }

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
    try {
      localStorage.setItem('avis_isAuthenticated', 'true')
      localStorage.setItem('avis_currentUser', JSON.stringify(userData))
    } catch (e) {
      // ignore storage errors
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setCurrentPage('dashboard')
    try {
      localStorage.removeItem('avis_isAuthenticated')
      localStorage.removeItem('avis_currentUser')
    } catch (e) {
      // ignore
    }
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            vehicles={vehicles} 
            assignments={assignments} 
            onNavigate={setCurrentPage} 
          />
        )
      case 'fleet':
        return <FleetList vehicles={vehicles} setVehicles={setVehicles} />
      case 'assignment':
        return (
          <FleetAssignment 
            vehicles={vehicles}
            assignments={assignments}
            onAssignVehicle={handleAssignVehicle}
            onReturnVehicle={handleReturnVehicle}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )
      case 'clients':
        return <Clients />
      case 'reports':
        return <Reports vehicles={vehicles} assignments={assignments} />
      case 'users':
        return <UserManagement />
      case 'help':
        return <Help />
      default:
        return <Dashboard vehicles={vehicles} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - fixed, doesn't affect layout */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

  {/* Main Content with left margin for always-expanded sidebar */}
  <div className="flex flex-col min-h-screen justify-start pt-16 lg:ml-64">
        {/* Topbar */}
        <Topbar currentUser={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto min-h-0">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
