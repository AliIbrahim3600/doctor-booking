import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAppointments } from "../../store/slices/appointmentSlice";
import { fetchDoctors, updateDoctorAvailabilityAsync } from "../../store/slices/doctorSlice";
import StatCard from "../../components/doctor/StatCard";
import AppointmentTable from "../../components/doctor/AppointmentTable";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { appointments, isLoading: apptsLoading } = useAppSelector((state) => state.appointment);
  const { doctors } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(fetchAppointments());
    if (doctors.length === 0) dispatch(fetchDoctors());
  }, [dispatch, doctors.length]);

  const currentDoctor = doctors.find(doc => doc.email === user?.email);

  const [appointmentFilter, setAppointmentFilter] = useState<"Today" | "Week">("Today");

  const todayAppointments = appointments.filter(a => {
    return a.status !== "cancelled" && a.status !== "completed";
  });
  
  const filteredAppointments = appointmentFilter === "Today" ? todayAppointments : appointments;

  const pendingReviews = appointments.filter(a => a.status === "completed").length; 
  const uniquePatients = new Set(appointments.map(a => a.patientId)).size;
  const totalEarnings = appointments.filter(a => a.status === "completed").reduce((sum, a) => sum + (a.fees || 0), 0); 

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const shortDays = ["M", "T", "W", "T", "F"];
  const selectedDay = days[selectedDayIndex];

  const daySlots = currentDoctor?.availability?.filter(slot => slot.day === selectedDay) || [];

  const handleAddSlot = () => {
    if (!currentDoctor) {
      alert("Doctor profile not found.");
      return;
    }
    const startTime = prompt("Enter Start Time (e.g. 08:00 AM)", "08:00 AM");
    if (!startTime) return;
    const endTime = prompt("Enter End Time (e.g. 12:00 PM)", "12:00 PM");
    if (!endTime) return;

    const newAvailability = [...currentDoctor.availability, { day: selectedDay, startTime, endTime }];
    dispatch(updateDoctorAvailabilityAsync({ doctorId: currentDoctor._id, availability: newAvailability }));
  };

  const handleRemoveSlot = (startTime: string, endTime: string) => {
    if (!currentDoctor) return;
    const newAvailability = currentDoctor.availability.filter(slot => !(slot.day === selectedDay && slot.startTime === startTime && slot.endTime === endTime));
    dispatch(updateDoctorAvailabilityAsync({ doctorId: currentDoctor._id, availability: newAvailability }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight">Doctor Dashboard</h2>
          <p className="text-on-surface-variant text-sm mt-1">Welcome back, {user?.name || "Doctor"}. Here is your practice overview.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full md:w-auto mt-4 md:mt-0">
          <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors shrink-0">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-10 w-[1px] bg-outline-variant/20 mx-2"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="text-sm font-bold leading-none">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-xs text-on-surface-variant">Active Session</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Upcoming Today" 
          value={todayAppointments.length} 
          icon="event_note" 
          trendText="+8% from yesterday"
          trendType="up"
          trendIcon="trending_up"
          colorClass="primary"
        />
        <StatCard 
          title="Total Patients" 
          value={uniquePatients} 
          icon="groups" 
          trendText="Unique returning patients"
          trendType="neutral"
          trendIcon="horizontal_rule"
          colorClass="secondary"
        />
        <StatCard 
          title="Pending Reviews" 
          value={pendingReviews} 
          icon="clinical_notes" 
          trendText="Action required"
          trendType="warning"
          trendIcon="priority_high"
          colorClass="tertiary"
        />
        <StatCard 
          title="Total Earnings" 
          value={`$${totalEarnings}`} 
          icon="payments" 
          trendText="From completed sessions"
          trendType="up"
          trendIcon="trending_up"
          colorClass="secondary-container"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-8 w-full max-w-[100vw] overflow-hidden">
          <div className="bg-white rounded-xxl p-4 sm:p-6 lg:p-8 shadow-sm border border-outline-variant/10 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="text-xl font-bold font-manrope">Manage Appointments</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => setAppointmentFilter("Today")} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${appointmentFilter === "Today" ? "bg-surface-container-low text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low"}`}>Today</button>
                <button onClick={() => setAppointmentFilter("Week")} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${appointmentFilter === "Week" ? "bg-surface-container-low text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low"}`}>Week</button>
              </div>
            </div>
            <AppointmentTable appointmentsList={filteredAppointments} isLoading={apptsLoading} />
          </div>
        </section>

        <section className="space-y-8 w-full">
          <div className="bg-white rounded-xxl p-4 sm:p-6 lg:p-8 shadow-sm border border-outline-variant/10">
            <h3 className="text-xl font-bold font-manrope mb-6">Set Availability</h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Select Day</label>
                <div className="flex flex-wrap gap-2">
                  {shortDays.map((d, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedDayIndex(i)} 
                      className={`flex-1 py-3 rounded-xl border border-outline-variant/20 transition-colors font-bold text-xs ${selectedDayIndex === i ? 'bg-primary-container text-white' : 'hover:bg-surface-container-low text-on-surface'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 min-h-[160px]">
                {daySlots.length > 0 ? daySlots.map((slot, idx) => (
                   <div key={idx} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-on-surface">{slot.startTime} - {slot.endTime}</span>
                      <span className="text-xs text-on-surface-variant">Scheduled Block</span>
                    </div>
                    <button onClick={() => handleRemoveSlot(slot.startTime, slot.endTime)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete Slot">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                )) : (
                  <div className="p-8 text-center text-sm text-on-surface-variant border-2 border-dashed border-outline-variant/20 rounded-xl">
                    No time slots scheduled for this day.
                  </div>
                )}
              </div>
              
              <button onClick={handleAddSlot} className="w-full py-4 rounded-xl font-bold text-sm bg-surface-container-highest text-primary hover:bg-primary-fixed/30 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">add_circle</span>
                Add Time Slot
              </button>
            </div>
          </div>
          
          <div className="bg-primary text-white rounded-xxl p-8 shadow-lg bg-signature-gradient relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-bold font-manrope leading-tight mb-2">Practice Insights</h4>
              <p className="text-primary-fixed text-xs mb-6 opacity-80">You've completed 94% of your monthly targets for health screenings.</p>
              <button className="bg-white text-primary px-6 py-2 rounded-lg text-sm font-bold shadow-sm">View Report</button>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-10">
              <span className="material-symbols-outlined text-[12rem]">clinical_notes</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
