import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useMainContext } from '../context/mainContext';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { server } = useMainContext();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    securityCode: '',
    adminRememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { username, password } = formData;
      const response = await fetch(`${server}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const token = data?.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('role', 'admin');
          localStorage.setItem('user', JSON.stringify(data.user));
          
          toast({
            title: "Welcome Admin! 🔐",
            description: "Successfully logged into admin dashboard",
          });
          
          navigate("/admin-portal");
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl text-emerald-700 hover:text-emerald-800 transition-colors no-underline">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="CollegeManzil" className="w-7 h-7 rounded-lg object-cover" />
            </div>
            <span>CollegeManzil</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-sm">Need assistance?</span>
            <Link 
              to="/" 
              className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium transition-all hover:bg-emerald-600 hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-12 min-h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white rounded-xl shadow-xl overflow-hidden min-h-[700px] items-center">
            {/* Left Side - Form */}
            <div className="p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-user-shield text-3xl text-red-600"></i>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
                  <p className="text-slate-600">Secure administrative access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                    <i className="fas fa-user-shield text-emerald-600 mr-2"></i>
                    Admin Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter admin username"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    <i className="fas fa-key text-emerald-600 mr-2"></i>
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter admin password"
                      className="w-full px-4 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Security Code */}
                <div>
                  <label htmlFor="securityCode" className="block text-sm font-semibold text-slate-700 mb-2">
                    <i className="fas fa-shield-alt text-emerald-600 mr-2"></i>
                    Security Code
                  </label>
                  <input
                    type="text"
                    id="securityCode"
                    name="securityCode"
                    value={formData.securityCode}
                    onChange={handleInputChange}
                    placeholder="Enter 2FA security code"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="adminRememberMe"
                      checked={formData.adminRememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-600">Keep me signed in</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i>
                      <span>Access Admin Panel</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8">
                <p className="text-center text-slate-600 mb-4 text-sm">Looking for a different portal?</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/student-login"
                    className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
                  >
                    <i className="fas fa-user-graduate"></i>
                    <span>Student Login</span>
                  </Link>
                  <Link
                    to="/college-login"
                    className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
                  >
                    <i className="fas fa-university"></i>
                    <span>College Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Admin Info */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-12 text-white flex flex-col justify-center min-h-[700px]">
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-3xl font-bold mb-4">System Administration</h2>
              <p className="text-slate-200 mb-8 leading-relaxed">
                Manage the entire CollegeManzil platform with comprehensive administrative tools and real-time monitoring capabilities.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <i className="fas fa-chart-bar text-2xl text-red-400 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold">Analytics & Reports</h3>
                    <p className="text-slate-300 text-sm">Monitor platform performance and user engagement</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <i className="fas fa-users text-2xl text-red-400 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold">User Management</h3>
                    <p className="text-slate-300 text-sm">Manage students, colleges, and administrators</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <i className="fas fa-shield-alt text-2xl text-red-400 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold">Security Controls</h3>
                    <p className="text-slate-300 text-sm">Advanced security monitoring and access control</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <i className="fas fa-cog text-2xl text-red-400 flex-shrink-0"></i>
                  <div>
                    <h3 className="font-semibold">System Configuration</h3>
                    <p className="text-slate-300 text-sm">Platform settings and feature management</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-600">
                <h4 className="font-semibold mb-4 text-red-400">Security Notice</h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <i className="fas fa-exclamation-triangle text-amber-400 mt-0.5 flex-shrink-0"></i>
                    <span>All admin activities are logged and monitored</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-lock text-amber-400 mt-0.5 flex-shrink-0"></i>
                    <span>Two-factor authentication required for access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="fas fa-user-secret text-amber-400 mt-0.5 flex-shrink-0"></i>
                    <span>Unauthorized access attempts will be reported</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center mt-8">
                <div>
                  <div className="text-3xl font-bold text-red-400">500+</div>
                  <div className="text-slate-300 text-sm">Active Colleges</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">10K+</div>
                  <div className="text-slate-300 text-sm">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">99.9%</div>
                  <div className="text-slate-300 text-sm">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm">
              <a href="#about" className="text-slate-600 hover:text-emerald-600 transition-colors">About</a>
              <a href="#privacy" className="text-slate-600 hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#terms" className="text-slate-600 hover:text-emerald-600 transition-colors">Terms</a>
              <a href="#contact" className="text-slate-600 hover:text-emerald-600 transition-colors">Contact</a>
            </div>
            <div>
              <p className="text-slate-600 text-sm">© 2024 CollegeManzil. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
