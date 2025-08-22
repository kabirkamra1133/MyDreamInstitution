import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollegesTab } from './tabs/CollegesTab';
import { StudentsTab } from './tabs/StudentsTab';
import { AdmittedTab } from './tabs/AdmittedTab';
import { EmailModal } from './modals/EmailModal';
import type { Student } from './types/admin.types';

const AdminPortal: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleForwardProfile = (student: Student) => {
    if (!student.collegeFinalized || !student.courseFinalized) {
      alert("Please finalize the student's college and course before forwarding.");
      return;
    }
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-primary via-admin-secondary to-admin-accent">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-admin-primary to-admin-secondary shadow-admin-elegant">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Admin Portal</h1>
                <p className="text-white/80 text-lg">My Dream Institution Management System</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white/95 backdrop-blur-sm shadow-admin-glow border-0">
          <CardContent className="p-8">
            <Tabs defaultValue="colleges" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-admin-primary/10 to-admin-secondary/10 p-1 rounded-xl">
                <TabsTrigger 
                  value="colleges" 
                  className="data-[state=active]:bg-white data-[state=active]:text-admin-primary data-[state=active]:shadow-md transition-all duration-300 rounded-lg font-semibold"
                >
                  College Management
                </TabsTrigger>
                <TabsTrigger 
                  value="students" 
                  className="data-[state=active]:bg-white data-[state=active]:text-admin-primary data-[state=active]:shadow-md transition-all duration-300 rounded-lg font-semibold"
                >
                  Student Leads
                </TabsTrigger>
                <TabsTrigger 
                  value="admitted" 
                  className="data-[state=active]:bg-white data-[state=active]:text-admin-primary data-[state=active]:shadow-md transition-all duration-300 rounded-lg font-semibold"
                >
                  Admitted Students
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="colleges" className="mt-6">
                <CollegesTab />
              </TabsContent>
              
              <TabsContent value="students" className="mt-6">
                <StudentsTab onForwardProfile={handleForwardProfile} />
              </TabsContent>
              
              <TabsContent value="admitted" className="mt-6">
                <AdmittedTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {isModalOpen && (
        <EmailModal 
          student={selectedStudent} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminPortal;