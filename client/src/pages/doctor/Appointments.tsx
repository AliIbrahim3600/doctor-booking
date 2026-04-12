import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAppointments } from "../../store/slices/appointmentSlice";
import AppointmentTable from "../../components/doctor/AppointmentTable";

const Appointments = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("All");
  const { appointments, isLoading } = useAppSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const filters = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const filteredAppointments = appointments.filter(appt => {
    if (filter === "All") return true;
    return appt.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight mb-2">Appointments Directory</h2>
          <p className="text-on-surface-variant text-sm">View and manage all your patient appointments across all statuses.</p>
        </div>
        <div className="flex gap-2 bg-surface-container-lowest p-1 rounded-xl shadow-sm border border-outline-variant/10">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === f ? "bg-primary-container text-white" : "text-on-surface-variant hover:bg-surface-container-low"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>
      
      <div className="bg-white rounded-xxl p-8 shadow-sm border border-outline-variant/10">
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline-variant/20 w-80">
              <span className="material-symbols-outlined text-outline ml-2">search</span>
              <input type="text" placeholder="Search patients..." className="bg-transparent border-none outline-none text-sm w-full text-on-surface" />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant/20 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              More Filters
           </button>
        </div>
        
        <AppointmentTable appointmentsList={filteredAppointments} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Appointments;
