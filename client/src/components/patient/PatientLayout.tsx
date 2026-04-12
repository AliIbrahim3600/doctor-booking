import { Outlet, useNavigate, useLocation } from "react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import PatientSidebar from "./PatientSidebar";
import PatientBottomNav from "./PatientBottomNav";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import useDataContext from "../../hooks/useDataContext";

const PatientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { searchQuery, setSearchQuery } = useDataContext();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clear search on route change to keep pages clean
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname, setSearchQuery]);

  const placeholder = useMemo(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Search dashboard...";
    if (path.includes("appointments")) return "Search doctors...";
    if (path.includes("records")) return "Search records...";
    if (path.includes("messages")) return "Search messages...";
    return "Search...";
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <div className="bg-surface-container-lowest min-h-screen text-on-surface flex md:flex-row flex-col relative font-body">
      {/* Desktop Sidebar */}
      <PatientSidebar />

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-x-hidden md:pl-0 pb-20 md:pb-0">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-outline-variant/20 sticky top-0 z-30">
           <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden bg-surface-container">
                   <img 
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patient")}&background=random`} 
                      alt={user?.name} 
                      className="w-full h-full object-cover"
                   />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-bold text-outline-variant tracking-wider uppercase">Welcome Back</p>
                  <p className="text-sm font-headline font-extrabold text-primary">{user?.name || "The Clinical Atelier"}</p>
               </div>
           </div>
           <button className="relative p-2 text-outline-variant hover:text-on-surface transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-error border-2 border-surface"></span>
           </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-20 px-8 bg-surface-container-lowest border-b border-outline-variant/20 sticky top-0 z-30">
            {/* Left Nav */}
            <div className="flex items-center gap-6">
                <h2 className="font-headline font-extrabold text-xl text-on-surface mr-4">Patient Dashboard</h2>
                <nav className="flex items-center gap-6">
                    <button onClick={() => navigate('/doctors')} className="text-sm font-bold text-primary border-b-2 border-primary py-1">Find Doctors</button>
                    <button onClick={() => navigate('/')} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Specialties</button>
                    <button onClick={() => navigate('/')} className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">How it Works</button>
                </nav>
            </div>

            {/* Right Nav */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
                   <input 
                     type="text" 
                     placeholder={placeholder} 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-surface-container-low text-sm rounded-full py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all" 
                   />
                </div>
                {/* Icons */}
                <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-2.5 right-2 w-2 h-2 rounded-full bg-error"></span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>
                
                {/* Profile Box / Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 rounded-full border-2 border-surface-container-high overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  >
                     <img 
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patient")}&background=random`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                     />
                  </button>
                  {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 py-2 z-50">
                          <button onClick={() => { setDropdownOpen(false); navigate('/patient/profile'); }} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-surface-container transition-colors cursor-pointer">Profile</button>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium text-error hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer">Sign Out</button>
                      </div>
                  )}
                </div>
            </div>
        </div>

        {/* Dynamic Content */}
        <main className="flex-1 w-full relative">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <PatientBottomNav />
    </div>
  );
};

export default PatientLayout;
