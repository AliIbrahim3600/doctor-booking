import { useState, useEffect } from "react";
import { Outlet, useLocation, NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../store/slices/authSlice";

const ADMIN_LINKS = [
  { name: "OVERVIEW", icon: "dashboard", path: "/admin/dashboard" },
  { name: "DOCTORS", icon: "medical_information", path: "/admin/doctors" },
  { name: "APPOINTMENTS", icon: "calendar_month", path: "/admin/appointments" },
  { name: "ADD", icon: "add_circle", path: "/admin/add-doctor" },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface flex flex-col md:flex-row relative">
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-outline-variant/20 sticky top-0 z-30 shadow-sm">
        <h1 className="text-xl font-extrabold font-manrope text-blue-800 tracking-tight">The Clinical Atelier</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-lg">{isSidebarOpen ? "close" : "menu"}</span>
        </button>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex-shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <aside className="py-8 px-4 flex flex-col gap-6 h-full w-72 bg-slate-50 md:rounded-r-[1.5rem] z-40 border-r border-slate-200/50 shadow-sm md:shadow-none">
          <div className="px-4 mb-4">
            <h1 className="text-xl font-extrabold font-manrope text-blue-800">The Clinical Atelier</h1>
            <p className="text-xs text-on-surface-variant mt-1">Admin Panel</p>
          </div>
          
          <div className="flex flex-col items-center gap-2 px-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-primary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-4xl text-white">admin_panel_settings</span>
            </div>
            <div className="text-center">
              <p className="font-manrope text-sm font-bold text-on-surface">{user?.name || "Admin"}</p>
              <p className="font-inter text-xs text-on-surface-variant">System Administrator</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {ADMIN_LINKS.map((link) => (
              <NavLink 
                key={link.name}
                to={link.path} 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-white text-blue-700 shadow-sm font-semibold scale-95" : "text-slate-500 hover:bg-slate-200/50"}`
                }
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-inter text-sm">{link.name}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-4 flex flex-col gap-2">
            <div className="h-[1px] bg-slate-200/50 my-4"></div>
            <button onClick={handleSignOut} className="flex items-center gap-3 text-slate-500 py-2 hover:text-red-600 transition-colors w-full text-left">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-inter text-xs">Sign Out</span>
            </button>
          </div>
        </aside>
      </div>

      <main className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8 overflow-x-hidden pt-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/20 z-40 pb-safe">
        <div className="flex items-center justify-around h-16">
          {ADMIN_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? "text-primary" : "text-outline-variant hover:text-on-surface-variant"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span 
                    className="material-symbols-outlined text-[24px] pointer-events-none" 
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {link.icon}
                  </span>
                  <span className="text-[10px] font-bold tracking-wide pointer-events-none">{link.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminLayout;