import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, LogIn, CreditCard, Building2, Shield, BarChart3, Users, FileText, Clock } from 'lucide-react';

const CollegeLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    collegeId: '',
    email: '',
    password: '',
    rememberDevice: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('College login submitted:', formData);
    // Handle login logic here
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">My Dream Institution</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Need an account?</span>
              <Link to="/contact" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Form */}
              <div className="p-8 lg:p-12">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">College Portal</h1>
                    <p className="text-gray-600">Welcome back! Access your institution dashboard</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* College ID Field */}
                    <div>
                      <label htmlFor="collegeId" className="block text-sm font-medium text-gray-700 mb-2">
                        College ID / Institution Code
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="collegeId"
                          name="collegeId"
                          value={formData.collegeId}
                          onChange={handleInputChange}
                          placeholder="Enter your college ID"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Official Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter institutional email"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Form Options */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="rememberDevice"
                          checked={formData.rememberDevice}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember this device</span>
                      </label>
                      <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Access Portal</span>
                    </button>
                  </form>

                  {/* Footer Links */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                      New to our platform? <Link to="/contact" className="text-green-600 hover:text-green-700">Contact us for setup</Link>
                    </p>
                    
                    <div className="border-t pt-6">
                      <p className="text-gray-600 mb-4">Looking for a different portal?</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          to="/student-login"
                          className="flex items-center justify-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <GraduationCap className="w-4 h-4" />
                          <span>Student Login</span>
                        </Link>
                        <Link
                          to="/admin-login"
                          className="flex items-center justify-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Login</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Info */}
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 lg:p-12 text-white">
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold mb-4">Manage Admissions</h2>
                  <p className="text-green-100 mb-8">
                    Access your comprehensive college dashboard to manage applications, review candidates, and streamline your admission process.
                  </p>

                  {/* Dashboard Features */}
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Application Management</h3>
                        <p className="text-green-100 text-sm">Review and process student applications efficiently</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Analytics & Reports</h3>
                        <p className="text-green-100 text-sm">Track admission statistics and generate reports</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Student Database</h3>
                        <p className="text-green-100 text-sm">Access comprehensive student profiles and data</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Real-time Processing</h3>
                        <p className="text-green-100 text-sm">Process applications and send updates instantly</p>
                      </div>
                    </div>
                  </div>

                  {/* Platform Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">500+</div>
                      <div className="text-green-100 text-sm">Partner Colleges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">50K+</div>
                      <div className="text-green-100 text-sm">Applications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">99.9%</div>
                      <div className="text-green-100 text-sm">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">24/7</div>
                      <div className="text-green-100 text-sm">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 sm:mb-0">
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
            <p className="text-gray-600 text-sm">© 2024 My Dream Institution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CollegeLogin;
