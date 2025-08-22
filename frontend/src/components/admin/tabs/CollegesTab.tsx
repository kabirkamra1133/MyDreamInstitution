import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { collegesData } from '../data/mockData';
import { Edit, Trash2, Plus } from 'lucide-react';

export const CollegesTab: React.FC = () => {
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
    </div>
  );
};