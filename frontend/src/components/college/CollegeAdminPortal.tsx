import React, { useState, useEffect } from 'react';
import { ProfileView } from "./ProfileView";
import { ProfileForm } from "./ProfileForm";
import { ImageEditor } from "@/components/ui/image-editor";
import { useToast } from "@/hooks/use-toast";
import { useMainContext } from '../../context/mainContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Mail, Phone, Calendar, GraduationCap, User, Building2, RefreshCw } from 'lucide-react';

interface ForwardedStudent {
  id: string;
  name: string;
  email: string;
  phone: number;
  dateOfBirth: string;
  education: string;
  interestedCourses: Array<{ parent: string; name: string; addedAt: string }>;
  notes: string;
  forwardedAt: string;
  college: { name: string; email: string };
}

interface Course {
  name: string;
  subCourses: Array<{
    name: string;
    fee: string;
    eligibility: string[];
  }>;
}

interface ProfileData {
  name: string;
  contactNumber: string;
  logo: { url: string; filename?: string; size?: number } | null;
  coverPhoto: { url: string; filename?: string; size?: number } | null;
  profile: {
    description: string;
    features: string[];
    address: {
      line1: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    googleLocation: string;
    contact: {
      primaryPhone: string;
      secondaryPhone: string;
      email: string;
      website: string;
    };
    videos: string[];
  };
  courses: Course[];
}

const CollegeAdminPortal: React.FC = () => {
  const { server } = useMainContext();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    contactNumber: '',
    logo: null,
    coverPhoto: null,
    profile: {
      description: '',
      features: [],
      address: {
        line1: '',
        city: '',
        state: '',
        pincode: '',
        country: ''
      },
      googleLocation: '',
      contact: {
        primaryPhone: '',
        secondaryPhone: '',
        email: '',
        website: ''
      },
      videos: []
    },
    courses: []
  });

  const [existingProfile, setExistingProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [editingField, setEditingField] = useState<'logo' | 'coverPhoto' | null>(null);
  
  // Add state for forwarded students
  const [forwardedStudents, setForwardedStudents] = useState<ForwardedStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'students'>('profile');

  const { toast } = useToast();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${server}/api/college-admins/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Transform the data to match our interface
          const transformedData: ProfileData = {
            name: data.name || '',
            contactNumber: data.contactNumber || '',
            logo: data.logo || null,
            coverPhoto: data.coverPhoto || null,
            profile: {
              description: data.profile?.description || '',
              features: data.profile?.features || [],
              address: data.profile?.address || {
                line1: '',
                city: '',
                state: '',
                pincode: '',
                country: ''
              },
              googleLocation: data.profile?.googleLocation || '',
              contact: data.profile?.contact || {
                primaryPhone: '',
                secondaryPhone: '',
                email: '',
                website: ''
              },
              videos: data.profile?.videos || []
            },
            courses: data.courses || []
          };
          
          setExistingProfile(transformedData);
          setProfileData(transformedData);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    loadProfile();
  }, [token, server]);

  // Fetch forwarded students
  useEffect(() => {
    const fetchForwardedStudents = async () => {
      if (!token) return;
      
      setLoadingStudents(true);
      setStudentsError(null);
      try {
        const response = await fetch(`${server}/api/college-admins/forwarded-students`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setForwardedStudents(data.students || []);
        } else {
          setStudentsError('Failed to fetch forwarded students');
        }
      } catch (error) {
        setStudentsError('Error fetching forwarded students');
        console.error('Error:', error);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchForwardedStudents();
  }, [token, server]);

  const handleImageUpload = async (field: 'logo' | 'coverPhoto') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setEditingField(field);
        setShowImageEditor(true);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleProcessedImageUpload = async (processedImageBlob: Blob) => {
    if (!editingField) return;

    if (!CLOUDINARY_CLOUD || !CLOUDINARY_PRESET) {
      toast({ title: 'Configuration Error', description: 'Cloudinary not configured' });
      return;
    }

    const setUploading = editingField === 'logo' ? setUploadingLogo : setUploadingCover;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', processedImageBlob);
      formData.append('upload_preset', CLOUDINARY_PRESET);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      
      const mediaObject = {
        url: data.secure_url,
        filename: data.original_filename || 'uploaded-image',
        size: data.bytes || 0
      };

      setProfileData(prev => ({ ...prev, [editingField]: mediaObject }));
      toast({ title: 'Image uploaded successfully' });
      setShowImageEditor(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast({ title: 'Upload failed', description: message });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!token) return;

    try {
      const url = existingProfile ? `/api/college-admins/profile` : '/api/college-admins/profile';
      const method = existingProfile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        await response.json();
        setExistingProfile(profileData);
        setIsEditing(false);
        toast({ title: `Profile ${existingProfile ? 'updated' : 'created'} successfully` });
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({ title: 'Error', description: 'Failed to save profile' });
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (existingProfile) {
      setProfileData(existingProfile);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <img src="/logo.jpeg" alt="CollegeManzil" className="w-12 h-12 rounded-lg object-cover" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
            CollegeManzil Portal
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Manage your institution profile and connect with prospective students
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profile' | 'students')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[500px] mx-auto h-14 bg-emerald-50 border border-emerald-200">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-3 text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Building2 className="w-5 h-5" />
              Institution Profile
            </TabsTrigger>
            <TabsTrigger 
              value="students" 
              className="flex items-center gap-3 text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Users className="w-5 h-5" />
              Student Applications
              {forwardedStudents.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 border-amber-200">
                  {forwardedStudents.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="shadow-xl border-emerald-100">
              <CardContent className="p-8">
                {existingProfile && !isEditing ? (
                  <ProfileView 
                    profileData={existingProfile} 
                    onEdit={startEditing}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                          {existingProfile ? 'Edit Institution Profile' : 'Create Institution Profile'}
                        </h2>
                        <p className="text-slate-600 mt-1">
                          {existingProfile ? 'Update your college information and courses' : 'Set up your college profile to attract students'}
                        </p>
                      </div>
                      {existingProfile && (
                        <Button 
                          variant="outline" 
                          onClick={cancelEditing}
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          Cancel Changes
                        </Button>
                      )}
                    </div>
                    
                    <ProfileForm
                      profileData={profileData}
                      setProfileData={setProfileData}
                      onSubmit={handleSubmit}
                      onImageUpload={handleImageUpload}
                      isUploading={uploadingLogo || uploadingCover}
                      isEditing={!!existingProfile}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Interested Tab */}
          <TabsContent value="students">
            <Card className="shadow-xl border-emerald-100">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/15 border-b border-emerald-100">
                <CardTitle className="flex items-center gap-4 text-emerald-700">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Users className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">Student Applications</h3>
                    <p className="text-emerald-600 text-sm font-normal">Students interested in your institution</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                      {forwardedStudents.length} Applications
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        // Refresh forwarded students
                        const fetchStudents = async () => {
                          setLoadingStudents(true);
                          try {
                            const response = await fetch(`${server}/api/college-admins/forwarded-students`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (response.ok) {
                              const data = await response.json();
                              setForwardedStudents(data.students || []);
                            }
                          } catch (error) {
                            console.error('Error refreshing:', error);
                          } finally {
                            setLoadingStudents(false);
                          }
                        };
                        fetchStudents();
                      }}
                      className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {loadingStudents ? (
                  <div className="flex flex-col justify-center items-center h-40 space-y-4">
                    <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600">Loading student applications...</p>
                  </div>
                ) : studentsError ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-exclamation-triangle text-2xl text-red-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Applications</h3>
                    <p className="text-red-500">{studentsError}</p>
                  </div>
                ) : forwardedStudents.length === 0 ? (
                  <div className="p-12 text-center text-slate-600">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">No Applications Yet</h3>
                    <p className="text-lg mb-2">Students will appear here when admins forward their profiles to your institution.</p>
                    <p className="text-sm text-slate-500">Complete your profile to start attracting prospective students!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-emerald-50/50 border-b border-emerald-100">
                          <TableHead className="font-bold text-emerald-700 py-4">Student Details</TableHead>
                          <TableHead className="font-bold text-emerald-700 py-4">Contact Information</TableHead>
                          <TableHead className="font-bold text-emerald-700 py-4">Academic Background</TableHead>
                          <TableHead className="font-bold text-emerald-700 py-4">Course Interests</TableHead>
                          <TableHead className="font-bold text-emerald-700 py-4">Admin Notes</TableHead>
                          <TableHead className="font-bold text-emerald-700 py-4">Application Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {forwardedStudents.map((student) => (
                          <TableRow key={student.id} className="hover:bg-emerald-50/30 transition-colors border-b border-slate-100">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 text-lg">{student.name}</div>
                                  <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4 text-emerald-600" />
                                    {student.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  <span className="font-medium">{student.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                  <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  <span>Born: {new Date(student.dateOfBirth).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                  <GraduationCap className="w-5 h-5 text-amber-600" />
                                </div>
                                <span className="font-semibold text-slate-700">{student.education}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex flex-wrap gap-2 max-w-xs">
                                {student.interestedCourses.map((course, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-2 py-1"
                                  >
                                    {course.name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="max-w-xs">
                                {student.notes ? (
                                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                                    <div className="flex items-start gap-2">
                                      <i className="fas fa-sticky-note text-amber-600 mt-0.5 flex-shrink-0"></i>
                                      <span>{student.notes}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">No additional notes</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="text-sm">
                                <div className="font-medium text-slate-700">
                                  {new Date(student.forwardedAt).toLocaleDateString()}
                                </div>
                                <div className="text-slate-500 text-xs">
                                  {new Date(student.forwardedAt).toLocaleTimeString()}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Image Editor Modal */}
        <ImageEditor
          isOpen={showImageEditor}
          onClose={() => setShowImageEditor(false)}
          imageUrl={selectedImage}
          onUpload={handleProcessedImageUpload}
          fieldType={editingField || 'logo'}
          isUploading={uploadingLogo || uploadingCover}
        />
      </div>
    </div>
  );
};

export default CollegeAdminPortal;