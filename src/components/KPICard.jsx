import React from 'react'
import { motion } from 'framer-motion'

// KPI Card Component
const KPICard = ({ icon, label, value, unit, trend, color, size = 'default' }) => {
  const isSmall = size === 'small'
  
  return (
    <motion.div
      className={`bg-transparent ${isSmall ? 'p-3' : 'p-6'} rounded-xl border border-gray-300 transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-gray-600 ${isSmall ? 'text-xs' : 'text-sm'} font-medium`}>{label}</p>
          <h3 className={`${isSmall ? 'text-xl' : 'text-3xl'} font-bold text-avis-black mt-2`}>{value}</h3>
          {unit && <p className="text-xs text-gray-500 mt-1">{unit}</p>}
        </div>
        <div className={`${isSmall ? 'p-2 text-lg' : 'p-3 text-xl'} rounded-lg bg-gray-100 text-avis-darkgray`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className={`${isSmall ? 'mt-2' : 'mt-4'} flex items-center gap-2`}>
          <span className="text-sm font-bold text-avis-black">
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </motion.div>
  )
}

export default KPICard
