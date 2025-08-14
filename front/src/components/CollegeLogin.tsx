import { useState } from 'react';
import { Link } from 'react-router-dom';

const CollegeLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    collegeId: '',
    email: '',
    password: '',
    collegeRememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('College login submitted:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-open-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-poppins font-semibold text-xl text-blue-900 no-underline">
            <i className="fas fa-graduation-cap text-2xl"></i>
            <span>My Dream Institution</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Need an account?</span>
            <a href="#contact" className="px-6 py-2 border-2 border-blue-900 text-blue-900 rounded-lg font-medium transition-all duration-300 hover:bg-blue-900 hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Form */}
              <div className="p-8 lg:p-12">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-university text-3xl text-blue-600"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2 font-poppins">College Portal</h1>
                    <p className="text-slate-500">Welcome back! Access your institution dashboard</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* College ID Field */}
                    <div>
                      <label htmlFor="collegeId" className="block text-sm font-medium text-slate-700 mb-2">
                        College ID / Institution Code
                      </label>
                      <div className="relative">
                        <i className="fas fa-id-card absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                        <input
                          type="text"
                          id="collegeId"
                          name="collegeId"
                          value={formData.collegeId}
                          onChange={handleInputChange}
                          placeholder="Enter your college ID"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Official Email
                      </label>
                      <div className="relative">
                        <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter institutional email"
                          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
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

                    {/* Form Options */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="collegeRememberMe"
                          checked={formData.collegeRememberMe}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">Remember this device</span>
                      </label>
                      <a href="#forgot" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <i className="fas fa-sign-in-alt"></i>
                      Access Portal
                    </button>
                  </form>

                  {/* Footer Link */}
                  <div className="mt-6 text-center">
                    <p className="text-slate-600">
                      New to our platform? <a href="#contact" className="text-blue-600 hover:underline font-medium">Contact us for setup</a>
                    </p>
                  </div>

                  {/* Login Types */}
                  <div className="mt-8">
                    <p className="text-center text-slate-600 mb-4">Looking for a different portal?</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/student-login"
                        className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        <i className="fas fa-user-graduate"></i>
                        <span>Student Portal</span>
                      </Link>
                      <Link
                        to="/admin-login"
                        className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        <i className="fas fa-user-shield"></i>
                        <span>Admin Portal</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Info */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 lg:p-12 text-white">
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold mb-4 font-poppins">Manage Your Admissions</h2>
                  <p className="text-blue-100 mb-8 leading-relaxed">
                    Access your comprehensive college dashboard to manage applications, review candidates, and streamline your admission process.
                  </p>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center gap-4">
                      <i className="fas fa-users text-2xl text-yellow-400"></i>
                      <div>
                        <h3 className="font-semibold font-poppins">Application Management</h3>
                        <p className="text-blue-100 text-sm">Review and process student applications</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <i className="fas fa-chart-line text-2xl text-yellow-400"></i>
                      <div>
                        <h3 className="font-semibold font-poppins">Analytics Dashboard</h3>
                        <p className="text-blue-100 text-sm">Track admission trends and statistics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <i className="fas fa-envelope text-2xl text-yellow-400"></i>
                      <div>
                        <h3 className="font-semibold font-poppins">Communication Tools</h3>
                        <p className="text-blue-100 text-sm">Connect with prospective students</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mb-8">
                    <h3 className="font-bold mb-4 font-poppins">Why Colleges Choose Us</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-green-400"></i>
                        <span className="text-blue-100">Streamlined application processing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-green-400"></i>
                        <span className="text-blue-100">Advanced filtering and search tools</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-green-400"></i>
                        <span className="text-blue-100">Automated candidate matching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fas fa-check text-green-400"></i>
                        <span className="text-blue-100">Comprehensive analytics and reports</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">500+</div>
                      <div className="text-blue-200 text-sm">Partner Colleges</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">50K+</div>
                      <div className="text-blue-200 text-sm">Applications</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">98%</div>
                      <div className="text-blue-200 text-sm">Satisfaction</div>
                    </div>
                  </div>
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

export default CollegeLogin;
