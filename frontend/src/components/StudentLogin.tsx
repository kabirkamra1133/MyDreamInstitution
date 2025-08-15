import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StudentLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await axios.post('http://localhost:3000/api/auth/student/login', { email, password });
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'student');
      }
      console.log('Student login success:', res.data);
      // redirect or update UI as needed
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error('Student login error', err);
      alert(err?.response?.data?.error || 'Login failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <i className="fas fa-graduation-cap text-2xl" style={{ color: '#1e3a8a' }}></i>
              <span className="text-xl font-bold" style={{ color: '#1e3a8a' }}>My Dream Institution</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Don't have an account?</span>
              <Link to="/signup" className="px-4 py-2 border-2 text-white rounded-lg font-medium transition-colors"
                style={{ 
                  borderColor: '#1e3a8a',
                  backgroundColor: 'transparent',
                  color: '#1e3a8a'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e3a8a';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#1e3a8a';
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-8 min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white rounded-xl shadow-lg overflow-hidden min-h-[600px] items-center">
            {/* Left Side - Form */}
            <div className="p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <div className="text-center mb-8">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}
                  >
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Login</h1>
                  <p className="text-gray-600">Welcome back! Sign in to your student account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg transition-all"
                        style={{
                          '--tw-ring-color': '#1e3a8a'
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.target.style.outline = 'none';
                          e.target.style.borderColor = '#1e3a8a';
                          e.target.style.boxShadow = '0 0 0 2px rgba(30, 58, 138, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
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
                      <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg transition-all"
                        onFocus={(e) => {
                          e.target.style.outline = 'none';
                          e.target.style.borderColor = '#1e3a8a';
                          e.target.style.boxShadow = '0 0 0 2px rgba(30, 58, 138, 0.2)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 flex items-center justify-center transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#1e3a8a';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af';
                        }}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Form Options */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer text-sm text-gray-600">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-sm mr-2 flex items-center justify-center ${
                          formData.rememberMe 
                            ? 'text-white' 
                            : 'border-gray-300'
                        }`}
                        style={{
                          backgroundColor: formData.rememberMe ? '#1e3a8a' : 'transparent',
                          borderColor: formData.rememberMe ? '#1e3a8a' : '#d1d5db'
                        }}
                        >
                          {formData.rememberMe && <i className="fas fa-check text-xs"></i>}
                        </div>
                      </div>
                      Remember me
                    </label>
                    <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: '#1e3a8a' }}>
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 text-white py-3 rounded-lg font-semibold transition-colors"
                    style={{ backgroundColor: '#1e3a8a' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1e3a8a';
                    }}
                  >
                    <i className="fas fa-sign-in-alt"></i>
                    <span>Sign In</span>
                  </button>
                </form>

                {/* Divider */}
                <div className="my-6 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Social Login */}
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors text-gray-600">
                  <i className="fab fa-google"></i>
                  <span>Continue with Google</span>
                </button>

                {/* Footer Links */}
                <div className="mt-6 text-center border-t pt-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Don't have an account? <Link to="/signup" className="hover:underline" style={{ color: '#1e3a8a' }}>Create one here</Link>
                  </p>
                </div>

                {/* Login Types */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-sm mb-4">Are you a college representative?</p>
                  <div className="flex gap-3 justify-center">
                    <Link
                      to="/college-login"
                      className="flex items-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600"
                    >
                      <i className="fas fa-university"></i>
                      <span>College Login</span>
                    </Link>
                    <Link
                      to="/admin-login"
                      className="flex items-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600"
                    >
                      <i className="fas fa-user-shield"></i>
                      <span>Admin Login</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="text-white p-12 flex items-center" style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}>
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Track Your Applications</h2>
                <p className="mb-8 text-blue-100 text-lg">
                  Access your personalized dashboard to monitor application progress, receive updates, and manage your college journey.
                </p>

                {/* Dashboard Preview */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center space-x-4 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <i className="fas fa-chart-pie text-yellow-300 text-xl w-6"></i>
                    <div>
                      <h3 className="font-semibold mb-1 text-lg">Application Dashboard</h3>
                      <p className="text-blue-100 text-sm">View all your applications in one place</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <i className="fas fa-bell text-yellow-300 text-xl w-6"></i>
                    <div>
                      <h3 className="font-semibold mb-1 text-lg">Real-time Updates</h3>
                      <p className="text-blue-100 text-sm">Get notified about status changes instantly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
                    <i className="fas fa-calendar text-yellow-300 text-xl w-6"></i>
                    <div>
                      <h3 className="font-semibold mb-1 text-lg">Important Dates</h3>
                      <p className="text-blue-100 text-sm">Never miss deadlines and important dates</p>
                    </div>
                  </div>
                </div>

                {/* Success Stats */}
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">95%</div>
                    <div className="text-blue-100 text-xs mt-1">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">1000+</div>
                    <div className="text-blue-100 text-xs mt-1">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-300">500+</div>
                    <div className="text-blue-100 text-xs mt-1">Colleges</div>
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

export default StudentLogin;
