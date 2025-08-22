import type { College, Student, AdmittedStudent } from '../types/admin.types';

export const collegesData: College[] = [
  { 
    name: 'Global Tech Institute', 
    courses: ['Computer Science', 'Data Science'], 
    address: '123 Tech Park', 
    state: 'California', 
    email: 'contact@gti.edu', 
    phone: '123-456-7890' 
  },
  { 
    name: 'National Arts University', 
    courses: ['Fine Arts', 'Graphic Design'], 
    address: '456 Art Ave', 
    state: 'New York', 
    email: 'info@nau.edu', 
    phone: '234-567-8901' 
  },
  { 
    name: 'Evergreen Business School', 
    courses: ['MBA', 'Finance'], 
    address: '789 Commerce St', 
    state: 'Texas', 
    email: 'admissions@ebs.com', 
    phone: '345-678-9012' 
  },
  { 
    name: 'Oceanview Medical College', 
    courses: ['Medicine', 'Nursing'], 
    address: '101 Health Rd', 
    state: 'Florida', 
    email: 'help@omc.edu', 
    phone: '456-789-0123' 
  },
  { 
    name: 'Pioneer Engineering College', 
    courses: ['Mechanical Engg', 'Civil Engg'], 
    address: '212 Innovation Dr', 
    state: 'California', 
    email: 'r.kamra09@gmail.com', 
    phone: '567-890-1234' 
  },
];

export const initialStudentsData: Student[] = [
  { 
    id: 'STU001', 
    name: 'Alice Johnson', 
    mainCourse: 'Computer Science', 
    subCourse: 'AI/ML', 
    collegesSelected: ['Global Tech Institute', 'Pioneer Engineering College'], 
    collegeFinalized: 'Global Tech Institute', 
    coursesSelected: ['Computer Science', 'Data Science'], 
    courseFinalized: 'Computer Science', 
    counselor: 'John Doe' 
  },
  { 
    id: 'STU002', 
    name: 'Bob Williams', 
    mainCourse: 'Fine Arts', 
    subCourse: 'Painting', 
    collegesSelected: ['National Arts University'], 
    collegeFinalized: '', 
    coursesSelected: ['Fine Arts', 'Graphic Design'], 
    courseFinalized: '', 
    counselor: 'Jane Smith' 
  },
  { 
    id: 'STU003', 
    name: 'Charlie Brown', 
    mainCourse: 'MBA', 
    subCourse: 'Marketing', 
    collegesSelected: ['Evergreen Business School'], 
    collegeFinalized: 'Evergreen Business School', 
    coursesSelected: ['MBA'], 
    courseFinalized: 'MBA', 
    counselor: 'John Doe' 
  },
];

export const admittedData: AdmittedStudent[] = [
  { 
    date: '2025-08-15', 
    student: 'Alice Johnson', 
    college: 'Global Tech Institute', 
    course: 'Computer Science', 
    subCourse: 'AI/ML', 
    counselor: 'John Doe' 
  },
  { 
    date: '2025-08-14', 
    student: 'Charlie Brown', 
    college: 'Evergreen Business School', 
    course: 'MBA', 
    subCourse: 'Marketing', 
    counselor: 'John Doe' 
  },
];