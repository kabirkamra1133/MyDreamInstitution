import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StudentLogin from './components/StudentLogin';
import CollegeLogin from './components/CollegeLogin';
import AdminLogin from './components/AdminLogin';
import Signup from './components/Signup';
import AdminPortal from './pages/AdminPortal';
import Index from './pages/Index';
import CollegeAdminPortal from './components/college/CollegeAdminPortal';
import { Toaster } from './components/ui/toaster';


import Protected from './protectedRoute/Protected';
import StudentContextProvider from './context/studentContext';
import MainContextProvider from './context/mainContext';
import CollegeDetails from './pages/CollegeDetails';
import CollegeProvider from './context/collegeContext';

function App() {
  return (
    <MainContextProvider>
    <StudentContextProvider>
      <CollegeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/college-login" element={<CollegeLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/admin-portal' element={
          <Protected allowedRoles={["admin"]}>
            <AdminPortal />
          </Protected>
        } />
        <Route path='/colleges' element={<Index />} />
        <Route path ='/college-portal' element = {
          <Protected allowedRoles={["college","collegeAdmin","admin"]}>
            <CollegeAdminPortal />
          </Protected>
        }/>
  <Route path="/colleges/:id" element={<CollegeDetails />} />
      </Routes>
      <Toaster />
    </Router>
   </CollegeProvider>
    </StudentContextProvider>
     </MainContextProvider>
    
  );
}

export default App;
