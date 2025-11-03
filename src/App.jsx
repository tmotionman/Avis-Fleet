import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FleetList from './pages/FleetList'
import FleetAssignment from './pages/FleetAssignment'
import MaintenanceTracker from './pages/MaintenanceTracker'
import Clients from './pages/Clients'
import Reports from './pages/Reports'
import UserManagement from './pages/UserManagement'

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
        return <Dashboard />
      case 'fleet':
        return <FleetList />
      case 'assignment':
        return <FleetAssignment />
      case 'maintenance':
        return <MaintenanceTracker />
      case 'fuel':
        return <Clients />
      case 'reports':
        return <Reports />
      case 'users':
        return <UserManagement />
      default:
        return <Dashboard />
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
