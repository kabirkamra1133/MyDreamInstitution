import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    education: '',
    interestedField: '',
    terms: false,
    newsletter: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.confirmPassword!=formData.password) alert("Password and confirmPassword doesn't match");
    const res = await axios.post('http://localhost:3000/api/users/register',formData);
    if(res.status==200) {
      alert("User registered successfully");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        education: '',
        interestedField: '',
        terms: false,
        newsletter: false
      });
    }
    else{
      alert("Error in registration: " + res.data.error);
      return;
    }
    console.log('Form submitted:', formData);
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
            <span className="text-slate-600">Already have an account?</span>
            <Link to="/student-login" className="px-6 py-2 border-2 border-blue-900 text-blue-900 rounded-lg font-medium transition-all duration-300 hover:bg-blue-900 hover:text-white">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Form */}
              <div className="p-8 lg:p-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2 font-poppins">Create Your Account</h1>
                    <p className="text-slate-500">Start your college admission journey with us</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    {/* Education Level */}
                    <div>
                      <label htmlFor="education" className="block text-sm font-medium text-slate-700 mb-2">
                        Current Education Level
                      </label>
                      <select
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select Education Level</option>
                        <option value="high-school">High School</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="postgraduate">Postgraduate</option>
                      </select>
                    </div>

                    {/* Field of Interest */}
                    <div>
                      <label htmlFor="interestedField" className="block text-sm font-medium text-slate-700 mb-2">
                        Field of Interest
                      </label>
                      <select
                        id="interestedField"
                        name="interestedField"
                        value={formData.interestedField}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select Field</option>
                        <option value="engineering">Engineering</option>
                        <option value="medicine">Medicine</option>
                        <option value="business">Business</option>
                        <option value="arts">Arts & Humanities</option>
                        <option value="science">Science</option>
                        <option value="law">Law</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          required
                        />
                        <span className="text-sm text-slate-600">
                          I agree to the <a href="#terms" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                          className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">
                          Subscribe to our newsletter for college updates and admission tips
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <i className="fas fa-user-plus"></i>
                      Create Account
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-slate-300"></div>
                    <span className="px-4 text-slate-500 bg-white">or</span>
                    <div className="flex-1 border-t border-slate-300"></div>
                  </div>

                  {/* Social Signup */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-slate-50">
                      <i className="fab fa-google text-red-500"></i>
                      Continue with Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-slate-50">
                      <i className="fab fa-facebook-f text-blue-600"></i>
                      Continue with Facebook
                    </button>
                  </div>

                  {/* Footer Link */}
                  <div className="mt-6 text-center">
                    <p className="text-slate-600">
                      Already have an account? <Link to="/student-login" className="text-blue-600 hover:underline font-medium">Sign in here</Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Info */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-8 lg:p-12 text-white">
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold mb-4 font-poppins">Join Thousands of Students</h2>
                  <p className="text-blue-100 mb-8 leading-relaxed">
                    Discover your dream college and simplify your admission process with our comprehensive platform.
                  </p>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center gap-4">
                      <i className="fas fa-university text-2xl text-yellow-400"></i>
                      <div>
                        <h3 className="font-semibold font-poppins">1000+ Colleges</h3>
                        <p className="text-blue-100 text-sm">Access to top colleges and universities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <i className="fas fa-file-alt text-2xl text-yellow-400"></i>
                      <div>
                        <h3 className="font-semibold font-poppins">Single Application</h3>
                        <p className="text-blue-100 text-sm">Apply to multiple colleges with one form</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <i className="fas fa-chart-line text-2xl text-yellow-400"></i>
                      <div>
                        <h3 className="font-semibold font-poppins">95% Success Rate</h3>
                        <p className="text-blue-100 text-sm">High admission success rate for our students</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <p className="text-blue-50 italic mb-4">
                      "My Dream Institution made my college application process so much easier. I got admitted to my dream university!"
                    </p>
                    <div>
                      <strong className="text-white">Sarah Johnson</strong>
                      <span className="text-blue-200 text-sm block">Student, MIT</span>
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

export default Signup;
