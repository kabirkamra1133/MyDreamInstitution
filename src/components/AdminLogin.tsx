import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, User, Key, Eye, EyeOff, LogIn, Shield, AlertTriangle, Settings, BarChart, Users, Database } from 'lucide-react';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    securityCode: '',
    keepSignedIn: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login submitted:', formData);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">My Dream Institution</span>
            </Link>
            
            <Link to="/" className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full mx-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
              <p className="text-slate-400">Authorized access only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter admin username"
                    className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter admin password"
                    className="w-full pl-12 pr-12 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Security Code Field */}
              <div>
                <label htmlFor="securityCode" className="block text-sm font-medium text-slate-300 mb-2">
                  Security Code (2FA)
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="securityCode"
                    name="securityCode"
                    value={formData.securityCode}
                    onChange={handleInputChange}
                    placeholder="Enter 2FA code"
                    className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Keep Signed In */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="keepSignedIn"
                  id="keepSignedIn"
                  checked={formData.keepSignedIn}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                />
                <label htmlFor="keepSignedIn" className="ml-2 text-sm text-slate-300">
                  Keep me signed in
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <LogIn className="w-5 h-5" />
                <span>Access Admin Panel</span>
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-400 font-semibold text-sm mb-1">Security Notice</h3>
                  <p className="text-yellow-300/80 text-xs">
                    This is a restricted area. All access attempts are logged and monitored. Unauthorized access is prohibited.
                  </p>
                </div>
              </div>
            </div>

            {/* Other Login Types */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-slate-400 text-center mb-4 text-sm">Looking for a different portal?</p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/student-login"
                  className="flex items-center justify-center space-x-2 border border-slate-600 text-slate-300 py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Login</span>
                </Link>
                <Link
                  to="/college-login"
                  className="flex items-center justify-center space-x-2 border border-slate-600 text-slate-300 py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>College Login</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Admin Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <BarChart className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">Analytics</div>
              <div className="text-slate-400 text-xs">Platform Insights</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">User Management</div>
              <div className="text-slate-400 text-xs">Control Access</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <Database className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">Database</div>
              <div className="text-slate-400 text-xs">System Data</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <Settings className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-white text-sm font-medium">Settings</div>
              <div className="text-slate-400 text-xs">Platform Config</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-slate-400 text-sm">© 2024 My Dream Institution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
