import React from 'react'
import { motion } from 'framer-motion'

// KPI Card Component
const KPICard = ({ icon, label, value, unit, trend, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-bold text-avis-black mt-2">{value}</h3>
          {unit && <p className="text-xs text-gray-400 mt-1">{unit}</p>}
        </div>
        <div className={`p-3 rounded-lg text-xl`} style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </motion.div>
  )
}

export default KPICard
