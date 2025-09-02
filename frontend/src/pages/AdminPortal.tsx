import React, { useState, useEffect, useCallback, FC } from 'react';
import { useMainContext } from '../context/mainContext';
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
  User, 
  School, 
  BookOpen,
  TrendingUp,
  Calendar,
  Shield,
  CheckCircle2,
  Clock,
  Loader2,
  ListOrdered,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Eye,
  Send,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollege } from '@/context/collegeContext';
import { useToast } from '@/hooks/use-toast';

// --- TYPE DEFINITIONS ---
interface College {
    instituteCode?: string;
    password?: string;
    name?: string;
    courses?: string[];
    address?: string;
    state?: string;
    email?: string;
    phone?: string;
    _id?: string;
    [key: string]: unknown; // Allow additional properties from backend
}

interface BackendUser {
    _id: string;
    name?: string;
    email: string;
    mainCourse?: string;
    subCourse?: string;
    collegeFinalized?: string;
    courseFinalized?: string;
    counselor?: string;
}

interface CourseSelection {
    college: {
        _id: string;
        name: string;
    };
    courses: string[];
    applicationStatus?: string;
    notes?: string;
    addedAt?: string;
}


interface Student {
    id: string;
    name: string;
    email: string;
    mainCourse: string;
    subCourse: string;
    collegesSelected: string[];
    collegeFinalized: string;
    coursesSelected: string[];
    courseFinalized: string;
    counselor: string;
    courseSelections?: CourseSelection[];
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
    { id: 'STU001', name: 'Alice Johnson', email: 'alice@example.com', mainCourse: 'Computer Science', subCourse: 'AI/ML', collegesSelected: ['Global Tech Institute', 'Pioneer Engineering College'], collegeFinalized: 'Global Tech Institute', coursesSelected: ['Computer Science', 'Data Science'], courseFinalized: 'Computer Science', counselor: 'John Doe' },
    { id: 'STU002', name: 'Bob Williams', email: 'bob@example.com', mainCourse: 'Fine Arts', subCourse: 'Painting', collegesSelected: ['National Arts University'], collegeFinalized: '', coursesSelected: ['Fine Arts', 'Graphic Design'], courseFinalized: '', counselor: 'Jane Smith' },
    { id: 'STU003', name: 'Charlie Brown', email: 'charlie@example.com', mainCourse: 'MBA', subCourse: 'Marketing', collegesSelected: ['Evergreen Business School'], collegeFinalized: 'Evergreen Business School', coursesSelected: ['MBA'], courseFinalized: 'MBA', counselor: 'John Doe' },
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

// --- FORWARD STUDENT MODAL ---
interface ForwardStudentModalProps {
    student: Student | null;
    onClose: () => void;
}

const ForwardStudentModal: FC<ForwardStudentModalProps> = ({ student, onClose }) => {
    const [selectedCollege, setSelectedCollege] = useState('');
    const [notes, setNotes] = useState('');
    const [isForwarding, setIsForwarding] = useState(false);
    const [colleges, setColleges] = useState<{_id: string, name: string}[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const {server} = useMainContext();

    // Fetch available colleges for forwarding
    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${server}/api/college-admins`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (response.ok) {
                    const data = await response.json();
                    setColleges(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching colleges:', error);
            }
        };
        fetchColleges();
    }, [server]);

    const handleForward = async () => {
        if (!student || !selectedCollege) {
            setError('Please select a college to forward to');
            return;
        }

        setIsForwarding(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${server}/api/users/forward`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    studentId: student.id,
                    collegeId: selectedCollege,
                    courses: [student.courseFinalized || student.mainCourse],
                    notes: notes
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => onClose(), 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to forward student');
            }
        } catch (error) {
            setError('Error forwarding student');
            console.error('Error:', error);
        } finally {
            setIsForwarding(false);
        }
    };

    if (!student) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <Card className="w-full max-w-2xl shadow-premium">
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Forward Student Profile
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {success ? (
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Student Forwarded Successfully!</h3>
                            <p className="text-green-700">The student profile has been sent to the selected college.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Student Info Summary */}
                            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg">
                                <h3 className="font-semibold text-primary mb-2">Student Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-medium">Name:</span> {student.name}</div>
                                    <div><span className="font-medium">Email:</span> {student.email}</div>
                                    <div><span className="font-medium">Main Course:</span> {student.mainCourse}</div>
                                    <div><span className="font-medium">Sub Course:</span> {student.subCourse}</div>
                                    <div><span className="font-medium">Finalized College:</span> {student.collegeFinalized || 'Not set'}</div>
                                    <div><span className="font-medium">Finalized Course:</span> {student.courseFinalized || 'Not set'}</div>
                                </div>
                            </div>

                            {/* College Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Select College to Forward To *</label>
                                <select 
                                    value={selectedCollege} 
                                    onChange={(e) => setSelectedCollege(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    required
                                >
                                    <option value="">Choose a college...</option>
                                    {colleges.map(college => (
                                        <option key={college._id} value={college._id}>
                                            {college.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                                <Textarea 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any additional information about this student..."
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleForward}
                                    disabled={isForwarding || !selectedCollege}
                                    className="bg-gradient-primary"
                                >
                                    {isForwarding ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Forwarding...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Forward Student
                                        </>
                                    )}
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
    const { server } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<CourseSelection[]>([]);
    const [studentInfo, setStudentInfo] = useState<{
        firstName?: string;
        lastName?: string;
        fullName?: string;
        email?: string;
        phone?: number;
        dateOfBirth?: string;
        education?: string;
        role?: string;
        createdAt?: string;
        mainCourse?: string;
        subCourse?: string;
        collegeFinalized?: string;
        courseFinalized?: string;
        counselor?: string;
    } | null>(null);

    useEffect(() => {
        if (!studentId) return;
        let mounted = true;
        (async () => {
            setLoading(true); setError(null);
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                
                // Get complete student info from new endpoint
                const userRes = await fetch(`${server}/api/users/student/${encodeURIComponent(studentId)}/info`, { 
                    headers: token ? { Authorization: `Bearer ${token}` } : {} 
                });
                if (!userRes.ok) throw new Error('Failed to load student info');
                const userResponse = await userRes.json();
                
                // Get student's course selections
                const detailsRes = await fetch(`${server}/api/users/student/${encodeURIComponent(studentId)}/details`, { 
                    headers: token ? { Authorization: `Bearer ${token}` } : {} 
                });
                let courseSelections = [];
                if (detailsRes.ok) {
                    const detailsData = await detailsRes.json();
                    courseSelections = detailsData.courseSelections || [];
                }
                
                // Set student info from user data
                if (mounted) {
                    setStudentInfo(userResponse.student);
                    setItems(courseSelections);
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Error');
            } finally { if (mounted) setLoading(false); }
        })();
        return () => { mounted = false; };
    }, [studentId, initialName, server]);

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
                        <div className="space-y-6">
                            {/* Basic Student Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Name</div>
                                    <div className="font-medium">{studentInfo?.fullName || `${studentInfo?.firstName || ''} ${studentInfo?.lastName || ''}`.trim() || initialName || 'Unknown'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Email</div>
                                    <div className="font-medium">{studentInfo?.email || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Phone</div>
                                    <div className="font-medium">{studentInfo?.phone || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Date of Birth</div>
                                    <div className="font-medium">{studentInfo?.dateOfBirth ? new Date(studentInfo.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Education Background</div>
                                    <div className="font-medium">{studentInfo?.education || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Registration Date</div>
                                    <div className="font-medium">{studentInfo?.createdAt ? new Date(studentInfo.createdAt).toLocaleDateString() : 'N/A'}</div>
                                </div>
                                {studentInfo?.counselor && (
                                    <div>
                                        <div className="text-sm text-muted-foreground">Assigned Counselor</div>
                                        <div className="font-medium">{studentInfo.counselor}</div>
                                    </div>
                                )}
                                {studentInfo?.collegeFinalized && (
                                    <div>
                                        <div className="text-sm text-muted-foreground">Finalized College</div>
                                        <div className="font-medium text-green-600">{studentInfo.collegeFinalized}</div>
                                    </div>
                                )}
                                {studentInfo?.courseFinalized && (
                                    <div>
                                        <div className="text-sm text-muted-foreground">Finalized Course</div>
                                        <div className="font-medium text-green-600">{studentInfo.courseFinalized}</div>
                                    </div>
                                )}
                            </div>

                            {/* Course Selections */}
                            {items.length === 0 ? (
                                <div className="text-sm text-muted-foreground">No college applications found for this student.</div>
                            ) : (
                                <div>
                                    <div className="text-sm text-muted-foreground mb-3">College Applications & Course Selections</div>
                                    <div className="space-y-3">
                                        {items.map((selection, idx) => (
                                            <div key={idx} className="p-4 bg-card rounded-lg border">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-medium text-primary">{selection.college.name}</div>
                                                    {selection.applicationStatus && (
                                                        <Badge variant="secondary">{selection.applicationStatus}</Badge>
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground mb-2">
                                                    Applied: {selection.addedAt ? new Date(selection.addedAt).toLocaleString() : 'Unknown'}
                                                </div>
                                                {Array.isArray(selection.courses) && selection.courses.length > 0 && (
                                                    <div className="mt-2">
                                                        <div className="text-xs text-muted-foreground mb-1">Selected Courses:</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {selection.courses.map((course, courseIndex) => (
                                                                <Badge key={courseIndex} variant="outline" className="text-xs">
                                                                    {course}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {selection.notes && (
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        <span className="font-medium">Notes: </span>
                                                        {selection.notes}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
    const { toast } = useToast();
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
            toast({
                title: "College Added Successfully! 🎉",
                description: `${newCollege.name} has been added to the partner network`,
            });
        } else {
            toast({
                title: "Missing Required Fields",
                description: "Please fill in required fields: Name, Email, and Phone",
                variant: "destructive",
            });
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
            <Card className="shadow-xl border-emerald-100">
                <CardHeader className="border-b bg-gradient-to-r from-emerald-500/10 to-emerald-600/15">
                    <CardTitle className="flex items-center gap-3 text-emerald-700">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Building2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        Add New Partner College
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
                        <Button type="submit" className="md:col-span-2 lg:col-span-4 h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                            <Building2 className="w-4 h-4 mr-2" />
                            Add Partner College
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="shadow-xl border-emerald-100">
                <CardHeader className="border-b bg-gradient-to-r from-emerald-500/10 to-emerald-600/15">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <School className="w-6 h-6 text-emerald-600" />
                        </div>
                        <CardTitle className="flex items-center gap-3 text-emerald-700">College Directory</CardTitle>
                        <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200">{colleges.length} Colleges</Badge>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-3 hover:bg-emerald-50 text-emerald-600" 
                            onClick={fetchColleges} 
                            title="Refresh colleges"
                        >
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
    const {server} = useMainContext();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [selectedStudentName, setSelectedStudentName] = useState<string | undefined>(undefined);
    const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
    const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // Fetch all students from users endpoint
    useEffect(() => {
        let mounted = true;
        const fetchStudents = async () => {
            setLoading(true); setError(null);
            try {
                const response = await fetch(`${server}/api/users`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const transformedStudents: Student[] = data.users.map((user: BackendUser) => ({
                        id: user._id,
                        name: user.name || user.email,
                        email: user.email,
                        mainCourse: user.mainCourse || 'Not Specified',
                        subCourse: user.subCourse || 'Not Specified',
                        collegesSelected: [], // Will be populated when expanded
                        collegeFinalized: user.collegeFinalized || '',
                        coursesSelected: [], // Will be populated when expanded
                        courseFinalized: user.courseFinalized || '',
                        counselor: user.counselor || 'Not Assigned'
                    }));
                    if (mounted) setStudents(transformedStudents);
                } else {
                    if (mounted) setError('Failed to fetch students');
                }
            } catch (err) {
                if (mounted) setError('Error fetching students');
                console.error('Error fetching students:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchStudents();
        return () => { mounted = false; };
    }, [token, server]);

    const fetchStudentDetails = async (studentId: string) => {
        try {
            setLoadingDetails(prev => new Set(prev).add(studentId));
            const response = await fetch(`${server}/api/users/student/${studentId}/details`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (response.ok) {
                const studentDetails = await response.json();
                setStudents(prev => prev.map(s => 
                    s.id === studentId ? { 
                        ...s, 
                        courseSelections: studentDetails.courseSelections,
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
            const student = students.find(s => s.id === studentId);
            if (student && !student.courseSelections) {
                await fetchStudentDetails(studentId);
            }
        }
        setExpandedStudents(newExpanded);
    };

    const handleFinalize = async (studentId: string, field: 'college' | 'course', value: string) => {
        try {
            const response = await fetch(`${server}/api/users/${studentId}/finalize`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ field, value })
            });

            if (response.ok) {
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

    return (
        <Card className="shadow-xl border-emerald-100">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-500/10 to-emerald-600/15">
                <CardTitle className="flex items-center gap-3 text-emerald-700">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    Student Management Dashboard
                    <Badge variant="secondary" className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200">
                        {students.length} Active Students
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? <div className="p-6"><Spinner /></div> : error ? <div className="p-6 text-center text-destructive">{error}</div> : (
                <Table>
                    <TableHeader>
                        <TableRow className="bg-emerald-50/50">
                            <TableHead className="font-semibold w-12 text-emerald-700">Expand</TableHead>
                            <TableHead className="font-semibold text-emerald-700">Student Details</TableHead>
                            <TableHead className="font-semibold text-emerald-700">Colleges Selected</TableHead>
                            <TableHead className="font-semibold text-emerald-700">College Finalized</TableHead>
                            <TableHead className="font-semibold text-emerald-700">Courses Selected</TableHead>
                            <TableHead className="font-semibold text-emerald-700">Course Finalized</TableHead>
                            <TableHead className="text-center font-semibold text-emerald-700">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <div className="flex flex-col items-center gap-3">
                                        <Users className="w-12 h-12 text-emerald-400" />
                                        <div>
                                            <h3 className="font-semibold text-emerald-600">No students found</h3>
                                            <p className="text-sm text-slate-500">Students will appear here once they register on the platform</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map(student => (
                                <React.Fragment key={student.id}>
                                    <TableRow className="hover:bg-emerald-50/50 transition-colors">
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleStudentExpansion(student.id)}
                                                disabled={loadingDetails.has(student.id)}
                                                className="p-1 h-8 w-8 hover:bg-emerald-100"
                                            >
                                                {loadingDetails.has(student.id) ? (
                                                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                                ) : expandedStudents.has(student.id) ? (
                                                    <ChevronDown className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-emerald-600" />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 rounded-lg">
                                                    <User className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <button className="font-semibold text-slate-800 text-left hover:text-emerald-600 transition-colors" onClick={() => { setSelectedStudentId(student.id); setSelectedStudentName(student.name); }}>
                                                        {student.name}
                                                    </button>
                                                    <div className="text-sm text-slate-600">
                                                        {student.mainCourse} • {student.counselor}
                                                    </div>
                                                    <Badge variant="outline" className="text-xs mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">{student.id}</Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {student.collegesSelected?.length > 0 ? student.collegesSelected.map(college => (
                                                    <Badge 
                                                        key={college} 
                                                        variant="outline" 
                                                        className="cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        onClick={() => handleFinalize(student.id, 'college', college)}
                                                    >
                                                        {college}
                                                    </Badge>
                                                )) : (
                                                    <span className="text-xs text-slate-500">Click expand to see selections</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.collegeFinalized ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    {student.collegeFinalized}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-slate-500 border-slate-300">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {student.coursesSelected?.length > 0 ? student.coursesSelected.map(course => (
                                                    <Badge 
                                                        key={course} 
                                                        variant="outline" 
                                                        className="cursor-pointer hover:bg-emerald-600 hover:text-white transition-colors text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        onClick={() => handleFinalize(student.id, 'course', course)}
                                                    >
                                                        {course}
                                                    </Badge>
                                                )) : (
                                                    <span className="text-xs text-slate-500">Click expand to see selections</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.courseFinalized ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    {student.courseFinalized}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-slate-500 border-slate-300">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button size="sm" variant="outline" onClick={() => { 
                                                    setSelectedStudentId(student.id); 
                                                    setSelectedStudentName(student.name);
                                                }} className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Info
                                                </Button>
                                                <Button 
                                                    onClick={() => onForwardProfile(student)} 
                                                    size="sm"
                                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                                                    disabled={!student.collegeFinalized || !student.courseFinalized}
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Forward
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    
                                    {/* Expanded row showing detailed course selections */}
                                    {expandedStudents.has(student.id) && (
                                        <TableRow className="bg-emerald-50/30">
                                            <TableCell colSpan={7} className="p-4 border-t border-emerald-200">
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-emerald-700">
                                                        <BookOpen className="w-4 h-4" />
                                                        Detailed Course Selections & Applications
                                                    </h4>
                                                    {loadingDetails.has(student.id) ? (
                                                        <div className="text-center py-4">
                                                            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                                            <p className="text-sm text-emerald-600">Loading course details...</p>
                                                        </div>
                                                    ) : !student.courseSelections ? (
                                                        <div className="text-center py-4">
                                                            <p className="text-slate-500">Click to load detailed course selections...</p>
                                                        </div>
                                                    ) : student.courseSelections.length === 0 ? (
                                                        <div className="text-center py-4">
                                                            <p className="text-slate-500">This student hasn't applied to any colleges yet.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="grid gap-3">
                                                            {student.courseSelections.map((selection, index) => (
                                                                <div key={index} className="border border-emerald-200 rounded-lg p-4 bg-white shadow-sm">
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <h5 className="font-medium text-lg text-emerald-700">{selection.college.name}</h5>
                                                                        {selection.applicationStatus && (
                                                                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                                                                {selection.applicationStatus}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {selection.courses.length > 0 && (
                                                                        <div className="mb-2">
                                                                            <p className="text-sm font-medium text-slate-600 mb-1">Applied Courses:</p>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {selection.courses.map((course, courseIndex) => (
                                                                                    <Badge key={courseIndex} variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                                        {course}
                                                                                    </Badge>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {selection.notes && (
                                                                        <div className="mt-2 p-2 bg-emerald-50/50 rounded text-sm border-l-2 border-emerald-300">
                                                                            <span className="font-medium text-emerald-700">Notes: </span>
                                                                            <span className="text-slate-600">{selection.notes}</span>
                                                                        </div>
                                                                    )}
                                                                    {selection.addedAt && (
                                                                        <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                                                            <Calendar className="w-3 h-3" />
                                                                            Applied: {new Date(selection.addedAt).toLocaleDateString()}
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
        <Card className="shadow-xl border-green-100">
            <CardHeader className="border-b bg-gradient-to-r from-green-500/10 to-green-600/15">
                <CardTitle className="flex items-center gap-3 text-green-700">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    Successful Admissions
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 border-green-200">
                        {admittedData.length} Completed
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
    const {server} = useMainContext();
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
                const res = await fetch(`${server}/api/shortlists/college`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
        }, [token, server]);

        const fetchStats = React.useCallback(async () => {
            setMode('aggregate');
            setLoading(true); setError(null);
            try {
                const res = await fetch(`${server}/api/shortlists/stats/aggregate`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
        }, [token, fetchOwnCollege, server]);

  const fetchStudents = async (stat: ShortlistStat) => {
    setSelectedCollege(stat);
    setStudentsLoading(true); setError(null); setStudents([]);
    try {
      const res = await fetch(`${server}/api/shortlists/college/${stat.collegeAdminId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
                <Card className="shadow-xl border-blue-100">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-500/10 to-blue-600/15">
                        <CardTitle className="flex items-center gap-3 text-blue-700">
                            <div className="p-2 bg-blue-500/10 rounded-lg"><ListOrdered className="w-6 h-6 text-blue-600" /></div>
                            College Shortlist Analytics
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-auto hover:bg-blue-50 text-blue-600" 
                                onClick={fetchStats} 
                                disabled={loading}
                            >
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
        <Card className="shadow-xl border-blue-100">
          <CardHeader className="border-b bg-gradient-to-r from-blue-500/10 to-blue-600/15">
            <CardTitle className="flex items-center gap-3 text-blue-700">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              {mode === 'aggregate' ? `Students interested in ${selectedCollege.name}` : 'Students interested in your college'}
              <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-700 border-blue-200">{students.length} Students</Badge>
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
    const { toast } = useToast();
   
    const [activeTab, setActiveTab] = useState<Tab>('colleges');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [collegeCount, setCollegeCount] = useState<number>(0);

    const handleForwardProfile = (student: Student) => {
        if (!student.collegeFinalized || !student.courseFinalized) {
            toast({
                title: "Cannot Forward Student",
                description: "Please finalize the student's college and course before forwarding.",
                variant: "destructive",
            });
            return;
        }
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-50">
            <div className="container mx-auto p-6 space-y-8">
                {/* Header */}
                <header className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-xl">
                            <img 
                                src="/logo.jpeg" 
                                alt="CollegeManzil" 
                                className="w-12 h-12 object-cover rounded-lg shadow-sm"
                            />
                        </div>
                        <div className="text-left">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                                CollegeManzil Admin
                            </h1>
                            <p className="text-lg text-slate-600">Administrative Dashboard</p>
                        </div>
                    </div>
                    <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed">
                        Comprehensive management system for educational institutions. 
                        Streamline admissions, manage college partnerships, and track student progress across the platform.
                    </p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="shadow-xl border-l-4 border-l-emerald-500 hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Partner Colleges</p>
                                    <p className="text-3xl font-bold text-emerald-600">{collegeCount}</p>
                                    <p className="text-xs text-slate-500 mt-1">Active institutions</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-xl">
                                    <Building2 className="w-7 h-7 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-xl border-l-4 border-l-amber-500 hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Student Leads</p>
                                    <p className="text-3xl font-bold text-amber-600">{initialStudentsData.length}</p>
                                    <p className="text-xs text-slate-500 mt-1">Active prospects</p>
                                </div>
                                <div className="p-3 bg-amber-100 rounded-xl">
                                    <TrendingUp className="w-7 h-7 text-amber-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-xl border-l-4 border-l-green-500 hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">Successful Admissions</p>
                                    <p className="text-3xl font-bold text-green-600">{admittedData.length}</p>
                                    <p className="text-xs text-slate-500 mt-1">Completed placements</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto h-14 bg-emerald-50 border border-emerald-200">
                        <TabsTrigger 
                            value="colleges" 
                            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                        >
                            <Building2 className="w-4 h-4" />
                            Colleges
                        </TabsTrigger>
                        <TabsTrigger 
                            value="students" 
                            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                        >
                            <Users className="w-4 h-4" />
                            Students
                        </TabsTrigger>
                        <TabsTrigger 
                            value="admitted" 
                            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                        >
                            <GraduationCap className="w-4 h-4" />
                            Admitted
                        </TabsTrigger>
                        <TabsTrigger 
                            value="shortlists" 
                            className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                        >
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
                <ForwardStudentModal 
                    student={selectedStudent} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default AdminPortal;