import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'
import vehiclesData from '../data/vehicles.json'
import maintenanceData from '../data/maintenance.json'
import fuelData from '../data/fuel.json'

// Fleet Utilization Chart - Shows vehicle status distribution
export const FleetUtilizationChart = () => {
  // Count vehicles by status
  const statusCounts = vehiclesData.reduce((acc, vehicle) => {
    const status = vehicle.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // Create chart data with current status distribution
  const data = [
    { 
      month: 'Current',
      Active: statusCounts['Active'] || 0,
      'In Service': statusCounts['In Service'] || 0,
      'Maintenance': statusCounts['Maintenance'] || 0,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-avis-black mb-4">Fleet Status Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
          <Legend />
          <Bar dataKey="Active" fill="#E41E26" radius={[8, 8, 0, 0]} />
          <Bar dataKey="In Service" fill="#3B82F6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Maintenance" fill="#FFA500" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// Vehicle Status Distribution
export const VehicleStatusChart = () => {
  // Count vehicles by status
  const statusCounts = vehiclesData.reduce((acc, vehicle) => {
    const status = vehicle.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const statusColors = {
    'Active': '#22C55E',
    'In Service': '#3B82F6',
    'Maintenance': '#F59E0B',
    'Retired': '#EF4444',
  }

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status] || '#9CA3AF',
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-avis-black mb-4">Vehicle Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name} (${value})`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// Fuel Consumption Chart - Shows total fuel spent in past week
export const FuelConsumptionChart = () => {
  // Group fuel expenses by date (simplified to 4 recent groups)
  const sortedFuel = [...fuelData].sort((a, b) => new Date(b.date) - new Date(a.date))
  
  const dataByWeek = {}
  sortedFuel.forEach(fuel => {
    const date = new Date(fuel.date)
    const weekNum = Math.floor((new Date() - date) / (7 * 24 * 60 * 60 * 1000)) + 1
    const label = weekNum === 1 ? 'This Week' : weekNum === 2 ? 'Last Week' : `${weekNum} weeks ago`
    
    if (!dataByWeek[label]) {
      dataByWeek[label] = 0
    }
    dataByWeek[label] += fuel.amount
  })

  // Create data array with up to 4 weeks
  const data = Object.entries(dataByWeek)
    .slice(0, 4)
    .map(([week, consumption]) => ({
      week,
      consumption: Math.round(consumption),
    }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-avis-black mb-4">Fuel Expenses (ZAR)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} formatter={(value) => `R${value.toLocaleString()}`} />
          <Bar dataKey="consumption" fill="#E41E26" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
