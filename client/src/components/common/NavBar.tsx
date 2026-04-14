import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import {
  FiMenu,
  FiX,
  FiBell,
  FiSettings,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiGrid,
  FiChevronDown,
} from "react-icons/fi";

/* ─── types ─────────────────────────────────────── */

/* ─── nav config ────────────────────────────────── */
const NAV_LINKS = [
  { label: "Find Doctors", to: "/doctors",        isHash: false },
  { label: "Specialties",  to: "#specialties",     isHash: true  },
  { label: "How it Works", to: "#how-it-works",    isHash: true  },
  { label: "About",        to: "#about",           isHash: true  },
];

function dashboardPath(role: string) {
  if (role === "doctor") return "/doctor/dashboard";
  if (role === "admin")  return "/admin/dashboard";
  return "/patient/dashboard";
}

/* ─── main component ────────────────────────────── */
export default function NavBar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();
  const user       = useAppSelector((state) => state.auth.user);

  /* shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* close mobile on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleLogout() {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login");
  }

  /* active‑link style (desktop) */
  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium py-1 transition-colors duration-150 ` +
    `after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full ` +
    `after:bg-blue-600 after:transition-all after:duration-200 ` +
    (isActive
      ? "text-blue-600 after:w-full"
      : "text-slate-600 hover:text-blue-600 after:w-0 hover:after:w-full");

  return (
    <>
      {/* ══════════ BAR ══════════ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-md" : "border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg leading-none select-none shadow-sm">
                +
              </div>
              <span className="text-[15px] font-bold text-slate-900 tracking-tight">
                Aura <span className="text-blue-600">Health</span>
              </span>
            </Link>

            {/* ── Desktop centre nav ── */}
            <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
              {NAV_LINKS.map(({ label, to, isHash }) =>
                isHash ? (
                  <a
                    key={to}
                    href={"/" + to}
                    className="relative text-sm font-medium py-1 text-slate-600 hover:text-blue-600 transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-blue-600 after:w-0 hover:after:w-full after:transition-all after:duration-200"
                  >
                    {label}
                  </a>
                ) : (
                  <NavLink
                    key={to}
                    to={to}
                    className={desktopLinkClass}
                  >
                    {label}
                  </NavLink>
                )
              )}
            </nav>

            {/* ── Desktop right zone ── */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {user ? (
                /* ── Logged in: bell + gear + avatar ── */
                <>
                  {/* Bell */}
                  <button
                    className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Notifications"
                  >
                    <FiBell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
                  </button>

                  {/* Settings */}
                  <button
                    className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Settings"
                  >
                    <FiSettings size={18} />
                  </button>

                  {/* Avatar + dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      id="user-avatar-btn"
                      onClick={() => setDropdownOpen((p) => !p)}
                      className="flex items-center gap-1.5 ml-1 focus:outline-none"
                      aria-label="User menu"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 ring-2 ring-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <FiChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                        {/* header */}
                        <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                          <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-800 truncate mt-0.5">{user.name}</p>
                          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 capitalize">
                            {user.role}
                          </span>
                        </div>

                        <Link
                          to={dashboardPath(user.role)}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <FiGrid size={15} className="text-slate-400" /> Dashboard
                        </Link>
                        <Link
                          to={user.role === "patient" ? "/patient/appointments" : "/doctor/appointments"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <FiCalendar size={15} className="text-slate-400" /> Appointments
                        </Link>
                        <Link
                          to={user.role === "patient" ? "/patient/profile" : "/doctor/profile"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <FiUser size={15} className="text-slate-400" /> My Profile
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <FiLogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ── Guest: Sign In button ── */
                <Link
                  to="/login"
                  id="nav-signin-btn"
                  className="px-5 py-2 text-sm font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* ══════════ MOBILE DRAWER ══════════ */}
        <div
          className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-[500px] border-t border-slate-100" : "max-h-0"
          }`}
        >
          <div className="px-4 pt-3 pb-5 space-y-0.5">
            {NAV_LINKS.map(({ label, to, isHash }) =>
              isHash ? (
                <a
                  key={to}
                  href={"/" + to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  {label}
                </NavLink>
              )
            )}

            <div className="pt-3 mt-2 border-t border-slate-100">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Link
                    to={dashboardPath(user.role)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <FiGrid size={15} /> Dashboard
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50"
                  >
                    <FiLogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* spacer so page content isn't under fixed bar */}
      <div className="h-16" />
    </>
  );
}
