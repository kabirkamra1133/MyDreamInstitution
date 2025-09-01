import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Student, BackendUser, CourseSelection } from '../types/admin.types';
import { Sparkles, User, GraduationCap, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

interface StudentsTabProps {
  onForwardProfile: (student: Student) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({ onForwardProfile }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch all students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Transform backend user data to Student format
          const transformedStudents: Student[] = data.users.map((user: BackendUser) => ({
            id: user._id,
            name: user.name || user.email,
            mainCourse: user.mainCourse || 'Not Specified',
            subCourse: user.subCourse || 'Not Specified',
            collegesSelected: [], // Will be populated from shortlists when expanded
            collegeFinalized: user.collegeFinalized || '',
            coursesSelected: [], // Will be populated from shortlists when expanded
            courseFinalized: user.courseFinalized || '',
            counselor: user.counselor || 'Not Assigned'
          }));
          setStudents(transformedStudents);
        } else {
          setError('Failed to fetch students');
        }
      } catch (err) {
        setError('Error fetching students');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const fetchStudentDetails = async (studentId: string) => {
    try {
      setLoadingDetails(prev => new Set(prev).add(studentId));
      const response = await fetch(`/api/users/student/${studentId}/details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const studentDetails = await response.json();
        setStudents(prev => prev.map(s => 
          s.id === studentId ? { 
            ...s, 
            courseSelections: studentDetails.courseSelections,
            // Also update the basic college/course arrays from shortlist data
            collegesSelected: studentDetails.courseSelections?.map((cs: CourseSelection) => cs.college.name) || [],
            coursesSelected: studentDetails.courseSelections?.flatMap((cs: CourseSelection) => cs.courses) || []
          } : s
        ));
      } else {
        console.error('Failed to fetch student details');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoadingDetails(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentId);
        return newSet;
      });
    }
  };

  const toggleStudentExpansion = async (studentId: string) => {
    const newExpanded = new Set(expandedStudents);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
      // Fetch details if not already loaded
      const student = students.find(s => s.id === studentId);
      if (student && !student.courseSelections) {
        await fetchStudentDetails(studentId);
      }
    }
    setExpandedStudents(newExpanded);
  };

  const handleFinalize = async (studentId: string, field: 'college' | 'course', value: string) => {
    try {
      // Update in backend
      const response = await fetch(`/api/users/${studentId}/finalize`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ field, value })
      });

      if (response.ok) {
        // Update local state
        setStudents(prev => prev.map(s => {
          if (s.id === studentId) {
            return field === 'college' 
              ? { ...s, collegeFinalized: value } 
              : { ...s, courseFinalized: value };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error('Error finalizing:', error);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-admin-elegant">
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-admin-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-admin-elegant">
        <CardContent className="p-8">
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-admin-elegant">
      <CardHeader className="bg-gradient-to-r from-admin-primary/10 to-admin-secondary/10">
        <CardTitle className="flex items-center gap-2 text-admin-primary">
          <User className="w-5 h-5" />
          Student Lead Management ({students.length} students)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-admin-primary w-12">Expand</TableHead>
                <TableHead className="font-semibold text-admin-primary">Student Info</TableHead>
                <TableHead className="font-semibold text-admin-primary">Colleges Selected</TableHead>
                <TableHead className="font-semibold text-admin-primary">College Finalized</TableHead>
                <TableHead className="font-semibold text-admin-primary">Courses Selected</TableHead>
                <TableHead className="font-semibold text-admin-primary">Course Finalized</TableHead>
                <TableHead className="text-center font-semibold text-admin-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No students found</p>
                  </TableCell>
                </TableRow>
              ) : (
                students.map(student => (
                  <React.Fragment key={student.id}>
                    <TableRow className="hover:bg-admin-primary/5 transition-colors">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStudentExpansion(student.id)}
                          disabled={loadingDetails.has(student.id)}
                          className="p-1 h-8 w-8"
                        >
                          {loadingDetails.has(student.id) ? (
                            <div className="w-4 h-4 border-2 border-admin-primary border-t-transparent rounded-full animate-spin" />
                          ) : expandedStudents.has(student.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-admin-primary">{student.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {student.mainCourse} • {student.counselor}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.collegesSelected?.length > 0 ? student.collegesSelected.map(college => (
                            <Badge 
                              key={college} 
                              variant="outline" 
                              className="cursor-pointer hover:bg-admin-primary hover:text-white transition-colors text-xs"
                              onClick={() => handleFinalize(student.id, 'college', college)}
                            >
                              {college}
                            </Badge>
                          )) : (
                            <span className="text-xs text-muted-foreground">Click expand to see selections</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.collegeFinalized ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {student.collegeFinalized}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Pending</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.coursesSelected?.length > 0 ? student.coursesSelected.map(course => (
                            <Badge 
                              key={course} 
                              variant="outline" 
                              className="cursor-pointer hover:bg-admin-secondary hover:text-white transition-colors text-xs"
                              onClick={() => handleFinalize(student.id, 'course', course)}
                            >
                              {course}
                            </Badge>
                          )) : (
                            <span className="text-xs text-muted-foreground">Click expand to see selections</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.courseFinalized ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {student.courseFinalized}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button 
                          size="sm" 
                          onClick={() => onForwardProfile(student)}
                          className="bg-gradient-to-r from-admin-accent to-admin-secondary hover:from-admin-secondary hover:to-admin-accent transition-all duration-300 shadow-admin-subtle"
                          disabled={!student.collegeFinalized || !student.courseFinalized}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          Forward
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded row showing detailed course selections */}
                    {expandedStudents.has(student.id) && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gradient-to-r from-admin-primary/5 to-admin-secondary/5 border-t">
                          <div className="p-4">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-admin-primary">
                              <BookOpen className="w-4 h-4" />
                              Detailed Course Selections & Applications
                            </h4>
                            {loadingDetails.has(student.id) ? (
                              <div className="text-center py-4">
                                <div className="w-6 h-6 border-2 border-admin-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Loading course details...</p>
                              </div>
                            ) : !student.courseSelections ? (
                              <div className="text-center py-4">
                                <p className="text-muted-foreground">Click to load detailed course selections...</p>
                              </div>
                            ) : student.courseSelections.length === 0 ? (
                              <div className="text-center py-4">
                                <p className="text-muted-foreground">This student hasn't applied to any colleges yet.</p>
                              </div>
                            ) : (
                              <div className="grid gap-3">
                                {student.courseSelections.map((selection, index) => (
                                  <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-3">
                                      <h5 className="font-medium text-lg text-admin-primary">{selection.college.name}</h5>
                                      {selection.applicationStatus && (
                                        <Badge variant="secondary" className="bg-admin-secondary/10 text-admin-secondary">
                                          {selection.applicationStatus}
                                        </Badge>
                                      )}
                                    </div>
                                    {selection.courses.length > 0 && (
                                      <div className="mb-2">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Applied Courses:</p>
                                        <div className="flex flex-wrap gap-1">
                                          {selection.courses.map((course, courseIndex) => (
                                            <Badge key={courseIndex} variant="outline" className="text-xs bg-admin-accent/10 text-admin-accent border-admin-accent/20">
                                              {course}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {selection.notes && (
                                      <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                                        <span className="font-medium">Notes: </span>
                                        {selection.notes}
                                      </div>
                                    )}
                                    {selection.addedAt && (
                                      <div className="text-xs text-muted-foreground mt-2">
                                        Applied on: {new Date(selection.addedAt).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};