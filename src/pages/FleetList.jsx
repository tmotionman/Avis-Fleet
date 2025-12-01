import React, { useState, useMemo } from 'react'
import { Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight, Eye, MapPin, Calendar, Car, X, AlertTriangle, ChevronUp, ChevronDown, CheckCircle, Activity, Wrench, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import KPICard from '../components/KPICard'
import CustomSelect from '../components/CustomSelect'

const FleetList = ({ vehicles, setVehicles, onCreateVehicle, onUpdateVehicle, onDeleteVehicle }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [availabilityTab, setAvailabilityTab] = useState('All') // 'All', 'Available', 'Unavailable'
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)

  const statusOptions = [
    { value: 'All', label: 'All Status', icon: Filter, color: 'text-gray-600', bg: 'bg-gray-100' },
    { value: 'Available', label: 'Available', icon: CheckCircle, color: 'text-gray-600', bg: 'bg-gray-100' },
    { value: 'On Rent', label: 'On Rent', icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100' },
    { value: 'Maintenance', label: 'Maintenance', icon: Wrench, color: 'text-gray-600', bg: 'bg-gray-100' },
  ]

  const [formData, setFormData] = useState({
    registrationNo: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'Available',
    location: '',
    assignedTo: 'Unassigned',
  })

  const itemsPerPage = 10

  // Filter and search logic
  const filteredVehicles = useMemo(() => {
    if (!vehicles || !Array.isArray(vehicles)) return []
    
    let result = vehicles.filter(v => {
      if (!v) return false
      const regNo = v.registrationNo || v.licensePlate || ''
      const model = v.model || ''
      const location = v.location || ''
      const assignedTo = v.assignedTo || ''
      
      const matchesSearch = regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatusFilter = statusFilter === 'All' || v.status === statusFilter
      
      // Availability filter: Available vs Unavailable (On Rent, Maintenance)
      let matchesAvailability = true
      if (availabilityTab === 'Available') {
        matchesAvailability = v.status === 'Available'
      } else if (availabilityTab === 'Unavailable') {
        matchesAvailability = v.status !== 'Available'
      }
      
      return matchesSearch && matchesStatusFilter && matchesAvailability
    })

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key]
        let bVal = b[sortConfig.key]
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase()
        if (typeof bVal === 'string') bVal = bVal.toLowerCase()
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [vehicles, searchTerm, statusFilter, availabilityTab, sortConfig])

  // Handle column sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp size={14} className="text-gray-300" />
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-avis-red" />
      : <ChevronDown size={14} className="text-avis-red" />
  }

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddClick = () => {
    setEditingVehicle(null)
    setFormData({
      registrationNo: '',
      model: '',
      year: new Date().getFullYear(),
      status: 'Available',
      location: '',
      assignedTo: 'Unassigned',
    })
    setShowModal(true)
  }

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      registrationNo: vehicle.registrationNo,
      model: vehicle.model,
      year: vehicle.year || new Date().getFullYear(),
      status: vehicle.status,
      location: vehicle.location || '',
      assignedTo: vehicle.assignedTo || 'Unassigned',
    })
    setShowModal(true)
  }

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowDetailModal(true)
  }

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (vehicleToDelete) {
      try {
        await onDeleteVehicle(vehicleToDelete.id)
        setShowDeleteConfirm(false)
        setVehicleToDelete(null)
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        alert('Error deleting vehicle. Please try again.')
      }
    }
  }

  const handleSave = async () => {
    if (!formData.registrationNo || !formData.model) {
      alert('Please fill in Registration No and Model')
      return
    }

    const vehicleData = {
      ...formData,
      year: parseInt(formData.year) || new Date().getFullYear(),
    }

    try {
      if (editingVehicle) {
        await onUpdateVehicle(editingVehicle.id, vehicleData)
      } else {
        await onCreateVehicle(vehicleData)
      }
      setShowModal(false)
    } catch (error) {
      console.error('Error saving vehicle:', error)
      alert('Error saving vehicle. Please try again.')
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'On Rent':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-avis-black">Fleet Management</h1>
          <p className="text-gray-500 mt-1">Manage and monitor all vehicles</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-avis-red to-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Vehicles</p>
            <p className="text-3xl font-bold text-white mt-1">{vehicles.length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Available</p>
            <p className="text-3xl font-bold text-white mt-1">{vehicles.filter(v => v.status === 'Available').length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">On Rent</p>
            <p className="text-3xl font-bold text-white mt-1">{vehicles.filter(v => v.status === 'On Rent').length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Maintenance</p>
            <p className="text-3xl font-bold text-white mt-1">{vehicles.filter(v => v.status === 'Maintenance').length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
      </div>

      {/* Availability Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['All', 'Available', 'Unavailable'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => {
              setAvailabilityTab(tab)
              setCurrentPage(1) // Reset to first page when switching tabs
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
              availabilityTab === tab
                ? 'text-avis-red border-avis-red'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab === 'All' && `All Fleets (${vehicles.length})`}
            {tab === 'Available' && `Available (${vehicles.filter(v => v.status === 'Available').length})`}
            {tab === 'Unavailable' && `Unavailable (${vehicles.filter(v => v.status !== 'Available').length})`}
          </motion.button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row items-center">
          <div className="flex-1 w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-avis-red transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by registration, model, location, or assigned to..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-avis-red/20 focus:border-avis-red transition-all duration-200 sm:text-sm"
            />
          </div>
          
          <div className="relative z-20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-avis-red/30 transition-all duration-200 min-w-[200px] justify-between group"
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${statusOptions.find(o => o.value === statusFilter)?.bg || 'bg-gray-100'}`}>
                  {React.createElement(statusOptions.find(o => o.value === statusFilter)?.icon || Filter, {
                    size: 16,
                    className: statusOptions.find(o => o.value === statusFilter)?.color || 'text-gray-600'
                  })}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {statusOptions.find(o => o.value === statusFilter)?.label || statusFilter}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''} group-hover:text-avis-red`} 
              />
            </motion.button>

            <AnimatePresence>
              {isStatusDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsStatusDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden ring-1 ring-black ring-opacity-5"
                  >
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Filter by Status
                      </div>
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setStatusFilter(option.value)
                            setIsStatusDropdownOpen(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            statusFilter === option.value
                              ? 'bg-red-50 text-avis-red'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:pl-4'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md ${statusFilter === option.value ? 'bg-red-100' : 'bg-gray-100'}`}>
                            <option.icon size={16} className={statusFilter === option.value ? 'text-avis-red' : 'text-gray-600'} />
                          </div>
                          {option.label}
                          {statusFilter === option.value && (
                            <motion.div layoutId="activeCheck" className="ml-auto">
                              <div className="w-2 h-2 rounded-full bg-avis-red shadow-[0_0_8px_rgba(228,30,38,0.5)]" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">Showing <span className="font-semibold text-avis-black">{paginatedVehicles.length}</span> of <span className="font-semibold text-avis-black">{filteredVehicles.length}</span> vehicles</p>
          
          {/* Active Filters Tags */}
          {statusFilter !== 'All' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setStatusFilter('All')}
              className="text-xs flex items-center gap-1 text-avis-red hover:text-red-700 font-medium px-2 py-1 bg-red-50 rounded-md transition-colors"
            >
              Clear Filter <X size={12} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('registrationNo')}
                >
                  <div className="flex items-center gap-1">
                    Registration <SortIcon columnKey="registrationNo" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('model')}
                >
                  <div className="flex items-center gap-1">
                    Model <SortIcon columnKey="model" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('year')}
                >
                  <div className="flex items-center gap-1">
                    Year <SortIcon columnKey="year" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center gap-1">
                    Location <SortIcon columnKey="location" />
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status <SortIcon columnKey="status" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
              paginatedVehicles.map((vehicle, index) => (
                <motion.tr
                  key={vehicle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-avis-black">{vehicle.registrationNo}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vehicle.model}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vehicle.year || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {vehicle.location || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 font-medium">
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewClick(vehicle)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClick(vehicle)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClick(vehicle)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Vehicle Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-avis-black">Vehicle Details</h2>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              {/* Vehicle Header */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-avis-red bg-opacity-10 flex items-center justify-center">
                  <Car size={32} className="text-avis-red" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-avis-black">{selectedVehicle.registrationNo}</h3>
                  <p className="text-gray-600">{selectedVehicle.model}</p>
                  <span className="text-sm text-gray-700 font-medium">
                    {selectedVehicle.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Year</p>
                  <p className="text-sm font-medium text-avis-black mt-1">{selectedVehicle.year || '—'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
                  <p className="text-sm font-medium text-avis-black mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {selectedVehicle.location || '—'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Assigned To</p>
                  <p className="text-sm font-medium text-avis-black mt-1">{selectedVehicle.assignedTo || 'Unassigned'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Last Service</p>
                  <p className="text-sm font-medium text-avis-black mt-1 flex items-center gap-1">
                    <Calendar size={12} /> {selectedVehicle.lastServiceDate || '—'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDetailModal(false)
                    handleEditClick(selectedVehicle)
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-avis-red to-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Edit Vehicle
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && vehicleToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-avis-black mb-2">Delete Vehicle?</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{vehicleToDelete.registrationNo}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-avis-red border-2 border-avis-red rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-avis-red to-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-avis-black">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration No *</label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  className="input-field"
                  placeholder="e.g., ZMB 215 ZM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Toyota Corolla 1.6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="input-field"
                  placeholder="2024"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <CustomSelect
                  label="Location"
                  value={formData.location}
                  onChange={(value) => setFormData({ ...formData, location: value })}
                  options={[
                    'Lusaka',
                    'Ndola',
                    'Kitwe',
                    'Livingstone',
                    'Kabwe',
                    'Chingola'
                  ]}
                  placeholder="Select location"
                />
              </div>
              <div>
                <CustomSelect
                  label="Status"
                  value={formData.status}
                  onChange={(value) => setFormData({ ...formData, status: value })}
                  options={['Available', 'On Rent', 'Maintenance']}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="input-field"
                  placeholder="e.g., John Smith or Unassigned"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-avis-red border-2 border-avis-red rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-avis-red to-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FleetList
