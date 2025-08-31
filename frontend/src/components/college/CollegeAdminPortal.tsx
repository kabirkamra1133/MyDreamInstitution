import React, { useState, useEffect } from 'react';
import { ProfileView } from "./ProfileView";
import { ProfileForm } from "./ProfileForm";
import { ImageEditor } from "@/components/ui/image-editor";
import { useToast } from "@/hooks/use-toast";

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
      <div className="max-w-6xl mx-auto">
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
                <button 
                  onClick={cancelEditing}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
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