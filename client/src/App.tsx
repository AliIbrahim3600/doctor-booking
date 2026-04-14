import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router";
import { Provider } from "react-redux";
import { useAppDispatch, store } from "./store/store";
import { loadUser } from "./store/slices/authSlice";

import { DataProvider } from "./context/AppContext";
import Loader from "./components/common/Loader";
import NavBar from "./components/common/NavBar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";
import Footer from "./components/common/Footer";
import DoctorLayout from "./components/doctor/DoctorLayout";
import PatientLayout from "./components/patient/PatientLayout";

// Public Pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Doctors = lazy(() => import("./pages/Doctors"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Patient Pages
const PatientDashboard = lazy(() => import("./pages/patient/Dashboard"));
const MyAppointments = lazy(() => import("./pages/patient/MyAppointments"));
const PatientProfile = lazy(() => import("./pages/patient/Profile"));
const PatientRecords = lazy(() => import("./pages/patient/Records"));
const PatientMessages = lazy(() => import("./pages/patient/Messages"));
const PatientAnalytics = lazy(() => import("./pages/patient/Analytics"));

// Doctor Pages
const DoctorDashboard = lazy(() => import("./pages/doctor/Dashboard"));
const DoctorAppointments = lazy(() => import("./pages/doctor/Appointments"));
const DoctorProfilePage = lazy(() => import("./pages/doctor/Profile"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AddDoctor = lazy(() => import("./pages/admin/AddDoctor"));
const AllDoctors = lazy(() => import("./pages/admin/AllDoctors"));
const AllAppointments = lazy(() => import("./pages/admin/AllAppointments"));

const AUTH_ROUTES = ["/login", "/register"];
const year = new Date().getFullYear();
function Layout() {
  const { pathname } = useLocation();

  const isPatientDashboardRoute = pathname.startsWith("/patient");
  const showNav = !AUTH_ROUTES.includes(pathname) && !isPatientDashboardRoute;
  const showFooter = pathname !== "/" && pathname !== "/login" && pathname !== "/register" && !isPatientDashboardRoute; 

  return (
    <>
      {showNav && <NavBar />}
      <Outlet />
      {showFooter && <Footer year={year} />}
    </>
  );
}


function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return <>{children}</>;
}

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <BrowserRouter>
          <DataProvider>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route element={<Layout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/doctor/:id" element={<DoctorProfile />} />

                  {/* Public Auth Routes (Log in / Register) */}
                  <Route element={<PublicOnlyRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>

                  {/* Patient Routes */}
                  <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
                    <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
                    <Route element={<PatientLayout />}>
                      <Route path="/patient/dashboard" element={<PatientDashboard />} />
                      <Route path="/patient/appointments" element={<MyAppointments />} />
                      <Route path="/patient/profile" element={<PatientProfile />} />
                      <Route path="/patient/records" element={<PatientRecords />} />
                      <Route path="/patient/messages" element={<PatientMessages />} />
                      <Route path="/patient/analytics" element={<PatientAnalytics />} />
                    </Route>
                  </Route>

                  {/* Doctor Routes */}
                  <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
                    <Route element={<DoctorLayout />}>
                      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                      <Route path="/doctor/profile" element={<DoctorProfilePage />} />
                    </Route>
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/add-doctor" element={<AddDoctor />} />
                    <Route path="/admin/doctors" element={<AllDoctors />} />
                    <Route path="/admin/appointments" element={<AllAppointments />} />
                  </Route>

                  {/* Catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </DataProvider>
        </BrowserRouter>
      </AuthInitializer>
    </Provider>
  );
}

export default App;
