import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Mail, Send, X } from 'lucide-react';
import type { EmailModalProps } from '../types/admin.types';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-admin-primary" />
  </div>
);

export const EmailModal: React.FC<EmailModalProps> = ({ student, onClose }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draftEmail = useCallback(async () => {
    if (!student || !student.collegeFinalized || !student.courseFinalized) {
      setError("Student's finalized college and course are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const prompt = `You are an experienced admissions counselor at 'Dream Institution'. Draft a professional email to a partner college.
        *Details:*
        - Student Name: ${student.name}
        - Applying to College: ${student.collegeFinalized}
        - Applying for Course: ${student.courseFinalized}
        - Counselor: ${student.counselor}
        *Instructions:*
        1. Create a subject line: "Student Referral: [Student Name] for [Course Name]".
        2. Write a concise (100-150 words), warm, and professional email introducing the student.
        3. End with a clear call to action.
        4. The email is from ${student.counselor}.
        5. Return ONLY a JSON object: {"subject": "...", "body": "..."}`;

    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockResponse = {
        subject: `Student Referral: ${student.name} for ${student.courseFinalized}`,
        body: `Dear Admissions Team,

I hope this email finds you well. I am writing to refer ${student.name}, an exceptional candidate interested in your ${student.courseFinalized} program.

${student.name} has demonstrated outstanding academic performance and shows great potential in ${student.mainCourse}. After careful counseling and assessment, we believe your institution would be an excellent fit for their educational goals.

I would appreciate the opportunity to discuss ${student.name}'s application further and provide any additional information you may require.

Best regards,
${student.counselor}
Dream Institution`
      };
      
      setSubject(mockResponse.subject);
      setBody(mockResponse.body);

    } catch (err) {
      console.error("Error generating email:", err);
      setError("Failed to generate email draft. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [student]);

  useEffect(() => {
    if (student) {
      draftEmail();
    }
  }, [draftEmail, student]);

  if (!student) return null;

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-admin-primary text-xl">
            <Mail className="w-5 h-5" />
            Draft Forwarding Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Student Info Card */}
          <Card className="bg-gradient-to-r from-admin-primary/5 to-admin-secondary/5">
            <CardContent className="pt-4">
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Student:</span> {student.name}</div>
                <div><span className="font-medium">College:</span> {student.collegeFinalized}</div>
                <div><span className="font-medium">Course:</span> {student.courseFinalized}</div>
                <div><span className="font-medium">Counselor:</span> {student.counselor}</div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <div className="text-red-600 text-center">
                  <p className="font-medium">Error: {error}</p>
                  <p className="text-sm mt-1">Could not generate email draft. Please try again later.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  id="emailSubject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="focus:ring-admin-primary focus:border-admin-primary"
                />
              </div>
              
              <div>
                <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body
                </label>
                <Textarea
                  id="emailBody"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={12}
                  className="focus:ring-admin-primary focus:border-admin-primary resize-none"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-admin-primary to-admin-secondary hover:from-admin-secondary hover:to-admin-primary transition-all duration-300"
              disabled={isLoading || !!error}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};