import React, { useState, useMemo } from 'react'
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Users, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser } from 'react-icons/fa'
import KPICard from '../components/KPICard'
import CustomSelect from '../components/CustomSelect'
import clientsData from '../data/clients.json'

const Clients = () => {
  const [clients, setClients] = useState(clientsData)

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [expandedClientId, setExpandedClientId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    industry: '',
    status: 'Active',
  })

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const searchLower = searchTerm.toLowerCase()
      return (
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(searchTerm) ||
        c.city.toLowerCase().includes(searchLower)
      )
    })
  }, [clients, searchTerm])

  const handleAddClick = () => {
    setEditingClient(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      industry: '',
      status: 'Active',
    })
    setShowModal(true)
  }

  const handleEditClick = (e, client) => {
    e.stopPropagation()
    setEditingClient(client)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      industry: client.industry,
      status: client.status,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in Name, Email, and Phone')
      return
    }

    if (editingClient) {
      setClients(clients.map(c =>
        c.id === editingClient.id
          ? { ...c, ...formData }
          : c
      ))
    } else {
      setClients([
        ...clients,
        {
          id: `CLI${String(clients.length + 1).padStart(3, '0')}`,
          ...formData,
          addedDate: new Date().toISOString().split('T')[0],
        },
      ])
    }
    setShowModal(false)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id))
    }
  }

  const toggleExpand = (id) => {
    setExpandedClientId(expandedClientId === id ? null : id)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'Inactive':
        return 'bg-gray-100 text-gray-700'
      case 'Suspended':
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
          <h1 className="text-3xl font-bold text-avis-black">Clients</h1>
          <p className="text-gray-500 mt-1">Manage client information and details</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-avis-red to-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <Plus size={16} />
          Add Client
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Clients</p>
            <p className="text-3xl font-bold text-white mt-1">{clients.length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Active Clients</p>
            <p className="text-3xl font-bold text-white mt-1">{clients.filter(c => c.status === 'Active').length}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
        <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Industries</p>
            <p className="text-3xl font-bold text-white mt-1">{new Set(clients.map(c => c.industry)).size}</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-avis-red"></div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent ml-2 outline-none w-full"
          />
        </div>
        <p className="text-sm text-gray-500 mt-3">Total: {filteredClients.length} client(s)</p>
      </div>

      {/* Clients Table */}
      {filteredClients.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <FaUser size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No clients found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-avis-red/10 flex items-center justify-center">
                          <FaUser className="text-avis-red text-xs" />
                        </div>
                        <span className="text-sm font-medium text-avis-black">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{client.industry}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail size={12} /> {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone size={12} /> {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700">{client.city}</span>
                        <span className="text-xs text-gray-500">{client.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleEditClick(e, client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDelete(e, client.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
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
            className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-avis-black mb-6">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Acme Corporation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Technology"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+260-21-123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Lusaka"
                  />
                </div>
                <div>
                  <CustomSelect
                    label="Status"
                    value={formData.status}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                    options={['Active', 'Inactive', 'Suspended']}
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
                {editingClient ? 'Update' : 'Add'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Clients
