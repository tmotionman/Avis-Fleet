import React, { useState, useRef, useEffect } from 'react'
import { Menu, Bell, User, LogOut, Settings, ChevronDown, Upload, X } from 'lucide-react'
import { motion } from 'framer-motion'
import AvisLogoWebp from '../assets/Avis.webp'
import CustomSelect from './CustomSelect'
import { usersApi, API_BASE_URL } from '../lib/d1Client'

// Helper to get full avatar URL
const getAvatarUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('data:') || url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

// Profile Modal Component - Extracted to prevent re-mounting on parent re-render
const ProfileModal = ({ showProfileModal, setShowProfileModal, profileData, setProfileData, dragActive, setDragActive, fileInputRef, handleDrag, handleDrop, handleInputChange, removeProfilePhoto, handleProfileSave, isSaving }) => {
  if (!showProfileModal) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      onClick={(e) => e.target === e.currentTarget && setShowProfileModal(false)}
      onMouseDown={(e) => e.target === e.currentTarget && e.preventDefault()}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full" 
        onClick={(e) => e.stopPropagation()} 
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
          <button
            onClick={() => setShowProfileModal(false)}
            className="text-gray-400"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-3">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
                dragActive 
                  ? 'border-avis-red bg-red-50' 
                  : 'border-gray-300'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              
              {profileData.profilePhoto ? (
                <div className="space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={getAvatarUrl(profileData.profilePhoto)} 
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeProfilePhoto}
                    className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-avis-red border border-avis-red rounded-lg transition-colors"
                  >
                    <X size={12} />
                    Remove
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer space-y-1 py-2"
                >
                  <Upload size={20} className="mx-auto text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">Drag photo or click</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={profileData.role}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                disabled
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Join Date</label>
              <input
                type="text"
                value={profileData.joinDate}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProfileModal(false)}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-avis-red border-2 border-avis-red rounded-full transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleProfileSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-avis-red rounded-full shadow-md transition-all duration-200 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// Settings Modal Component - Extracted to prevent re-mounting on parent re-render
const SettingsModal = ({ showSettingsModal, setShowSettingsModal, settings, setSettings }) => {
  if (!showSettingsModal) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
      onClick={(e) => e.target === e.currentTarget && setShowSettingsModal(false)} 
      onMouseDown={(e) => e.target === e.currentTarget && e.preventDefault()}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full" 
        onClick={(e) => e.stopPropagation()} 
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="text-gray-400"
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
            <CustomSelect
              options={[
                { value: 'English', label: 'English' },
                { value: 'Français', label: 'Français' },
                { value: 'Español', label: 'Español' },
                { value: 'Portuguese', label: 'Portuguese' },
              ]}
              value={settings.language}
              onChange={(value) => setSettings({ ...settings, language: value })}
              placeholder="Select Language"
            />
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
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSettingsModal(false)}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-avis-red border-2 border-avis-red rounded-full transition-all duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSettingsModal(false)}
            className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-avis-red rounded-full shadow-md transition-all duration-200"
          >
            Save Changes
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// Removed local notification generation in favor of Context
import { useNotifications } from '../context/NotificationContext'

