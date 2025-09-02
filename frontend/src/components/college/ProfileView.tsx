import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Phone, Mail, Globe, Video } from "lucide-react";

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

interface ProfileViewProps {
  profileData: ProfileData;
  onEdit: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profileData, onEdit }) => {
  return (
    <div className="space-y-6">
      {/* Header with Cover Photo */}
      <Card className="overflow-hidden">
        <div className="relative">
          {profileData.coverPhoto?.url && (
            <div className="h-48 w-full">
              <img 
                src={profileData.coverPhoto.url} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Button 
              onClick={onEdit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border-0 font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {/* Logo */}
            {profileData.logo?.url && (
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={profileData.logo.url} 
                  alt="Logo" 
                  className="w-full h-full object-cover rounded-lg border-2 border-white shadow-lg"
                />
              </div>
            )}
            
            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
              <p className="text-gray-600 mb-4">{profileData.profile.description}</p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {profileData.contactNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {profileData.contactNumber}
                  </div>
                )}
                {profileData.profile.contact.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profileData.profile.contact.email}
                  </div>
                )}
                {profileData.profile.contact.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a href={profileData.profile.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      {profileData.profile.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.profile.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-800">
              {profileData.profile.address.line1}
              {profileData.profile.address.line1 && <br />}
              {profileData.profile.address.city}, {profileData.profile.address.state} {profileData.profile.address.pincode}
              {profileData.profile.address.city && <br />}
              {profileData.profile.address.country}
            </p>
            
            {profileData.profile.contact.primaryPhone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>Primary: {profileData.profile.contact.primaryPhone}</span>
                {profileData.profile.contact.secondaryPhone && (
                  <span>• Secondary: {profileData.profile.contact.secondaryPhone}</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Courses */}
      {profileData.courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Courses Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileData.courses.map((course, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">{course.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {course.subCourses.map((subCourse, subIndex) => (
                      <div key={subIndex} className="bg-gray-50 rounded p-3">
                        <h4 className="font-medium mb-1">{subCourse.name}</h4>
                        <p className="text-sm text-green-600 font-medium mb-1">Fee: {subCourse.fee}</p>
                        <p className="text-xs text-gray-600">
                          Eligibility: {subCourse.eligibility.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos */}
      {profileData.profile.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Promotional Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.profile.videos.map((video, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <a 
                    href={video} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Watch Video {index + 1}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
