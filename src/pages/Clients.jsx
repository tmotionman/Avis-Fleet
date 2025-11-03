import React, { useState, useMemo } from 'react'
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaUser } from 'react-icons/fa'

const Clients = () => {
  const [clients, setClients] = useState([
    {
      id: 'CLI001',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+27-11-100-1000',
      address: '123 Business Park, Johannesburg',
      city: 'Johannesburg',
      industry: 'Technology',
      status: 'Active',
      addedDate: '2024-01-15',
    },
    {
      id: 'CLI002',
      name: 'Global Logistics Ltd',
      email: 'info@globallogistics.co.za',
      phone: '+27-21-200-2000',
      address: '456 Industrial Zone, Cape Town',
      city: 'Cape Town',
      industry: 'Logistics',
      status: 'Active',
      addedDate: '2024-02-20',
    },
    {
      id: 'CLI003',
      name: 'Durban Services Inc',
      email: 'sales@durbanservices.co.za',
      phone: '+27-31-300-3000',
      address: '789 Commerce Street, Durban',
      city: 'Durban',
      industry: 'Services',
      status: 'Active',
      addedDate: '2024-03-10',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
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

  const handleEditClick = (client) => {
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(c => c.id !== id))
    }
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Client
        </motion.button>
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

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <FaUser size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No clients found</p>
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header with status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-avis-red bg-opacity-20 flex items-center justify-center">
                    <FaUser className="text-avis-red text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-avis-black">{client.name}</h3>
                    <p className="text-xs text-gray-500">{client.industry}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${client.email}`} className="hover:text-avis-red transition-colors">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={16} className="text-gray-400" />
                  <a href={`tel:${client.phone}`} className="hover:text-avis-red transition-colors">
                    {client.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{client.city}</span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-700">
                <p className="text-xs text-gray-500 font-semibold mb-1">ADDRESS</p>
                <p>{client.address}</p>
              </div>

              {/* Added Date */}
              <p className="text-xs text-gray-400 mb-4">Added: {client.addedDate}</p>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditClick(client)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <Edit size={16} />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(client.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
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
                    placeholder="+27-11-123-4567"
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
                    placeholder="e.g., Johannesburg"
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
                    <option>Inactive</option>
                    <option>Suspended</option>
                  </select>
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
                {editingClient ? 'Update' : 'Add'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Clients
