import React, { useState } from 'react'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Wrench, DollarSign, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import maintenanceData from '../data/maintenance.json'
import KPICard from '../components/KPICard'

const MaintenanceTracker = () => {
  const [maintenance, setMaintenance] = useState(maintenanceData)
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    vehicleNo: '',
    serviceType: '',
    date: '',
    cost: '',
    notes: '',
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(maintenance.length / itemsPerPage)
  const paginatedMaintenance = maintenance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddClick = () => {
    setEditingRecord(null)
    setFormData({
      vehicleNo: '',
      serviceType: '',
      date: '',
      cost: '',
      notes: '',
    })
    setShowModal(true)
  }

  const handleEditClick = (record) => {
    setEditingRecord(record)
    setFormData({
      vehicleNo: record.vehicleNo,
      serviceType: record.serviceType,
      date: record.date,
      cost: record.cost,
      notes: record.notes,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingRecord) {
      setMaintenance(maintenance.map(m => m.id === editingRecord.id ? { ...m, ...formData } : m))
    } else {
      setMaintenance([...maintenance, { id: `MAINT${maintenance.length + 1}`, ...formData, status: 'Scheduled', technician: 'Unassigned' }])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setMaintenance(maintenance.filter(m => m.id !== id))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700'
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const totalCost = maintenance.reduce((sum, m) => sum + m.cost, 0)

  return (
    <div className="relative">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-avis-black">Maintenance Tracker</h1>
          <p className="text-gray-500 mt-1">Track and manage vehicle maintenance schedules</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          className="flex items-center gap-2 px-3 py-1 bg-avis-red text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all duration-200"
        >
          <Plus size={16} />
          Add Record
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard 
          label="Total Records" 
          value={maintenance.length} 
          icon={<Wrench />} 
        />
        <KPICard 
          label="Total Cost" 
          value={`R${totalCost.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`} 
          icon={<DollarSign />} 
        />
        <KPICard 
          label="Pending Services" 
          value={maintenance.filter(m => m.status === 'Scheduled').length} 
          icon={<Clock />} 
        />
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMaintenance.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-avis-black">{record.vehicleNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.serviceType}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{record.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-avis-black">R{record.cost.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(record)}
                      className="p-2 text-blue-600 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(record.id)}
                      className="p-2 text-red-600 rounded-lg transition-colors"
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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

    </motion.div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
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
              {editingRecord ? 'Edit Maintenance Record' : 'Add Maintenance Record'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle No</label>
                <input
                  type="text"
                  value={formData.vehicleNo}
                  onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                  className="input-field"
                  placeholder="GAU 215 GP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <input
                  type="text"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="input-field"
                  placeholder="Oil Change"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost (R)</label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field min-h-24"
                  placeholder="Add notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-avis-red border-2 border-avis-red rounded-full transition-all duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-avis-red rounded-full shadow-md transition-all duration-200"
              >
                {editingRecord ? 'Update' : 'Add'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default MaintenanceTracker
