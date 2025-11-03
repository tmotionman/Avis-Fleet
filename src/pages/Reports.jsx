import React, { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import vehiclesData from '../data/vehicles.json'
import maintenanceData from '../data/maintenance.json'
import fuelData from '../data/fuel.json'

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('fleet')

  const exportToCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(obj => Object.values(obj).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const FleetReport = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Fleet Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Total Vehicles</p>
            <p className="text-2xl font-bold text-avis-black mt-2">{vehiclesData.length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Active Vehicles</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{vehiclesData.filter(v => v.status === 'Active').length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Average Mileage</p>
            <p className="text-2xl font-bold text-avis-black mt-2">{(vehiclesData.reduce((sum, v) => sum + v.mileage, 0) / vehiclesData.length).toLocaleString('en-ZA', { maximumFractionDigits: 0 })} km</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Fleet Age (Avg)</p>
            <p className="text-2xl font-bold text-avis-black mt-2">{Math.round(vehiclesData.reduce((sum, v) => sum + (2025 - v.year), 0) / vehiclesData.length)} years</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Fleet Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Registration</th>
                <th className="px-4 py-2 text-left">Model</th>
                <th className="px-4 py-2 text-left">Mileage</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehiclesData.map((v, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{v.registrationNo}</td>
                  <td className="px-4 py-2">{v.model}</td>
                  <td className="px-4 py-2">{v.mileage} km</td>
                  <td className="px-4 py-2"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{v.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToCSV(vehiclesData, 'fleet-report.csv')}
        className="btn-primary flex items-center gap-2"
      >
        <Download size={20} />
        Export Fleet Report to CSV
      </motion.button>
    </motion.div>
  )

  const MaintenanceReport = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Maintenance Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Total Records</p>
            <p className="text-2xl font-bold text-avis-black mt-2">{maintenanceData.length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold text-avis-red mt-2">R{maintenanceData.reduce((sum, m) => sum + m.cost, 0).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Pending Services</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{maintenanceData.filter(m => m.status === 'Scheduled').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Maintenance Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Vehicle</th>
                <th className="px-4 py-2 text-left">Service Type</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Cost</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceData.map((m, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{m.vehicleNo}</td>
                  <td className="px-4 py-2">{m.serviceType}</td>
                  <td className="px-4 py-2">{m.date}</td>
                  <td className="px-4 py-2">R{m.cost}</td>
                  <td className="px-4 py-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToCSV(maintenanceData, 'maintenance-report.csv')}
        className="btn-primary flex items-center gap-2"
      >
        <Download size={20} />
        Export Maintenance Report to CSV
      </motion.button>
    </motion.div>
  )

  const FuelReport = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Fuel Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Total Spent</p>
            <p className="text-2xl font-bold text-avis-black mt-2">R{fuelData.reduce((sum, f) => sum + f.amount, 0).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Total Liters</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{fuelData.reduce((sum, f) => sum + f.liters, 0)} L</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Avg Price/L</p>
            <p className="text-2xl font-bold text-avis-black mt-2">R{(fuelData.reduce((sum, f) => sum + f.amount, 0) / fuelData.reduce((sum, f) => sum + f.liters, 0)).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Fuel Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Vehicle</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Liters</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {fuelData.map((f, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{f.vehicleNo}</td>
                  <td className="px-4 py-2">{f.date}</td>
                  <td className="px-4 py-2">{f.liters} L</td>
                  <td className="px-4 py-2">R{f.amount}</td>
                  <td className="px-4 py-2">{f.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToCSV(fuelData, 'fuel-report.csv')}
        className="btn-primary flex items-center gap-2"
      >
        <Download size={20} />
        Export Fuel Report to CSV
      </motion.button>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-avis-black">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and export fleet management reports</p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { id: 'fleet', label: 'Fleet Report', icon: '🚗' },
          { id: 'maintenance', label: 'Maintenance Report', icon: '🔧' },
          { id: 'fuel', label: 'Fuel Report', icon: '⛽' },
        ].map(report => (
          <motion.button
            key={report.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedReport(report.id)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedReport === report.id
                ? 'border-avis-red bg-red-50'
                : 'border-gray-200 bg-white hover:border-avis-red'
            }`}
          >
            <div className="text-3xl mb-2">{report.icon}</div>
            <h3 className={`font-semibold ${selectedReport === report.id ? 'text-avis-red' : 'text-avis-black'}`}>
              {report.label}
            </h3>
          </motion.button>
        ))}
      </div>

      {/* Report Content */}
      {selectedReport === 'fleet' && <FleetReport />}
      {selectedReport === 'maintenance' && <MaintenanceReport />}
      {selectedReport === 'fuel' && <FuelReport />}
    </motion.div>
  )
}

export default Reports
