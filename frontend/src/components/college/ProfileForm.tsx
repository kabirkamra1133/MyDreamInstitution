import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Plus, Minus } from "lucide-react";

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

interface ProfileFormProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  onSubmit: () => void;
  onImageUpload: (field: 'logo' | 'coverPhoto') => void;
  isUploading: boolean;
  isEditing: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  setProfileData,
  onSubmit,
  onImageUpload,
  isUploading,
  isEditing
}) => {
  const addFeature = () => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        features: [...prev.profile.features, '']
      }
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        features: prev.profile.features.map((f, i) => i === index ? value : f)
      }
    }));
  };

  const removeFeature = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        features: prev.profile.features.filter((_, i) => i !== index)
      }
    }));
  };

  const addVideo = () => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        videos: [...prev.profile.videos, '']
      }
    }));
  };

  const updateVideo = (index: number, value: string) => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        videos: prev.profile.videos.map((v, i) => i === index ? value : v)
      }
    }));
  };

  const removeVideo = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        videos: prev.profile.videos.filter((_, i) => i !== index)
      }
    }));
  };

 



  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Institution Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter institution name"
              />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={profileData.contactNumber}
                onChange={(e) => setProfileData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="Enter contact number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Branding & Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-4">
              <Label>Institution Logo</Label>
              {profileData.logo?.url && (
                <div className="w-32 h-32 mx-auto">
                  <img src={profileData.logo.url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                </div>
              )}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  disabled={isUploading}
                  onClick={() => onImageUpload('logo')}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </div>
            </div>

            {/* Cover Photo */}
            <div className="space-y-4">
              <Label>Cover Photo</Label>
              {profileData.coverPhoto?.url && (
                <div className="w-full h-32">
                  <img src={profileData.coverPhoto.url} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                </div>
              )}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  disabled={isUploading}
                  onClick={() => onImageUpload('coverPhoto')}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Cover
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profileData.profile.description}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                profile: { ...prev.profile, description: e.target.value }
              }))}
              placeholder="Tell students about your institution..."
              rows={4}
            />
          </div>

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Features</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addFeature}
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>
            {profileData.profile.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Enter a feature"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Google Location */}
          <div>
            <Label htmlFor="googleLocation">Google Maps Location</Label>
            <Input
              id="googleLocation"
              value={profileData.profile.googleLocation}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                profile: { ...prev.profile, googleLocation: e.target.value }
              }))}
              placeholder="Google Maps embed URL"
            />
          </div>

          {/* Videos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Promotional Videos</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addVideo}
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Video
              </Button>
            </div>
            {profileData.profile.videos.map((video, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={video}
                  onChange={(e) => updateVideo(index, e.target.value)}
                  placeholder="YouTube/Video URL"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeVideo(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="line1">Address Line 1</Label>
              <Input
                id="line1"
                value={profileData.profile.address.line1}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    address: { ...prev.profile.address, line1: e.target.value }
                  }
                }))}
                placeholder="Street address"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profileData.profile.address.city}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    address: { ...prev.profile.address, city: e.target.value }
                  }
                }))}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={profileData.profile.address.state}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    address: { ...prev.profile.address, state: e.target.value }
                  }
                }))}
                placeholder="State"
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={profileData.profile.address.pincode}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    address: { ...prev.profile.address, pincode: e.target.value }
                  }
                }))}
                placeholder="Pincode"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profileData.profile.address.country}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    address: { ...prev.profile.address, country: e.target.value }
                  }
                }))}
                placeholder="Country"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primaryPhone">Primary Phone</Label>
              <Input
                id="primaryPhone"
                value={profileData.profile.contact.primaryPhone}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    contact: { ...prev.profile.contact, primaryPhone: e.target.value }
                  }
                }))}
                placeholder="Primary phone number"
              />
            </div>
            <div>
              <Label htmlFor="secondaryPhone">Secondary Phone</Label>
              <Input
                id="secondaryPhone"
                value={profileData.profile.contact.secondaryPhone}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    contact: { ...prev.profile.contact, secondaryPhone: e.target.value }
                  }
                }))}
                placeholder="Secondary phone number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.profile.contact.email}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    contact: { ...prev.profile.contact, email: e.target.value }
                  }
                }))}
                placeholder="Contact email"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileData.profile.contact.website}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  profile: {
                    ...prev.profile,
                    contact: { ...prev.profile.contact, website: e.target.value }
                  }
                }))}
                placeholder="Website URL"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Courses Offered</CardTitle>
            <Button variant="outline" onClick={() => {
              setProfileData(prev => ({
                ...prev,
                courses: [
                  ...prev.courses,
                  { name: '', subCourses: [{ name: '', fee: '', eligibility: [''] }] }
                ]
              }));
            }}>
              <Plus className="h-4 w-4 mr-1" />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileData.courses.map((course, courseIndex) => (
            <Card key={courseIndex} className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    value={course.name}
                    onChange={(e) => {
                      setProfileData(prev => ({
                        ...prev,
                        courses: prev.courses.map((c, i) => 
                          i === courseIndex ? { ...c, name: e.target.value } : c
                        )
                      }));
                    }}
                    placeholder="Course name (e.g., Engineering, Medicine)"
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setProfileData(prev => ({
                        ...prev,
                        courses: prev.courses.filter((_, i) => i !== courseIndex)
                      }));
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sub-courses */}
                <div className="space-y-3 ml-4">
                  <Label className="text-sm">Specializations</Label>
                  {course.subCourses.map((subCourse, subIndex) => (
                    <div key={subIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 rounded">
                      <Input
                        value={subCourse.name}
                        onChange={(e) => {
                          setProfileData(prev => ({
                            ...prev,
                            courses: prev.courses.map((c, ci) => 
                              ci === courseIndex
                                ? {
                                    ...c,
                                    subCourses: c.subCourses.map((sc, si) =>
                                      si === subIndex ? { ...sc, name: e.target.value } : sc
                                    )
                                  }
                                : c
                            )
                          }));
                        }}
                        placeholder="Specialization name"
                      />
                      <Input
                        value={subCourse.fee}
                        onChange={(e) => {
                          setProfileData(prev => ({
                            ...prev,
                            courses: prev.courses.map((c, ci) => 
                              ci === courseIndex
                                ? {
                                    ...c,
                                    subCourses: c.subCourses.map((sc, si) =>
                                      si === subIndex ? { ...sc, fee: e.target.value } : sc
                                    )
                                  }
                                : c
                            )
                          }));
                        }}
                        placeholder="Fee amount"
                      />
                      <div className="flex gap-1">
                        <Input
                          value={subCourse.eligibility[0] || ''}
                          onChange={(e) => {
                            setProfileData(prev => ({
                              ...prev,
                              courses: prev.courses.map((c, ci) => 
                                ci === courseIndex
                                  ? {
                                      ...c,
                                      subCourses: c.subCourses.map((sc, si) =>
                                        si === subIndex ? { ...sc, eligibility: [e.target.value] } : sc
                                      )
                                    }
                                  : c
                              )
                            }));
                          }}
                          placeholder="Eligibility criteria"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setProfileData(prev => ({
                              ...prev,
                              courses: prev.courses.map((c, ci) => 
                                ci === courseIndex
                                  ? {
                                      ...c,
                                      subCourses: c.subCourses.filter((_, si) => si !== subIndex)
                                    }
                                  : c
                              )
                            }));
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProfileData(prev => ({
                        ...prev,
                        courses: prev.courses.map((c, ci) => 
                          ci === courseIndex
                            ? { ...c, subCourses: [...c.subCourses, { name: '', fee: '', eligibility: [''] }] }
                            : c
                        )
                      }));
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Specialization
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <Button 
          onClick={onSubmit} 
          disabled={isUploading} 
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg font-semibold px-8 py-3 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <i className="fas fa-save mr-2"></i>
              {isEditing ? 'Update Profile' : 'Create Profile'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
