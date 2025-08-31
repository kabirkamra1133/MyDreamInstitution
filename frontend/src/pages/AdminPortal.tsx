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
  Loader2,
  ListOrdered,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollege } from '@/context/collegeContext';

// --- TYPE DEFINITIONS ---
interface College {
    instituteCode?: string;
    password : string,
    name: string;
    courses: string[];
    address: string;
    state: string;
    email: string;
    phone: string;
}
interface CollegeRegistrationData {
    instituteCode : string,
    email: string;
    password: string
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

// Define new types for shortlist stats
interface ShortlistStat { collegeAdminId: string; name: string; email?: string; count: number; latest: string; }
interface ShortlistedStudent { id: string; firstName: string; lastName: string; email: string; education: string; shortlistedAt: string; }

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

    // (Prompt removed - previously unused variable causing lint warning)

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

// --- STUDENT DETAILS MODAL ---
interface StudentDetailsModalProps {
    studentId: string | null;
    initialName?: string;
    onClose: () => void;
}

const StudentDetailsModal: FC<StudentDetailsModalProps> = ({ studentId, initialName, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<any[]>([]);
    const [studentInfo, setStudentInfo] = useState<{ name?: string; email?: string; phone?: string } | null>(null);

    useEffect(() => {
        if (!studentId) return;
        let mounted = true;
        (async () => {
            setLoading(true); setError(null);
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const res = await fetch(`/api/shortlists?student=${encodeURIComponent(studentId)}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                if (!res.ok) throw new Error('Failed to load student details');
                const body = await res.json();
                const data = Array.isArray(body.data) ? body.data : body.data && Array.isArray([body.data]) ? [body.data] : [];
                if (!mounted) return;
                setItems(data.map(d => ({ college: d.college?.name || d.college, interestedCourses: d.interestedCourses || [], notes: d.notes, createdAt: d.createdAt })));
                // try to set basic student info from populated student field if present
                if (data[0] && data[0].student) {
                    setStudentInfo({ name: `${data[0].student.firstName || ''} ${data[0].student.lastName || ''}`.trim(), email: data[0].student.email });
                } else {
                    setStudentInfo({ name: initialName });
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Error');
            } finally { if (mounted) setLoading(false); }
        })();
        return () => { mounted = false; };
    }, [studentId]);

    if (!studentId) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-premium">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">Student Details</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4"/></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {loading ? <Spinner /> : error ? (
                        <div className="text-center text-destructive">{error}</div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-muted-foreground">Name</div>
                                <div className="font-medium">{studentInfo?.name || initialName || 'Unknown'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Email</div>
                                <div className="font-medium">{studentInfo?.email || 'N/A'}</div>
                            </div>
                            {items.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No shortlist entries found for this student.</div>
                            ) : (
                                <div>
                                    <div className="text-sm text-muted-foreground mb-2">Shortlist Entries</div>
                                    <ul className="space-y-3">
                                        {items.map((it, idx) => (
                                            <li key={idx} className="p-3 bg-card rounded">
                                                <div className="text-sm font-medium">{it.college}</div>
                                                <div className="text-xs text-muted-foreground">Added: {new Date(it.createdAt).toLocaleString()}</div>
                                                {Array.isArray(it.interestedCourses) && it.interestedCourses.length > 0 && (
                                                    <div className="mt-2 text-sm">
                                                        <div className="text-xs text-muted-foreground">Interested Courses:</div>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {it.interestedCourses.map((c: any, i: number) => (
                                                                <Badge key={`${i}-${c.name}`} variant="secondary" className="text-xs">{c.parent} — {c.name}</Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {it.notes && (<div className="mt-2 text-sm text-muted-foreground">Notes: {it.notes}</div>)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// --- TAB COMPONENTS ---
const CollegesTab: FC<{ onListChange?: (count: number) => void }> = ({ onListChange }) => {
    const {saveCollegeData,getRegisteredColleges} = useCollege();
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newCollege, setNewCollege] = useState({
        instituteCode: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        state: '',
        courses: [] as string[]
    });

    const handleAddCollege = async(e: React.FormEvent) => {
        e.preventDefault();
        if (newCollege.name && newCollege.email && newCollege.phone) {
            const instituteCode = newCollege.instituteCode && newCollege.instituteCode.trim()
                ? newCollege.instituteCode.trim()
                : `COL${String(colleges.length + 1).padStart(3, '0')}`;
            try{
                setError(null);
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                if (!token) {
                    setError('Not authenticated. Please login as admin before creating college credentials.');
                    return;
                }
                    await saveCollegeData({ instituteCode, name: newCollege.name, email: newCollege.email, password: newCollege.password, contactNumber: newCollege.phone });
                // refetch list from backend to avoid stale/mock data
                const list = await getRegisteredColleges();
                setColleges(list as College[]);
                onListChange?.((list as College[]).length ?? 0);
            }catch(err){
                console.error('Failed to save college', err);
                // surface backend message if available
                let msg = 'Failed to save college. Check console for details.';
                if (err && typeof err === 'object' && 'response' in err) {
                    const maybeResp = (err as unknown) as { response?: { data?: unknown } };
                    const resp = maybeResp.response;
                    if (resp && resp.data && typeof resp.data === 'object' && 'error' in (resp.data as object)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        msg = String((resp.data as any).error);
                    }
                }
                setError(msg);
                return;
            }
            setNewCollege({
                instituteCode: '',
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

    // fetch colleges (callable) and refresh on window focus
    const fetchColleges = useCallback(async () => {
        let mounted = true;
        setLoading(true); setError(null);
        try{
            const list = await getRegisteredColleges();
            if(mounted) {
                setColleges(list as College[]);
                onListChange?.((list as College[]).length ?? 0);
            }
        }catch(err){
            console.error('Error loading colleges', err);
            if(mounted) setError('Failed to load colleges');
        }finally{ if(mounted) setLoading(false); }
        return () => { mounted = false; };
    }, [getRegisteredColleges, onListChange]);

    useEffect(() => { fetchColleges(); }, [fetchColleges]);

    // Refresh when window/tab regains focus so admin sees recent student changes
    useEffect(() => {
        const onFocus = () => { fetchColleges(); };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [fetchColleges]);

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
                            placeholder="Institute Code (optional)"
                            className="h-11"
                            value={newCollege.instituteCode}
                            onChange={(e) => setNewCollege({...newCollege, instituteCode: e.target.value})}
                        />
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
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <School className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="flex items-center gap-3">College Listings</CardTitle>
                        <Badge variant="secondary" className="ml-auto">{colleges.length} Colleges</Badge>
                        <Button variant="ghost" size="sm" className="ml-3" onClick={fetchColleges} title="Refresh colleges">
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6"><Spinner /></div>
                    ) : error ? (
                        <div className="p-6 text-center text-destructive">{error}</div>
                    ) : (
                        <>
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
                            {colleges.map((college, index) => {
                                if (!college) return null;
                                const keyId = college.name ?? college.instituteCode ?? `col-${index}`;
                                const maybeCollegeObj = college as unknown as Record<string, unknown>;
                                const courses = Array.isArray(maybeCollegeObj.courses) ? (maybeCollegeObj.courses as string[]) : [];
                                return (
                                <TableRow key={`${keyId}-${index}`} className="hover:bg-muted/25 transition-colors">
                                    <TableCell>
                                        <div>
                                            <div className="font-semibold text-foreground">{college.name ?? 'Unnamed College'}</div>
                                            <Badge variant="outline" className="mt-1 text-xs">
                                                ID: {college.instituteCode ?? `COL${String(index + 1).padStart(3, '0')}`}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {courses.map(course => (
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
                                                <div>{typeof maybeCollegeObj.address === 'string' ? maybeCollegeObj.address : ''}</div>
                                                <div className="text-muted-foreground">{typeof maybeCollegeObj.state === 'string' ? maybeCollegeObj.state : ''}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-3 h-3 text-muted-foreground" />
                                                {typeof maybeCollegeObj.email === 'string' ? maybeCollegeObj.email : ''}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                {typeof maybeCollegeObj.phone === 'string' ? maybeCollegeObj.phone : ''}
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
                                );
                            })}
                        </TableBody>
                    </Table>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const StudentsTab: FC<{ onForwardProfile: (student: Student) => void }> = ({ onForwardProfile }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [selectedStudentName, setSelectedStudentName] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true); setError(null);
            try {
                // Fetch aggregated shortlist stats to discover colleges
                const res = await fetch('/api/shortlists/stats/aggregate', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                if (!res.ok) throw new Error('Failed to load shortlist stats');
                const body = await res.json();
                const stats = Array.isArray(body.data) ? body.data : [];

                const studentMap = new Map<string, Student>();
                for (const stat of stats) {
                    try {
                        const r2 = await fetch(`/api/shortlists/college/${stat.collegeAdminId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                        if (!r2.ok) continue;
                        const b2 = await r2.json();
                        const list = Array.isArray(b2.students) ? b2.students : [];
                        for (const s of list) {
                            const id = s.id ?? s._id ?? `${Math.random()}`;
                            const existing = studentMap.get(String(id));
                            if (!existing) {
                                studentMap.set(String(id), {
                                    id: String(id),
                                    name: `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || 'Unnamed',
                                    mainCourse: '',
                                    subCourse: '',
                                    collegesSelected: [stat.name ?? 'Unknown'],
                                    collegeFinalized: '',
                                    coursesSelected: [],
                                    courseFinalized: '',
                                    counselor: ''
                                });
                            } else {
                                existing.collegesSelected = Array.from(new Set([...existing.collegesSelected, stat.name ?? 'Unknown']));
                            }
                        }
                    } catch (e) {
                        console.error('Failed to fetch students for college', stat, e);
                        continue;
                    }
                }
                if (mounted) setStudents(Array.from(studentMap.values()));
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Error loading student leads');
            } finally { if (mounted) setLoading(false); }
        };
        load();
        return () => { mounted = false; };
    }, [token]);

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
                {loading ? <div className="p-6"><Spinner /></div> : error ? <div className="p-6 text-center text-destructive">{error}</div> : (
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
                                            <button className="font-semibold text-foreground text-left" onClick={() => { setSelectedStudentId(student.id); setSelectedStudentName(student.name); }}>
                                                {student.name}
                                            </button>
                                            <div className="text-sm text-muted-foreground">
                                                {student.mainCourse} • {student.counselor}
                                            </div>
                                            <Badge variant="outline" className="text-xs mt-1">{student.id}</Badge>
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
                                    <div className="flex justify-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => { setSelectedStudentId(student.id); setSelectedStudentName(student.name); }}>
                                            Info
                                        </Button>
                                        <Button 
                                            onClick={() => onForwardProfile(student)} 
                                            size="sm"
                                            className="bg-gradient-primary"
                                            disabled={!student.collegeFinalized || !student.courseFinalized}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Forward
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            {selectedStudentId && (
                <StudentDetailsModal studentId={selectedStudentId} initialName={selectedStudentName} onClose={() => { setSelectedStudentId(null); setSelectedStudentName(undefined); }} />
            )}
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

const ShortlistsTab: FC = () => {
    const [stats, setStats] = useState<ShortlistStat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCollege, setSelectedCollege] = useState<ShortlistStat | null>(null);
    const [students, setStudents] = useState<ShortlistedStudent[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [mode, setMode] = useState<'aggregate' | 'single'>('aggregate');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const fetchOwnCollege = React.useCallback(async () => {
            setMode('single');
            setStudentsLoading(true); setError(null);
            try {
                const res = await fetch('/api/shortlists/college', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                if (res.status === 401) throw new Error('Unauthorized');
                if (res.status === 403) throw new Error('Forbidden');
                if (!res.ok) throw new Error('Failed to load your college shortlist');
                const body = await res.json();
                const college = body.college ? { collegeAdminId: body.college._id, name: body.college.name, email: body.college.email, count: body.count || 0, latest: body.students?.[0]?.shortlistedAt || new Date().toISOString() } : null;
                if (college) setSelectedCollege(college);
                setStudents(Array.isArray(body.students) ? body.students : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Error');
            } finally { setStudentsLoading(false); }
        }, [token]);

        const fetchStats = React.useCallback(async () => {
            setMode('aggregate');
            setLoading(true); setError(null);
            try {
                const res = await fetch('/api/shortlists/stats/aggregate', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
                if (res.status === 401 || res.status === 403) {
                    // Not admin; fallback to single college view
                    setLoading(false);
                    await fetchOwnCollege();
                    return;
                }
                if (!res.ok) throw new Error('Failed to load stats');
                const body = await res.json();
                setStats(Array.isArray(body.data) ? body.data : []);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Error');
            } finally { setLoading(false); }
        }, [token, fetchOwnCollege]);

  const fetchStudents = async (stat: ShortlistStat) => {
    setSelectedCollege(stat);
    setStudentsLoading(true); setError(null); setStudents([]);
    try {
      const res = await fetch(`/api/shortlists/college/${stat.collegeAdminId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.status === 401) throw new Error('Unauthorized');
      if (!res.ok) throw new Error('Failed to load students');
      const body = await res.json();
      setStudents(Array.isArray(body.students) ? body.students : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally { setStudentsLoading(false); }
  };

    useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className="space-y-6">
            {mode === 'aggregate' && (
                <Card className="shadow-card">
                    <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg"><ListOrdered className="w-6 h-6 text-primary" /></div>
                            Shortlist Overview
                            <Button variant="ghost" size="sm" className="ml-auto" onClick={fetchStats} disabled={loading}>
                                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? <Spinner /> : error ? (
                            <div className="p-6 text-center text-destructive">{error}</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">College</TableHead>
                                        <TableHead className="font-semibold">Shortlists</TableHead>
                                        <TableHead className="font-semibold">Latest</TableHead>
                                        <TableHead className="text-right font-semibold">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.map(stat => (
                                        <TableRow key={stat.collegeAdminId} className="hover:bg-muted/25 transition-colors">
                                            <TableCell>
                                                <div className="font-semibold">{stat.name}</div>
                                                <div className="text-xs text-muted-foreground">{stat.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">{stat.count}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">{new Date(stat.latest).toLocaleString()}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="outline" onClick={() => fetchStudents(stat)}>View Students</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!stats.length && (
                                        <TableRow><TableCell colSpan={4} className="text-center py-6 text-sm text-muted-foreground">No shortlist data yet.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}

    {selectedCollege && (
        <Card className="shadow-card">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-3">
          {mode === 'aggregate' ? 'Students who shortlisted ' + selectedCollege.name : 'Students who shortlisted your college'}
              <Badge variant="outline" className="ml-auto">{students.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {studentsLoading ? <Spinner /> : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Student</TableHead>
                    <TableHead className="font-semibold">Education</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Shortlisted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(stu => (
                    <TableRow key={stu.id}>
                      <TableCell>
                        <div className="font-semibold">{stu.firstName} {stu.lastName}</div>
                      </TableCell>
                      <TableCell>{stu.education}</TableCell>
                      <TableCell>{stu.email}</TableCell>
                      <TableCell>{new Date(stu.shortlistedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {!students.length && (
                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-sm text-muted-foreground">No students yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
type Tab = 'colleges' | 'students' | 'admitted' | 'shortlists';

const AdminPortal: FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('colleges');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [collegeCount, setCollegeCount] = useState<number>(0);

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
                                    <p className="text-3xl font-bold text-primary">{collegeCount}</p>
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
                        <TabsTrigger value="shortlists" className="flex items-center gap-2">
                            <ListOrdered className="w-4 h-4" />
                            Shortlists
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="colleges">
                        <CollegesTab onListChange={setCollegeCount} />
                    </TabsContent>
                    <TabsContent value="students">
                        <StudentsTab onForwardProfile={handleForwardProfile} />
                    </TabsContent>
                    <TabsContent value="admitted">
                        <AdmittedTab />
                    </TabsContent>
                    <TabsContent value="shortlists">
                        <ShortlistsTab />
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