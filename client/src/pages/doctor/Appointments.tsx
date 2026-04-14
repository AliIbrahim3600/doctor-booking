import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAppointments } from "../../store/slices/appointmentSlice";
import AppointmentTable from "../../components/doctor/AppointmentTable";

const Appointments = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { appointments, isLoading } = useAppSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const filters = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const filteredAppointments = appointments.filter(appt => {
    // 1. Status Filter
    const matchesStatus = filter === "All" || appt.status.toLowerCase() === filter.toLowerCase();
    
    // 2. Search Filter
    const matchesSearch = appt.patientName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 fade-in">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight mb-2">Appointments Directory</h2>
          <p className="text-on-surface-variant text-sm">View and manage all your patient appointments across all statuses.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto bg-surface-container-lowest p-2 lg:p-1 rounded-xl shadow-sm border border-outline-variant/10">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filter === f ? "bg-primary-container text-white" : "text-on-surface-variant hover:bg-surface-container-low"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>
      
      <div className="bg-white rounded-xxl p-4 sm:p-6 lg:p-8 shadow-sm border border-outline-variant/10 w-full overflow-hidden max-w-[100vw]">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 w-full">
           <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-outline-variant/20 w-full sm:w-80 shrink-0">
              <span className="material-symbols-outlined text-outline ml-2">search</span>
              <input 
                type="text" 
                placeholder="Search patients..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-on-surface" 
              />
           </div>
            <button 
              onClick={() => {
                const csvHeader = "Patient,Speciality,Status,Date,Time\n";
                const csvRows = filteredAppointments.map(a => `${a.patientName},${a.speciality},${a.status},${a.date},${a.time}`).join("\n");
                const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', 'appointments_export.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }} 
              className="flex items-center justify-center gap-2 px-4 py-2 border border-outline-variant/20 rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container transition-colors sm:w-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export List
            </button>
        </div>
        
        <AppointmentTable appointmentsList={filteredAppointments} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Appointments;
