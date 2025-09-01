import React, { useState, useEffect } from 'react';
import { ProfileView } from "./ProfileView";
import { ProfileForm } from "./ProfileForm";
import { ImageEditor } from "@/components/ui/image-editor";
import { useToast } from "@/hooks/use-toast";
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
        const response = await fetch('/api/college-admins/profile', {
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
  }, [token]);

  // Fetch forwarded students
  useEffect(() => {
    const fetchForwardedStudents = async () => {
      if (!token) return;
      
      setLoadingStudents(true);
      setStudentsError(null);
      try {
        const response = await fetch('/api/college-admins/forwarded-students', {
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
  }, [token]);

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">College Admin Portal</h1>
          <p className="text-muted-foreground">Manage your college profile and view interested students</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profile' | 'students')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] mx-auto h-12">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              College Profile
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Students Interested
              {forwardedStudents.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                  {forwardedStudents.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            {existingProfile && !isEditing ? (
              <ProfileView 
                profileData={existingProfile} 
                onEdit={startEditing}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {existingProfile ? 'Edit Profile' : 'Create Profile'}
                  </h2>
                  {existingProfile && (
                    <Button variant="outline" onClick={cancelEditing}>
                      Cancel
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
          </TabsContent>

          {/* Students Interested Tab */}
          <TabsContent value="students">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                <CardTitle className="flex items-center gap-3 text-blue-600">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  Students Interested in Your College
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {forwardedStudents.length} Students
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        // Refresh forwarded students
                        const fetchStudents = async () => {
                          setLoadingStudents(true);
                          try {
                            const response = await fetch('/api/college-admins/forwarded-students', {
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
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loadingStudents ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : studentsError ? (
                  <div className="p-6 text-center text-red-600">{studentsError}</div>
                ) : forwardedStudents.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold mb-2">No Students Forwarded Yet</h3>
                    <p>Students will appear here when admins forward their profiles to your college.</p>
                    <p className="text-sm mt-2">Check back later or contact the admin team for more information.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold text-blue-600">Student Details</TableHead>
                          <TableHead className="font-semibold text-blue-600">Contact Info</TableHead>
                          <TableHead className="font-semibold text-blue-600">Education</TableHead>
                          <TableHead className="font-semibold text-blue-600">Interested Courses</TableHead>
                          <TableHead className="font-semibold text-blue-600">Admin Notes</TableHead>
                          <TableHead className="font-semibold text-blue-600">Forwarded Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {forwardedStudents.map((student) => (
                          <TableRow key={student.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-full">
                                  <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-semibold text-foreground">{student.name}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {student.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-muted-foreground" />
                                  <span>{student.phone}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{student.education}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {student.interestedCourses.map((course, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                  >
                                    {course.name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {student.notes ? (
                                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 max-w-xs">
                                    {student.notes}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">No notes</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {new Date(student.forwardedAt).toLocaleDateString()}
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