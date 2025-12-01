import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import KPICard from '../components/KPICard'
import { FaCarSide, FaCheckCircle, FaCar, FaExclamationTriangle, FaClock, FaPlus, FaUserPlus, FaClipboardList, FaImage, FaSync } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { exchangeRatesApi } from '../lib/d1Client'
import sunsetDriveWebp from '../assets/sunset-coast-drive.webp'

const Dashboard = ({ vehicles, clients = [], assignments = [], onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [exchangeRates, setExchangeRates] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch exchange rates on mount
  useEffect(() => {
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    setIsLoading(true)
    try {
      const data = await exchangeRatesApi.getRates()
      setExchangeRates(data.rates || [])
      setLastUpdated(new Date(data.lastUpdated))
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      // Use fallback rates
      setExchangeRates([
        { currency: 'USD', buy: 22.9468, sell: 22.9968 },
        { currency: 'GBP', buy: 29.1250, sell: 29.4500 },
        { currency: 'EUR', buy: 24.8500, sell: 25.1500 },
        { currency: 'ZAR', buy: 1.2450, sell: 1.2850 },
      ])
      setLastUpdated(new Date())
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate KPI values from props
  const vehiclesData = vehicles || []
  const totalVehicles = vehiclesData.length
  const availableVehicles = vehiclesData.filter(v => v.status === 'Available').length
  const vehiclesOnRent = vehiclesData.filter(v => v.status === 'On Rent').length
  const maintenanceVehicles = vehiclesData.filter(v => v.status === 'Maintenance').length

  // Calculate Alerts
  const today = new Date().toISOString().split('T')[0]
  const overdueReturns = assignments.filter(a => !a.returnDate && a.endDate < today).length
  
  // Calculate upcoming service (dummy logic for now as we don't have nextServiceDate, using lastServiceDate > 1 year)
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const serviceDue = vehiclesData.filter(v => new Date(v.lastServiceDate) < oneYearAgo).length

  // Recent Activity
  const recentActivity = useMemo(() => {
    // Use only real assignments from database (no dummy data)
    return assignments
      .sort((a, b) => new Date(b.assignedDate || b.createdAt || 0) - new Date(a.assignedDate || a.createdAt || 0))
      .slice(0, 10)
  }, [assignments])

  // Location Chart Data
  const locationData = useMemo(() => {
    const counts = vehiclesData.reduce((acc, v) => {
      const loc = v.location || 'Unknown'
      acc[loc] = (acc[loc] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [vehiclesData])

  // Clients by City Chart Data
  const clientsByCity = useMemo(() => {
    const counts = (clients || []).reduce((acc, c) => {
      const city = c.city || 'Unknown'
      acc[city] = (acc[city] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [clients])

  // Status Chart Data
  const statusData = [
    { name: 'Available', value: availableVehicles, color: '#E41E26' },
    { name: 'On Rent', value: vehiclesOnRent, color: '#4B4B4B' },
    { name: 'Maintenance', value: maintenanceVehicles, color: '#F5F5F5' },
  ].filter(d => d.value > 0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-3 md:p-6 space-y-6"
    >
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-avis-black">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to Avis Fleet Management System</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-3">
          <button 
            onClick={() => onNavigate('assignment')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-avis-red to-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FaPlus className="text-xs" />
            New Assignment
          </button>
          <button 
            onClick={() => onNavigate('fleet')}
            className="flex items-center gap-2 px-4 py-2 bg-avis-darkgray text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
          >
            <FaCar className="text-xs" />
            Add Vehicle
          </button>
          <button 
            onClick={() => onNavigate('clients')}
            className="flex items-center gap-2 px-4 py-2 bg-avis-darkgray text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
          >
            <FaUserPlus className="text-xs" />
            Add Client
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KPI Cards Column */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          {/* Image Placeholder Card */}
          <div className="bg-avis-darkgray rounded-xl shadow-sm border border-avis-darkgray h-48 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:shadow-md transition-all duration-200">
            <img 
              src={sunsetDriveWebp}
              alt="Featured Vehicle" 
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>

          <div onClick={() => onNavigate('fleet')} className="cursor-pointer transform transition-transform hover:scale-105">
            <KPICard
              icon={<FaCarSide />}
              label="Total Vehicles"
              value={totalVehicles}
              trend={5}
              color="#E41E26"
              size="small"
            />
          </div>
          <div onClick={() => onNavigate('fleet')} className="cursor-pointer transform transition-transform hover:scale-105">
            <KPICard
              icon={<FaCheckCircle />}
              label="Available Vehicles"
              value={availableVehicles}
              trend={8}
              color="#22C55E"
              size="small"
            />
          </div>
          <div onClick={() => onNavigate('fleet')} className="cursor-pointer transform transition-transform hover:scale-105">
            <KPICard
              icon={<FaCar />}
              label="On Rent"
              value={vehiclesOnRent}
              trend={2}
              color="#3B82F6"
              size="small"
            />
          </div>

          {/* Time & Date Card */}
          <div className="bg-avis-darkgray rounded-xl shadow-sm border border-avis-darkgray p-4 flex flex-col items-center justify-center text-white h-24 transform transition-transform hover:scale-105">
             <div className="text-3xl font-bold tracking-widest">
               {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
             </div>
             <div className="text-xs font-bold uppercase tracking-wider mt-1 text-gray-300">
               {currentTime.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}
             </div>
          </div>
        </motion.div>
        {/* Left Column - Alerts & Location Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clients by City Chart */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-avis-black mb-4">Clients by City</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientsByCity} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="clientBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E41E26" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#E41E26" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      color: '#F3F4F6'
                    }}
                    itemStyle={{ color: '#F3F4F6' }}
                    cursor={{ fill: '#F9FAFB', opacity: 0.5 }}
                    formatter={(value) => Math.round(value)}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#clientBarGradient)" 
                    radius={[6, 6, 0, 0]} 
                    name="Clients"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-avis-black">Recent Activity</h3>
              <button onClick={() => onNavigate('assignment')} className="text-xs text-avis-red font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="mt-1 w-1 h-1 rounded-full bg-avis-red flex-shrink-0" style={{marginTop: '6px'}}></div>
                    <div>
                      <p className="text-sm font-medium text-avis-black">
                        Vehicle assigned to <span className="font-bold">{activity.clientName}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.assignedDate} • {activity.purpose || 'No purpose'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Status Donut & Recent Activity */}
        <div className="space-y-6">
          {/* Status Donut Chart */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-avis-black mb-4">Fleet Status</h3>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      color: '#F3F4F6'
                    }}
                    itemStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-medium text-gray-600 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-avis-black">{totalVehicles}</span>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total</span>
              </div>
            </div>
          </motion.div>

          {/* Exchange Rates Card */}
          <motion.div variants={itemVariants} className="bg-avis-darkgray p-6 rounded-xl shadow-sm border border-avis-darkgray">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">Exchange Rates</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Source: Bank of Zambia</p>
                </div>
              </div>
              <motion.button 
                onClick={fetchExchangeRates}
                disabled={isLoading}
                animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors group disabled:opacity-50"
              >
                <FaSync className="text-gray-400 text-xs group-hover:text-white transition-colors" />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
              <span>Currency</span>
              <span className="text-right">Buy</span>
              <span className="text-right">Sell</span>
            </div>

            <div className="space-y-1 max-h-[130px] overflow-y-auto custom-scrollbar pr-1">
              {exchangeRates.length === 0 ? (
                <p className="text-center text-gray-400 text-xs py-4">Loading rates...</p>
              ) : (
                exchangeRates.map((rate, index) => (
                  <div key={index} className="grid grid-cols-3 items-center p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rate.currency}</span>
                    </div>
                    <div className="text-right font-mono text-sm font-medium text-gray-300">
                      {rate.buy.toFixed(4)}
                    </div>
                    <div className="text-right font-mono text-sm font-bold text-white">
                      {rate.sell.toFixed(4)}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-600 text-center">
              <p className="text-[10px] text-gray-400">
                Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Dashboard

