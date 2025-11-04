import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import bg1600Avif from '../../assets/bg-1600.avif'
import bg800Avif from '../../assets/bg-800.avif'
import bg400Avif from '../../assets/bg-400.avif'
import bg1600Webp from '../../assets/bg-1600.webp'
import bg800Webp from '../../assets/bg-800.webp'
import bg400Webp from '../../assets/bg-400.webp'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate auth delay
    setTimeout(() => {
      if (!email || !password) {
        setError('Please enter both email and password')
        setIsLoading(false)
        return
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address')
        setIsLoading(false)
        return
      }

      // Mock successful login
      onLogin({
        id: 'USR001',
        name: email.split('@')[0],
        email: email,
        role: 'Admin',
      })
    }, 1000)
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

      {/* Mobile: Branding overlay on image header */}
      <div className="lg:hidden absolute top-1/4 left-0 right-0 z-20 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-avis-red">AVIS</span>
          <span className="text-white"> | Fleet</span>
        </h1>
      </div>

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
              <h2 className="text-3xl font-bold text-avis-black mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your Avis Fleet account</p>
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

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
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
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
                  Remember me
                </label>
                <a href="#" className="text-avis-red hover:text-red-700 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-avis-red to-red-700 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-500 text-sm">New to Avis Fleet?</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSignUp(true)}
              className="w-full py-3 border-2 border-avis-red text-avis-red font-bold rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              Create Account
            </motion.button>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 font-medium mb-3">DEMO CREDENTIALS</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p>Email: <span className="font-mono font-semibold">admin@avisfleet.com</span></p>
                <p>Password: <span className="font-mono font-semibold">password123</span></p>
              </div>
            </div>
        </motion.div>
      </motion.div>

      {/* Sign Up Modal */}
      {showSignUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignUp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-avis-black mb-6">Create Account</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avis-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  I agree to the Terms of Service
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignUp(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignUp(false)
                  alert('Sign up feature coming soon!')
                }}
                className="flex-1 px-4 py-2 bg-avis-red text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Login
