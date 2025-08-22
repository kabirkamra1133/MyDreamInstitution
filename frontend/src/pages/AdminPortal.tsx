import React, { useState, useEffect, useCallback, FC } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  X, 
  Send, 
  User, 
  School, 
  BookOpen,
  TrendingUp,
  Calendar,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// --- TYPE DEFINITIONS ---
interface College {
    name: string;
    courses: string[];
    address: string;
    state: string;
    email: string;
    phone: string;
}

interface Student {
    id: string;
    name: string;
    mainCourse: string;
    subCourse: string;
    collegesSelected: string[];
    collegeFinalized: string;
    coursesSelected: string[];
    courseFinalized: string;
    counselor: string;
}

interface AdmittedStudent {
    date: string;
    student: string;
    college: string;
    course: string;
    subCourse: string;
    counselor: string;
}

// --- MOCK DATA ---
const initialCollegesData: College[] = [
    { name: 'Global Tech Institute', courses: ['Computer Science', 'Data Science'], address: '123 Tech Park', state: 'California', email: 'contact@gti.edu', phone: '123-456-7890' },
    { name: 'National Arts University', courses: ['Fine Arts', 'Graphic Design'], address: '456 Art Ave', state: 'New York', email: 'info@nau.edu', phone: '234-567-8901' },
    { name: 'Evergreen Business School', courses: ['MBA', 'Finance'], address: '789 Commerce St', state: 'Texas', email: 'admissions@ebs.com', phone: '345-678-9012' },
    { name: 'Oceanview Medical College', courses: ['Medicine', 'Nursing'], address: '101 Health Rd', state: 'Florida', email: 'help@omc.edu', phone: '456-789-0123' },
    { name: 'Pioneer Engineering College', courses: ['Mechanical Engg', 'Civil Engg'], address: '212 Innovation Dr', state: 'California', email: 'r.kamra09@gmail.com', phone: '567-890-1234' },
];

const initialStudentsData: Student[] = [
    { id: 'STU001', name: 'Alice Johnson', mainCourse: 'Computer Science', subCourse: 'AI/ML', collegesSelected: ['Global Tech Institute', 'Pioneer Engineering College'], collegeFinalized: 'Global Tech Institute', coursesSelected: ['Computer Science', 'Data Science'], courseFinalized: 'Computer Science', counselor: 'John Doe' },
    { id: 'STU002', name: 'Bob Williams', mainCourse: 'Fine Arts', subCourse: 'Painting', collegesSelected: ['National Arts University'], collegeFinalized: '', coursesSelected: ['Fine Arts', 'Graphic Design'], courseFinalized: '', counselor: 'Jane Smith' },
    { id: 'STU003', name: 'Charlie Brown', mainCourse: 'MBA', subCourse: 'Marketing', collegesSelected: ['Evergreen Business School'], collegeFinalized: 'Evergreen Business School', coursesSelected: ['MBA'], courseFinalized: 'MBA', counselor: 'John Doe' },
];

const admittedData: AdmittedStudent[] = [
    { date: '2025-08-15', student: 'Alice Johnson', college: 'Global Tech Institute', course: 'Computer Science', subCourse: 'AI/ML', counselor: 'John Doe' },
    { date: '2025-08-14', student: 'Charlie Brown', college: 'Evergreen Business School', course: 'MBA', subCourse: 'Marketing', counselor: 'John Doe' },
];

// --- HELPER COMPONENTS ---
const Spinner: FC = () => (
    <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
);

// --- MODAL COMPONENT ---
interface EmailModalProps {
    student: Student | null;
    onClose: () => void;
}

const EmailModal: FC<EmailModalProps> = ({ student, onClose }) => {
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
            // Simulate API call
            setTimeout(() => {
                setSubject(`Student Referral: ${student.name} for ${student.courseFinalized}`);
                setBody(`Dear Admissions Team,

I hope this email finds you well. I am writing to refer ${student.name}, an exceptional student who has expressed strong interest in your ${student.courseFinalized} program.

${student.name} has demonstrated excellent academic performance and commitment to their field of study. After careful consideration of their academic goals and our discussion about their career aspirations, I believe your institution would be an ideal fit for their educational journey.

I would appreciate the opportunity to discuss ${student.name}'s application further. Please let me know if you require any additional information or documentation.

Best regards,
${student.counselor}
Dream Institution`);
                setIsLoading(false);
            }, 2000);
        } catch (err) {
            console.error("Error generating email:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            setIsLoading(false);
        }
    }, [student]);

    useEffect(() => {
        draftEmail();
    }, [draftEmail]);

    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-premium">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" />
                            Draft Forwarding Email
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading ? <Spinner /> : error ? (
                        <div className="text-center p-6 bg-destructive/10 rounded-lg">
                            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                            <p className="text-destructive font-medium mb-2">Error: {error}</p>
                            <p className="text-muted-foreground">Could not generate email draft. Please try again later.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="emailSubject" className="block text-sm font-medium mb-2">Subject</label>
                                <Input 
                                    id="emailSubject" 
                                    value={subject} 
                                    onChange={e => setSubject(e.target.value)}
                                    className="font-medium"
                                />
                            </div>
                            <div>
                                <label htmlFor="emailBody" className="block text-sm font-medium mb-2">Message Body</label>
                                <Textarea 
                                    id="emailBody" 
                                    value={body} 
                                    onChange={e => setBody(e.target.value)} 
                                    rows={12}
                                    className="resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button className="bg-gradient-primary">
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Email
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// --- TAB COMPONENTS ---
const CollegesTab: FC = () => {
    const [colleges, setColleges] = useState<College[]>(initialCollegesData);
    const [newCollege, setNewCollege] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        state: '',
        courses: [] as string[]
    });

    const handleAddCollege = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCollege.name && newCollege.email && newCollege.phone) {
            const college: College = {
                name: newCollege.name,
                email: newCollege.email,
                phone: newCollege.phone,
                address: newCollege.address || 'Address not provided',
                state: newCollege.state || 'State not provided',
                courses: newCollege.courses.length > 0 ? newCollege.courses : ['General Course']
            };
            setColleges([...colleges, college]);
            setNewCollege({
                name: '',
                email: '',
                phone: '',
                password: '',
                address: '',
                state: '',
                courses: []
            });
            alert('College added successfully!');
        } else {
            alert('Please fill in required fields: Name, Email, and Phone');
        }
    };

    const handleEditCollege = (index: number) => {
        const college = colleges[index];
        const newName = prompt('Enter new college name:', college.name);
        if (newName && newName.trim()) {
            const updatedColleges = [...colleges];
            updatedColleges[index] = { ...college, name: newName.trim() };
            setColleges(updatedColleges);
        }
    };

    const handleDeleteCollege = (index: number) => {
        if (confirm('Are you sure you want to delete this college?')) {
            const updatedColleges = colleges.filter((_, i) => i !== index);
            setColleges(updatedColleges);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-card">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        Add New College
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleAddCollege} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input 
                            placeholder="College Name *" 
                            className="h-11" 
                            value={newCollege.name}
                            onChange={(e) => setNewCollege({...newCollege, name: e.target.value})}
                            required
                        />
                        <Input 
                            type="email" 
                            placeholder="Email (Username) *" 
                            className="h-11"
                            value={newCollege.email}
                            onChange={(e) => setNewCollege({...newCollege, email: e.target.value})}
                            required
                        />
                        <Input 
                            placeholder="Phone Number *" 
                            className="h-11"
                            value={newCollege.phone}
                            onChange={(e) => setNewCollege({...newCollege, phone: e.target.value})}
                            required
                        />
                        <Input 
                            type="password" 
                            placeholder="Password" 
                            className="h-11"
                            value={newCollege.password}
                            onChange={(e) => setNewCollege({...newCollege, password: e.target.value})}
                        />
                        <Button type="submit" className="md:col-span-2 lg:col-span-4 h-11 bg-gradient-primary hover:opacity-90 transition-opacity">
                            <Building2 className="w-4 h-4 mr-2" />
                            Add College
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-card">
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <School className="w-6 h-6 text-primary" />
                        </div>
                        College Listings
                        <Badge variant="secondary" className="ml-auto">
                            {colleges.length} Colleges
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">College</TableHead>
                                <TableHead className="font-semibold">Courses</TableHead>
                                <TableHead className="font-semibold">Location</TableHead>
                                <TableHead className="font-semibold">Contact</TableHead>
                                <TableHead className="text-right font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {colleges.map((college, index) => (
                                <TableRow key={`${college.name}-${index}`} className="hover:bg-muted/25 transition-colors">
                                    <TableCell>
                                        <div>
                                            <div className="font-semibold text-foreground">{college.name}</div>
                                            <Badge variant="outline" className="mt-1 text-xs">
                                                ID: COL{String(index + 1).padStart(3, '0')}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {college.courses.map(course => (
                                                <Badge key={course} variant="secondary" className="text-xs">
                                                    {course}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div className="text-sm">
                                                <div>{college.address}</div>
                                                <div className="text-muted-foreground">{college.state}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-3 h-3 text-muted-foreground" />
                                                {college.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                {college.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleEditCollege(index)}
                                                className="hover:bg-primary/10 hover:text-primary"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleDeleteCollege(index)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

const StudentsTab: FC<{ onForwardProfile: (student: Student) => void }> = ({ onForwardProfile }) => {
    const [students, setStudents] = useState<Student[]>(initialStudentsData);

    const handleFinalize = (studentId: string, field: 'college' | 'course', value: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                return field === 'college' ? { ...s, collegeFinalized: value } : { ...s, courseFinalized: value };
            }
            return s;
        }));
    };
    
    return (
        <Card className="shadow-card">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="w-6 h-6 text-primary" />
                    </div>
                    Student Leads
                    <Badge variant="secondary" className="ml-auto">
                        {students.length} Active Leads
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Student Details</TableHead>
                            <TableHead className="font-semibold">Colleges Selected</TableHead>
                            <TableHead className="font-semibold">College Finalized</TableHead>
                            <TableHead className="font-semibold">Courses Selected</TableHead>
                            <TableHead className="font-semibold">Course Finalized</TableHead>
                            <TableHead className="text-center font-semibold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map(student => (
                            <TableRow key={student.id} className="hover:bg-muted/25 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">{student.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {student.mainCourse} • {student.counselor}
                                            </div>
                                            <Badge variant="outline" className="text-xs mt-1">
                                                {student.id}
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {student.collegesSelected.map(college => (
                                            <Badge 
                                                key={college} 
                                                variant="outline" 
                                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                                                onClick={() => handleFinalize(student.id, 'college', college)}
                                            >
                                                {college}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {student.collegeFinalized ? (
                                        <Badge className="bg-success text-success-foreground">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            {student.collegeFinalized}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Pending
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {student.coursesSelected.map(course => (
                                            <Badge 
                                                key={course} 
                                                variant="outline" 
                                                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                                                onClick={() => handleFinalize(student.id, 'course', course)}
                                            >
                                                {course}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {student.courseFinalized ? (
                                        <Badge className="bg-success text-success-foreground">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            {student.courseFinalized}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Pending
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button 
                                        onClick={() => onForwardProfile(student)} 
                                        size="sm"
                                        className="bg-gradient-primary"
                                        disabled={!student.collegeFinalized || !student.courseFinalized}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Forward
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const AdmittedTab: FC = () => {
    return (
        <Card className="shadow-card">
            <CardHeader className="border-b bg-gradient-to-r from-success/5 to-success/10">
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-success" />
                    </div>
                    Admitted Students
                    <Badge variant="secondary" className="ml-auto">
                        {admittedData.length} Admissions
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Admission Date</TableHead>
                            <TableHead className="font-semibold">Student Details</TableHead>
                            <TableHead className="font-semibold">College</TableHead>
                            <TableHead className="font-semibold">Course Details</TableHead>
                            <TableHead className="font-semibold">Counselor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admittedData.map((admitted, index) => (
                            <TableRow key={`${admitted.student}-${index}`} className="hover:bg-muted/25 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{admitted.date}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-success/10 rounded-full">
                                            <User className="w-4 h-4 text-success" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground">{admitted.student}</div>
                                            <Badge className="bg-success text-success-foreground mt-1">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Admitted
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <School className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{admitted.college}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">{admitted.course}</div>
                                            <div className="text-sm text-muted-foreground">({admitted.subCourse})</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-muted-foreground" />
                                        <span>{admitted.counselor}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

// --- MAIN APP COMPONENT ---
type Tab = 'colleges' | 'students' | 'admitted';

const AdminPortal: FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('colleges');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const handleForwardProfile = (student: Student) => {
        if (!student.collegeFinalized || !student.courseFinalized) {
            alert("Please finalize the student's college and course before forwarding.");
            return;
        }
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto p-6 space-y-8">
                {/* Header */}
                <header className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-primary rounded-2xl shadow-premium">
                            <GraduationCap className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-4xl font-bold text-foreground">Admin Portal</h1>
                            <p className="text-lg text-muted-foreground">My Dream Institution</p>
                        </div>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Comprehensive management system for educational institutions. 
                        Streamline admissions, manage partnerships, and track student progress.
                    </p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-card border-l-4 border-l-primary">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Colleges</p>
                                    <p className="text-3xl font-bold text-primary">{initialCollegesData.length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-card border-l-4 border-l-warning">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Leads</p>
                                    <p className="text-3xl font-bold text-warning">{initialStudentsData.length}</p>
                                </div>
                                <div className="p-3 bg-warning/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-warning" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-card border-l-4 border-l-success">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Admissions</p>
                                    <p className="text-3xl font-bold text-success">{admittedData.length}</p>
                                </div>
                                <div className="p-3 bg-success/10 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-success" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto h-12">
                        <TabsTrigger value="colleges" className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Colleges
                        </TabsTrigger>
                        <TabsTrigger value="students" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Students
                        </TabsTrigger>
                        <TabsTrigger value="admitted" className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Admitted
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="colleges">
                        <CollegesTab />
                    </TabsContent>
                    <TabsContent value="students">
                        <StudentsTab onForwardProfile={handleForwardProfile} />
                    </TabsContent>
                    <TabsContent value="admitted">
                        <AdmittedTab />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Modal */}
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