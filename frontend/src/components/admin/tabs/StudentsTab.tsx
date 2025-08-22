import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { initialStudentsData } from '../data/mockData';
import type { Student } from '../types/admin.types';
import { Sparkles, User, GraduationCap } from 'lucide-react';

interface StudentsTabProps {
  onForwardProfile: (student: Student) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({ onForwardProfile }) => {
  const [students, setStudents] = useState<Student[]>(initialStudentsData);

  const handleFinalize = (studentId: string, field: 'college' | 'course', value: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return field === 'college' 
          ? { ...s, collegeFinalized: value } 
          : { ...s, courseFinalized: value };
      }
      return s;
    }));
  };

  return (
    <Card className="shadow-admin-elegant">
      <CardHeader className="bg-gradient-to-r from-admin-primary/10 to-admin-secondary/10">
        <CardTitle className="flex items-center gap-2 text-admin-primary">
          <User className="w-5 h-5" />
          Student Lead Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-admin-primary">Student Info</TableHead>
                <TableHead className="font-semibold text-admin-primary">Colleges Selected</TableHead>
                <TableHead className="font-semibold text-admin-primary">College Finalized</TableHead>
                <TableHead className="font-semibold text-admin-primary">Courses Selected</TableHead>
                <TableHead className="font-semibold text-admin-primary">Course Finalized</TableHead>
                <TableHead className="text-center font-semibold text-admin-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id} className="hover:bg-admin-primary/5 transition-colors">
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
                      {student.collegesSelected.map(college => (
                        <Badge 
                          key={college} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-admin-primary hover:text-white transition-colors text-xs"
                          onClick={() => handleFinalize(student.id, 'college', college)}
                        >
                          {college}
                        </Badge>
                      ))}
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
                      {student.coursesSelected.map(course => (
                        <Badge 
                          key={course} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-admin-secondary hover:text-white transition-colors text-xs"
                          onClick={() => handleFinalize(student.id, 'course', course)}
                        >
                          {course}
                        </Badge>
                      ))}
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};