import React, { useState, useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import fuelData from '../data/fuel.json'

const FuelManagement = () => {
  const [fuel] = useState(fuelData)

  // Calculate stats
  const totalSpent = useMemo(() => fuel.reduce((sum, f) => sum + f.amount, 0), [fuel])
  const totalLiters = useMemo(() => fuel.reduce((sum, f) => sum + f.liters, 0), [fuel])
  const avgPricePerLiter = useMemo(() => (totalSpent / totalLiters).toFixed(2), [totalSpent, totalLiters])

  // Monthly trend data
  const monthlyTrend = [
    { month: 'Week 1', spend: 1250, liters: 140 },
    { month: 'Week 2', spend: 980, liters: 110 },
    { month: 'Week 3', spend: 1450, liters: 160 },
    { month: 'Week 4', spend: 1120, liters: 125 },
  ]

  // Vehicle consumption
  const vehicleConsumption = [
    { name: 'VEH001', consumption: 110 },
    { name: 'VEH002', consumption: 95 },
    { name: 'VEH003', consumption: 128 },
    { name: 'VEH004', consumption: 105 },
    { name: 'VEH007', consumption: 115 },
    { name: 'VEH008', consumption: 98 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-avis-black">Fuel Management</h1>
        <p className="text-gray-500 mt-1">Monitor fuel consumption and expenses</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <p className="text-gray-500 text-sm font-medium">Total Spent</p>
          <h3 className="text-3xl font-bold text-avis-black mt-2">R{totalSpent.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</h3>
          <p className="text-xs text-gray-400 mt-2">This month</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <p className="text-gray-500 text-sm font-medium">Total Liters</p>
          <h3 className="text-3xl font-bold text-avis-black mt-2">{totalLiters} L</h3>
          <p className="text-xs text-gray-400 mt-2">Consumed</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <p className="text-gray-500 text-sm font-medium">Avg Price/L</p>
          <h3 className="text-3xl font-bold text-avis-black mt-2">R{avgPricePerLiter}</h3>
          <p className="text-xs text-gray-400 mt-2">Per liter</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <p className="text-gray-500 text-sm font-medium">Active Cards</p>
          <h3 className="text-3xl font-bold text-avis-black mt-2">{new Set(fuel.map(f => f.cardNumber)).size}</h3>
          <p className="text-xs text-gray-400 mt-2">Fuel cards</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-avis-black mb-4">Weekly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="spend" stroke="#E41E26" strokeWidth={2} name="Spend (R)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Consumption vs Spend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-avis-black mb-4">Weekly Liters Used</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="liters" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Liters (L)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Vehicle Consumption */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-avis-black mb-4">Vehicle Fuel Consumption</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vehicleConsumption}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="consumption" fill="#E41E26" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-avis-black mb-4">Recent Fuel Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Liters</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount (R)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
              </tr>
            </thead>
            <tbody>
              {fuel.slice(0, 8).map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-avis-black">{item.vehicleNo}</td>
                  <td className="px-6 py-4 text-gray-700">{item.date}</td>
                  <td className="px-6 py-4 text-gray-700">{item.liters} L</td>
                  <td className="px-6 py-4 font-medium text-avis-black">R{item.amount.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</td>
                  <td className="px-6 py-4 text-gray-700">{item.location}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FuelManagement
