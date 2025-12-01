import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CustomSelect = ({ label, value, onChange, options, placeholder, icon: Icon, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // Check if click is inside the portal content (which is not in containerRef)
        // We can't easily check portal ref here without another ref.
        // But since the portal is rendered separately, we might need a ref for it too.
        // However, usually clicking outside the trigger closes it.
        // If we click inside the dropdown, we handle it in the option click.
        // But if we click the scrollbar of the dropdown?
        // We need to ignore clicks inside the dropdown.
      }
    }
    // document.addEventListener('mousedown', handleClickOutside)
    // return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Better click outside handling for portal
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!isOpen) return
      
      // If clicked inside the trigger, toggle handles it (or we ignore here)
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return
      }

      // If clicked inside the dropdown (we need a ref for the dropdown)
      // Since we don't have the ref in this scope easily without state, 
      // let's use a data attribute or class check as a simple workaround, 
      // or just rely on the fact that clicking an option closes it.
      // But clicking the scrollbar shouldn't close it.
      
      if (e.target.closest('.custom-select-dropdown')) {
        return
      }

      setIsOpen(false)
    }

    window.addEventListener('mousedown', handleGlobalClick)
    return () => window.removeEventListener('mousedown', handleGlobalClick)
  }, [isOpen])

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  const getOptionValue = (option) => {
    if (option === null || option === undefined) return ''
    return typeof option === 'object' ? option.value : option
  }

  const getOptionLabel = (option) => {
    if (option === null || option === undefined) return ''
    return typeof option === 'object' ? option.label : option
  }

  const selectedOption = options.find(opt => getOptionValue(opt) === value)
  
  const displayValue = selectedOption 
    ? getOptionLabel(selectedOption)
    : placeholder || 'Select option'

  return (
    <div className={`relative ${className || ''}`} ref={containerRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-2 border rounded-lg cursor-pointer flex items-center justify-between bg-white transition-all duration-200
          ${isOpen ? 'border-avis-red ring-2 ring-avis-red/20' : 'border-gray-300 hover:border-avis-red/50'}
        `}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon size={18} className="text-gray-400" />}
          <span className={`truncate ${!selectedOption && placeholder ? 'text-gray-400' : 'text-gray-700'}`}>
            {displayValue}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-avis-red' : ''}`} 
        />
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: coords.width,
                zIndex: 9999
              }}
              className="custom-select-dropdown bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-auto py-1 custom-scrollbar"
            >
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">No options</div>
              ) : (
                options.map((option, index) => {
                  const optValue = getOptionValue(option)
                  const optLabel = getOptionLabel(option)
                  const isSelected = optValue === value

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        onChange(optValue)
                        setIsOpen(false)
                      }}
                      className={`
                        px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors
                        ${isSelected ? 'bg-red-50 text-avis-red font-medium' : 'text-gray-700 hover:bg-gray-50'}
                      `}
                    >
                      <span>{optLabel}</span>
                      {isSelected && <Check size={16} className="text-avis-red" />}
                    </div>
                  )
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default CustomSelect
