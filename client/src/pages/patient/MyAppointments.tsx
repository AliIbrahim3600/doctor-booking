import { useState } from "react";
import useDataContext from "../../hooks/useDataContext";

const APPOINTMENTS_MOCK = [
  {
    id: "1",
    doctorName: "Dr. Sarah Jenkins",
    speciality: "General Practice",
    type: "In-Person",
    date: "Oct 24, 2024",
    time: "09:30 AM",
    status: "Confirmed",
    image: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random",
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    speciality: "Optometry",
    type: "Telehealth",
    date: "Nov 07, 2024",
    time: "07:15 PM",
    status: "Pending",
    image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
  },
  {
    id: "3",
    doctorName: "Dr. Elena Rodriguez",
    speciality: "Pediatric",
    type: "In-Person",
    date: "Dec 12, 2024",
    time: "11:30 AM",
    status: "Confirmed",
    image: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random",
  },
  {
    id: "4",
    doctorName: "Dr. James Wilson",
    speciality: "Cardiologist",
    type: "In-Person",
    date: "Oct 15, 2024",
    time: "04:00 PM",
    status: "Completed",
    image: "https://ui-avatars.com/api/?name=James+Wilson&background=random",
  },
  {
    id: "5",
    doctorName: "Dr. Lisa Wong",
    speciality: "Dermatology",
    type: "Telehealth",
    date: "Oct 10, 2024",
    time: "10:00 AM",
    status: "Completed",
    image: "https://ui-avatars.com/api/?name=Lisa+Wong&background=random",
  },
  {
    id: "6",
    doctorName: "Dr. Robert Miller",
    speciality: "Neurology",
    type: "In-Person",
    date: "Oct 28, 2024",
    time: "02:45 PM",
    status: "Pending",
    image: "https://ui-avatars.com/api/?name=Robert+Miller&background=random",
  },
  {
    id: "7",
    doctorName: "Dr. Aisha Patel",
    speciality: "Gynecology",
    type: "In-Person",
    date: "Sep 20, 2024",
    time: "09:00 AM",
    status: "Cancelled",
    image: "https://ui-avatars.com/api/?name=Aisha+Patel&background=random",
  },
];

const MyAppointments = () => {
  const [filter, setFilter] = useState<"Upcoming" | "Past" | "All">("Upcoming");
  const { searchQuery } = useDataContext();

  const filteredAppointments = APPOINTMENTS_MOCK.filter((appt) => {
    // 1. Status Filter
    let matchesStatus = true;
    if (filter === "Upcoming") {
      matchesStatus = appt.status !== "Completed" && appt.status !== "Cancelled";
    } else if (filter === "Past") {
      matchesStatus = appt.status === "Completed" || appt.status === "Cancelled";
    }

    // 2. Search Filter
    const matchesSearch = 
      appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      appt.speciality.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
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
              key={appt.id}
              className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-outline-variant/20 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start md:items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 border border-outline-variant/30">
                  <img src={appt.image} alt={appt.doctorName} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline font-bold text-on-surface">{appt.doctorName}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      appt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                      appt.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      appt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                      "bg-error-container text-error"
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-sm font-body text-on-surface-variant mb-2">{appt.speciality} • {appt.type}</p>
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
                {appt.status !== "Completed" && (
                  <>
                    <button className="flex-1 lg:flex-none px-4 py-2.5 bg-surface-container-high text-on-surface text-sm font-bold rounded-xl hover:bg-surface-container-highest transition-colors cursor-pointer">
                      Reschedule
                    </button>
                    <button className="flex-1 lg:flex-none px-4 py-2.5 bg-error-container/20 text-error text-sm font-bold rounded-xl hover:bg-error-container transition-colors cursor-pointer">
                      Cancel
                    </button>
                    {appt.type === "Telehealth" && appt.status === "Confirmed" && (
                      <button className="w-full lg:w-auto px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]">videocam</span>
                        Join Call
                      </button>
                    )}
                  </>
                )}
                {appt.status === "Completed" && (
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
    </div>
  );
};

export default MyAppointments;
