import React, { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
// Defines the structure for an educational qualification record.
interface IQualification {
  id: number;
  degree: string;
  board: string;
  subjects: string;
  year: string;
  grade: string;
  doc: string;
}

// Defines the structure for a college record.
interface ICollege {
    id: string; // CollegeAdmin id
    collegeId?: string | null; // linked College id
    name: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    contactNumber?: string;
    createdAt?: string;
    courses?: string[]; // array of course names
    logo?: string | null;
    coverPhoto?: string | null;
    rating?: number | null;
}

// --- SVG ICONS ---
// A collection of SVG icons used throughout the application for a consistent look.
const Icons = {
  logo: (
    <svg className="h-8 w-auto text-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7L12 12L21 7L12 2Z"/>
      <path d="M3 17L12 22L21 17"/>
      <path d="M3 12L12 17L21 12"/>
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
  ),
  delete: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  upload: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  ),
  save: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  cancel: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  finalise: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  expert: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  ),
  graduation: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  form: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  chart: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  support: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
    </svg>
  ),
};

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
const Header: FC = () => (
    <header className="gradient-hero shadow-elegant fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex-shrink-0 flex items-center">
                    {Icons.logo}
                    <span className="ml-3 text-xl font-bold text-primary-foreground">My Dream Institution</span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-primary-foreground/90 font-medium hidden sm:block">Jane Doe</span>
                    <img 
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-foreground/20" 
                        src="https://placehold.co/100x100/E2E8F0/4A5568?text=JD" 
                        alt="Student Profile" 
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/E2E8F0/4A5568?text=Error')} 
                    />
                    <button className="btn-outline border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-sm">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </header>
);


