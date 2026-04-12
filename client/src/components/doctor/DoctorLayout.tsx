import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import DoctorSidebar from "./DoctorSidebar";

const DoctorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-surface min-h-screen text-on-surface flex flex-col md:flex-row relative">
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-outline-variant/20 sticky top-0 z-30 shadow-sm">
         <h1 className="text-xl font-extrabold font-manrope text-blue-800 tracking-tight">The Clinical Atelier</h1>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-lg">{isSidebarOpen ? "close" : "menu"}</span>
         </button>
      </div>
      
      {isSidebarOpen && (
        <div 
           className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
           onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:flex-shrink-0`}>
        <DoctorSidebar />
      </div>

      <main className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden pt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
