export interface College {
  name: string;
  courses: string[];
  address: string;
  state: string;
  email: string;
  phone: string;
}

export interface BackendUser {
  _id: string;
  name?: string;
  email: string;
  mainCourse?: string;
  subCourse?: string;
  collegeFinalized?: string;
  courseFinalized?: string;
  counselor?: string;
}

export interface CourseSelection {
  college: {
    _id: string;
    name: string;
  };
  courses: string[];
  applicationStatus?: string;
  notes?: string;
  addedAt?: string;
}

export interface Student {
  id: string;
  name: string;
  mainCourse: string;
  subCourse: string;
  collegesSelected: string[];
  collegeFinalized: string;
  coursesSelected: string[];
  courseFinalized: string;
  counselor: string;
  courseSelections?: CourseSelection[];
}

export interface AdmittedStudent {
  date: string;
  student: string;
  college: string;
  course: string;
  subCourse: string;
  counselor: string;
}

export interface EmailModalProps {
  student: Student | null;
  onClose: () => void;
}