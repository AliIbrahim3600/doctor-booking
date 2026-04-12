import { useEffect } from "react";
import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { fetchDoctors } from "../../store/slices/doctorSlice";

const DoctorSidebar = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { doctors, selectedDoctor } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    if (user && user.email) {
      if (doctors.length === 0) dispatch(fetchDoctors());
    }
  }, [user, dispatch, doctors.length]);

  const doctorProfile = selectedDoctor || doctors.find((doc) => doc.email === user?.email);
  const speciality = doctorProfile?.speciality || "Manage Practice";

  const handleSignOut = () => {
    dispatch(logout());
  };

  return (
    <aside className="py-8 px-4 flex flex-col gap-6 h-full w-72 bg-slate-50 md:rounded-r-[1.5rem] z-40 border-r border-slate-200/50 shadow-sm md:shadow-none">
      <div className="px-4 mb-4">
        <h1 className="text-xl font-extrabold font-manrope text-blue-800">The Clinical Atelier</h1>
      </div>
      
      <div className="flex flex-col items-center gap-2 px-4 mb-6">
        <img 
          alt="Doctor Portrait" 
          className="w-20 h-20 rounded-xl object-cover shadow-sm" 
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || "Doctor"}&background=003d9b&color=ffffff`} 
        />
        <div className="text-center">
          <p className="font-manrope text-sm font-bold text-on-surface">{user?.name || "Dr. Vance"}</p>
          <p className="font-inter text-xs text-on-surface-variant">{speciality}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <NavLink 
          to="/doctor/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-white text-blue-700 shadow-sm font-semibold scale-95" : "text-slate-500 hover:bg-slate-200/50"}`
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-inter text-sm">Overview</span>
        </NavLink>
        <NavLink 
          to="/doctor/appointments" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-white text-blue-700 shadow-sm font-semibold scale-95" : "text-slate-500 hover:bg-slate-200/50"}`
          }
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="font-inter text-sm">Appointments</span>
        </NavLink>
        <NavLink 
          to="/doctor/profile" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-white text-blue-700 shadow-sm font-semibold scale-95" : "text-slate-500 hover:bg-slate-200/50"}`
          }
        >
          <span className="material-symbols-outlined">folder_shared</span>
          <span className="font-inter text-sm">Profile</span>
        </NavLink>
      </nav>

      <div className="mt-auto px-4 flex flex-col gap-2">
        <button className="bg-signature-gradient text-white w-full py-3 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">
          Schedule Break
        </button>
        <div className="h-[1px] bg-slate-200/50 my-4"></div>
        <button onClick={handleSignOut} className="flex items-center gap-3 text-slate-500 py-2 hover:text-red-600 transition-colors w-full text-left">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-inter text-xs">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
