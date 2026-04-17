import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAppointments } from "../../store/slices/appointmentSlice";
import { fetchDoctors, approveDoctor } from "../../store/slices/doctorSlice";
import Loader from "../../components/common/Loader";
import Swal from "sweetalert2";

const StatCard = ({ title, value, icon, colorClass }: { title: string; value: string | number; icon: string; colorClass: string }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10 ${colorClass}`}>
    <div className="flex items-center justify-between mb-4">
      <span className="material-symbols-outlined text-3xl text-primary/70">{icon}</span>
    </div>
    <p className="text-3xl font-extrabold text-on-surface mb-1">{value}</p>
    <p className="text-sm text-on-surface-variant font-medium">{title}</p>
  </div>
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { appointments, isLoading: apptsLoading } = useAppSelector((state) => state.appointment);
  const { doctors } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctors());
  }, [dispatch]);

  const totalDoctors = doctors.length;
  const approvedDoctors = doctors.filter(d => d.isApproved).length;
  const pendingDoctors = doctors.filter(d => !d.isApproved).length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === "completed").length;
  const pendingAppointments = appointments.filter(a => a.status === "pending").length;

  const recentAppointments = appointments.slice(0, 5);

  const handleApproveDoctor = (doctorId: string) => {
    Swal.fire({
      title: "Approve Doctor",
      text: "Are you sure you want to approve this doctor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(approveDoctor({ id: doctorId, isApproved: true }));
        Swal.fire("Approved!", "Doctor has been approved.", "success");
      }
    });
  };

  const pendingDoctorsList = doctors.filter(d => !d.isApproved).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight">Admin Dashboard</h2>
          <p className="text-on-surface-variant text-sm mt-1">Welcome back. Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right">
            <p className="text-sm font-bold leading-none">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            <p className="text-xs text-on-surface-variant">System Active</p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Doctors" value={totalDoctors} icon="medical_information" colorClass="" />
        <StatCard title="Approved" value={approvedDoctors} icon="check_circle" colorClass="" />
        <StatCard title="Pending Approval" value={pendingDoctors} icon="pending" colorClass="" />
        <StatCard title="Total Appointments" value={totalAppointments} icon="calendar_month" colorClass="" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold font-manrope">Recent Appointments</h3>
          </div>
          <div className="space-y-4 max-h-[320px] overflow-y-auto">
            {recentAppointments.length > 0 ? (
              recentAppointments.map((appt) => (
                <div key={appt._id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-white">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{appt.patientName}</p>
                      <p className="text-xs text-on-surface-variant">{appt.doctorName} • {appt.speciality}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-on-surface">{appt.date}</p>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${appt.status === 'completed' ? 'bg-green-100 text-green-700' : appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-on-surface-variant">No appointments found.</div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-manrope">Pending Doctor Approvals</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">{pendingDoctors}</span>
          </div>
          <div className="space-y-4 max-h-[320px] overflow-y-auto">
            {pendingDoctorsList.length > 0 ? (
              pendingDoctorsList.map((doc) => (
                <div key={doc._id} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <img 
                      src={doc.avatar || `https://ui-avatars.com/api/?name=${doc.name?.replace(' ', '+') || "Doctor"}&background=random`}
                      alt={doc.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-on-surface">{doc.name}</p>
                      <p className="text-xs text-on-surface-variant">{doc.speciality}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApproveDoctor(doc._id)}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-on-surface-variant">No pending approvals.</div>
            )}
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-[#0052cc] rounded-2xl p-6 text-white">
          <h4 className="text-lg font-bold mb-2">Completed Appointments</h4>
          <p className="text-4xl font-extrabold">{completedAppointments}</p>
          <p className="text-sm text-white/80 mt-2">Total completed sessions</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10">
          <h4 className="text-lg font-bold mb-2 text-on-surface">Pending Appointments</h4>
          <p className="text-4xl font-extrabold text-on-surface">{pendingAppointments}</p>
          <p className="text-sm text-on-surface-variant mt-2">Awaiting confirmation</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/10">
          <h4 className="text-lg font-bold mb-2 text-on-surface">Approval Rate</h4>
          <p className="text-4xl font-extrabold text-on-surface">{totalDoctors > 0 ? Math.round((approvedDoctors / totalDoctors) * 100) : 0}%</p>
          <p className="text-sm text-on-surface-variant mt-2">Doctors approved</p>
        </div>
      </section>

      {apptsLoading && <Loader />}
    </div>
  );
};

export default Dashboard;