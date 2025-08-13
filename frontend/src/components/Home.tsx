import { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-all duration-300">
        <div className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-poppins font-semibold text-xl text-blue-900 no-underline">
            <i className="fas fa-graduation-cap text-2xl"></i>
            <span>My Dream Institution</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex list-none gap-8">
            <a href="#about" className="text-slate-500 no-underline font-medium transition-colors duration-300 hover:text-blue-900">About</a>
            <a href="#colleges" className="text-slate-500 no-underline font-medium transition-colors duration-300 hover:text-blue-900">Colleges</a>
            <a href="#nri" className="text-slate-500 no-underline font-medium transition-colors duration-300 hover:text-blue-900">NRI</a>
            <a href="#contact" className="text-slate-500 no-underline font-medium transition-colors duration-300 hover:text-blue-900">Contact</a>
          </div>

          <a href="#apply" className="hidden md:inline-block px-6 py-3 bg-blue-900 text-white no-underline rounded-md font-medium transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5">
            Apply Now
          </a>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="block w-6 h-0.5 bg-blue-900 my-0.5 transition-all duration-300"></span>
            <span className="block w-6 h-0.5 bg-blue-900 my-0.5 transition-all duration-300"></span>
            <span className="block w-6 h-0.5 bg-blue-900 my-0.5 transition-all duration-300"></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-blue-600/60 flex items-center text-white" style={{
        backgroundImage: "linear-gradient(135deg, rgba(30, 58, 138, 0.8), rgba(59, 130, 246, 0.6)), url('https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-blue-600/60"></div>
        <div className="relative z-10 pt-24 pb-8 w-full">
          <div className="max-w-6xl mx-auto px-8">
            <div className="max-w-2xl text-center mx-auto">
              <h1 className="text-6xl font-bold font-poppins mb-6 drop-shadow-lg">
                Your <span className="text-yellow-400">Dream College</span><br />
                Journey Starts Here
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Discover thousands of colleges, compare programs, and apply seamlessly through our streamlined admission platform. Your dream college journey starts here.
              </p>

              {/* Feature Tags */}
              <div className="flex justify-center gap-8 mb-8 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <i className="fas fa-university text-yellow-400"></i>
                  <span>1000+ Colleges</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <i className="fas fa-file-alt text-yellow-400"></i>
                  <span>Single Application</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <i className="fas fa-bolt text-yellow-400"></i>
                  <span>Quick Process</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 justify-center mt-8 flex-wrap">
                <a href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <i className="fas fa-rocket"></i>
                  Start Your Application
                </a>
                <a href="#colleges" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-medium transition-all duration-300 hover:bg-white hover:text-blue-900">
                  <i className="fas fa-search"></i>
                  Explore Colleges
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-2xl animate-bounce">
          <i className="fas fa-chevron-down"></i>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-slate-50" id="about">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">
              Why Choose <span className="text-yellow-500">My Dream Institution</span>?
            </h2>
            <p className="text-lg text-slate-500">
              Our platform simplifies the college admissions process, making it easier for students to find and apply to their dream institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Feature Cards */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-database"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Comprehensive College Database</h3>
              <p className="text-slate-500 leading-relaxed">Access detailed information about thousands of colleges and universities, including admission requirements, fees, and campus facilities.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Single Application Form</h3>
              <p className="text-slate-500 leading-relaxed">Fill out one comprehensive application form and apply to multiple colleges simultaneously, saving time and effort.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Student Portal</h3>
              <p className="text-slate-500 leading-relaxed">Track your application status, view admission updates, and manage all your college applications through your personalized student dashboard.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-cogs"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">College Management</h3>
              <p className="text-slate-500 leading-relaxed">Colleges can manage their admission process through our comprehensive platform, making the selection process efficient and transparent.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Real-time Tracking</h3>
              <p className="text-slate-500 leading-relaxed">Monitor your application progress in real-time with instant notifications and status updates.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">24/7 Support</h3>
              <p className="text-slate-500 leading-relaxed">Get dedicated support throughout your admission journey, ensuring a smooth experience from start to finish.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-blue-50/50" style={{
        backgroundImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(30, 58, 138, 0.05)), url('https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">How It Works</h2>
            <p className="text-lg text-slate-500">
              Simple <span className="text-yellow-500 font-semibold">4 Step Process</span> to start your college admission journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Step Cards */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                1
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Explore Colleges</h3>
              <p className="text-slate-500">Browse through thousands of colleges and find the ones that match your preferences and requirements.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                2
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Create Account</h3>
              <p className="text-slate-500">Sign up for your student account and set up your profile with academic details and preferences.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                3
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-edit"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Fill Application</h3>
              <p className="text-slate-500">Complete your comprehensive application form and submit it to multiple colleges at once.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                4
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Get Admitted</h3>
              <p className="text-slate-500">Receive admission offers, compare options, and make your final decision to start your college journey.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-24 bg-white" id="apply">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Benefits */}
            <div>
              <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">
                Start Your <span className="text-yellow-500">Application Today</span>
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Ready to take the next step in your educational journey? Through our streamlined platform, the application, college recommendation and admission process is simple and fast.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-600">Apply to multiple colleges with one form</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-600">Track application statuses in real-time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-600">Get personalized college recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-600">Receive admission decisions faster</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                  <i className="fas fa-user-plus"></i>
                  <span>Start Application</span>
                </Link>
                <a href="#colleges" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-blue-900 text-blue-900 rounded-lg font-medium transition-all duration-300 hover:bg-blue-900 hover:text-white">
                  <i className="fas fa-university"></i>
                  <span>Browse Colleges</span>
                </a>
              </div>
            </div>
            {/* Right Side - Application Form */}
            <div>
              <div className="bg-slate-50 p-8 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 font-poppins">Common Admission Form</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-600 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-slate-600 mb-2">
                      Preferred Course
                    </label>
                    <select
                      id="course"
                      name="course"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Course</option>
                      <option value="engineering">Engineering</option>
                      <option value="medicine">Medicine</option>
                      <option value="business">Business</option>
                      <option value="arts">Arts</option>
                      <option value="science">Science</option>
                      <option value="law">Law</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="percentage" className="block text-sm font-medium text-slate-600 mb-2">
                      Academic Percentage
                    </label>
                    <input
                      type="number"
                      id="percentage"
                      name="percentage"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 rounded-lg font-medium shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <i className="fas fa-paper-plane"></i>
                    <span>Submit Application</span>
                  </button>
                </form>
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-500 text-center mb-4">Already have an account?</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/student-login"
                      className="flex items-center justify-center gap-2 border border-slate-300 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                    >
                      <i className="fas fa-user"></i>
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
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="bg-white p-12 rounded-xl shadow-md">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">Ready to Start Your Journey?</h2>
            <p className="text-lg text-slate-500 mb-8">
              Join thousands of students who have found their dream colleges through our platform.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <i className="fas fa-rocket"></i>
              <span>Begin Application</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-poppins">
              Trusted by <span className="text-yellow-400">Thousands</span>
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Join a growing community of successful students and prestigious colleges who trust our platform for their admission needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-graduate text-2xl text-blue-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-200">Happy Students<br />Placed Successfully</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-alt text-2xl text-blue-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Applications<br />Processed</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-2xl text-blue-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-200">Success Rate<br />in Admissions</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-2xl text-blue-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">72hrs</div>
              <div className="text-blue-200">Average Processing<br />Time</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <i className="fas fa-award text-yellow-500"></i>
              <span className="text-slate-700">Best Education Platform 2024</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <i className="fas fa-shield-alt text-green-500"></i>
              <span className="text-slate-700">Secure & Trusted</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <i className="fas fa-star text-yellow-500"></i>
              <span className="text-slate-700">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <i className="fas fa-graduation-cap text-2xl text-blue-400"></i>
              <span className="text-xl font-bold">My Dream Institution</span>
            </div>
            <p className="text-slate-400 mb-6">Your dream college journey starts here.</p>
            <div className="flex justify-center gap-6">
              <a href="#about" className="text-slate-400 hover:text-white transition-colors">About</a>
              <a href="#colleges" className="text-slate-400 hover:text-white transition-colors">Colleges</a>
              <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a>
              <a href="#privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-slate-400 text-sm">
              © 2024 My Dream Institution. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
