import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../store/slices/authSlice";

const NAV_LINKS = [
  { name: "Overview", icon: "grid_view", path: "/patient/dashboard" },
  { name: "Appointments", icon: "calendar_month", path: "/patient/appointments" },
  { name: "Medical Records", icon: "folder", path: "/patient/records" },
  { name: "Messages", icon: "mail", path: "/patient/messages" },
  { name: "Analytics", icon: "bar_chart", path: "/patient/analytics" },
];

const PatientSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-outline-variant/20 flex flex-col pt-6 pb-8 px-4 h-full hidden md:flex sticky top-0">
      {/* Brand */ }
      <div className="flex items-center gap-2 px-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-xl font-extrabold font-headline text-primary tracking-tight">
          The Clinical Atelier
        </h1>
      </div>

      {/* Profile Snippet */ }
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden shrink-0 border border-outline-variant/30">
           <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patient")}&background=random`} 
              alt={user?.name} 
              className="w-full h-full object-cover"
           />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface truncate pr-2" title={user?.name}>{user?.name || "Dr. Julian Vance"}</p>
          <p className="text-xs text-on-surface-variant capitalize">{user?.role || "Patient"}</p>
        </div>
      </div>

      {/* Main Nav */ }
      <nav className="flex-1 space-y-1">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-fixed/20 text-primary font-bold shadow-[0_2px_8px_-2px_rgba(0,61,155,0.1)]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            {({ isActive }) => (
              <>
                 <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                   {link.icon}
                 </span>
                 {link.name}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-6 pb-2">
            <button 
               onClick={() => navigate('/doctors')}
               className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl shadow-[0_4px_12px_-2px_rgba(0,61,155,0.3)] hover:opacity-95 transition-opacity active:scale-[0.98] font-bold text-sm cursor-pointer"
            >
               + Schedule New
            </button>
        </div>
      </nav>

      {/* Footer Nav */ }
      <div className="mt-auto space-y-1 pt-4 border-t border-outline-variant/20">
        <NavLink
            to="/help"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-fixed/20 text-primary font-bold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            Help Center
        </NavLink>
        <button
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px] rotate-180">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default PatientSidebar;
