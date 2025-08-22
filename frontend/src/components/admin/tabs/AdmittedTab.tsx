import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { admittedData } from '../data/mockData';
import { CheckCircle, Calendar } from 'lucide-react';

export const AdmittedTab: React.FC = () => {
  return (
    <Card className="shadow-admin-elegant">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="flex items-center gap-2 text-emerald-700">
          <CheckCircle className="w-5 h-5" />
          Successfully Admitted Students
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-admin-primary">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Admission Date
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-admin-primary">Student Name</TableHead>
                <TableHead className="font-semibold text-admin-primary">College</TableHead>
                <TableHead className="font-semibold text-admin-primary">Course Details</TableHead>
                <TableHead className="font-semibold text-admin-primary">Counselor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admittedData.map((admitted, index) => (
                <TableRow key={`${admitted.student}-${index}`} className="hover:bg-green-50/50 transition-colors">
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {admitted.date}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-admin-primary">
                    {admitted.student}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{admitted.college}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{admitted.course}</div>
                      <Badge variant="secondary" className="text-xs">
                        {admitted.subCourse}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20">
                      {admitted.counselor}
                    </Badge>
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