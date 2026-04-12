import { NavLink } from "react-router";

const BOTTOM_NAV_LINKS = [
  { name: "HOME", icon: "home", path: "/patient/dashboard" },
  { name: "SCHEDULE", icon: "calendar_month", path: "/patient/appointments" },
  { name: "HEALTH", icon: "medical_information", path: "/patient/records" },
  { name: "INBOX", icon: "chat", path: "/patient/messages" },
  { name: "PROFILE", icon: "person", path: "/patient/profile" },
];

const PatientBottomNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/20 z-40 pb-safe">
      <nav className="flex items-center justify-around h-16">
        {BOTTOM_NAV_LINKS.map((link) => (
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
      </nav>
    </div>
  );
};

export default PatientBottomNav;
