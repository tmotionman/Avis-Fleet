import React, { useState } from 'react'
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Users, Shield, Briefcase, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import usersData from '../data/users.json'
import KPICard from '../components/KPICard'
import CustomSelect from '../components/CustomSelect'

const UserManagement = () => {
  const [users, setUsers] = useState(usersData)
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee',
    region: 'Johannesburg',
    phone: '',
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(users.length / itemsPerPage)
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddClick = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      role: 'Employee',
      region: 'Johannesburg',
      phone: '',
    })
    setShowModal(true)
  }

  const handleEditClick = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      region: user.region,
      phone: user.phone,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
    } else {
      setUsers([...users, { id: `USR${users.length + 1}`, ...formData, joinDate: new Date().toISOString().split('T')[0], status: 'Active' }])
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-700'
      case 'Manager':
        return 'bg-blue-100 text-blue-700'
      case 'Employee':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusBadge = (status) => {
    return status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700'
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
          <h1 className="text-3xl font-bold text-avis-black">User Management</h1>
          <p className="text-gray-500 mt-1">Manage system users and access control</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddClick}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add User
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard 
          label="Total Users" 
          value={users.length} 
          icon={<Users />} 
        />
        <KPICard 
          label="Admins" 
          value={users.filter(u => u.role === 'Admin').length} 
          icon={<Shield />} 
        />
        <KPICard 
          label="Managers" 
          value={users.filter(u => u.role === 'Manager').length} 
          icon={<Briefcase />} 
        />
        <KPICard 
          label="Active Users" 
          value={users.filter(u => u.status === 'Active').length} 
          icon={<CheckCircle />} 
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-avis-black">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.region}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditClick(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(user.id)}
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
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="john@avisfleet.co.zm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="+260-21-123-4567"
                />
              </div>
              <div>
                <CustomSelect
                  label="Role"
                  value={formData.role}
                  onChange={(value) => setFormData({ ...formData, role: value })}
                  options={['Admin', 'Manager', 'Employee']}
                />
              </div>
              <div>
                <CustomSelect
                  label="Region"
                  value={formData.region}
                  onChange={(value) => setFormData({ ...formData, region: value })}
                  options={['All', 'Lusaka', 'Ndola', 'Kitwe', 'Livingstone']}
                />
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
                {editingUser ? 'Update' : 'Add'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default UserManagement
