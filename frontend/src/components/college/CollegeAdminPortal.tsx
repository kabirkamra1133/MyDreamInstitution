import React, { useState, useMemo } from 'react';
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
import { Plus, Edit2, Trash2, Eye, GraduationCap, Users, BookOpen, Settings, Upload, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const CollegeAdminPortal = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(initialProfileData);
  const [courses, setCourses] = useState(initialCourses);
  const [students, setStudents] = useState(initialStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { toast } = useToast();

  // Profile Management Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({...prev, contact: {...prev.contact, [name]: value }}));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({...prev, address: {...prev.address, [name]: value }}));
  };

  const handleFeatureAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      setProfileData(prev => ({ ...prev, features: [...prev.features, e.target.value.trim()] }));
      e.target.value = '';
      toast({ title: "Feature added successfully!" });
    }
  };

  const handleFeatureRemove = (indexToRemove) => {
    setProfileData(prev => ({ ...prev, features: prev.features.filter((_, index) => index !== indexToRemove) }));
    toast({ title: "Feature removed" });
  };
  
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({...prev, [field]: reader.result}));
        toast({ title: "File uploaded successfully!" });
      };
      reader.readAsDataURL(file);
    }
  };

  // Course Management Handlers
  const addCourse = () => {
    setCourses([...courses, { name: '', subCourses: [{ name: '', fee: '', eligibility: [''] }] }]);
    toast({ title: "New course added" });
  };
  
  const handleCourseChange = (index, event) => {
    const newCourses = [...courses];
    newCourses[index][event.target.name] = event.target.value;
    setCourses(newCourses);
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
    toast({ title: "Course removed" });
  };

  const addSubCourse = (courseIndex) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses.push({ name: '', fee: '', eligibility: [''] });
    setCourses(newCourses);
  };

  const handleSubCourseChange = (courseIndex, subIndex, event) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses[subIndex][event.target.name] = event.target.value;
    setCourses(newCourses);
  };

  const removeSubCourse = (courseIndex, subIndex) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses = newCourses[courseIndex].subCourses.filter((_, i) => i !== subIndex);
    setCourses(newCourses);
  };

  const addEligibility = (courseIndex, subIndex) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses[subIndex].eligibility.push('');
    setCourses(newCourses);
  };

  const handleEligibilityChange = (courseIndex, subIndex, eligIndex, event) => {
    const newCourses = [...courses];
    newCourses[courseIndex].subCourses[subIndex].eligibility[eligIndex] = event.target.value;
    setCourses(newCourses);
  };
  
  const removeEligibility = (courseIndex, subIndex, eligIndex) => {
    const newCourses = [...courses];
    const eligibility = newCourses[courseIndex].subCourses[subIndex].eligibility;
    if (eligibility.length > 1) {
      newCourses[courseIndex].subCourses[subIndex].eligibility = eligibility.filter((_, i) => i !== eligIndex);
      setCourses(newCourses);
    }
  };

  // Student Management Handlers
  const handleStudentStatusChange = (studentId, status) => {
    setStudents(students.map(student => student.id === studentId ? { ...student, status } : student));
    toast({ title: `Student status updated to ${status}` });
  };

  const viewStudentProfile = (studentId) => {
    const student = students.find(s => s.id === studentId);
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
                removeEligibility 
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
const ProfileManagement = ({ data, courses, handlers }) => {
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
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
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
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Cover
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
              {data.features.map((feature, index) => (
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
            <Button onClick={handlers.addCourse} variant="admin">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {courses.map((course, courseIndex) => (
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
                      {course.subCourses.map((sub, subIndex) => (
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
                              {sub.eligibility.map((elig, eligIndex) => (
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
    </div>
  );
};

// Student Applications Component
const InterestedStudents = ({ students, handlers }) => {
  const [filters, setFilters] = useState({ course: 'All', status: 'All', search: '' });

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = filters.search.toLowerCase();
      return (
        (filters.course === 'All' || student.course === filters.course) &&
        (filters.status === 'All' || student.status === filters.status) &&
        (student.name.toLowerCase().includes(searchLower) || student.id.toLowerCase().includes(searchLower))
      );
    });
  }, [students, filters]);
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Selected': return <Badge variant="default" className="bg-success text-success-foreground">Selected</Badge>;
      case 'Rejected': return <Badge variant="destructive">Rejected</Badge>;
      case 'On Hold': return <Badge variant="default" className="bg-warning text-warning-foreground">On Hold</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const stats = useMemo(() => {
    const total = students.length;
    const selected = students.filter(s => s.status === 'Selected').length;
    const pending = students.filter(s => s.status === 'Pending').length;
    const rejected = students.filter(s => s.status === 'Rejected').length;
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
                {[...new Set(students.map(s => s.course))].map((course: string) => (
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
                {filteredStudents.map(student => (
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
const StudentProfileModal = ({ student, onClose }) => {
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
