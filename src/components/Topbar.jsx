import React, { useState } from 'react'
import { Menu, Search, Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import AvisLogo from '../../assets/Avis.png'

const Topbar = ({ currentUser, sidebarOpen, setSidebarOpen, onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'User',
    email: currentUser?.email || '',
    role: currentUser?.role || 'User',
    phone: '+27-11-123-4567',
    department: 'Operations',
    joinDate: '2024-01-15',
  })
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    twoFactor: true,
    language: 'English',
  })

  const notifications = [
    { id: 1, message: 'Vehicle VEH005 requires maintenance', priority: 'high' },
    { id: 2, message: 'Fuel card limit reached for VEH002', priority: 'medium' },
    { id: 3, message: 'New user registration pending approval', priority: 'low' },
  ]

  const handleProfileSave = () => {
    setShowProfileModal(false)
  }

  const handleSettingsSave = () => {
    setShowSettingsModal(false)
  }

  // Profile Modal Component
  const ProfileModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
          <button
            onClick={() => setShowProfileModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input
              type="text"
              value={profileData.role}
              onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={profileData.department}
              onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
            <input
              type="text"
              value={profileData.joinDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
              disabled
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setShowProfileModal(false)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleProfileSave}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )

  // Settings Modal Component
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Email Notifications</label>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
            <input
              type="checkbox"
              checked={settings.twoFactor}
              onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
              className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option>English</option>
              <option>Français</option>
              <option>Español</option>
              <option>Portuguese</option>
            </select>
          </div>
          <div className="flex items-center justify-between pt-2">
            <label className="text-sm font-medium text-gray-700">Dark Mode</label>
            <button
              onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSettingsSave}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed top-0 left-0 right-0 lg:left-64 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-600 hover:text-avis-red transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:block">
          <img src={AvisLogo} alt="Avis" className="h-8 w-auto object-contain" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-avis-red transition-all">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicles, users..."
            className="bg-transparent ml-2 outline-none text-sm w-40"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-gray-600 hover:text-avis-red hover:bg-gray-100 rounded-lg transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-avis-red rounded-full"></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-avis-black">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1 ${
                        notif.priority === 'high' ? 'bg-avis-red' :
                        notif.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <p className="text-sm text-gray-700">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <div className="w-8 h-8 bg-avis-red rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <ChevronDown size={18} className="text-gray-600" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-avis-black">{currentUser.name}</p>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-avis-red text-white text-xs rounded-full font-medium">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => {
                    setShowProfileModal(true)
                    setProfileOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={() => {
                    setShowSettingsModal(true)
                    setProfileOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </div>
              <div className="p-2 border-t border-gray-200">
                <button 
                  onClick={() => {
                    onLogout()
                    setProfileOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm text-avis-red font-medium"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && <ProfileModal />}
      {showSettingsModal && <SettingsModal />}
    </div>
  )
}

export default Topbar
