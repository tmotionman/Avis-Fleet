import React, { useState, useMemo } from 'react'
import { Plus, Search, Trash2, Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import vehiclesData from '../data/vehicles.json'
import usersData from '../data/users.json'

const FleetAssignment = () => {
  const [assignments, setAssignments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [formData, setFormData] = useState({
    vehicleId: '',
    userId: '',
    startDate: '',
    endDate: '',
    purpose: '',
  })

  // Available vehicles are those with 'Active' status
  const availableVehicles = useMemo(() => {
    return vehiclesData.filter(v => v.status === 'Active' && !assignments.some(a => a.vehicleId === v.id && !a.returnDate))
  }, [assignments])

  // Filter assigned vehicles based on search
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const vehicle = vehiclesData.find(v => v.id === a.vehicleId)
      const user = usersData.find(u => u.id === a.userId)
      const searchLower = searchTerm.toLowerCase()
      return (
        (vehicle?.registrationNo.toLowerCase().includes(searchLower)) ||
        (user?.name.toLowerCase().includes(searchLower)) ||
        (a.purpose?.toLowerCase().includes(searchLower))
      )
    })
  }, [assignments, searchTerm])

  const handleAddClick = () => {
    setEditingAssignment(null)
    setFormData({
      vehicleId: '',
      userId: '',
      startDate: '',
      endDate: '',
      purpose: '',
    })
    setShowModal(true)
  }

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      vehicleId: assignment.vehicleId,
      userId: assignment.userId,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      purpose: assignment.purpose,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.vehicleId || !formData.userId) {
      alert('Please select both a vehicle and a user')
      return
    }

    if (editingAssignment) {
      setAssignments(assignments.map(a =>
        a.id === editingAssignment.id ? { ...a, ...formData } : a
      ))
    } else {
      setAssignments([
        ...assignments,
        {
          id: `ASG${Date.now()}`,
          ...formData,
          assignedDate: new Date().toISOString().split('T')[0],
        },
      ])
    }
    setShowModal(false)
  }

  const handleReturnVehicle = (assignmentId) => {
    setAssignments(assignments.map(a =>
      a.id === assignmentId
        ? { ...a, returnDate: new Date().toISOString().split('T')[0] }
        : a
    ))
  }

  const handleDelete = (id) => {
    setAssignments(assignments.filter(a => a.id !== id))
  }

  const getVehicleName = (vehicleId) => {
    const vehicle = vehiclesData.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.registrationNo} (${vehicle.model})` : 'N/A'
  }

  const getUserName = (userId) => {
    const user = usersData.find(u => u.id === userId)
    return user ? user.name : 'N/A'
  }

  const activeAssignments = assignments.filter(a => !a.returnDate)
  const completedAssignments = assignments.filter(a => a.returnDate)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-avis-black">Fleet Assignment</h1>
          <p className="text-gray-500 mt-1">Assign available vehicles to clients</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          disabled={availableVehicles.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          New Assignment
        </motion.button>
      </div>

      {/* Available Vehicles Alert */}
      {availableVehicles.length === 0 && activeAssignments.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          <p className="text-sm font-medium">No available vehicles. All active vehicles are currently assigned.</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by registration, client name, or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent ml-2 outline-none w-full"
          />
        </div>
      </div>

      {/* Active Assignments */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-avis-black">Active Assignments ({activeAssignments.length})</h2>
        {activeAssignments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No active assignments yet</p>
          </div>
        ) : (
          <motion.div className="grid gap-4">
            {filteredAssignments
              .filter(a => !a.returnDate)
              .map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Vehicle</p>
                      <p className="text-sm font-bold text-avis-black mt-1">{getVehicleName(assignment.vehicleId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Client</p>
                      <p className="text-sm font-bold text-avis-black mt-1">{getUserName(assignment.userId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Purpose</p>
                      <p className="text-sm text-gray-700 mt-1">{assignment.purpose || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Assigned Date</p>
                      <p className="text-sm text-gray-700 mt-1 flex items-center gap-1">
                        <Calendar size={14} />
                        {assignment.assignedDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Actions</p>
                      <div className="flex gap-2 mt-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditClick(assignment)}
                          className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReturnVehicle(assignment.id)}
                          className="px-3 py-1 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          Return
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
      </div>

      {/* Completed Assignments */}
      {completedAssignments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-avis-black">Completed Assignments ({completedAssignments.length})</h2>
          <motion.div className="grid gap-4">
            {filteredAssignments
              .filter(a => a.returnDate)
              .map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6 opacity-75"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Vehicle</p>
                      <p className="text-sm font-bold text-avis-black mt-1">{getVehicleName(assignment.vehicleId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Client</p>
                      <p className="text-sm font-bold text-avis-black mt-1">{getUserName(assignment.userId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Return Date</p>
                      <p className="text-sm text-gray-700 mt-1 flex items-center gap-1">
                        <Calendar size={14} />
                        {assignment.returnDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {assignment.endDate
                          ? Math.max(0, Math.ceil((new Date(assignment.endDate) - new Date(assignment.assignedDate)) / (1000 * 60 * 60 * 24)))
                          : 'N/A'}{' '}
                        days
                      </p>
                    </div>
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(assignment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      )}

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
            className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-avis-black mb-6">
              {editingAssignment ? 'Edit Assignment' : 'New Fleet Assignment'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a vehicle</option>
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNo} - {v.model}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client / User *</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a user</option>
                  {usersData.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Client meeting, Site inspection"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
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
                {editingAssignment ? 'Update' : 'Assign'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FleetAssignment