// Tabs Component with improved styling
interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: 'profile' | 'search') => void;
}
const Tabs: FC<TabsProps> = ({ activeTab, setActiveTab }) => (
    <nav className="bg-card rounded-xl shadow-md mb-8">
        <div className="border-b border-border">
            <div className="flex -mb-px">
                <button
                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-semibold text-sm sm:text-base focus:outline-none transition-all ${
                        activeTab === 'profile' ? 'tab-active' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                    onClick={() => setActiveTab('profile')}
                >
                    👤 Student Profile
                </button>
                <button
                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-semibold text-sm sm:text-base focus:outline-none transition-all ${
                        activeTab === 'search' ? 'tab-active' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                    onClick={() => setActiveTab('search')}
                >
                    🎓 College Search
                </button>
            </div>
        </div>
    </nav>
);

// PersonalDetails Component with improved styling
const PersonalDetails: FC = () => {
    const uploadFile = (id: string) => {
        const statusDiv = document.getElementById(id);
        if (statusDiv) {
            statusDiv.innerHTML = `
                <div class="flex items-center justify-between mt-1 w-full px-3 py-2 text-sm text-left text-success bg-success/10 rounded-lg border border-success/20">
                    <span>document.pdf</span>
                    <span class="text-success font-semibold ml-2">✅ Verified</span>
                </div>
            `;
        }
    };

    return (
        <div className="card-elevated p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="bg-primary/10 p-2 rounded-lg">👤</span>
                Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                {/* Photo Upload */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground mb-3">Profile Photo</label>
                    <div className="flex items-center space-x-6">
                        <img 
                            className="h-24 w-24 rounded-full object-cover shadow-lg ring-4 ring-primary/20" 
                            src="https://placehold.co/128x128/E2E8F0/4A5568?text=JD" 
                            alt="Current profile photo" 
                        />
                        <button type="button" className="btn-secondary">
                            {Icons.upload} Upload Photo
                        </button>
                    </div>
                </div>
                
                {/* Form Fields */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                    <input type="text" id="name" className="form-input" placeholder="Jane Doe" />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                    <input type="tel" id="phone" className="form-input" placeholder="+91 12345 67890" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                    <input type="email" id="email" className="form-input" placeholder="jane.doe@example.com" />
                </div>
                <div>
                    <label htmlFor="father_name" className="block text-sm font-semibold text-foreground mb-2">Father's Name</label>
                    <input type="text" id="father_name" className="form-input" placeholder="John Doe" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-foreground mb-2">Complete Address</label>
                    <textarea id="address" rows={3} className="form-input" placeholder="123 Main Street, Anytown, State, PIN Code"></textarea>
                </div>
                <div>
                    <label htmlFor="aadhar" className="block text-sm font-semibold text-foreground mb-2">Aadhar Number</label>
                    <input type="text" id="aadhar" className="form-input" placeholder="1234 5678 9012" />
                </div>
                <div className="flex items-end">
                    <div id="aadhar-upload-status" className="w-full">
                        <label className="block text-sm font-semibold text-foreground mb-2 invisible">Upload</label>
                        <button onClick={() => uploadFile('aadhar-upload-status')} className="btn-outline w-full">
                            {Icons.upload} Upload Aadhar
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-semibold text-foreground mb-2">Date of Birth</label>
                    <input type="date" id="dob" className="form-input" />
                </div>
                <div className="flex items-end">
                    <div id="dob-upload-status" className="w-full">
                        <label className="block text-sm font-semibold text-foreground mb-2 invisible">Upload</label>
                        <button onClick={() => uploadFile('dob-upload-status')} className="btn-outline w-full">
                            {Icons.upload} Upload DOB Proof
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-foreground mb-2">Category</label>
                    <select id="category" className="form-input">
                        <option>General</option>
                        <option>OBC</option>
                        <option>SC</option>
                        <option>ST</option>
                        <option>EWS</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <div id="category-upload-status" className="w-full">
                        <label className="block text-sm font-semibold text-foreground mb-2 invisible">Upload</label>
                        <button onClick={() => uploadFile('category-upload-status')} className="btn-outline w-full">
                            {Icons.upload} Upload Category Proof
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-right">
                <button className="btn-primary">
                    {Icons.save} Save Personal Details
                </button>
            </div>
        </div>
    );
};

// EducationalQualifications Component
interface EducationalQualificationsProps {
    onSuggestCareers: () => void;
}
const EducationalQualifications: FC<EducationalQualificationsProps> = ({ onSuggestCareers }) => {
    return (
        <div className="card-elevated p-6 sm:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <span className="bg-primary/10 p-2 rounded-lg">🎓</span>
                    Educational Qualifications
                </h2>
                <div className="flex items-center gap-4">
                    <button onClick={onSuggestCareers} className="btn-accent text-sm">
                        ✨ Suggest Career Paths
                    </button>
                    <button className="btn-secondary text-sm">
                        + Add Qualification
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Degree/Certificate</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Board/University</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Subjects</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">B.Sc. Computer Science</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">University of Mumbai</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">CS, Math, Physics</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">2023</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">8.5 CGPA</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <button className="text-primary hover:text-primary-dark">{Icons.edit}</button>
                                    <button className="text-destructive hover:text-destructive/80">{Icons.delete}</button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">12th (HSC)</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Maharashtra State Board</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">Physics, Chemistry, Math</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">2020</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">88.5%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <button className="text-primary hover:text-primary-dark">{Icons.edit}</button>
                                    <button className="text-destructive hover:text-destructive/80">{Icons.delete}</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// CollegeSearchFilters Component
const CollegeSearchFilters: FC = () => (
    <aside className="w-full lg:w-1/4 lg:sticky top-24 self-start">
        <div className="card-elevated p-6 space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                🔍 Search Filters
            </h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Course Type</label>
                    <select className="form-input">
                        <option>All Courses</option>
                        <option>Engineering</option>
                        <option>Medical</option>
                        <option>Management</option>
                        <option>Arts & Sciences</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">State</label>
                    <select className="form-input">
                        <option>All States</option>
                        <option>Maharashtra</option>
                        <option>Karnataka</option>
                        <option>Delhi</option>
                        <option>Tamil Nadu</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Rating</label>
                    <select className="form-input">
                        <option>All Ratings</option>
                        <option>4.5+ Stars</option>
                        <option>4.0+ Stars</option>
                        <option>3.5+ Stars</option>
                    </select>
                </div>
                
                <button className="btn-primary w-full">
                    Apply Filters
                </button>
            </div>
        </div>
    </aside>
);

// CollegeCard Component
interface CollegeCardProps {
    college: ICollege;
    isShortlisted: boolean;
    onShortlistToggle: (id: string) => void;
    onViewDetails?: (college: ICollege) => void;
}
const CollegeCard: FC<CollegeCardProps> = ({ college, isShortlisted, onShortlistToggle, onViewDetails }) => (
    <div className="card-elevated p-6">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h4 className="text-lg font-bold text-foreground mb-2">{college.name}</h4>
                <p className="text-sm text-muted-foreground mb-1">📍 {college.city}, {college.state}</p>
                <p className="text-sm text-foreground mb-4">
                    <span className="font-semibold">Key Course:</span> {college.courses?.[0] || 'Various Programs'}
                </p>
            </div>
            <div className="flex-shrink-0 ml-4">
                <span className="px-3 py-1 text-sm font-bold text-accent bg-accent/10 rounded-full">
                    ⭐ {college.rating}
                </span>
            </div>
        </div>
            <div className="flex justify-between items-center pt-4 border-t border-border">
            <button className="btn-secondary text-sm" onClick={() => onViewDetails && onViewDetails(college)}>
                📋 View Details
            </button>
            <button 
                onClick={() => onShortlistToggle(college.id)} 
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                    isShortlisted 
                        ? 'bg-accent text-accent-foreground shadow-md' 
                        : 'bg-muted text-muted-foreground hover:bg-secondary'
                }`}
            >
                {isShortlisted ? '⭐ Shortlisted' : '☆ Shortlist'}
            </button>
        </div>
    </div>
);

// ShortlistedColleges Component
interface ShortlistedCollegesProps {
    colleges: ICollege[];
    onCompare: () => void;
    onRemove: (id: string) => void;
}
const ShortlistedColleges: FC<ShortlistedCollegesProps> = ({ colleges, onCompare, onRemove }) => (
    <div className="mt-12">
        <div className="card-elevated p-6 sm:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <span className="bg-accent/10 p-2 rounded-lg">⭐</span>
                    Shortlisted Colleges
                </h2>
                <button 
                    onClick={onCompare} 
                    disabled={colleges.length < 2} 
                    className="btn-accent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    ✨ Compare with AI
                </button>
            </div>
            {colleges.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No colleges shortlisted yet.</p>
                    <p className="text-muted-foreground">Start exploring colleges above!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">College</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {colleges.map(college => (
                                <tr key={college.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{college.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{college.city}, {college.state}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{college.courses?.[0] || 'Various Programs'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">⭐ {college.rating}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        <button 
                                            onClick={() => onRemove(college.id)}
                                            className="text-destructive hover:text-destructive/80"
                                        >
                                            {Icons.delete}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
);

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
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 border border-border w-full max-w-2xl shadow-xl rounded-xl bg-card">
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                        <h3 className="text-xl leading-6 font-bold text-foreground">✨ {title}</h3>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                            {Icons.close}
                        </button>
                    </div>
                    <div className="mt-2 px-2 py-3 text-sm text-foreground max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const CollegeAdmissionApp: FC = () => {
    const navigate = useNavigate();
    // State Management
    const [activeTab, setActiveTab] = useState<'profile' | 'search'>('profile');
    const [qualifications, setQualifications] = useState<IQualification[]>([]);
    const [colleges, setColleges] = useState<ICollege[]>([]);
    const [shortlisted, setShortlisted] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initial data loading
    useEffect(() => {
        setQualifications([
            { id: 1, degree: 'B.Sc. Computer Science', board: 'University of Mumbai', subjects: 'CS, Math, Physics', year: '2023', grade: '8.5 CGPA', doc: 'BSc_Marksheet.pdf' },
            { id: 2, degree: '12th (HSC)', board: 'Maharashtra State Board', subjects: 'Physics, Chemistry, Math', year: '2020', grade: '88.5%', doc: 'HSC_Marksheet.pdf' },
        ]);

        // fetch colleges from backend
        (async () => {
            try {
                const res = await fetch('/api/colleges');
                if (!res.ok) throw new Error('Failed to fetch colleges');
                const body = await res.json();
                setColleges(body.data || []);
            } catch (err) {
                console.error('Error loading colleges', err);
            }
        })();
    }, []);

    const handleSuggestCareers = async () => {
        setIsModalOpen(true);
        setIsLoading(true);
        setModalTitle('Career Path Suggestions');
        const qualificationsText = qualifications.map(q => `${q.degree} with subjects in ${q.subjects}`).join(', ');
        const prompt = `Based on these qualifications: ${qualificationsText}, suggest 5 potential career paths with a one-sentence description for each. Format as a simple list.`;
        const response = await callGeminiAPI(prompt);
        setModalContent(response.replace(/\n/g, '<br>'));
        setIsLoading(false);
    };

    const handleCompareColleges = async () => {
        setIsModalOpen(true);
        setIsLoading(true);
        setModalTitle('AI College Comparison');
    const collegeNames = colleges.filter(c => shortlisted.includes(c.id)).map(c => c.name).join(' and ');
        const prompt = `Provide a detailed comparison between ${collegeNames}. Compare them on: **Key Programs**, **Campus Life**, **Placement Statistics**, and **Notable Alumni**. Use bullet points.`;
        const response = await callGeminiAPI(prompt);
        setModalContent(response.replace(/\n/g, '<br>'));
        setIsLoading(false);
    };
    
    const handleShortlistToggle = (id: string) => {
        setShortlisted(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleRemoveShortlisted = (id: string) => {
        setShortlisted(prev => prev.filter(i => i !== id));
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            
            <main className="pt-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <PersonalDetails />
                            <EducationalQualifications onSuggestCareers={handleSuggestCareers} />
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="flex flex-col lg:flex-row gap-8">
                           <CollegeSearchFilters />
                           <div className="w-full lg:w-3/4">
                                <div className="space-y-6">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold text-foreground mb-2">🏛️ Available Colleges</h2>
                                        <p className="text-muted-foreground">Discover your perfect college match from our comprehensive database</p>
                                    </div>
                                    {colleges.map(college => (
                                        <CollegeCard 
                                            key={college.id} 
                                            college={college} 
                                            isShortlisted={shortlisted.includes(college.id)}
                                            onShortlistToggle={handleShortlistToggle}
                                            onViewDetails={(c) => navigate(`/colleges/${c.id}`)}
                                        />
                                    ))}
                                </div>
                                <ShortlistedColleges 
                                    colleges={colleges.filter(c => shortlisted.includes(c.id))}
                                    onCompare={handleCompareColleges}
                                    onRemove={handleRemoveShortlisted}
                                />
                           </div>
                        </div>
                    )}
                </div>
            </main>
            
            <GeminiModal 
                isOpen={isModalOpen}
                title={modalTitle}
                content={modalContent}
                isLoading={isLoading}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default CollegeAdmissionApp;