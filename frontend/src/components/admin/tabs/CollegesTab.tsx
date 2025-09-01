import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { collegesData } from '../data/mockData';
import { Edit, Trash2, Plus, Users, Mail, Phone, Calendar, GraduationCap, BookOpen, User } from 'lucide-react';

// TypeScript interfaces
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

export const CollegesTab: React.FC = () => {
  const [forwardedStudents, setForwardedStudents] = useState<ForwardedStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  // Fetch forwarded students for this college
  useEffect(() => {
    const fetchForwardedStudents = async () => {
      setLoadingStudents(true);
      setStudentsError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/college-admins/forwarded-students', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
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
  }, []);
  return (
    <div className="space-y-6">
      {/* Add New College Card */}
      <Card className="bg-gradient-to-r from-admin-primary/5 to-admin-secondary/5 border-admin-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-admin-primary">
            <Plus className="w-5 h-5" />
            Add New College
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input 
              placeholder="College Name" 
              className="focus:ring-admin-primary focus:border-admin-primary"
            />
            <Input 
              type="email" 
              placeholder="Email (Username)" 
              className="focus:ring-admin-primary focus:border-admin-primary"
            />
            <Input 
              placeholder="Phone" 
              className="focus:ring-admin-primary focus:border-admin-primary"
            />
            <Input 
              type="password" 
              placeholder="Password" 
              className="focus:ring-admin-primary focus:border-admin-primary"
            />
            <Button 
              type="submit" 
              className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-admin-primary to-admin-secondary hover:from-admin-secondary hover:to-admin-primary transition-all duration-300 shadow-admin-subtle"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add College
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* College Listings */}
      <Card className="shadow-admin-elegant">
        <CardHeader className="bg-gradient-to-r from-admin-primary/10 to-admin-secondary/10">
          <CardTitle className="text-admin-primary">College Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-admin-primary">College</TableHead>
                  <TableHead className="font-semibold text-admin-primary">Courses</TableHead>
                  <TableHead className="font-semibold text-admin-primary">Location</TableHead>
                  <TableHead className="font-semibold text-admin-primary">Contact</TableHead>
                  <TableHead className="text-right font-semibold text-admin-primary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collegesData.map((college, index) => (
                  <TableRow key={college.name} className="hover:bg-admin-primary/5 transition-colors">
                    <TableCell className="font-medium">{college.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {college.courses.map(course => (
                          <Badge key={course} variant="secondary" className="bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{college.address}</div>
                        <div className="text-muted-foreground">{college.state}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{college.email}</div>
                        <div className="text-muted-foreground">{college.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="hover:bg-admin-primary/10 hover:text-admin-primary hover:border-admin-primary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                          <Trash2 className="w-4 h-4" />
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

      {/* Students Interested Section */}
      <Card className="shadow-admin-elegant">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10">
          <CardTitle className="flex items-center gap-3 text-blue-600">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            Students Interested
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700">
              {forwardedStudents.length} Forwarded
            </Badge>
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
            <div className="p-6 text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>No students have been forwarded to your college yet.</p>
              <p className="text-sm mt-1">Students will appear here when admins forward profiles to you.</p>
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
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
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
    </div>
  );
};