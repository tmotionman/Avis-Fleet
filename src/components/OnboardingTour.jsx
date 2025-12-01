import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Car, Users, ClipboardList, BarChart3, HelpCircle, LayoutDashboard } from 'lucide-react'

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Avis Fleet! 👋',
    description: 'Let us show you around the system. This quick tour will help you get started with managing your fleet efficiently.',
    icon: Car,
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Your dashboard gives you a quick overview of your fleet status, including total vehicles, availability, and recent activity.',
    icon: LayoutDashboard,
    position: 'center',
    highlight: 'dashboard',
  },
  {
    id: 'fleet',
    title: 'Fleet Management',
    description: 'Add, edit, and manage all your vehicles here. Track status, location, and maintenance schedules for each vehicle.',
    icon: Car,
    position: 'center',
    highlight: 'fleet',
  },
  {
    id: 'assignments',
    title: 'Fleet Assignments',
    description: 'Assign vehicles to clients, track active rentals, and manage returns. Keep your fleet utilization optimized.',
    icon: ClipboardList,
    position: 'center',
    highlight: 'assignment',
  },
  {
    id: 'clients',
    title: 'Client Management',
    description: 'Manage your client database. Add new clients, update contact information, and track their rental history.',
    icon: Users,
    position: 'center',
    highlight: 'clients',
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    description: 'Generate detailed reports for your fleet, clients, and assignments. Export to PDF or CSV for your records.',
    icon: BarChart3,
    position: 'center',
    highlight: 'reports',
  },
  {
    id: 'help',
    title: 'Need Help?',
    description: 'Visit the Help section anytime for guides, FAQs, and support contact information. You can also restart this tour from there.',
    icon: HelpCircle,
    position: 'center',
    highlight: 'help',
  },
  {
    id: 'complete',
    title: "You're All Set! 🎉",
    description: "That's it! You're ready to start managing your fleet. Click 'Get Started' to begin. You can always access help from the sidebar.",
    icon: Car,
    position: 'center',
  },
]

const OnboardingTour = ({ isOpen, onClose, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const step = tourSteps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === tourSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onClose()
    } else {
      // Navigate to the highlighted page if specified
      const nextStep = tourSteps[currentStep + 1]
      if (nextStep.highlight && onNavigate) {
        onNavigate(nextStep.highlight)
      }
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      const prevStep = tourSteps[currentStep - 1]
      if (prevStep.highlight && onNavigate) {
        onNavigate(prevStep.highlight)
      }
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  // Reset step when tour opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      if (onNavigate) {
        onNavigate('dashboard')
      }
    }
  }, [isOpen, onNavigate])

  if (!isOpen) return null

  const IconComponent = step.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Darkened Background Overlay - No Blur */}
          <div 
            className="absolute inset-0 bg-black/70"
            onClick={handleSkip}
          />

          {/* Tour Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            {/* Grey Card - Same UI color as sidebar */}
            <div className="bg-[#262626] rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
              {/* Close Button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Card Content */}
              <div className="p-8">
                {/* Icon */}
                <div className="w-16 h-16 bg-avis-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent size={32} className="text-avis-red" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white text-center mb-3">
                  {step.title}
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-center leading-relaxed mb-8">
                  {step.description}
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {tourSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const targetStep = tourSteps[index]
                        if (targetStep.highlight && onNavigate) {
                          onNavigate(targetStep.highlight)
                        }
                        setCurrentStep(index)
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep 
                          ? 'w-8 bg-avis-red' 
                          : index < currentStep 
                            ? 'bg-avis-red/50' 
                            : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  {!isFirstStep && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePrev}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-gray-300 border border-gray-600 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                    >
                      <ChevronLeft size={18} />
                      Back
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-avis-red text-white rounded-xl hover:bg-red-700 transition-colors font-medium ${
                      isFirstStep ? 'w-full' : ''
                    }`}
                  >
                    {isLastStep ? 'Get Started' : isFirstStep ? "Let's Go" : 'Next'}
                    {!isLastStep && <ChevronRight size={18} />}
                  </motion.button>
                </div>

                {/* Skip Link */}
                {!isLastStep && (
                  <button
                    onClick={handleSkip}
                    className="w-full mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    Skip tour
                  </button>
                )}
              </div>

              {/* Step Counter */}
              <div className="bg-[#1f1f1f] px-8 py-3 text-center">
                <span className="text-sm text-gray-400">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OnboardingTour
