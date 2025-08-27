import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit2, Trash2, Eye, GraduationCap, Users, BookOpen, Settings, Upload, MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCollege } from '@/context/collegeContext';

// Initial data remains the same
const initialProfileData = {
  logo: 'https://placehold.co/150x150/E2E8F0/4A5568?text=Logo',
  coverPhoto: 'https://placehold.co/1200x400/E2E8F0/4A5568?text=Cover+Photo',
  gallery: [],
  videos: [''],
  description: 'Welcome to our institution, a place of excellence in learning and research. We are dedicated to nurturing future leaders and innovators.',
  features: ['Wi-Fi Enabled Campus', '24/7 Library Access', 'In-Campus Hostel'],
  address: { line1: '123 University Lane', city: 'Knowledge City', state: 'Education State', pincode: '12345', country: 'India' },
  googleLocation: 'https://maps.google.com/',
  contact: { primaryPhone: '1800-123-4567', secondaryPhone: '1800-987-6543', email: 'admissions@dreaminstitution.edu', website: 'https://dreaminstitution.edu' }
};

const initialCourses = [
  {
    name: 'Bachelor of Technology (B.Tech)',
    subCourses: [
      { name: 'Computer Science Engineering', fee: '150000', eligibility: ['Minimum 75% in Grade 12', 'Physics, Chemistry & Maths mandatory'] },
      { name: 'Mechanical Engineering', fee: '140000', eligibility: ['Minimum 70% in Grade 12', 'Physics, Chemistry & Maths mandatory'] }
    ]
  }
];

const initialStudents = [
  { id: 'MDI-STU-10293', name: 'Rohan Sharma', course: 'B.Tech (CSE)', date: '2025-08-15', status: 'Pending', profile: { photo: 'https://placehold.co/100x100/E2E8F0/4A5568?text=RS', dob: '2004-05-20', phone: '9876543210', email: 'rohan.sharma@email.com', address: '42, Sector 5, Gurgaon', academics: { class10: 'CBSE, 92%', class12: 'CBSE, 88% (PCM)' }, documents: ['Marksheet_10.pdf', 'Marksheet_12.pdf', 'ID_Proof.pdf'] } },
  { id: 'MDI-STU-10245', name: 'Priya Gupta', course: 'BBA', date: '2025-08-14', status: 'Selected', profile: { photo: 'https://placehold.co/100x100/E2E8F0/4A5568?text=PG', dob: '2004-11-10', phone: '9876543211', email: 'priya.gupta@email.com', address: '110, Malviya Nagar, Delhi', academics: { class10: 'ICSE, 95%', class12: 'ICSE, 91% (Commerce)' }, documents: ['Marksheet_10.pdf', 'Marksheet_12.pdf', 'ID_Proof.pdf'] } },
  { id: 'MDI-STU-10112', name: 'Ankit Verma', course: 'B.Tech (Mech)', date: '2025-08-12', status: 'On Hold', profile: { photo: 'https://placehold.co/100x100/E2E8F0/4A5568?text=AV', dob: '2004-01-30', phone: '9876543212', email: 'ankit.verma@email.com', address: '5, Andheri West, Mumbai', academics: { class10: 'State Board, 85%', class12: 'State Board, 82% (PCM)' }, documents: ['Marksheet_10.pdf', 'Marksheet_12.pdf', 'ID_Proof.pdf'] } },
  { id: 'MDI-STU-10056', name: 'Sneha Reddy', course: 'B.Tech (CSE)', date: '2025-08-10', status: 'Rejected', profile: { photo: 'https://placehold.co/100x100/E2E8F0/4A5568?text=SR', dob: '2004-07-15', phone: '9876543213', email: 'sneha.reddy@email.com', address: '88, Jubilee Hills, Hyderabad', academics: { class10: 'CBSE, 96%', class12: 'CBSE, 93% (PCM)' }, documents: ['Marksheet_10.pdf', 'Marksheet_12.pdf', 'ID_Proof.pdf'] } },
];

