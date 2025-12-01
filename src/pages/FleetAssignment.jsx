import React, { useState, useMemo } from 'react'
import { Plus, Search, Trash2, Calendar, MapPin, CheckCircle, Car } from 'lucide-react'
import { motion } from 'framer-motion'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import clientsData from '../data/clients.json'
import KPICard from '../components/KPICard'
import CustomSelect from '../components/CustomSelect'

const FleetAssignment = ({ 
  vehicles, 
  assignments, 
  onAssignVehicle, 
  onReturnVehicle, 
  onUpdateAssignment, 
  onDeleteAssignment 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [formData, setFormData] = useState({
    vehicleId: '',
    clientId: '',
    startDate: '',
    endDate: '',
    purpose: '',
  })

  // Available vehicles are those with 'Available' status (not already assigned)
  // When editing, also include the currently assigned vehicle
  const availableVehicles = useMemo(() => {
    return vehicles.filter(v => v.status === 'Available')
  }, [vehicles])

  // Vehicles available for selection in modal (includes current vehicle when editing)
  const selectableVehicles = useMemo(() => {
    if (editingAssignment) {
      const currentVehicle = vehicles.find(v => v.id === editingAssignment.vehicleId)
      if (currentVehicle && currentVehicle.status !== 'Available') {
        return [...availableVehicles, currentVehicle]
      }
    }
    return availableVehicles
  }, [vehicles, availableVehicles, editingAssignment])

  // Filter assigned vehicles based on search
  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const vehicle = vehicles.find(v => v.id === a.vehicleId)
      const client = clientsData.find(c => c.id === a.clientId)
      const searchLower = searchTerm.toLowerCase()
      return (
        (vehicle?.registrationNo.toLowerCase().includes(searchLower)) ||
        (client?.name.toLowerCase().includes(searchLower)) ||
        (a.purpose?.toLowerCase().includes(searchLower))
      )
    })
  }, [assignments, searchTerm, vehicles])

  const handleAddClick = () => {
    setEditingAssignment(null)
    setFormData({
      vehicleId: '',
      clientId: '',
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
      clientId: assignment.clientId,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
      purpose: assignment.purpose,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.vehicleId || !formData.clientId) {
      alert('Please select both a vehicle and a client')
      return
    }

    const client = clientsData.find(c => c.id === formData.clientId)

    if (editingAssignment) {
      // Update existing assignment
      onUpdateAssignment(editingAssignment.id, formData)
    } else {
      // Create new assignment - this will automatically set vehicle to "On Rent"
      onAssignVehicle({
        id: `ASG${Date.now()}`,
        ...formData,
        clientName: client?.name || 'Unknown',
        assignedDate: new Date().toISOString().split('T')[0],
      })
    }
    setShowModal(false)
  }

  const handleReturnVehicle = (assignmentId) => {
    // This will automatically set vehicle status back to "Available"
    onReturnVehicle(assignmentId)
  }

  const handleDelete = (id) => {
    onDeleteAssignment(id)
  }

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    return vehicle ? `${vehicle.registrationNo} (${vehicle.model})` : 'N/A'
  }

  const getUserName = (clientId) => {
    const client = clientsData.find(c => c.id === clientId)
    return client ? client.name : 'N/A'
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
          <div>
                <h1 className="text-3xl font-bold text-avis-black">Fleet Assignment</h1>
                <p className="text-gray-500 mt-1">Assign available vehicles to clients</p>
              </div>
        </div>
        <button
          onClick={handleAddClick}
          disabled={availableVehicles.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-avis-red to-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          New Assignment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Active Assignments</p>
            <p className="text-3xl font-bold text-white mt-1">{activeAssignments.length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Available Vehicles</p>
            <p className="text-3xl font-bold text-white mt-1">{availableVehicles.length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Completed</p>
            <p className="text-3xl font-bold text-white mt-1">{completedAssignments.length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
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
                      <p className="text-sm text-avis-black mt-1">{getVehicleName(assignment.vehicleId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Client</p>
                      <p className="text-sm text-avis-black mt-1">{getUserName(assignment.clientId)}</p>
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
                      <div className="flex gap-3 mt-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditClick(assignment)}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReturnVehicle(assignment.id)}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
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
                      <p className="text-sm text-avis-black mt-1">{getVehicleName(assignment.vehicleId)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Client</p>
                      <p className="text-sm text-avis-black mt-1">{getUserName(assignment.clientId)}</p>
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
                <CustomSelect
                  label="Vehicle *"
                  value={formData.vehicleId}
                  onChange={(value) => setFormData({ ...formData, vehicleId: value })}
                  options={selectableVehicles.map(v => ({
                    value: v.id,
                    label: `${v.registrationNo} - ${v.model}`
                  }))}
                  placeholder="Select a vehicle"
                />
              </div>
              <div>
                <CustomSelect
                  label="Client *"
                  value={formData.clientId}
                  onChange={(value) => setFormData({ ...formData, clientId: value })}
                  options={clientsData.map(c => ({
                    value: c.id,
                    label: c.name
                  }))}
                  placeholder="Select a client"
                />
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
                  <DatePicker
                    selected={formData.startDate ? new Date(formData.startDate) : null}
                    onChange={(date) => {
                      setFormData({ ...formData, startDate: date ? date.toISOString().split('T')[0] : '' })
                      setStartDateOpen(false)
                    }}
                    onInputClick={() => setStartDateOpen(!startDateOpen)}
                    open={startDateOpen}
                    onCalendarOpen={() => setStartDateOpen(true)}
                    onCalendarClose={() => setStartDateOpen(false)}
                    dateFormat="dd/MM/yyyy"
                    className="input-field cursor-pointer"
                    placeholderText="Select start date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <DatePicker
                    selected={formData.endDate ? new Date(formData.endDate) : null}
                    onChange={(date) => {
                      setFormData({ ...formData, endDate: date ? date.toISOString().split('T')[0] : '' })
                      setEndDateOpen(false)
                    }}
                    onInputClick={() => setEndDateOpen(!endDateOpen)}
                    open={endDateOpen}
                    onCalendarOpen={() => setEndDateOpen(true)}
                    onCalendarClose={() => setEndDateOpen(false)}
                    dateFormat="dd/MM/yyyy"
                    className="input-field cursor-pointer"
                    placeholderText="Select end date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
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
                {editingAssignment ? 'Update' : 'Assign'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FleetAssignment
