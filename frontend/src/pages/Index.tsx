import CollegeAdminPortal from "@/components/college/CollegeAdminPortal";
import AdminPortal from "@/components/admin/AdminPortal";

const Index = () => {
  // Toggle between college and admin portal based on route or state
  // For now, showing both - you can add routing logic here
  const isAdminPortal = window.location.pathname.includes('admin');
  
  return isAdminPortal ? <AdminPortal /> : <CollegeAdminPortal />;
};

export default Index;
