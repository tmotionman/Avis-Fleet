import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { motion } from 'framer-motion'
import vehiclesData from '../data/vehicles.json'
import clientsData from '../data/clients.json'

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

  const ClientsReport = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Clients Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Total Clients</p>
            <p className="text-2xl font-bold text-avis-black mt-2">{clientsData.length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Active Clients</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{clientsData.filter(c => c.status === 'Active').length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Industries</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{new Set(clientsData.map(c => c.industry)).size}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Client Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Industry</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((c, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2">{c.industry}</td>
                  <td className="px-4 py-2">{c.city}</td>
                  <td className="px-4 py-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToCSV(clientsData, 'clients-report.csv')}
        className="btn-primary flex items-center gap-2"
      >
        <Download size={20} />
        Export Clients Report to CSV
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

      {/* Report Type Selection - Tab Style */}
      <div className="flex gap-4 border-b border-gray-200">
        {[
          { id: 'fleet', label: 'Fleet Report' },
          { id: 'clients', label: 'Clients Report' },
        ].map(report => (
          <motion.button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
              selectedReport === report.id
                ? 'text-avis-red border-avis-red'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {report.label}
          </motion.button>
        ))}
      </div>

      {/* Report Content */}
      {selectedReport === 'fleet' && <FleetReport />}
      {selectedReport === 'clients' && <ClientsReport />}
    </motion.div>
  )
}

export default Reports