const Topbar = ({ currentUser, sidebarOpen, setSidebarOpen, onLogout, onProfileUpdate, vehicles = [], clients = [], users = [] }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification, readIds } = useNotifications()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  // notificationsViewed is now derived from context state (unreadCount === 0), but for the badge we use unreadCount directly.
  // We can keep a local state for the dropdown open/close only.
  
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const modalContentRef = useRef(null)
  const notificationsRef = useRef(null)
  const profileMenuRef = useRef(null)
  const [savedProfilePhoto, setSavedProfilePhoto] = useState(currentUser?.avatarUrl || null)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'User',
    email: currentUser?.email || '',
    role: currentUser?.role || 'User',
    phone: '+27-11-123-4567',
    department: 'Operations',
    joinDate: '2024-01-15',
    profilePhoto: currentUser?.avatarUrl || null,
  })
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    twoFactor: true,
    language: 'English',
  })

  const handleProfileSave = async () => {
    setIsSaving(true)
    try {
      const userId = currentUser?.id || currentUser?.email
      if (!userId) {
        console.error('No user ID available')
        setShowProfileModal(false)
        return
      }
      
      let finalAvatarUrl = profileData.profilePhoto
      
      // If a new file was selected, upload to R2 first
      if (selectedFile) {
        try {
          const uploadResult = await usersApi.uploadProfilePicture(selectedFile, userId)
          finalAvatarUrl = uploadResult.url
        } catch (uploadError) {
          console.error('R2 Upload failed:', uploadError)
          alert('Warning: Failed to upload photo to Cloudflare Storage. The photo will be saved but may not be accessible across all devices.')
          // Fallback to Base64 is already in finalAvatarUrl from profileData.profilePhoto
        }
      }
      
      // Prepare update data
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        avatarUrl: finalAvatarUrl,
      }
      
      // Call API to update profile
      const updatedUser = await usersApi.updateProfile(userId, updateData)
      
      // Update local state
      setSavedProfilePhoto(finalAvatarUrl)
      setSelectedFile(null)
      
      // Update localStorage with data
      const newUserData = {
        id: currentUser?.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: currentUser?.role,
        avatarUrl: finalAvatarUrl,
      }
      localStorage.setItem('avis_currentUser', JSON.stringify(newUserData))
      
      // Notify parent to update currentUser state
      if (onProfileUpdate) {
        onProfileUpdate({
          ...newUserData,
          avatarUrl: finalAvatarUrl,
        })
      }
      
      setShowProfileModal(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSettingsSave = () => {
    setShowSettingsModal(false)
  }

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData({ ...profileData, profilePhoto: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeProfilePhoto = () => {
    setProfileData({ ...profileData, profilePhoto: null })
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle notifications dropdown
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
      
      // Handle profile dropdown
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 lg:left-64 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-600 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:block">
          <img src={AvisLogoWebp} alt="Avis" className="h-8 w-auto object-contain" loading="lazy" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen)
              if (!notificationsOpen && unreadCount > 0) {
                 // Optional: mark all as read immediately on open, or let user click individually
                 // For now, let's keep the red dot logic simple: unreadCount drives it
              }
            }}
            className="relative p-2 text-gray-600 rounded-lg transition-all"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-avis-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-avis-black">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-avis-red font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? notifications.map((notif) => {
                  const isRead = readIds.includes(notif.id)
                  
                  return (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors last:border-0 relative group ${!isRead ? 'bg-red-50/30' : ''}`}
                  >
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            dismissNotification(notif.id)
                        }}
                        className="absolute top-2 right-2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Dismiss"
                    >
                        <X size={14} />
                    </button>
                    
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notif.priority === 'high' ? 'bg-avis-red' :
                        notif.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0 pr-4">
                        <p className={`text-sm font-medium ${isRead ? 'text-gray-500' : 'text-gray-900'}`}>{notif.message}</p>
                        
                        {/* Show vehicle details if applicable */}
                        {notif.data && Array.isArray(notif.data) && notif.data.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {notif.data.slice(0, 3).map((item, idx) => (
                              <div key={idx} className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">
                                {item.registrationNo || item.name} {item.model && `- ${item.model}`}
                              </div>
                            ))}
                            {notif.data.length > 3 && (
                              <div className="text-xs text-gray-400 px-2">
                                +{notif.data.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{new Date(notif.date || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-400">No notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 rounded-lg transition-all"
          >
            {savedProfilePhoto ? (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <img src={getAvatarUrl(savedProfilePhoto)} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-avis-red rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
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
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm text-gray-700"
                >
                  <User size={16} />
                  <span>My Profile</span>
                </button>
              </div>
              <div className="p-2 border-t border-gray-200">
                <button 
                  onClick={() => {
                    onLogout()
                    setProfileOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm text-avis-red font-medium"
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
      <ProfileModal 
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        profileData={profileData}
        setProfileData={setProfileData}
        dragActive={dragActive}
        setDragActive={setDragActive}
        fileInputRef={fileInputRef}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        handleInputChange={handleInputChange}
        removeProfilePhoto={removeProfilePhoto}
        handleProfileSave={handleProfileSave}
        isSaving={isSaving}
      />
      <SettingsModal 
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  )
}

export default Topbar
