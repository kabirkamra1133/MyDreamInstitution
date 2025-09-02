import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useMainContext } from '../context/mainContext';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { server } = useMainContext();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${server}/api/auth/student/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
          role: 'student'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "Login Successful! 🎉",
          description: `Welcome back! Redirecting to your dashboard...`,
          variant: "default",
        });
        
        setTimeout(() => {
          navigate('/colleges');
        }, 1500);
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-all duration-300">
        <div className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2 font-poppins font-semibold text-xl text-emerald-600 no-underline">
            <img 
              src="/logo.png" 
              alt="CollegeManzil" 
              className="w-20 h-20 " 
            />
            <span>CollegeManzil</span>
          </Link>
          <div className="hidden md:flex list-none gap-8">
            <a href="#about" className="text-slate-600 no-underline font-medium transition-colors duration-300 hover:text-emerald-600">About</a>
            <Link to="/colleges" className="text-slate-600 no-underline font-medium transition-colors duration-300 hover:text-emerald-600">Colleges</Link>
            <a href="#counselling" className="text-slate-600 no-underline font-medium transition-colors duration-300 hover:text-emerald-600">Counselling</a>
            <a href="#contact" className="text-slate-600 no-underline font-medium transition-colors duration-300 hover:text-emerald-600">Contact</a>
          </div>

          <a href="#apply" className="hidden md:inline-block px-6 py-3 bg-emerald-600 text-white no-underline rounded-md font-medium transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-0.5">
            Get Started
          </a>
          <button 
            className="md:hidden flex flex-col cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="block w-6 h-0.5 bg-emerald-600 my-0.5 transition-all duration-300"></span>
            <span className="block w-6 h-0.5 bg-emerald-600 my-0.5 transition-all duration-300"></span>
            <span className="block w-6 h-0.5 bg-emerald-600 my-0.5 transition-all duration-300"></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-900/85 via-emerald-700/70 to-teal-600/65 flex items-center text-white" style={{
        backgroundImage: "linear-gradient(135deg, rgba(6, 78, 59, 0.85), rgba(15, 118, 110, 0.7)), url('https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/85 via-emerald-700/70 to-teal-600/65"></div>
        <div className="relative z-10 pt-24 pb-8 w-full">
          <div className="max-w-6xl mx-auto px-8">
            <div className="max-w-3xl text-center mx-auto">
              <h1 className="text-6xl font-bold font-poppins mb-6 drop-shadow-lg">
                Find Your <span className="text-amber-400">Dream College</span><br />
                Journey with <span className="text-amber-400">CollegeManzil</span>
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Your trusted companion for college admissions in India. We connect students with top colleges 
                and universities, making your higher education journey simple, transparent, and successful.
              </p>

              {/* Feature Tags */}
              <div className="flex justify-center gap-6 mb-8 flex-wrap">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <i className="fas fa-university text-amber-400"></i>
                  <span>1000+ Colleges</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <i className="fas fa-user-graduate text-amber-400"></i>
                  <span>Expert Counselling</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                  <i className="fas fa-map-marked-alt text-amber-400"></i>
                  <span>AI-Driven Guidance</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 justify-center mt-8 flex-wrap">
                <a href="#apply" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <i className="fas fa-compass"></i>
                  Start Your Journey
                </a>
                <a href="colleges" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-medium transition-all duration-300 hover:bg-white hover:text-emerald-900">
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

      {/* About Us Section */}
      <section className="py-24 bg-slate-50" id="about">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl font-bold text-slate-800 mb-6 font-poppins">
              About <span className="text-emerald-600">CollegeManzil</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              At <strong>CollegeManzil</strong>, we believe every student deserves the right guidance to reach their dream destination in higher education. 
              Choosing the right college and course is one of the most important decisions of life, and our mission is to make that journey simple, transparent, and stress-free.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-eye text-emerald-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Our Vision</h3>
                </div>
                <p className="text-slate-600">
                  To become India's most student-friendly platform where young minds can discover, decide, and design their future with confidence.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-bullseye text-emerald-600 text-xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Our Mission</h3>
                </div>
                <ul className="text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                    Bridge the gap between students and colleges with verified information
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                    Simplify admission processes through expert counselling and AI-driven tools
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                    Empower students to make informed career decisions with clarity
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">
              Why Choose <span className="text-emerald-600">CollegeManzil</span>?
            </h2>
            <p className="text-lg text-slate-600">
              We are a trusted platform that connects students with top colleges and universities across India, 
              providing reliable, updated, and easy-to-understand information – all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {/* Feature Cards */}
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border-l-4 border-emerald-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-database"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Verified Information</h3>
              <p className="text-slate-600 leading-relaxed">Access reliable, updated information about thousands of colleges across India, including courses, fees, and admission procedures.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border-l-4 border-emerald-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Expert Counselling</h3>
              <p className="text-slate-600 leading-relaxed">Our team of expert counsellors provides personalized guidance to help you choose the right college and course for your future.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border-l-4 border-emerald-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-robot"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">AI-Driven Insights</h3>
              <p className="text-slate-600 leading-relaxed">Technology-driven insights help students explore opportunities that best match their interests, skills, and aspirations.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border-l-4 border-emerald-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Multiple Streams</h3>
              <p className="text-slate-600 leading-relaxed">Whether you're looking for engineering, medical, management, law, or vocational studies, we guide you every step of the way.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border-l-4 border-emerald-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Transparent Process</h3>
              <p className="text-slate-600 leading-relaxed">We make the admission process transparent and stress-free, helping you understand every step clearly.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center border-l-4 border-emerald-500">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                <i className="fas fa-headset"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">24/7 Support</h3>
              <p className="text-slate-600 leading-relaxed">Get dedicated support throughout your admission journey, ensuring a smooth experience from application to admission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative bg-gradient-to-br from-emerald-50/50 via-emerald-50/30 to-emerald-50/50" style={{
        backgroundImage: "linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 78, 59, 0.05)), url('https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">How CollegeManzil Works</h2>
            <p className="text-lg text-slate-600">
              Simple <span className="text-emerald-600 font-semibold">4 Step Process</span> to find your dream college and start your admission journey with expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Step Cards */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                1
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Discover Colleges</h3>
              <p className="text-slate-600">Explore thousands of verified colleges and universities across India with detailed information about courses and admission requirements.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                2
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Get Expert Counselling</h3>
              <p className="text-slate-600">Connect with our expert counsellors who will guide you based on your interests, skills, and career aspirations.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                3
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-edit"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Apply with Confidence</h3>
              <p className="text-slate-600">Submit your applications to shortlisted colleges with our streamlined process and track your application status.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold font-poppins">
                4
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mt-4 mb-6 text-white text-2xl">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 font-poppins">Secure Admission</h3>
              <p className="text-slate-600">Receive admission offers, compare options with our guidance, and secure your seat in your dream college.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Counselling Section */}
      <section className="py-24 bg-slate-50" id="counselling">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">Expert Counselling Services</h2>
            <p className="text-lg text-slate-600">
              Get personalized guidance from our experienced counsellors who understand the education landscape 
              and help you make informed decisions about your future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-comments text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">One-on-One Counselling</h3>
              <p className="text-slate-600">Personal counselling sessions to understand your goals and provide tailored college recommendations.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-chart-bar text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Career Assessment</h3>
              <p className="text-slate-600">Scientific assessment tools to identify your strengths and suggest suitable career paths.</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">Parent Counselling</h3>
              <p className="text-slate-600">Guidance sessions for parents to understand the admission process and support their children effectively.</p>
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
                Your Dream <span className="text-emerald-600">College Awaits</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                At <strong>CollegeManzil</strong>, your journey to success begins with the right direction. 
                Log in to access thousands of verified colleges, expert counselling, and AI-powered guidance.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-700">Connect with 1000+ verified colleges across India</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-700">Get expert counselling and personalized guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-700">AI-driven tools for better career decisions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-white text-sm"></i>
                  </div>
                  <span className="text-slate-700">Transparent and stress-free admission process</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium transition-all duration-300 hover:bg-emerald-600 hover:text-white">
                  <i className="fas fa-user-plus"></i>
                  <span>Create Account</span>
                </Link>
                <Link to="/colleges" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-slate-400 text-slate-600 rounded-lg font-medium transition-all duration-300 hover:bg-slate-100">
                  <i className="fas fa-university"></i>
                  <span>Browse Colleges</span>
                </Link>
              </div>
            </div>
            
            {/* Right Side - Student Login Form */}
            <div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 rounded-xl shadow-lg border border-emerald-200">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-user-graduate text-white text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 font-poppins">Student Login</h3>
                  <p className="text-slate-600">Access your college search dashboard</p>
                </div>
                
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      <i className="fas fa-envelope text-emerald-600 mr-2"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                      <i className="fas fa-lock text-emerald-600 mr-2"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                      required
                      disabled={isLoading}
                    />
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
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-600 text-center mb-4">New to CollegeManzil?</p>
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/signup"
                      className="flex items-center justify-center gap-2 bg-white border border-emerald-300 py-3 px-4 rounded-lg hover:bg-emerald-50 transition-colors text-emerald-700 font-medium"
                    >
                      <i className="fas fa-user-plus"></i>
                      <span>Create Student Account</span>
                    </Link>
                    <div className="flex gap-3">
                      <Link
                        to="/college-login"
                        className="flex-1 flex items-center justify-center gap-2 border border-slate-300 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
                      >
                        <i className="fas fa-university"></i>
                        <span>College Login</span>
                      </Link>
                      <Link
                        to="/admin-login"
                        className="flex-1 flex items-center justify-center gap-2 border border-slate-300 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
                      >
                        <i className="fas fa-user-shield"></i>
                        <span>Admin Login</span>
                      </Link>
                    </div>
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
            <h2 className="text-4xl font-bold text-slate-800 mb-4 font-poppins">Ready to Find Your Dream College?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of students who have found their perfect college match through CollegeManzil's expert guidance and comprehensive platform.
            </p>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-medium shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <i className="fas fa-compass"></i>
              <span>Start Your Journey</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-emerald-900 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-poppins">
              Trusted by <span className="text-amber-400">Thousands</span>
            </h2>
            <p className="text-lg text-emerald-100 max-w-3xl mx-auto">
              Join a growing community of successful students and prestigious colleges who trust CollegeManzil for their admission journey and career guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-graduate text-2xl text-emerald-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-emerald-200">Students<br />Successfully Placed</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-university text-2xl text-emerald-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-emerald-200">Partner<br />Colleges</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-2xl text-emerald-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-emerald-200">Student<br />Satisfaction Rate</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-tie text-2xl text-emerald-600"></i>
              </div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-emerald-200">Expert<br />Counsellors</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <i className="fas fa-award text-amber-500"></i>
              <span className="text-slate-700">Best Education Platform 2024</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <i className="fas fa-shield-alt text-emerald-500"></i>
              <span className="text-slate-700">Trusted & Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <i className="fas fa-star text-amber-500"></i>
              <span className="text-slate-700">4.9/5 Student Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12" id="contact">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/logo.jpeg" 
                  alt="CollegeManzil" 
                  className="w-8 h-8 rounded-lg object-cover shadow-sm" 
                />
                <span className="text-xl font-bold">CollegeManzil</span>
              </div>
              <p className="text-slate-400 mb-4 leading-relaxed">
                Your trusted companion for college admissions in India. We connect students with top colleges 
                and universities, making your higher education journey simple, transparent, and successful.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#colleges" className="text-slate-400 hover:text-white transition-colors">Colleges</a></li>
                <li><a href="#counselling" className="text-slate-400 hover:text-white transition-colors">Counselling</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="text-slate-400 hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#refund" className="text-slate-400 hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="#support" className="text-slate-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 CollegeManzil. All rights reserved. | Your journey to success begins with the right direction.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
