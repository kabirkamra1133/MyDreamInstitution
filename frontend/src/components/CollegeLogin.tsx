import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useMainContext } from '../context/mainContext';

const CollegeLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { server } = useMainContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    instituteCode: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password, instituteCode } = formData;
      const response = await fetch(`${server}/api/auth/college/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, instituteCode }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const token = data?.token;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('role', 'college');
          localStorage.setItem('user', JSON.stringify(data.user));
          
          toast({
            title: "Login Successful! 🎉",
            description: "Welcome to your CollegeManzil portal. Redirecting to dashboard...",
            variant: "default",
          });
          
          // Small delay for toast to be visible before navigation
          setTimeout(() => {
            navigate('/college-portal');
          }, 1500);
        }
      } else {
        toast({
          title: "Login Failed ❌",
          description: data.error || 'Invalid credentials. Please check your email and password.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('College login error', err);
      
      toast({
        title: "Network Error ⚠️",
        description: 'Unable to connect to server. Please check your internet connection and try again.',
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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="CollegeManzil" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
              <span className="text-xl font-bold text-emerald-600">CollegeManzil</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Need help getting started?</span>
              <a href="#contact" className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium transition-all hover:bg-emerald-600 hover:text-white">
                Contact Us
              </a>
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
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-university text-3xl text-emerald-600"></i>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">College Portal</h1>
                  <p className="text-slate-600">Welcome back! Access your institution dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      <i className="fas fa-envelope text-emerald-600 mr-2"></i>
                      Official Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter institutional email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Institute Code Field */}
                  <div>
                    <label htmlFor="instituteCode" className="block text-sm font-semibold text-slate-700 mb-2">
                      <i className="fas fa-building text-emerald-600 mr-2"></i>
                      Institute Code
                    </label>
                    <input
                      type="text"
                      id="instituteCode"
                      name="instituteCode"
                      value={formData.instituteCode}
                      onChange={handleInputChange}
                      placeholder="Enter your institute code"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                      <i className="fas fa-lock text-emerald-600 mr-2"></i>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
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

                  {/* Form Options */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600">Remember this device</span>
                    </label>
                    <a href="#forgot" className="text-sm text-emerald-600 hover:underline font-medium">Forgot Password?</a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt"></i>
                        <span>Access Portal</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center">
                  <p className="text-slate-600 text-sm">
                    New to our platform? <a href="#contact" className="text-emerald-600 hover:underline font-medium">Contact us for setup</a>
                  </p>
                </div>

                {/* Login Types */}
                <div className="mt-8">
                  <p className="text-center text-slate-600 mb-4 text-sm">Looking for a different portal?</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/student-login"
                      className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
                    >
                      <i className="fas fa-user-graduate"></i>
                      <span>Student Portal</span>
                    </Link>
                    <Link
                      to="/admin-login"
                      className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
                    >
                      <i className="fas fa-user-shield"></i>
                      <span>Admin Portal</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 p-12 text-white flex flex-col justify-center min-h-[600px]">
              <div className="max-w-md mx-auto w-full">
                <h2 className="text-3xl font-bold mb-4">Manage Your Admissions</h2>
                <p className="text-emerald-100 mb-8 leading-relaxed">
                  Access your comprehensive college dashboard to manage applications, review candidates, and streamline your admission process with CollegeManzil.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-4">
                    <i className="fas fa-users text-2xl text-amber-400 flex-shrink-0"></i>
                    <div>
                      <h3 className="font-semibold">Application Management</h3>
                      <p className="text-emerald-100 text-sm">Review and process student applications efficiently</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <i className="fas fa-chart-line text-2xl text-amber-400 flex-shrink-0"></i>
                    <div>
                      <h3 className="font-semibold">Analytics Dashboard</h3>
                      <p className="text-emerald-100 text-sm">Track admission trends and detailed statistics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <i className="fas fa-envelope text-2xl text-amber-400 flex-shrink-0"></i>
                    <div>
                      <h3 className="font-semibold">Communication Tools</h3>
                      <p className="text-emerald-100 text-sm">Connect with prospective students seamlessly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <i className="fas fa-robot text-2xl text-amber-400 flex-shrink-0"></i>
                    <div>
                      <h3 className="font-semibold">AI-Powered Matching</h3>
                      <p className="text-emerald-100 text-sm">Smart candidate recommendations and insights</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm mb-8">
                  <h3 className="font-bold mb-4">Why Colleges Choose CollegeManzil</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <i className="fas fa-check text-green-400 mt-0.5 flex-shrink-0"></i>
                      <span className="text-emerald-100">Streamlined application processing with advanced filtering</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <i className="fas fa-check text-green-400 mt-0.5 flex-shrink-0"></i>
                      <span className="text-emerald-100">AI-powered candidate matching and recommendations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <i className="fas fa-check text-green-400 mt-0.5 flex-shrink-0"></i>
                      <span className="text-emerald-100">Comprehensive analytics and detailed admission reports</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <i className="fas fa-check text-green-400 mt-0.5 flex-shrink-0"></i>
                      <span className="text-emerald-100">24/7 support and dedicated account management</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-amber-400">1000+</div>
                    <div className="text-emerald-200 text-sm">Partner Colleges</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-400">50K+</div>
                    <div className="text-emerald-200 text-sm">Applications</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-400">98%</div>
                    <div className="text-emerald-200 text-sm">Satisfaction</div>
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

export default CollegeLogin;
