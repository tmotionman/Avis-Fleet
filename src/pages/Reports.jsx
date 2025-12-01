import React, { useState } from 'react'
import { Download, Car, Users, Calendar, Briefcase, Link2, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import clientsData from '../data/clients.json'
import KPICard from '../components/KPICard'
import avisLogoWebp from '../assets/Avis.webp'

const Reports = ({ vehicles, assignments = [] }) => {
  const [selectedReport, setSelectedReport] = useState('fleet')
  
  // Use vehicles from props or empty array as fallback
  const vehiclesData = vehicles || []

  const exportToCSV = (data, filename) => {
    // Exclude certain columns from fleet export
    const excludeColumns = filename === 'fleet-report.csv' 
      ? ['lastServiceDate', 'fuelLevel', 'fuelType', 'mileage'] 
      : []
    
    const headers = Object.keys(data[0]).filter(key => !excludeColumns.includes(key))
    const csv = [
      headers.join(','),
      ...data.map(obj => headers.map(key => obj[key]).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.setAttribute("crossOrigin", "anonymous")
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL("image/png")
        resolve(dataURL)
      }
      img.onerror = error => {
        reject(error)
      }
      img.src = url
    })
  }

  const exportToPDF = async (title, data, columns) => {
    const doc = new jsPDF()
    
    // Brand Colors
    const avisRed = '#E41E26'
    const avisBlack = '#000000'
    const avisDarkGray = '#4B4B4B'
    
    // Load Logo
    try {
      const logoBase64 = await getBase64ImageFromURL(avisLogoWebp)
      doc.addImage(logoBase64, 'PNG', 14, 10, 40, 12) // Adjust dimensions as needed
    } catch (error) {
      console.error("Error loading logo:", error)
    }

    // Header
    doc.setFontSize(22)
    doc.setTextColor(avisRed)
    doc.text(title, 14, 35)
    
    // Subtitle / Date
    doc.setFontSize(10)
    doc.setTextColor(avisDarkGray)
    doc.text(`Generated on ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} at ${new Date().toLocaleTimeString()}`, 14, 42)
    
    let lastY = 50

    // Handle single table vs multi-section
    // If columns is provided, it's a single table. Otherwise data is treated as sections array.
    const sections = columns ? [{ title: '', data, columns }] : data

    for (const section of sections) {
      if (section.data.length === 0) continue

      if (section.title) {
        // Check if we need a page break for the title
        if (lastY > doc.internal.pageSize.height - 40) {
          doc.addPage()
          lastY = 20
        }
        
        doc.setFontSize(14)
        doc.setTextColor(avisBlack)
        doc.text(section.title, 14, lastY)
        lastY += 5
      }

      autoTable(doc, {
        startY: lastY,
        head: [section.columns.map(col => col.label)],
        body: section.data.map(row => section.columns.map(col => row[col.key] || '—')),
        headStyles: {
          fillColor: avisRed,
          textColor: '#FFFFFF',
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: '#F5F5F5',
        },
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 3,
          textColor: avisDarkGray,
        },
        margin: { top: 20 },
      })
      
      lastY = doc.lastAutoTable.finalY + 15
    }
    
    // Footer & Watermark
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      
      // Watermark
      doc.saveGraphicsState()
      doc.setGState(new doc.GState({ opacity: 0.1 }))
      doc.setFontSize(60)
      doc.setTextColor(150)
      doc.text("AVIS FLEET", doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, {
        align: 'center',
        angle: 45
      })
      doc.restoreGraphicsState()

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text('AVIS Fleet Management System • Report generated automatically', 14, doc.internal.pageSize.height - 10)
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' })
    }
    
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`)
  }

  const FleetReport = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-avis-black mb-4">Fleet Report Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Vehicles</p>
              <p className="text-3xl font-bold text-white mt-1">{vehiclesData.length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-avis-red"></div>
          </div>
          <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Available Vehicles</p>
              <p className="text-3xl font-bold text-white mt-1">{vehiclesData.filter(v => v.status === 'Available').length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-avis-red"></div>
          </div>
          <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">On Rent</p>
              <p className="text-3xl font-bold text-white mt-1">{vehiclesData.filter(v => v.status === 'On Rent').length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-avis-red"></div>
          </div>
          <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Fleet Age (Avg)</p>
              <p className="text-3xl font-bold text-white mt-1">{vehiclesData.length > 0 ? Math.round(vehiclesData.reduce((sum, v) => sum + (2025 - v.year), 0) / vehiclesData.length) : 0} <span className="text-xs">years</span></p>
            </div>
            <div className="w-3 h-3 rounded-full bg-avis-red"></div>
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
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehiclesData.map((v, i) => (
                <tr key={i} className="border-b">
                  <td className="px-4 py-2">{v.registrationNo}</td>
                  <td className="px-4 py-2">{v.model}</td>
                  <td className="px-4 py-2">{v.year}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      v.status === 'Available' ? 'bg-green-100 text-green-700' :
                      v.status === 'On Rent' ? 'bg-blue-100 text-blue-700' :
                      v.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => exportToCSV(vehiclesData, 'fleet-report.csv')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <Download size={14} />
          Export CSV
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => exportToPDF('Fleet Report', vehiclesData, [
            { key: 'registrationNo', label: 'Registration' },
            { key: 'model', label: 'Model' },
            { key: 'year', label: 'Year' },
            { key: 'status', label: 'Status' },
            { key: 'location', label: 'Location' },
          ])}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <FileText size={14} />
          Export PDF
        </motion.button>
      </div>
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
          <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Clients</p>
              <p className="text-3xl font-bold text-white mt-1">{clientsData.length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-avis-red"></div>
          </div>
          <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Active Clients</p>
              <p className="text-3xl font-bold text-white mt-1">{clientsData.filter(c => c.status === 'Active').length}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-avis-red"></div>
          </div>
          <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Industries</p>
              <p className="text-3xl font-bold text-white mt-1">{new Set(clientsData.map(c => c.industry)).size}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-avis-red"></div>
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

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => exportToCSV(clientsData, 'clients-report.csv')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <Download size={14} />
          Export CSV
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => exportToPDF('Clients Report', clientsData, [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'industry', label: 'Industry' },
            { key: 'city', label: 'City' },
            { key: 'status', label: 'Status' },
          ])}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <FileText size={14} />
          Export PDF
        </motion.button>
      </div>
    </motion.div>
  )

  const AssignmentReport = () => {
    const assignmentsData = assignments || []
    const activeAssignments = assignmentsData.filter(a => !a.returnDate)
    const completedAssignments = assignmentsData.filter(a => a.returnDate)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-avis-black mb-4">Fleet Assignment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Assignments</p>
                <p className="text-3xl font-bold text-white mt-1">{assignmentsData.length}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-avis-red"></div>
            </div>
            <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Active Assignments</p>
                <p className="text-3xl font-bold text-white mt-1">{activeAssignments.length}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-avis-red"></div>
            </div>
            <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-bold text-white mt-1">{completedAssignments.length}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-avis-red"></div>
            </div>
            <div className="bg-avis-darkgray rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Completion Rate</p>
                <p className="text-3xl font-bold text-white mt-1">{assignmentsData.length > 0 ? Math.round((completedAssignments.length / assignmentsData.length) * 100) : 0}%</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-avis-red"></div>
            </div>
          </div>
        </div>

        {activeAssignments.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-avis-black mb-4">Active Assignments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Vehicle</th>
                    <th className="px-4 py-2 text-left">Client</th>
                    <th className="px-4 py-2 text-left">Purpose</th>
                    <th className="px-4 py-2 text-left">Assigned Date</th>
                    <th className="px-4 py-2 text-left">Start Date</th>
                    <th className="px-4 py-2 text-left">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activeAssignments.map((a, i) => {
                    const vehicle = vehiclesData.find(v => v.id === a.vehicleId)
                    return (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-2 font-medium">{vehicle?.registrationNo || 'N/A'}</td>
                        <td className="px-4 py-2">{a.clientName || 'N/A'}</td>
                        <td className="px-4 py-2">{a.purpose || '—'}</td>
                        <td className="px-4 py-2">{a.assignedDate}</td>
                        <td className="px-4 py-2">{a.startDate || '—'}</td>
                        <td className="px-4 py-2">{a.endDate || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {completedAssignments.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-avis-black mb-4">Completed Assignments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Vehicle</th>
                    <th className="px-4 py-2 text-left">Client</th>
                    <th className="px-4 py-2 text-left">Purpose</th>
                    <th className="px-4 py-2 text-left">Assigned Date</th>
                    <th className="px-4 py-2 text-left">Return Date</th>
                    <th className="px-4 py-2 text-left">Duration (Days)</th>
                  </tr>
                </thead>
                <tbody>
                  {completedAssignments.map((a, i) => {
                    const vehicle = vehiclesData.find(v => v.id === a.vehicleId)
                    const duration = a.endDate
                      ? Math.max(0, Math.ceil((new Date(a.endDate) - new Date(a.assignedDate)) / (1000 * 60 * 60 * 24)))
                      : 'N/A'
                    return (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-2 font-medium">{vehicle?.registrationNo || 'N/A'}</td>
                        <td className="px-4 py-2">{a.clientName || 'N/A'}</td>
                        <td className="px-4 py-2">{a.purpose || '—'}</td>
                        <td className="px-4 py-2">{a.assignedDate}</td>
                        <td className="px-4 py-2">{a.returnDate}</td>
                        <td className="px-4 py-2">{duration}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {assignmentsData.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No assignments yet</p>
          </div>
        )}

        {assignmentsData.length > 0 && (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const exportData = assignmentsData.map(a => {
                  const vehicle = vehiclesData.find(v => v.id === a.vehicleId)
                  return {
                    vehicleReg: vehicle?.registrationNo || 'N/A',
                    vehicleModel: vehicle?.model || 'N/A',
                    clientName: a.clientName || 'N/A',
                    purpose: a.purpose || '—',
                    assignedDate: a.assignedDate,
                    startDate: a.startDate || '—',
                    endDate: a.endDate || '—',
                    returnDate: a.returnDate || 'Active',
                  }
                })
                exportToCSV(exportData, 'fleet-assignments-report.csv')
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Download size={14} />
              Export CSV
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const activeData = activeAssignments.map(a => {
                  const vehicle = vehiclesData.find(v => v.id === a.vehicleId)
                  return {
                    vehicleReg: vehicle?.registrationNo || 'N/A',
                    clientName: a.clientName || 'N/A',
                    purpose: a.purpose || '—',
                    assignedDate: a.assignedDate,
                    startDate: a.startDate || '—',
                    endDate: a.endDate || '—',
                  }
                })

                const completedData = completedAssignments.map(a => {
                  const vehicle = vehiclesData.find(v => v.id === a.vehicleId)
                  const duration = a.endDate
                      ? Math.max(0, Math.ceil((new Date(a.endDate) - new Date(a.assignedDate)) / (1000 * 60 * 60 * 24)))
                      : 'N/A'
                  return {
                    vehicleReg: vehicle?.registrationNo || 'N/A',
                    clientName: a.clientName || 'N/A',
                    purpose: a.purpose || '—',
                    assignedDate: a.assignedDate,
                    returnDate: a.returnDate,
                    duration: duration
                  }
                })

                const sections = [
                  {
                    title: 'Active Assignments',
                    data: activeData,
                    columns: [
                      { key: 'vehicleReg', label: 'Vehicle' },
                      { key: 'clientName', label: 'Client' },
                      { key: 'purpose', label: 'Purpose' },
                      { key: 'assignedDate', label: 'Assigned Date' },
                      { key: 'startDate', label: 'Start Date' },
                      { key: 'endDate', label: 'End Date' },
                    ]
                  },
                  {
                    title: 'Completed Assignments',
                    data: completedData,
                    columns: [
                      { key: 'vehicleReg', label: 'Vehicle' },
                      { key: 'clientName', label: 'Client' },
                      { key: 'purpose', label: 'Purpose' },
                      { key: 'assignedDate', label: 'Assigned Date' },
                      { key: 'returnDate', label: 'Return Date' },
                      { key: 'duration', label: 'Duration (Days)' },
                    ]
                  }
                ]

                exportToPDF('Fleet Assignments Report', sections)
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <FileText size={14} />
              Export PDF
            </motion.button>
          </div>
        )}
      </motion.div>
    )
  }

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
          { id: 'assignments', label: 'Fleet Assignments' },
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
      {selectedReport === 'assignments' && <AssignmentReport />}
      {selectedReport === 'clients' && <ClientsReport />}
    </motion.div>
  )
}

export default Reports
