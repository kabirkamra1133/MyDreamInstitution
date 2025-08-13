import { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    securityCode: '',
    adminRememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin login submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen font-open-sans" style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)'
    }}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-poppins font-semibold text-xl text-blue-900 no-underline">
            <i className="fas fa-graduation-cap text-2xl"></i>
            <span>My Dream Institution</span>
          </Link>
          
          <Link to="/" className="px-6 py-2 border-2 border-blue-900 text-blue-900 rounded-lg font-medium transition-all duration-300 hover:bg-blue-900 hover:text-white">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-12">
        <div className="max-w-lg mx-auto px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-shield text-3xl text-red-600"></i>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2 font-poppins">Admin Panel</h1>
                <p className="text-slate-500">Authorized access only</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Username
                  </label>
                  <div className="relative">
                    <i className="fas fa-user-shield absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter admin username"
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <i className="fas fa-key absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter admin password"
                      className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Security Code */}
                <div>
                  <label htmlFor="securityCode" className="block text-sm font-medium text-slate-700 mb-2">
                    Security Code
                  </label>
                  <div className="relative">
                    <i className="fas fa-shield-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                    <input
                      type="text"
                      id="securityCode"
                      name="securityCode"
                      value={formData.securityCode}
                      onChange={handleInputChange}
                      placeholder="Enter 2FA code"
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="adminRememberMe"
                      checked={formData.adminRememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">Keep me signed in</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #f87171)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
                  }}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Access Admin Panel
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 rounded-lg p-4" style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b'
              }}>
                <div className="flex items-start gap-3">
                  <i className="fas fa-exclamation-triangle mt-1" style={{ color: '#f59e0b', fontSize: '1.25rem' }}></i>
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: '#92400e' }}>Security Notice</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#92400e' }}>
                      This is a restricted area. All access attempts are logged and monitored. Unauthorized access is prohibited.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Types */}
              <div className="mt-8">
                <p className="text-center text-slate-600 mb-4">Looking for a different login?</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/student-login"
                    className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                  >
                    <i className="fas fa-user-graduate"></i>
                    <span>Student Login</span>
                  </Link>
                  <Link
                    to="/college-login"
                    className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                  >
                    <i className="fas fa-university"></i>
                    <span>College Login</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Admin Features */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4 font-poppins text-center">Admin Dashboard Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-3">
                  <i className="fas fa-chart-bar text-2xl text-blue-600 mb-2"></i>
                  <span className="text-sm text-slate-600">Analytics & Reports</span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <i className="fas fa-users text-2xl text-blue-600 mb-2"></i>
                  <span className="text-sm text-slate-600">User Management</span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <i className="fas fa-university text-2xl text-blue-600 mb-2"></i>
                  <span className="text-sm text-slate-600">College Management</span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <i className="fas fa-file-alt text-2xl text-blue-600 mb-2"></i>
                  <span className="text-sm text-slate-600">Application Review</span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <i className="fas fa-cog text-2xl text-blue-600 mb-2"></i>
                  <span className="text-sm text-slate-600">System Settings</span>
                </div>
                <div className="flex flex-col items-center text-center p-3">
                  <i className="fas fa-shield-alt text-2xl text-blue-600 mb-2"></i>
                  <span className="text-sm text-slate-600">Security Controls</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#privacy" className="text-slate-600 hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#terms" className="text-slate-600 hover:text-blue-600 transition-colors">Terms</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div>
              <p className="text-slate-600">© 2024 My Dream Institution. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
