import React from 'react'
import { X, Menu } from 'lucide-react'
import { FaChartLine, FaCarSide, FaFileAlt, FaUsers, FaLink } from 'react-icons/fa'
import { motion } from 'framer-motion'

// Always-expanded sidebar (w-64) - icons + labels
const Sidebar = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'assignment', label: 'Fleet Assignment', icon: FaLink },
  { id: 'fleet', label: 'Fleet Management', icon: FaCarSide },
  { id: 'clients', label: 'Clients', icon: FaUsers },
    { id: 'reports', label: 'Reports', icon: FaFileAlt },
    { id: 'users', label: 'User Management', icon: FaUsers },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - permanently expanded */}
  <div className="hidden lg:flex fixed inset-y-0 left-0 top-0 bottom-0 h-screen w-64 bg-[#262626] border-r border-gray-800 flex-col items-start py-6 z-40 overflow-y-auto">

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-3 w-full px-4 pt-12">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-[#1f1f1f] text-white shadow-inner relative'
                      : 'text-gray-300 hover:text-white hover:bg-[#2b2b2b]'
                  }`}
              >
                <IconComponent size={20} />
                <span className="font-medium text-sm">{item.label}</span>

                {/* Side selector - red */}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -left-3 top-2 w-1 h-6 bg-red-600 rounded-r shadow-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Desktop bottom copyright (pinned to bottom) */}
        <div className="absolute left-0 right-0 bottom-3 px-4">
          <p className="text-xs text-gray-400 text-center">© 2025 Ancestro</p>
        </div>
      </div>

      {/* Mobile Full-Width Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed lg:hidden left-0 top-0 h-screen w-72 bg-[#262626] z-40 flex flex-col overflow-y-auto"
      >
        {/* Mobile Header */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">AVIS</h1>
            <p className="text-xs text-gray-500">Fleet Manager</p>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id)
                  setSidebarOpen(false)
                }}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-[#1f1f1f] text-white shadow-inner'
                      : 'text-gray-400 hover:text-white hover:bg-[#2b2b2b]'
                  }`}
              >
                <IconComponent size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* Mobile User Profile removed for mobile view per request */}
        {/* Mobile copyright */}
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-gray-400">© 2025 Ancestro</p>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
