import React from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'

// Fleet Utilization Chart
export const FleetUtilizationChart = () => {
  const data = [
    { month: 'Aug', Active: 7, Maintenance: 1 },
    { month: 'Sep', Active: 6, Maintenance: 2 },
    { month: 'Oct', Active: 7, Maintenance: 1 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-avis-black mb-4">Fleet Utilization Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
          <Legend />
          <Line type="monotone" dataKey="Active" stroke="#E41E26" strokeWidth={2} />
          <Line type="monotone" dataKey="Maintenance" stroke="#FFA500" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

// Vehicle Status Distribution
export const VehicleStatusChart = () => {
  const data = [
    { name: 'Active', value: 6, color: '#22C55E' },
    { name: 'In Service', value: 1, color: '#3B82F6' },
    { name: 'Maintenance', value: 1, color: '#F59E0B' },
    { name: 'Retired', value: 1, color: '#EF4444' },
  ]

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

// Fuel Consumption Chart
export const FuelConsumptionChart = () => {
  const data = [
    { week: 'Week 1', consumption: 320 },
    { week: 'Week 2', consumption: 280 },
    { week: 'Week 3', consumption: 410 },
    { week: 'Week 4', consumption: 350 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-avis-black mb-4">Weekly Fuel Consumption</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
          <Bar dataKey="consumption" fill="#E41E26" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
