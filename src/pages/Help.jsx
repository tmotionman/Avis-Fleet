import React from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaCarSide, FaLink, FaUsers, FaFileAlt, FaInfoCircle, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaEnvelope } from 'react-icons/fa'

const Help = () => {
  const sections = [
    {
      title: 'Dashboard',
      icon: FaChartLine,
      content: 'The Dashboard provides a high-level overview of your fleet status. You can see key metrics such as total vehicles, available vehicles, and vehicles on rent. It also displays recent activity and alerts.'
    },
    {
      title: 'Fleet Management',
      icon: FaCarSide,
      content: 'In the Fleet Management section, you can view the complete list of vehicles. You can add new vehicles, update existing vehicle details, and change their status (e.g., Available, On Rent, Maintenance).'
    },
    {
      title: 'Fleet Assignment',
      icon: FaLink,
      content: 'This section allows you to assign vehicles to clients. You can select an available vehicle and a client to create a new assignment. You can also mark vehicles as returned when the rental period is over.'
    },
    {
      title: 'Clients',
      icon: FaUsers,
      content: 'Manage your client database here. You can add new clients, view their contact information, and see their rental history.'
    },
    {
      title: 'Reports',
      icon: FaFileAlt,
      content: 'Generate reports to analyze fleet performance. You can view reports on vehicle utilization, revenue, and maintenance costs.'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Help & About</h1>
        <p className="text-gray-600 mt-2">Documentation and information about the Avis Fleet Management System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon size={24} className="text-red-600" />
                <h2 className="text-xl font-semibold text-gray-800">{section.title}</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* About Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <FaInfoCircle size={24} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">About the Application</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Avis Fleet Management System</h3>
            <p className="text-gray-600 mb-4">
              A comprehensive solution designed to streamline vehicle fleet operations. This application enables efficient tracking of vehicle inventory, client assignments, and performance analytics.
            </p>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between border-b border-gray-50 py-2">
                <span className="font-medium">Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 py-2">
                <span className="font-medium">Release Date</span>
                <span>December 2025</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 py-2">
                <span className="font-medium">License</span>
                <span>Proprietary</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Developed by Ancestro</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ancestro specializes in building robust and scalable software solutions for enterprise management.
            </p>
            <div className="text-xs text-gray-500 mt-4">
              <p>© 2026 Ancestro. All rights reserved.</p>
              <p className="mt-1">
                Unauthorized duplication or distribution of this software is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Contact & Follow Us</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Direct Contact */}
           <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaEnvelope className="text-red-600" /> Direct Contact
              </h3>
              <a href="mailto:hello@ancestroai.co.zm" className="text-gray-600 transition-colors">
                hello@ancestroai.co.zm
              </a>
           </div>

           {/* Socials */}
           <div>
              <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="space-y-3">
                <a href="https://linkedin.com/company/ancestroai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 transition-colors">
                  <FaLinkedin size={20} /> <span>@ancestroai</span>
                </a>
                <a href="https://twitter.com/AncestroAi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 transition-colors">
                  <FaTwitter size={20} /> <span>@AncestroAi</span>
                </a>
                <a href="https://instagram.com/ancestroai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 transition-colors">
                  <FaInstagram size={20} /> <span>@ancestroai</span>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61558529813462" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 transition-colors">
                  <FaFacebook size={20} /> <span>Ancestro</span>
                </a>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Help
