import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';
import { useMainContext } from '../context/mainContext';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { server } = useMainContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { email, password } = formData;
      const res = await axios.post(`${server}/api/auth/student/login`, { email, password });
      const token = res?.data?.token;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'student');
        
        toast({
          title: "Login Successful! 🎉",
          description: "Welcome back to CollegeManzil. Redirecting to your dashboard...",
          variant: "default",
        });
        
        // Small delay for toast to be visible before navigation
        
          navigate("/colleges");
      
      }
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error('Student login error', err);
      
      toast({
        title: "Login Failed ❌",
        description: err?.response?.data?.error || 'Invalid credentials. Please check your email and password.',
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
              <span className="text-gray-600 text-sm">Don't have an account?</span>
              <Link to="/signup" className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium transition-all hover:bg-emerald-600 hover:text-white">
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
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Login</h1>
                  <p className="text-gray-600">Welcome back! Sign in to your CollegeManzil account</p>
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
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        disabled={isLoading}
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
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 w-6 h-6 flex items-center justify-center transition-colors"
                        disabled={isLoading}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Form Options */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer text-sm text-gray-600">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                        disabled={isLoading}
                      />
                      <span className="ml-2">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt"></i>
                        <span>Sign In</span>
                      </>
                    )}
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
                <button 
                  type="button"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fab fa-google"></i>
                  <span>Continue with Google</span>
                </button>

                {/* Footer Links */}
                <div className="mt-6 text-center border-t pt-6">
                  <p className="text-gray-600 text-sm mb-4">
                    Don't have an account? <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 hover:underline">Create one here</Link>
                  </p>
                </div>

                {/* Login Types */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-sm mb-4">Are you a college representative?</p>
                  <div className="flex gap-3 justify-center">
                    <Link
                      to="/college-login"
                      className="flex items-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all text-sm text-gray-600"
                    >
                      <i className="fas fa-university"></i>
                      <span>College Login</span>
                    </Link>
                    <Link
                      to="/admin-login"
                      className="flex items-center space-x-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all text-sm text-gray-600"
                    >
                      <i className="fas fa-user-shield"></i>
                      <span>Admin Login</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Info */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-12 flex items-center">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold mb-6">Your College Journey Awaits</h2>
                <p className="mb-8 text-emerald-100 text-lg leading-relaxed">
                  Access your personalized dashboard to track applications, discover new opportunities, and take the next step toward your dream college.
                </p>

                {/* Dashboard Preview */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-chart-pie text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-lg">Application Dashboard</h3>
                      <p className="text-emerald-100 text-sm">Track all your college applications in real-time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-heart text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-lg">Smart Shortlisting</h3>
                      <p className="text-emerald-100 text-sm">AI-powered recommendations for your dream colleges</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-lg">Expert Guidance</h3>
                      <p className="text-emerald-100 text-sm">Get personalized counseling from education experts</p>
                    </div>
                  </div>
                </div>

                {/* Success Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white mb-2">98%</div>
                    <div className="text-emerald-100 text-sm">Success Rate</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white mb-2">25K+</div>
                    <div className="text-emerald-100 text-sm">Students</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white mb-2">800+</div>
                    <div className="text-emerald-100 text-sm">Colleges</div>
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
              <Link to="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">About</Link>
              <Link to="/privacy" className="text-gray-600 hover:text-emerald-600 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-600 hover:text-emerald-600 transition-colors">Terms</Link>
              <Link to="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors">Contact</Link>
            </div>
            <p className="text-gray-600 text-sm">© 2024 CollegeManzil. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLogin;
