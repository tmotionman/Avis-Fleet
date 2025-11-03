import React, { useState } from 'react'
import { motion } from 'framer-motion'
import KPICard from '../components/KPICard'
import { FaCarSide, FaCheckCircle, FaTools, FaGasPump, FaClipboardList } from 'react-icons/fa'
import { FleetUtilizationChart, VehicleStatusChart, FuelConsumptionChart } from '../components/Charts'
import vehiclesData from '../data/vehicles.json'
import maintenanceData from '../data/maintenance.json'
import fuelData from '../data/fuel.json'

const Dashboard = () => {
  // Calculate KPI values
  const totalVehicles = vehiclesData.length
  const activeVehicles = vehiclesData.filter(v => v.status === 'Active').length
  const vehiclesInMaintenance = vehiclesData.filter(v => v.status === 'Maintenance').length
  const totalFuelSpent = fuelData.reduce((sum, f) => sum + f.amount, 0)
  const pendingMaintenance = maintenanceData.filter(m => m.status === 'Scheduled').length

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
      className="p-3 md:p-6 space-y-4 md:space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-avis-black">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Avis Fleet Management System</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
        <KPICard
          icon={<FaCarSide />}
          label="Total Vehicles"
          value={totalVehicles}
          trend={5}
          color="#E41E26"
        />
        <KPICard
          icon={<FaCheckCircle />}
          label="Active Vehicles"
          value={activeVehicles}
          trend={8}
          color="#22C55E"
        />
        <KPICard
          icon={<FaTools />}
          label="In Maintenance"
          value={vehiclesInMaintenance}
          trend={-2}
          color="#F59E0B"
        />
        <KPICard
          icon={<FaGasPump />}
          label="Total Fuel Spent"
          value={`R${totalFuelSpent.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`}
          unit="This Month"
          trend={3}
          color="#3B82F6"
        />
        <KPICard
          icon={<FaClipboardList />}
          label="Pending Services"
          value={pendingMaintenance}
          trend={-5}
          color="#8B5CF6"
        />
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <FleetUtilizationChart />
        <VehicleStatusChart />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FuelConsumptionChart />
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase">Average Mileage</h3>
          <p className="text-lg md:text-2xl font-bold text-avis-black mt-2">
            {(vehiclesData.reduce((sum, v) => sum + v.mileage, 0) / vehiclesData.length).toLocaleString('en-ZA', { maximumFractionDigits: 0 })} km
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase">Avg Fuel Consumption</h3>
          <p className="text-lg md:text-2xl font-bold text-avis-black mt-2">
            {(fuelData.reduce((sum, f) => sum + f.liters, 0) / fuelData.length).toFixed(1)} L
          </p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase">Fleet Age</h3>
          <p className="text-lg md:text-2xl font-bold text-avis-black mt-2">
            {Math.round(vehiclesData.reduce((sum, v) => sum + (2025 - v.year), 0) / vehiclesData.length)} years
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
