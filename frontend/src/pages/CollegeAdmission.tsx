import { useState, useEffect, useCallback, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMainContext } from '../context/mainContext';

// Defines the structure for a college record from /api/colleges endpoint.
interface ICollege {
    id: string; // CollegeAdmin id
    collegeId?: string | null; // linked College id
    name: string;
    email?: string;
    address?: string; // flat address string
    city?: string;
    state?: string;
    contactNumber?: string;
    createdAt?: string;
    courses?: string[]; // array of course names (flattened)
    logo?: string | null; // direct URL string
    coverPhoto?: string | null; // direct URL string
    rating?: number | null;
}

// --- API HELPER ---
async function callGeminiAPI(prompt: string, retries = 3, delay = 1000): Promise<string> {
    const apiKey = ""; // This will be handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 429 && retries > 0) {
                await new Promise(res => setTimeout(res, delay));
                return callGeminiAPI(prompt, retries - 1, delay * 2);
            }
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Sorry, the AI couldn't generate a response. The result was empty.";
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return `An error occurred: ${(error as Error).message}. Please check the console for details.`;
    }
}

// --- UI COMPONENTS ---

// Header Component with gradient background and professional styling
const Header: FC = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <img src="/logo.png" alt="CollegeManzil" className="w-8 h-8 rounded-lg object-cover shadow-sm mr-3" />
                        <span className="text-xl font-bold text-white">CollegeManzil</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-white/90 font-medium hidden sm:block">Student Portal</span>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                            <i className="fas fa-user text-white text-sm"></i>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 border border-white/30 text-white rounded-lg text-sm hover:bg-white/10 transition-all duration-300"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};



// EducationalQualifications Component

// CollegeSearchFilters Component
interface SearchFiltersProps {
    filters: {
        searchTerm: string;
        location: string;
        course: string;
    };
    onFiltersChange: (filters: { searchTerm: string; location: string; course: string; }) => void;
}

