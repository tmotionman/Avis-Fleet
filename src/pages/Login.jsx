import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa'
import { usersApi } from '../lib/d1Client'
import bg1600Avif from '../../assets/bg-1600.avif'
import bg800Avif from '../../assets/bg-800.avif'
import bg400Avif from '../../assets/bg-400.avif'
import bg1600Webp from '../../assets/bg-1600.webp'
import bg800Webp from '../../assets/bg-800.webp'
import bg400Webp from '../../assets/bg-400.webp'

const Login = ({ onLogin, onSignup }) => {
  const [isSignupMode, setIsSignupMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Call login API
    usersApi.login(email, password)
      .then(userData => {
        onLogin({
          ...userData,
          isNewUser: false,
        })
      })
      .catch(err => {
        setError(err.message || 'Login failed')
        setIsLoading(false)
      })
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validate fields
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Call signup API
    usersApi.signup(name, email, password)
      .then(userData => {
        onSignup({
          ...userData,
          isNewUser: true,
        })
      })
      .catch(err => {
        setError(err.message || 'Signup failed')
        setIsLoading(false)
      })
  }

  const switchMode = () => {
    setIsSignupMode(!isSignupMode)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  const [bgLoaded, setBgLoaded] = useState(false)

  return (
    <div className="min-h-screen flex flex-col lg:flex lg:items-center lg:justify-center lg:p-4 lg:relative lg:overflow-hidden bg-white">
      {/* Desktop: Full-screen background */}
      <picture className="hidden lg:block absolute inset-0 z-0 w-full h-full">
        <source
          srcSet={`${bg1600Avif} 1600w, ${bg800Avif} 800w, ${bg400Avif} 400w`}
          type="image/avif"
        />
        <source
          srcSet={`${bg1600Webp} 1600w, ${bg800Webp} 800w, ${bg400Webp} 400w`}
          type="image/webp"
        />
        <img
          src={bg1600Webp}
          alt="Avis background"
          loading="eager"
          onLoad={() => setBgLoaded(true)}
          style={{ transform: 'scaleX(-1)' }}
          className={`absolute inset-0 z-0 w-full h-full object-cover transition-filter duration-700 ${
            bgLoaded ? 'filter-none' : 'blur-2xl grayscale'
          }`}
        />
      </picture>

      {/* Desktop: Background gradient blobs and overlay */}
      <div className="hidden lg:block absolute top-0 left-0 w-96 h-96 bg-avis-red opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="hidden lg:block absolute bottom-0 right-0 w-96 h-96 bg-avis-red opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="hidden lg:block absolute inset-0 bg-black/40 z-10"></div>

      {/* Mobile: Background image as header */}
      <picture className="lg:hidden w-full h-48 overflow-hidden relative z-0">
        <source
          srcSet={`${bg1600Avif} 1600w, ${bg800Avif} 800w, ${bg400Avif} 400w`}
          type="image/avif"
        />
        <source
          srcSet={`${bg1600Webp} 1600w, ${bg800Webp} 800w, ${bg400Webp} 400w`}
          type="image/webp"
        />
        <img
          src={bg1600Webp}
          alt="Avis background"
          loading="eager"
          onLoad={() => setBgLoaded(true)}
          style={{ transform: 'scaleX(-1)' }}
          className={`w-full h-full object-cover transition-filter duration-700 ${
            bgLoaded ? 'filter-none' : 'blur-2xl grayscale'
          }`}
        />
      </picture>

      {/* Mobile branding overlay removed per request (only visible on desktop) */}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl lg:relative lg:z-20 flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center"
      >
        {/* Left Side - Branding & Message (Desktop only) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex flex-col justify-center space-y-8"
        >
          <div>
            <div className="h-12 mb-6 flex items-center">
              <h1 className="text-3xl font-bold text-white">
                <span className="text-avis-red">AVIS</span>
                <span className="text-white"> | Fleet</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8">
              Efficiently track, maintain, and assign vehicles to your clients. Everything you need for seamless fleet management.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-avis-red"></div>
              <p className="text-gray-300">Real-time vehicle tracking</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-avis-red"></div>
              <p className="text-gray-300">Vehicle management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-avis-red"></div>
              <p className="text-gray-300">Client management</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:max-w-md bg-white/95 lg:bg-white/95 backdrop-blur-md rounded-none lg:rounded-2xl shadow-lg lg:shadow-2xl p-6 lg:p-8 border-none lg:border lg:border-gray-200 z-30"
        >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-avis-black mb-2">
                {isSignupMode ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600">
                {isSignupMode 
                  ? 'Sign up to start managing your fleet' 
                  : 'Sign in to your Avis Fleet account'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login/Signup Form */}
            <form onSubmit={isSignupMode ? handleSignup : handleLogin} className="space-y-5">
              {/* Name Field (Signup only) */}
              {isSignupMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@avisfleet.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignupMode ? 'Create a password' : 'Enter your password'}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Signup only) */}
              {isSignupMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Remember & Forgot Password (Login only) */}
              {!isSignupMode && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
                    Remember me
                  </label>
                  <a href="#" className="text-avis-red font-medium">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-avis-red text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isSignupMode ? 'Creating Account...' : 'Signing in...'}
                  </>
                ) : (
                  isSignupMode ? 'Create Account' : 'Sign In'
                )}
              </motion.button>
            </form>

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-avis-red font-semibold"
                >
                  {isSignupMode ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            {/* Terms of Service and Privacy Policy */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By {isSignupMode ? 'signing up' : 'signing in'}, you agree to our{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-avis-red font-medium underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-avis-red font-medium underline"
                >
                  Privacy Policy
                </button>
              </p>
            </div>
        </motion.div>
      </motion.div>

      {/* Terms of Service Modal */}
      {showTerms && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTerms(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-avis-black mb-6">Terms of Service</h2>
            <div className="prose prose-sm text-gray-700 space-y-4">
              <p className="text-sm"><strong>Last Updated:</strong> February 11, 2026</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">1. Acceptance of Terms</h3>
              <p className="text-sm">By accessing and using the Avis Fleet Management System, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">2. Use of Service</h3>
              <p className="text-sm">The Avis Fleet Management System is provided for authorized business use only. You agree to use the system in compliance with all applicable laws and regulations, and in accordance with Avis company policies.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">3. User Accounts</h3>
              <p className="text-sm">You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">4. Data Accuracy</h3>
              <p className="text-sm">You agree to provide accurate and complete information when using the system. Avis reserves the right to suspend accounts that contain false or misleading information.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">5. Intellectual Property</h3>
              <p className="text-sm">All content, features, and functionality of the Avis Fleet Management System are owned by Avis and are protected by international copyright, trademark, and other intellectual property laws.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">6. Limitation of Liability</h3>
              <p className="text-sm">Avis shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">7. Changes to Terms</h3>
              <p className="text-sm">Avis reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTerms(false)}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-avis-red rounded-full shadow-md transition-all duration-200"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPrivacy(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-avis-black mb-6">Privacy Policy</h2>
            <div className="prose prose-sm text-gray-700 space-y-4">
              <p className="text-sm"><strong>Last Updated:</strong> February 11, 2026</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">1. Information We Collect</h3>
              <p className="text-sm">We collect information you provide directly to us, including name, email address, and other contact information necessary for fleet management operations.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">2. How We Use Your Information</h3>
              <p className="text-sm">We use the information we collect to provide, maintain, and improve our fleet management services, process transactions, and communicate with you about your account.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">3. Information Sharing</h3>
              <p className="text-sm">We do not sell or share your personal information with third parties except as necessary to provide our services, comply with legal obligations, or protect our rights.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">4. Data Security</h3>
              <p className="text-sm">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">5. Data Retention</h3>
              <p className="text-sm">We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">6. Your Rights</h3>
              <p className="text-sm">You have the right to access, correct, or delete your personal information. You may also request a copy of your data or object to certain processing activities.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">7. Cookies and Tracking</h3>
              <p className="text-sm">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services.</p>
              
              <h3 className="text-lg font-semibold text-avis-black mt-4">8. Contact Us</h3>
              <p className="text-sm">If you have questions about this Privacy Policy, please contact us at privacy@avisfleet.com.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPrivacy(false)}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-avis-red rounded-full shadow-md transition-all duration-200"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Login
