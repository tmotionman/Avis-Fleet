import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import OnboardingTour from './components/OnboardingTour'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import FleetList from './pages/FleetList'
import FleetAssignment from './pages/FleetAssignment'
import Clients from './pages/Clients'
import Reports from './pages/Reports'
import UserManagement from './pages/UserManagement'
import Help from './pages/Help'
import { vehiclesApi, clientsApi, assignmentsApi } from './lib/d1Client'
import { dummyVehicles, dummyClients, dummyAssignments } from './data/dummyTourData'

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

  // Loading state for data fetching
  const [isLoading, setIsLoading] = useState(true)
  const [dataError, setDataError] = useState(null)

  // Tour state for new users
  const [showTour, setShowTour] = useState(false)
  const [isTourMode, setIsTourMode] = useState(false)

  // Centralized vehicle state - fetched from D1 database
  const [vehicles, setVehicles] = useState([])

  // Centralized clients state - fetched from D1 database
  const [clients, setClients] = useState([])

  // Centralized assignments state - fetched from D1 database
  const [assignments, setAssignments] = useState([])

  // Fetch all data from D1 database on mount
  useEffect(() => {
    const fetchData = async () => {
      // If in tour mode (new user), use dummy data
      if (isTourMode) {
        setVehicles(dummyVehicles)
        setClients(dummyClients)
        setAssignments(dummyAssignments)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setDataError(null)
      try {
        const userId = currentUser?.id || currentUser?.email
        const [vehiclesData, clientsData, assignmentsData] = await Promise.all([
          vehiclesApi.getAll(userId),
          clientsApi.getAll(userId),
          assignmentsApi.getAll(userId)
        ])
        setVehicles(vehiclesData)
        setClients(clientsData)
        setAssignments(assignmentsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setDataError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, isTourMode, currentUser?.id, currentUser?.email])

  // Refresh data function
  const refreshData = async () => {
    try {
      const userId = currentUser?.id || currentUser?.email
      const [vehiclesData, clientsData, assignmentsData] = await Promise.all([
        vehiclesApi.getAll(userId),
        clientsApi.getAll(userId),
        assignmentsApi.getAll(userId)
      ])
      setVehicles(vehiclesData)
      setClients(clientsData)
      setAssignments(assignmentsData)
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }

  // Handler: Update vehicles (for FleetList)
  const handleUpdateVehicles = async (newVehicles) => {
    setVehicles(newVehicles)
  }

  // Handler: Create vehicle
  const handleCreateVehicle = async (vehicleData) => {
    try {
      const userId = currentUser?.id || currentUser?.email
      const result = await vehiclesApi.create(vehicleData, userId)
      await refreshData()
      return result
    } catch (error) {
      console.error('Error creating vehicle:', error)
      throw error
    }
  }

  // Handler: Update vehicle
  const handleUpdateVehicle = async (id, vehicleData) => {
    try {
      const userId = currentUser?.id || currentUser?.email
      const result = await vehiclesApi.update(id, vehicleData, userId)
      await refreshData()
      return result
    } catch (error) {
      console.error('Error updating vehicle:', error)
      throw error
    }
  }

  // Handler: Delete vehicle
  const handleDeleteVehicle = async (id) => {
    try {
      const userId = currentUser?.id || currentUser?.email
      await vehiclesApi.delete(id, userId)
      await refreshData()
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      throw error
    }
  }

  // Handler: Assign vehicle to client (changes status to "On Rent")
  const handleAssignVehicle = async (assignment) => {
    try {
      const userId = currentUser?.id || currentUser?.email
      await assignmentsApi.create(assignment, userId)
      await refreshData()
    } catch (error) {
      console.error('Error creating assignment:', error)
      throw error
    }
  }

  // Handler: Return vehicle (changes status back to "Available")
  const handleReturnVehicle = async (assignmentId) => {
    try {
      const userId = currentUser?.id || currentUser?.email
      await assignmentsApi.update(assignmentId, { 
        status: 'Completed',
        returnDate: new Date().toISOString().split('T')[0]
      }, userId)
      await refreshData()
    } catch (error) {
      console.error('Error returning vehicle:', error)
      throw error
    }
  }

  // Handler: Update assignment details
  const handleUpdateAssignment = async (assignmentId, updates) => {
    try {
      const userId = currentUser?.id || currentUser?.email
      await assignmentsApi.update(assignmentId, updates, userId)
      await refreshData()
    } catch (error) {
      console.error('Error updating assignment:', error)
      throw error
    }
  }

  // Handler: Delete assignment
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const userId = currentUser?.id || currentUser?.email
      await assignmentsApi.delete(assignmentId, userId)
      await refreshData()
    } catch (error) {
      console.error('Error deleting assignment:', error)
      throw error
    }
  }

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    setIsAuthenticated(true)
    // Existing users skip tour - load real data
    setIsTourMode(false)
    setShowTour(false)
    try {
      localStorage.setItem('avis_isAuthenticated', 'true')
      localStorage.setItem('avis_currentUser', JSON.stringify(userData))
    } catch (e) {
      // ignore storage errors
    }
  }

  const handleSignup = (userData) => {
    // New user signup - show tour with dummy data
    setCurrentUser(userData)
    setIsAuthenticated(true)
    setIsTourMode(true)
    setShowTour(true)
    try {
      localStorage.setItem('avis_isAuthenticated', 'true')
      localStorage.setItem('avis_currentUser', JSON.stringify(userData))
      // Mark as new user who needs tour
      localStorage.setItem(`avis_is_new_user_${userData?.id || userData?.email}`, 'true')
    } catch (e) {
      // ignore storage errors
    }
  }

  const handleTourComplete = async () => {
    setShowTour(false)
    setIsTourMode(false)
    // After tour completes, reset to empty/real database data
    // Clear dummy data and fetch real (likely empty) data from D1
    setVehicles([])
    setClients([])
    setAssignments([])
    setIsLoading(true)
    try {
      const userId = currentUser?.id || currentUser?.email
      const [vehiclesData, clientsData, assignmentsData] = await Promise.all([
        vehiclesApi.getAll(userId),
        clientsApi.getAll(userId),
        assignmentsApi.getAll(userId)
      ])
      setVehicles(vehiclesData)
      setClients(clientsData)
      setAssignments(assignmentsData)
    } catch (error) {
      console.log('Starting fresh - no existing data in database')
      // If error or no data, start with empty arrays (fresh start for new user)
      setVehicles([])
      setClients([])
      setAssignments([])
    } finally {
      setIsLoading(false)
    }
    // Mark tour as completed and user is no longer new
    try {
      localStorage.setItem(`avis_tour_completed_${currentUser?.id || currentUser?.email}`, 'true')
      localStorage.removeItem(`avis_is_new_user_${currentUser?.id || currentUser?.email}`)
    } catch (e) {
      // ignore
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setCurrentPage('dashboard')
    setIsTourMode(false)
    setShowTour(false)
    try {
      localStorage.removeItem('avis_isAuthenticated')
      localStorage.removeItem('avis_currentUser')
    } catch (e) {
      // ignore
    }
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onSignup={handleSignup} />
  }

  // Show loading screen while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-avis-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading fleet data...</p>
        </div>
      </div>
    )
  }

  // Show error screen if data fetch failed
  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">Unable to connect to the database. Please check your connection and try again.</p>
          <p className="text-sm text-gray-500 mb-4">{dataError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-avis-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
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
        return (
          <FleetList 
            vehicles={vehicles} 
            setVehicles={handleUpdateVehicles}
            onCreateVehicle={handleCreateVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        )
      case 'assignment':
        return (
          <FleetAssignment 
            vehicles={vehicles}
            clients={clients}
            assignments={assignments}
            onAssignVehicle={handleAssignVehicle}
            onReturnVehicle={handleReturnVehicle}
            onUpdateAssignment={handleUpdateAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )
      case 'clients':
        return <Clients clients={clients} refreshData={refreshData} />
      case 'reports':
        return <Reports vehicles={vehicles} clients={clients} assignments={assignments} />
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

      {/* Onboarding Tour for new users */}
      <OnboardingTour 
        isOpen={showTour}
        onClose={handleTourComplete}
        onNavigate={setCurrentPage} 
      />
    </div>
  )
}

export default App