interface StudentType { id: string; name: string; course: string; date: string; status: string; profile: { photo: string; dob: string; phone: string; email: string; address: string; academics: { class10: string; class12: string }; documents: string[] } }
const CollegeAdminPortal: React.FC = () => {
  const {uploadImage} = useCollege();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [profileData, setProfileData] = useState<typeof initialProfileData>(initialProfileData);
  const [courses, setCourses] = useState<typeof initialCourses>(initialCourses);
  const [students, setStudents] = useState<StudentType[]>(initialStudents as StudentType[]);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null);
  const { toast } = useToast();
  // Cloudinary direct upload state
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  // Legacy local file references (kept for backward compatibility in handleSubmit if needed)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  // Cloudinary environment configuration (Vite env variables must be defined in .env)
  const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
  // Admin account fields required by backend
  const [adminName, setAdminName] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminContactNumber, setAdminContactNumber] = useState<string>('');
  const handleAdminName = (e: React.ChangeEvent<HTMLInputElement>) => setAdminName(e.target.value);
  const handleAdminEmail = (e: React.ChangeEvent<HTMLInputElement>) => setAdminEmail(e.target.value);
  const handleAdminContact = (e: React.ChangeEvent<HTMLInputElement>) => setAdminContactNumber(e.target.value);

  // Profile Management Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({...prev, contact: {...prev.contact, [name]: value }}));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({...prev, address: {...prev.address, [name]: value }}));
  };

  const handleFeatureAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim() !== '') {
      const value = (e.target as HTMLInputElement).value.trim();
      setProfileData(prev => ({ ...prev, features: [...prev.features, value] }));
      (e.target as HTMLInputElement).value = '';
      toast({ title: "Feature added successfully!" });
    }
  };

  const handleFeatureRemove = (indexToRemove: number) => {
    setProfileData(prev => ({ ...prev, features: prev.features.filter((_, index) => index !== indexToRemove) }));
    toast({ title: "Feature removed" });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverPhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store locally in case backend upload-on-save still required
    if (field === 'logo') setLogoFile(file);
    if (field === 'coverPhoto') setCoverFile(file);

    if (!CLOUDINARY_CLOUD || !CLOUDINARY_PRESET) {
      const msg = 'Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.';
      setError(msg);
      toast({ title: 'Configuration Error', description: msg });
      return;
    }
    try {
      setError('');
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_PRESET);
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;
      const res = await fetch(url, { method: 'POST', body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed: ${res.status} ${txt}`);
      }
      const json = await res.json();
      const imageUrl = json.secure_url || json.url || '';
      if (!imageUrl) throw new Error('No URL returned from Cloudinary');
      setProfileData(prev => ({ ...prev, [field]: imageUrl }));
      toast({ title: 'Image uploaded', description: `${field === 'logo' ? 'Logo' : 'Cover photo'} updated` });
    } catch (err: unknown) {
      console.error('Cloudinary upload error', err);
      const message = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Upload failed');
      setError(message);
      toast({ title: 'Upload failed', description: message });
    } finally {
      setUploading(false);
    }
  };

  const [existingId, setExistingId] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch existing profile on mount
  useEffect(() => {
    const load = async () => {
      if (!token) return; // must be logged in as college
      try {
        const res = await fetch('/api/college-admins/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const json = await res.json();
          const d = json.data;
          if (d) {
            setExistingId(d._id);
            // map backend structure to local state
            setAdminName(d.name || '');
            setAdminEmail(d.email || '');
            setAdminContactNumber(d.contactNumber || '');
            setProfileData(prev => ({
              ...prev,
              logo: d.logo?.url || prev.logo,
              coverPhoto: d.coverPhoto?.url || prev.coverPhoto,
              description: d.profile?.description || prev.description,
              features: d.profile?.features?.length ? d.profile.features : prev.features,
              address: d.profile?.address ? { ...prev.address, ...d.profile.address } : prev.address,
              googleLocation: d.profile?.googleLocation || prev.googleLocation,
              contact: d.profile?.contact ? { ...prev.contact, ...d.profile.contact } : prev.contact,
              videos: d.profile?.videos?.length ? d.profile.videos : prev.videos
            }));
            if (Array.isArray(d.courses) && d.courses.length) setCourses(d.courses);
          }
        }
      } catch (e) {
        console.warn('Failed to load existing college admin profile', e);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    try {
      // If direct Cloudinary upload already replaced these with remote URLs, skip extra upload.
      let logoUrl = profileData.logo;
      let coverUrl = profileData.coverPhoto;
      const isCloudinaryUrl = (url: string) => /res.cloudinary.com/.test(url);
      if (logoFile && !isCloudinaryUrl(logoUrl) && uploadImage) {
        logoUrl = await uploadImage(logoFile);
      }
      if (coverFile && !isCloudinaryUrl(coverUrl) && uploadImage) {
        coverUrl = await uploadImage(coverFile);
      }
      const updatedProfileData = {
        ...profileData,
        logo: logoUrl,
        coverPhoto: coverUrl
      }
      // Build JSON payload (no multipart) containing only Cloudinary URLs
      const payload = {
        name: adminName || undefined,
        email: adminEmail || undefined,
        contactNumber: adminContactNumber || undefined,
        profile: {
          description: updatedProfileData.description,
          features: updatedProfileData.features,
          address: updatedProfileData.address,
          googleLocation: updatedProfileData.googleLocation,
          contact: updatedProfileData.contact,
          videos: updatedProfileData.videos
        },
        // Store media URLs in simplified structure expected by backend (fileMeta shape optional)
        logo: { url: logoUrl },
        coverPhoto: { url: coverUrl },
        courses,
      };

      const method = existingId ? 'PUT' : 'POST';
      const url = existingId ? `/api/college-admins/${existingId}` : '/api/college-admins';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Failed to save', description: err.message || 'Server error' });
        return;
      }

  const data = await res.json();
  toast({ title: 'Profile saved', description: data.message || 'Changes submitted' });
  if (!existingId && data?.data?._id) setExistingId(data.data._id);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Network error';
  toast({ title: 'Save failed', description: message });
    }
  };

  // Course Management Handlers
  const addCourse = () => {
    setCourses([...courses, { name: '', subCourses: [{ name: '', fee: '', eligibility: [''] }] }]);
    toast({ title: "New course added" });
  };
  
  const handleCourseChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newCourses = [...courses];
    newCourses[index].name = event.target.value;
    setCourses(newCourses);
  };

  const removeCourse = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
    toast({ title: "Course removed" });
  };

  const addSubCourse = (courseIndex: number) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses.push({ name: '', fee: '', eligibility: [''] });
    setCourses(newCourses);
  };

  const handleSubCourseChange = (courseIndex: number, subIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newCourses = [...courses];
    const { name, value } = event.target;
    if (name === 'name') newCourses[courseIndex].subCourses[subIndex].name = value;
    if (name === 'fee') newCourses[courseIndex].subCourses[subIndex].fee = value;
    setCourses(newCourses);
  };

  const removeSubCourse = (courseIndex: number, subIndex: number) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses = newCourses[courseIndex].subCourses.filter((_, i) => i !== subIndex);
    setCourses(newCourses);
  };

  const addEligibility = (courseIndex: number, subIndex: number) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses[subIndex].eligibility.push('');
    setCourses(newCourses);
  };

  const handleEligibilityChange = (courseIndex: number, subIndex: number, eligIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses[subIndex].eligibility[eligIndex] = event.target.value;
    setCourses(newCourses);
  };
  
  const removeEligibility = (courseIndex: number, subIndex: number, eligIndex: number) => {
    const newCourses = [...courses];
    const eligibility = newCourses[courseIndex].subCourses[subIndex].eligibility;
    if (eligibility.length > 1) {
      newCourses[courseIndex].subCourses[subIndex].eligibility = eligibility.filter((_, i) => i !== eligIndex);
      setCourses(newCourses);
    }
  };

  // Student Management Handlers
  const handleStudentStatusChange = (studentId: string, status: string) => {
    setStudents(students.map(student => student.id === studentId ? { ...student, status } : student));
    toast({ title: `Student status updated to ${status}` });
  };

  const viewStudentProfile = (studentId: string) => {
    const student = students.find(s => s.id === studentId) || null;
    setSelectedStudent(student);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">My Dream Institution</h1>
                  <p className="text-sm text-muted-foreground">Admin Portal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">College Management Dashboard</h2>
          <p className="text-muted-foreground">Manage your institution's profile, courses, and student applications</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Profile Management</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Student Applications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileManagement 
              data={profileData} 
              courses={courses} 
              handlers={{ 
                handleProfileChange, 
                handleContactChange, 
                handleAddressChange, 
                handleFeatureAdd, 
                handleFeatureRemove, 
                handleFileChange, 
                addCourse, 
                handleCourseChange, 
                removeCourse, 
                addSubCourse, 
                handleSubCourseChange, 
                removeSubCourse, 
                addEligibility, 
                handleEligibilityChange, 
                removeEligibility,
                handleSubmit,
                // admin handlers
                handleAdminName,
                handleAdminEmail,
                handleAdminContact,
                adminName,
                adminEmail,
                adminContactNumber,
                uploading,
                error,
                existingId,
                
              }} 
            />
          </TabsContent>

          <TabsContent value="students">
            <InterestedStudents 
              students={students} 
              handlers={{ handleStudentStatusChange, viewStudentProfile }} 
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {selectedStudent && (
        <StudentProfileModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
};

// Profile Management Component
interface ProfileHandlers {
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFeatureAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleFeatureRemove: (index: number) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'coverPhoto') => void;
  addCourse: () => void;
  handleCourseChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeCourse: (index: number) => void;
  addSubCourse: (courseIndex: number) => void;
  handleSubCourseChange: (courseIndex: number, subIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeSubCourse: (courseIndex: number, subIndex: number) => void;
  addEligibility: (courseIndex: number, subIndex: number) => void;
  handleEligibilityChange: (courseIndex: number, subIndex: number, eligIndex: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeEligibility: (courseIndex: number, subIndex: number, eligIndex: number) => void;
  handleSubmit: () => void | Promise<void>;
  handleAdminName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAdminEmail: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAdminContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  adminName: string;
  adminEmail: string;
  adminContactNumber: string;
  uploading: boolean;
  error: string;
  existingId?: string | null;
}
const ProfileManagement = ({ data, courses, handlers }: { data: typeof initialProfileData; courses: typeof initialCourses; handlers: ProfileHandlers }) => {
  return (
    <div className="space-y-8">
      {/* General Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>General Information</span>
          </CardTitle>
          <CardDescription>
            Update your institution's basic information and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium">College Logo</Label>
  <div className="mt-2 flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={data.logo} 
                    alt="Logo" 
                    className="w-20 h-20 rounded-xl object-cover bg-muted shadow-soft"
                  />
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer">
  <Button variant="outline" size="sm" asChild disabled={handlers.uploading}>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
  {handlers.uploading ? 'Uploading...' : 'Upload Logo'}
                      </span>
                    </Button>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handlers.handleFileChange(e, 'logo')}
                      accept="image/*"
                    />
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">Recommended: 200x200px</p>
      {handlers.error && <p className="text-xs text-destructive mt-1">{handlers.error}</p>}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium">Cover Photo</Label>
              <div className="mt-2 space-y-3">
                <div className="relative">
                  <img 
                    src={data.coverPhoto} 
                    alt="Cover" 
                    className="w-full h-24 rounded-lg object-cover bg-muted shadow-soft"
                  />
                </div>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild disabled={handlers.uploading}>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {handlers.uploading ? 'Uploading...' : 'Upload Cover'}
                    </span>
                  </Button>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => handlers.handleFileChange(e, 'coverPhoto')}
                    accept="image/*"
                  />
                </label>
                <p className="text-sm text-muted-foreground">Recommended: 1200x400px</p>
                {handlers.error && <p className="text-xs text-destructive mt-1">{handlers.error}</p>}
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-base font-medium">Institution Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={4} 
              value={data.description} 
              onChange={handlers.handleProfileChange} 
              className="mt-2"
              placeholder="Tell students about your institution..."
            />
          </div>
        </CardContent>
      </Card>
      {/* Administrator Account (fields required by backend) */}
      {!handlers.existingId && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Administrator Account</span>
            </CardTitle>
            <CardDescription>
              Create an administrator account for this institution (required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm">Admin Name</Label>
                <Input type="text" name="adminName" value={handlers.adminName || ''} onChange={handlers.handleAdminName} className="mt-2" />
              </div>
              <div>
                <Label className="text-sm">Admin Email</Label>
                <Input type="email" name="adminEmail" value={handlers.adminEmail || ''} onChange={handlers.handleAdminEmail} className="mt-2" />
              </div>
              {/* Password auto-generated on backend */}
              <div>
                <Label className="text-sm">Contact Number</Label>
                <Input type="text" name="adminContactNumber" value={handlers.adminContactNumber || ''} onChange={handlers.handleAdminContact} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Key Features */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Key Features & Amenities</span>
          </CardTitle>
          <CardDescription>
            Highlight what makes your institution special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="text" 
              onKeyDown={handlers.handleFeatureAdd} 
              placeholder="Type a feature and press Enter to add..." 
              className="w-full"
            />
            <div className="flex flex-wrap gap-2">
              {data.features.map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                  {feature}
                  <button 
                    onClick={() => handlers.handleFeatureRemove(index)} 
                    className="ml-2 text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Contact */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Location & Contact Information</span>
          </CardTitle>
          <CardDescription>
            Help students find and contact your institution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </Label>
                <Input 
                  type="text" 
                  name="line1" 
                  value={data.address.line1} 
                  onChange={handlers.handleAddressChange} 
                  className="mt-2"
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm">City</Label>
                  <Input 
                    type="text" 
                    name="city" 
                    value={data.address.city} 
                    onChange={handlers.handleAddressChange} 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">State</Label>
                  <Input 
                    type="text" 
                    name="state" 
                    value={data.address.state} 
                    onChange={handlers.handleAddressChange} 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Pincode</Label>
                  <Input 
                    type="text" 
                    name="pincode" 
                    value={data.address.pincode} 
                    onChange={handlers.handleAddressChange} 
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Primary Phone</span>
                </Label>
                <Input 
                  type="text" 
                  name="primaryPhone" 
                  value={data.contact.primaryPhone} 
                  onChange={handlers.handleContactChange} 
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Admissions Email</span>
                </Label>
                <Input 
                  type="email" 
                  name="email" 
                  value={data.contact.email} 
                  onChange={handlers.handleContactChange} 
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Offered */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>Courses Offered</span>
              </CardTitle>
              <CardDescription>
                Manage your academic programs and their details
              </CardDescription>
            </div>
            <Button onClick={handlers.addCourse} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {courses.map((course: { name: string; subCourses: { name: string; fee: string; eligibility: string[] }[] }, courseIndex: number) => (
            <Card key={courseIndex} className="border-2 border-muted">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <Input 
                    type="text" 
                    name="name" 
                    value={course.name} 
                    onChange={(e) => handlers.handleCourseChange(courseIndex, e)} 
                    placeholder="Course Name (e.g., B.Tech)" 
                    className="text-lg font-semibold border-0 p-0 focus-visible:ring-0"
                  />
                  <Button 
                    onClick={() => handlers.removeCourse(courseIndex)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Annual Fee (₹)</TableHead>
                        <TableHead>Eligibility</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.subCourses.map((sub: { name: string; fee: string; eligibility: string[] }, subIndex: number) => (
                        <TableRow key={subIndex}>
                          <TableCell>
                            <Input 
                              type="text" 
                              name="name" 
                              value={sub.name} 
                              onChange={(e) => handlers.handleSubCourseChange(courseIndex, subIndex, e)} 
                              placeholder="Specialization name"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="text" 
                              name="fee" 
                              value={sub.fee} 
                              onChange={(e) => handlers.handleSubCourseChange(courseIndex, subIndex, e)} 
                              placeholder="Amount"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              {sub.eligibility.map((elig: string, eligIndex: number) => (
                                <div key={eligIndex} className="flex items-center space-x-2">
                                  <Input 
                                    type="text" 
                                    value={elig} 
                                    onChange={(e) => handlers.handleEligibilityChange(courseIndex, subIndex, eligIndex, e)} 
                                    placeholder="Eligibility criteria"
                                    className="text-sm"
                                  />
                                  <Button 
                                    onClick={() => handlers.removeEligibility(courseIndex, subIndex, eligIndex)} 
                                    variant="ghost" 
                                    size="sm"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              <Button 
                                onClick={() => handlers.addEligibility(courseIndex, subIndex)} 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Criteria
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                onClick={() => handlers.removeSubCourse(courseIndex, subIndex)} 
                                variant="ghost" 
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={() => handlers.addSubCourse(courseIndex)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Specialization
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handlers.handleSubmit} className="mt-4" variant={handlers.existingId ? 'default' : 'secondary'}>
          {handlers.existingId ? 'Update Profile' : 'Create Profile'}
        </Button>
      </div>
    </div>
  );
};

// Student Applications Component
interface InterestedHandlers { handleStudentStatusChange: (id: string, status: string) => void; viewStudentProfile: (id: string) => void }
const InterestedStudents = ({ students, handlers }: { students: StudentType[]; handlers: InterestedHandlers }) => {
  const [filters, setFilters] = useState({ course: 'All', status: 'All', search: '' });

  const handleFilterChange = (field: 'course' | 'status' | 'search', value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student: StudentType) => {
      const searchLower = filters.search.toLowerCase();
      return (
        (filters.course === 'All' || student.course === filters.course) &&
        (filters.status === 'All' || student.status === filters.status) &&
        (student.name.toLowerCase().includes(searchLower) || student.id.toLowerCase().includes(searchLower))
      );
    });
  }, [students, filters]);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Selected': return <Badge variant="default" className="bg-success text-success-foreground">Selected</Badge>;
      case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'On Hold': return <Badge variant="default" className="bg-warning text-warning-foreground">On Hold</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const stats = useMemo(() => {
    const total = students.length;
    const selected = students.filter((s: StudentType) => s.status === 'Selected').length;
    const pending = students.filter((s: StudentType) => s.status === 'Pending').length;
    const rejected = students.filter((s: StudentType) => s.status === 'Rejected').length;
    return { total, selected, pending, rejected };
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Selected</p>
                <p className="text-3xl font-bold text-success">{stats.selected}</p>
              </div>
              <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-warning">{stats.pending}</p>
              </div>
              <div className="h-8 w-8 bg-warning/10 rounded-full flex items-center justify-center">
                <span className="text-warning font-bold">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-3xl font-bold text-destructive">{stats.rejected}</p>
              </div>
              <div className="h-8 w-8 bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-destructive font-bold">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Student Application Pipeline</span>
          </CardTitle>
          <CardDescription>
            Review and manage student applications efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
            <Input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Select value={filters.course} onValueChange={(value) => handleFilterChange('course', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Courses</SelectItem>
                {[...new Set(students.map((s: StudentType) => s.course))].map((course: string) => (
                  <SelectItem key={course} value={course}>{course}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Selected">Selected</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student: StudentType) => (
                  <TableRow key={student.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={student.profile.photo} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto font-medium text-primary"
                            onClick={() => handlers.viewStudentProfile(student.id)}
                          >
                            {student.name}
                          </Button>
                          <p className="text-sm text-muted-foreground">{student.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.date}</TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          onClick={() => handlers.handleStudentStatusChange(student.id, 'Selected')} 
                          variant="success"
                          size="sm"
                          disabled={student.status === 'Selected'}
                        >
                          Select
                        </Button>
                        <Button 
                          onClick={() => handlers.handleStudentStatusChange(student.id, 'Rejected')} 
                          variant="destructive"
                          size="sm"
                          disabled={student.status === 'Rejected'}
                        >
                          Reject
                        </Button>
                        <Button 
                          onClick={() => handlers.handleStudentStatusChange(student.id, 'On Hold')} 
                          variant="warning"
                          size="sm"
                          disabled={student.status === 'On Hold'}
                        >
                          Hold
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Student Profile Modal Component
const StudentProfileModal = ({ student, onClose }: { student: StudentType | null; onClose: () => void }) => {
  if (!student) return null;

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Student Profile</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about {student.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={student.profile.photo} />
              <AvatarFallback className="text-xl">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground">{student.name}</h3>
              <p className="text-muted-foreground">{student.id}</p>
              <p className="text-primary font-medium mt-1">Interested in: {student.course}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="font-medium">{student.profile.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{student.profile.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{student.profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-medium text-right max-w-48">{student.profile.address}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Academic Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class 10:</span>
                  <span className="font-medium">{student.profile.academics.class10}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class 12:</span>
                  <span className="font-medium">{student.profile.academics.class12}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {student.profile.documents.map((doc, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1.5">
                    {doc}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollegeAdminPortal;