const CollegeSearchFilters: FC<SearchFiltersProps> = ({ filters, onFiltersChange }) => {
    const handleFilterChange = (key: string, value: string) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearAllFilters = () => {
        onFiltersChange({ searchTerm: '', location: '', course: '' });
    };

    return (
        <aside className="w-full lg:w-1/4 lg:sticky top-24 self-start">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <i className="fas fa-filter text-emerald-600"></i>
                    Search & Filter Colleges
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Search Colleges</label>
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="text"
                                placeholder="Search by college name..."
                                value={filters.searchTerm}
                                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                        <div className="relative">
                            <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="text"
                                placeholder="City or State..."
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
                        <div className="relative">
                            <i className="fas fa-graduation-cap absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="text"
                                placeholder="Course name..."
                                value={filters.course}
                                onChange={(e) => handleFilterChange('course', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    
                    <button 
                        onClick={clearAllFilters}
                        className="w-full bg-slate-100 text-slate-600 py-2 rounded-lg font-medium hover:bg-slate-200 transition-all duration-300"
                    >
                        <i className="fas fa-undo mr-2"></i>
                        Clear All Filters
                    </button>
                </div>
            </div>
        </aside>
    );
};

// CollegeCard Component
interface CollegeCardProps {
    college: ICollege;
    isShortlisted: boolean;
    onShortlistToggle: (id: string) => void;
    onViewDetails?: (college: ICollege) => void;
}
const CollegeCard: FC<CollegeCardProps> = ({ college, isShortlisted, onShortlistToggle, onViewDetails }) => {
    const getCollegeLocation = () => {
        const city = college.city || '';
        const state = college.state || '';
        return city && state ? `${city}, ${state}` : city || state || 'Location not specified';
    };

    const getPrimaryCourse = () => {
        return college.courses?.[0] || 'Various Programs';
    };

    const getCollegeImage = () => {
        // First try coverPhoto, then logo, then fallback to placeholder
        return college.coverPhoto || college.logo || 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=400';
    };

    const getCollegeLogo = () => {
        return college.logo || 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=C';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* College Image */}
            <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <img 
                    src={getCollegeImage()}
                    alt={college.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-schools-159490.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* College Logo Overlay */}
                <div className="absolute top-4 left-4">
                    <img 
                        src={getCollegeLogo()}
                        alt={`${college.name} logo`}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-lg bg-white"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/48x48/10B981/FFFFFF?text=C';
                        }}
                    />
                </div>
                
                <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-sm font-bold text-white bg-emerald-600/90 backdrop-blur-sm rounded-full border border-white/20">
                        <i className="fas fa-star text-amber-400 mr-1"></i>
                        {college.rating || '4.2'}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{college.name}</h4>
                        <p className="text-sm text-slate-600 mb-2 flex items-center gap-1">
                            <i className="fas fa-map-marker-alt text-emerald-600"></i>
                            {getCollegeLocation()}
                        </p>
                        <p className="text-sm text-slate-700 mb-3">
                            <span className="font-semibold text-emerald-600">Featured Program:</span> {getPrimaryCourse()}
                        </p>
                        {/* Note: Description not available in public API for privacy */}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                    <button 
                        onClick={() => onViewDetails && onViewDetails(college)}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-all duration-300"
                    >
                        <i className="fas fa-info-circle"></i>
                        View Details
                    </button>
                    <button 
                        onClick={() => onShortlistToggle(college.id)} 
                        className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all duration-300 ${
                            isShortlisted 
                                ? 'bg-amber-100 text-amber-700 border border-amber-300 shadow-sm' 
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                    >
                        <i className={`fas ${isShortlisted ? 'fa-star' : 'fa-star-o'}`}></i>
                        {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ShortlistedColleges Component
interface ShortlistedCollegesProps {
    colleges: ICollege[];
    onCompare: () => void;
    onRemove: (id: string) => void;
    onViewDetails: (college: ICollege) => void;
}
const ShortlistedColleges: FC<ShortlistedCollegesProps> = ({ colleges, onCompare, onRemove, onViewDetails }) => {
    const getCollegeLocation = (college: ICollege) => {
        const city = college.city || '';
        const state = college.state || '';
        return city && state ? `${city}, ${state}` : city || state || 'Location not specified';
    };

    const getPrimaryCourse = (college: ICollege) => {
        return college.courses?.[0] || 'Various Programs';
    };

    return (
        <div className="mt-12">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="bg-amber-100 p-3 rounded-lg">
                            <i className="fas fa-star text-amber-600 text-xl"></i>
                        </span>
                        Your Shortlisted Colleges
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                            {colleges.length} Selected
                        </span>
                    </h2>
                    <div className="flex gap-3">
                        <button 
                            onClick={onCompare} 
                            disabled={colleges.length < 2} 
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <i className="fas fa-chart-bar"></i>
                            AI Compare ({colleges.length})
                        </button>
                    </div>
                </div>
                
                {colleges.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fas fa-university text-3xl text-slate-400"></i>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No colleges shortlisted yet</h3>
                        <p className="text-slate-500 mb-6">Start exploring colleges above and shortlist your favorites for comparison!</p>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                                <i className="fas fa-lightbulb text-amber-500"></i>
                                Tip: Shortlist 2+ colleges to compare
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Mobile view - Cards */}
                        <div className="block md:hidden space-y-4">
                            {colleges.map(college => (
                                <div key={college.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-slate-800">{college.name}</h4>
                                        <button 
                                            onClick={() => onRemove(college.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2">
                                        <i className="fas fa-map-marker-alt text-emerald-600 mr-1"></i>
                                        {getCollegeLocation(college)}
                                    </p>
                                    <p className="text-sm text-slate-600 mb-3">
                                        <i className="fas fa-graduation-cap text-emerald-600 mr-1"></i>
                                        {getPrimaryCourse(college)}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-amber-600">
                                            <i className="fas fa-star mr-1"></i>
                                            {college.rating || '4.2'}
                                        </span>
                                        <button 
                                            onClick={() => onViewDetails && onViewDetails(college)}
                                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop view - Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">College</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Primary Course</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {colleges.map(college => (
                                        <tr key={college.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <img 
                                                        src={college.logo || 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=C'}
                                                        alt={college.name}
                                                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                                                        onError={(e) => {
                                                            e.currentTarget.src = 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=C';
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-800">{college.name}</div>
                                                        {college.email && (
                                                            <div className="text-xs text-slate-500">{college.email}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                <i className="fas fa-map-marker-alt text-emerald-600 mr-1"></i>
                                                {getCollegeLocation(college)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getPrimaryCourse(college)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <i className="fas fa-star text-amber-500"></i>
                                                    {college.rating || '4.2'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => onViewDetails && onViewDetails(college)}
                                                        className="text-emerald-600 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <button 
                                                        onClick={() => onRemove(college.id)}
                                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Remove from Shortlist"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// GeminiModal Component
interface GeminiModalProps {
    isOpen: boolean;
    title: string;
    content: string;
    isLoading: boolean;
    onClose: () => void;
}
const GeminiModal: FC<GeminiModalProps> = ({ isOpen, title, content, isLoading, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white w-full max-w-4xl max-h-[80vh] shadow-2xl rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <i className="fas fa-robot"></i>
                            {title}
                        </h3>
                        <button 
                            onClick={onClose} 
                            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
                            <p className="text-slate-600">Our AI is analyzing and comparing your shortlisted colleges...</p>
                            <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                        </div>
                    ) : (
                        <div className="prose max-w-none">
                            <div 
                                className="text-slate-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                    __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-700">$1</strong>')
                                        .replace(/\n/g, '<br>')
                                        .replace(/•/g, '<span class="text-emerald-600">•</span>')
                                }} 
                            />
                        </div>
                    )}
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <i className="fas fa-info-circle text-emerald-600"></i>
                            Powered by AI • CollegeManzil Expert Analysis
                        </p>
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const CollegeAdmissionApp: FC = () => {
    const { server } = useMainContext();
    const [colleges, setColleges] = useState<ICollege[]>([]);
    const [shortlisted, setShortlisted] = useState<string[]>([]); // college ids
    const [shortlistLoading, setShortlistLoading] = useState(false);
    const [shortlistError, setShortlistError] = useState<string|undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [collegesLoading, setCollegesLoading] = useState(true);
    const [selectedCollege, setSelectedCollege] = useState<ICollege | null>(null);
    const [showCollegeDetails, setShowCollegeDetails] = useState(false);
    
    // Search and filter states
    const [searchFilters, setSearchFilters] = useState({
        searchTerm: '',
        location: '',
        course: ''
    });

    // Function to fetch colleges with search parameters
    const fetchColleges = useCallback(async (filters = searchFilters) => {
        try {
            setCollegesLoading(true);
            
            // Build query parameters
            const queryParams = new URLSearchParams();
            if (filters.searchTerm.trim()) {
                queryParams.append('search', filters.searchTerm.trim());
            }
            if (filters.location.trim()) {
                queryParams.append('location', filters.location.trim());
            }
            if (filters.course.trim()) {
                queryParams.append('course', filters.course.trim());
            }
            
            // Fetch from public colleges endpoint which doesn't require authentication
            const url = `${server}/api/colleges${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch colleges');
            const body = await res.json();
            setColleges(body.data || []);
        } catch (err) {
            console.error('Error loading colleges', err);
        } finally {
            setCollegesLoading(false);
        }
    }, [searchFilters, server]);

    useEffect(() => {
        fetchColleges();
    }, [fetchColleges]);

    // Refetch colleges when search filters change
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            fetchColleges(searchFilters);
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimeout);
    }, [searchFilters, fetchColleges]);

    // Fetch shortlisted colleges from backend
    useEffect(() => {
        const loadShortlist = async () => {
            setShortlistLoading(true);
            setShortlistError(undefined);
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const res = await fetch(`${server}/api/shortlists`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.status === 401) throw new Error('Not authenticated');
                if (!res.ok) throw new Error('Failed to load shortlist');
                const body = await res.json();
                interface ShortlistItem { college: string | { _id?: string; id?: string } }
                const raw: ShortlistItem[] = Array.isArray(body.data) ? body.data : [];
                const ids = raw.map(item => {
                    if (item && typeof item.college === 'object') return item.college._id || item.college.id || '';
                    return item.college as string;
                }).filter(id => typeof id === 'string' && id.length > 0);
                setShortlisted(ids);
            } catch (e) {
                console.error('loadShortlist error', e);
                setShortlistError(e instanceof Error ? e.message : 'Error loading shortlist');
            } finally {
                setShortlistLoading(false);
            }
        };
        loadShortlist();
    }, [server]);

    const handleCompareColleges = async () => {
        const shortlistedColleges = colleges.filter(c => shortlisted.includes(c.id));
        if (shortlistedColleges.length < 2) {
            alert('Please shortlist at least 2 colleges for comparison');
            return;
        }

        setIsModalOpen(true);
        setIsLoading(true);
        setModalTitle('AI-Powered College Comparison');
        
        const collegeDetails = shortlistedColleges.map(c => {
            const location = c.city && c.state 
                ? `${c.city}, ${c.state}` 
                : 'Location not specified';
            const courses = c.courses?.join(', ') || 'Various Programs';
            return `${c.name} (Located in ${location}, offering ${courses})`;
        }).join(' vs ');
        
        const prompt = `As an expert education counsellor, provide a detailed comparison between these colleges: ${collegeDetails}. 

        Please structure your response with the following sections:
        **🎓 Academic Excellence & Programs**
        **🏛️ Campus Infrastructure & Facilities** 
        **💼 Placement & Career Opportunities**
        **🌟 Unique Strengths & Specializations**
        **💰 Fee Structure & Value for Money**
        **📍 Location & Connectivity**
        **🏆 Final Recommendation**

        Make it comprehensive yet easy to understand for students. Use bullet points where appropriate and provide actionable insights.`;
        
        const response = await callGeminiAPI(prompt);
        setModalContent(response);
        setIsLoading(false);
    };

    const handleViewCollegeDetails = (college: ICollege) => {
        setSelectedCollege(college);
        setShowCollegeDetails(true);
    };

    const handleShortlistToggle = (id: string) => {
        setShortlisted(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
        (async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const res = await fetch(`${server}/api/shortlists/toggle`, {
                    method: 'POST',
                    headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ collegeId: id })
                });
                if (res.status === 401) throw new Error('Unauthorized');
                if (!res.ok) throw new Error('Toggle failed');
                const body = await res.json();
                if (typeof body.shortlisted === 'boolean') {
                    setShortlisted(prev => body.shortlisted ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter(i => i !== id));
                }
            } catch (e) {
                console.error('toggle shortlist error', e);
                setShortlisted(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
            }
        })();
    };

    const handleRemoveShortlisted = (id: string) => {
        setShortlisted(prev => prev.filter(i => i !== id));
        (async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const res = await fetch(`${server}/api/shortlists/${id}`, {
                    method: 'DELETE',
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.status === 401) throw new Error('Unauthorized');
                if (!res.ok) throw new Error('Remove failed');
            } catch (e) {
                console.error('remove shortlist error', e);
                setShortlisted(prev => prev.includes(id) ? prev : [...prev, id]);
            }
        })();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Header />
            <main className="pt-24">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Discover Your Perfect College Match
                            </h1>
                            <p className="text-xl opacity-90 mb-6">
                                Explore 1000+ verified colleges across India with expert guidance and AI-powered recommendations
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <i className="fas fa-university text-amber-300"></i>
                                    <span>1000+ Colleges</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <i className="fas fa-user-tie text-amber-300"></i>
                                    <span>Expert Counsellors</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <i className="fas fa-robot text-amber-300"></i>
                                    <span>AI-Powered Matching</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <CollegeSearchFilters 
                            filters={searchFilters}
                            onFiltersChange={setSearchFilters}
                        />
                        <div className="w-full lg:w-3/4">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                                            <i className="fas fa-university text-emerald-600"></i>
                                            Available Colleges
                                        </h2>
                                        <p className="text-slate-600">Discover your perfect college match from our comprehensive database of verified institutions</p>
                                    </div>
                                    <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200">
                                        <i className="fas fa-info-circle text-emerald-600 mr-1"></i>
                                        {colleges.length} colleges found
                                    </div>
                                </div>

                                {collegesLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                                                <div className="h-32 bg-slate-200 rounded-lg mb-4"></div>
                                                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                                                <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
                                                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : colleges.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <i className="fas fa-search text-3xl text-slate-400"></i>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No colleges found</h3>
                                        <p className="text-slate-500">Try adjusting your filters or search terms</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {colleges.map(college => (
                                            <CollegeCard
                                                key={college.id}
                                                college={college}
                                                isShortlisted={shortlisted.includes(college.id)}
                                                onShortlistToggle={handleShortlistToggle}
                                                onViewDetails={handleViewCollegeDetails}
                                            />
                                        ))}
                                    </div>
                                )}

                                {shortlistLoading && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <p className="text-sm text-emerald-700 flex items-center gap-2">
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Loading your shortlist...
                                        </p>
                                    </div>
                                )}
                                {shortlistError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-700 flex items-center gap-2">
                                            <i className="fas fa-exclamation-triangle"></i>
                                            {shortlistError}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <ShortlistedColleges
                                colleges={colleges.filter(c => shortlisted.includes(c.id))}
                                onCompare={handleCompareColleges}
                                onRemove={handleRemoveShortlisted}
                                onViewDetails={handleViewCollegeDetails}
                            />
                        </div>
                    </div>
                </div>
            </main>
            
            <GeminiModal
                isOpen={isModalOpen}
                title={modalTitle}
                content={modalContent}
                isLoading={isLoading}
                onClose={() => setIsModalOpen(false)}
            />

            {/* College Details Modal */}
            {showCollegeDetails && selectedCollege && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] shadow-2xl rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <i className="fas fa-university"></i>
                                    {selectedCollege.name}
                                </h3>
                                <button 
                                    onClick={() => setShowCollegeDetails(false)} 
                                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-3">College Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <p><strong>Location:</strong> {selectedCollege.city}, {selectedCollege.state}</p>
                                        <p><strong>Contact:</strong> {selectedCollege.contactNumber}</p>
                                        <p><strong>Email:</strong> {selectedCollege.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 mb-3">Available Courses</h4>
                                    <div className="space-y-2">
                                        {selectedCollege.courses?.map((courseName, index) => (
                                            <div key={index} className="bg-slate-50 p-3 rounded-lg">
                                                <h5 className="font-semibold text-slate-700">{courseName}</h5>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollegeAdmissionApp;