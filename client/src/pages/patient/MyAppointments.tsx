import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAppointments, updateAppointmentStatusAsync } from "../../store/slices/appointmentSlice";
import Loader from "../../components/common/Loader";
import Swal from "sweetalert2";

// Removed APPOINTMENTS_MOCK

const MyAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, isLoading } = useAppSelector((state) => state.appointment);
  const [filter, setFilter] = useState<"Upcoming" | "Past" | "All">("Upcoming");

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleCancel = async (id: string) => {
    const result = await Swal.fire({
      title: "Cancel Appointment?",
      text: "Are you sure you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      background: '#fff',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
      }
    });

    if (result.isConfirmed) {
      await dispatch(updateAppointmentStatusAsync({ id, status: "cancelled" }));
      Swal.fire({
        title: "Cancelled!",
        text: "Your appointment has been cancelled.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: '#fff',
        customClass: { popup: 'rounded-3xl' }
      });
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    // 1. Status Filter
    let matchesStatus = true;
    if (filter === "Upcoming") {
      matchesStatus = appt.status !== "completed" && appt.status !== "cancelled";
    } else if (filter === "Past") {
      matchesStatus = appt.status === "completed" || appt.status === "cancelled";
    }

    return matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">My Appointments</h1>
          <p className="text-on-surface-variant font-body mt-1">Manage your upcoming and past medical consultations.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex bg-surface-container-low p-1 rounded-xl w-fit">
            {["Upcoming", "Past", "All"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  filter === f
                    ? "bg-white text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <div
              key={appt._id}
              className={`bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-outline-variant/20 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow ${appt.status === 'cancelled' ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start md:items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 border border-outline-variant/30 bg-surface-container">
                  <img src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(appt.doctorName) + "&background=random"} alt={appt.doctorName} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline font-bold text-on-surface">{appt.doctorName}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      appt.status === "confirmed" ? "bg-green-100 text-green-700" :
                      appt.status === "pending" ? "bg-amber-100 text-amber-700" :
                      appt.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-error-container text-error"
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-sm font-body text-on-surface-variant mb-2">{appt.speciality} • Clinic Visit</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-outline-variant">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {appt.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-outline-variant">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      {appt.time}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                {appt.status !== "completed" && appt.status !== "cancelled" && (
                  <>
                    <button className="flex-1 lg:flex-none px-4 py-2.5 bg-surface-container-high text-on-surface text-sm font-bold rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer">
                      Reschedule
                    </button>
                    <button 
                      onClick={() => handleCancel(appt._id)}
                      className="flex-1 lg:flex-none px-4 py-2.5 bg-error-container/20 text-error text-sm font-bold rounded-xl hover:bg-error-container transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {appt.status === "completed" && (
                  <button className="w-full lg:w-auto px-4 py-2.5 border border-primary text-primary text-sm font-bold rounded-xl hover:bg-primary-fixed/20 transition-colors cursor-pointer">
                    View Prescriptions
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30 text-center">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4 text-outline-variant">
              <span className="material-symbols-outlined text-[40px]">calendar_today</span>
            </div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No appointments found</h3>
            <p className="text-on-surface-variant font-body max-w-xs">You don't have any {filter.toLowerCase()} appointments at the moment.</p>
          </div>
        )}
      </div>
      {(isLoading && appointments.length === 0) && <Loader />}
    </div>
  );
};

export default MyAppointments;
