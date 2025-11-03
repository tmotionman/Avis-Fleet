import React, { useState, useMemo } from 'react'
import { Plus, Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import vehiclesData from '../data/vehicles.json'

const FleetList = () => {
  const [vehicles, setVehicles] = useState(vehiclesData)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [availabilityTab, setAvailabilityTab] = useState('All') // 'All', 'Available', 'Unavailable'
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [formData, setFormData] = useState({
    registrationNo: '',
    model: '',
    mileage: '',
    status: 'Active',
  })

  const itemsPerPage = 10

  // Filter and search logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = v.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatusFilter = statusFilter === 'All' || v.status === statusFilter
      
      // Availability filter: Available (Active) vs Unavailable (In Service, Maintenance, Retired)
      let matchesAvailability = true
      if (availabilityTab === 'Available') {
        matchesAvailability = v.status === 'Active'
      } else if (availabilityTab === 'Unavailable') {
        matchesAvailability = v.status !== 'Active'
      }
      
      return matchesSearch && matchesStatusFilter && matchesAvailability
    })
  }, [vehicles, searchTerm, statusFilter, availabilityTab])

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddClick = () => {
    setEditingVehicle(null)
    setFormData({
      registrationNo: '',
      model: '',
      mileage: '',
      status: 'Active',
    })
    setShowModal(true)
  }

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormData({
      registrationNo: vehicle.registrationNo,
      model: vehicle.model,
      mileage: vehicle.mileage,
      status: vehicle.status,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...v, ...formData } : v))
    } else {
      setVehicles([...vehicles, { id: `VEH${vehicles.length + 1}`, ...formData }])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id))
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'In Service':
        return 'bg-blue-100 text-blue-700'
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-700'
      case 'Retired':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
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
          <h1 className="text-3xl font-bold text-avis-black">Fleet List</h1>
          <p className="text-gray-500 mt-1">Manage and monitor all vehicles</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Vehicle
        </motion.button>
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
            {tab === 'Available' && `Available (${vehicles.filter(v => v.status === 'Active').length})`}
            {tab === 'Unavailable' && `Unavailable (${vehicles.filter(v => v.status !== 'Active').length})`}
          </motion.button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by registration or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent ml-2 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-avis-red"
            >
              <option>All</option>
              <option>Active</option>
              <option>In Service</option>
              <option>Maintenance</option>
              <option>Retired</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500">Showing {paginatedVehicles.length} of {filteredVehicles.length} vehicles</p>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Registration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Mileage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Service</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVehicles.map((vehicle, index) => (
                <motion.tr
                  key={vehicle.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-avis-black">{vehicle.registrationNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{vehicle.model}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{vehicle.mileage.toLocaleString()} km</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{vehicle.lastServiceDate}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(vehicle)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
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

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-avis-black mb-6">
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration No</label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  className="input-field"
                  placeholder="e.g., GAU 215 GP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Toyota Corolla 1.6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option>Active</option>
                  <option>In Service</option>
                  <option>Maintenance</option>
                  <option>Retired</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex-1"
              >
                {editingVehicle ? 'Update' : 'Add'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FleetList
