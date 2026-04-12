import { useNavigate } from "react-router";
import useDataContext from "../../hooks/useDataContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { searchQuery } = useDataContext();

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const appointments = [
    { id: "1", doctor: "Dr. Sarah Jenkins", speciality: "General Practice", type: "In-Person", date: "Oct 24, 2024", time: "09:30 AM", status: "Confirmed", image: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random" },
    { id: "2", doctor: "Dr. Michael Chen", speciality: "Optometry", type: "Telehealth", date: "Nov 07, 2024", time: "07:15 PM", status: "Pending", image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random" },
    { id: "3", doctor: "Dr. Emily Stone", speciality: "Dermatology", type: "In-Person", date: "Cancelled", time: "", status: "Cancelled", image: "https://ui-avatars.com/api/?name=Emily+Stone&background=random" },
  ];

  const filteredAppointments = appointments.filter(appt => 
    appt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appt.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed');
  // Priority: first confirmed appointment, or fallback to the first appointment if none are confirmed
  const nextAppointment = confirmedAppointments.length > 0 ? confirmedAppointments[0] : appointments[0];

  const quickActions = [
    { title: "Lab Results Ready", desc: "Blood Panel • Reviewed by Dr. Vance", icon: "science", color: "bg-secondary-fixed/30 text-secondary" },
    { title: "Prescription Refill", desc: "Lipitor 20mg • 2 refills remaining", icon: "medication", color: "bg-error-container/50 text-error" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-[1400px] w-full mx-auto pb-10">
      
      {/* ─── Top Section (Upcoming & Quick Info) ─── */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8">
        
        {/* Upcoming Visit - Hero Card */}
        <div className="flex-1 bg-gradient-to-br from-primary to-[#0052cc] rounded-3xl p-6 md:p-8 text-white ambient-shadow relative overflow-hidden">
           <div className="absolute -top-24 -right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
           <div className="absolute -bottom-24 -left-10 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col h-full justify-between gap-6 md:gap-0">
              {nextAppointment ? (
                <>
                  <div>
                      <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                        Upcoming Visit
                      </span>
                      <h2 className="text-2xl md:text-3xl font-headline font-extrabold mb-2">Annual Health Assessment</h2>
                      <p className="text-white/80 font-medium">{nextAppointment.doctor} • {nextAppointment.speciality}</p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
                     <div className="flex gap-8">
                        <div>
                            <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">Date</p>
                            <p className="font-bold text-lg">{nextAppointment.date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-white/60 mb-1 uppercase tracking-wider font-bold">Time</p>
                            <p className="font-bold text-lg">{nextAppointment.time}</p>
                        </div>
                     </div>
                     <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-surface transition-colors cursor-pointer active:scale-95 shadow-md">
                        Prepare for Visit
                     </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                   <span className="material-symbols-outlined text-5xl mb-3 opacity-50">calendar_today</span>
                   <h2 className="text-xl font-bold mb-1">No upcoming visits</h2>
                   <p className="text-white/70 text-sm">Stay on top of your health by scheduling a checkup.</p>
                </div>
              )}
           </div>
        </div>

        {/* Quick Actions (Lab & Prescriptions) */}
        <div className="flex xl:flex-col md:flex-row flex-col gap-4 xl:w-80 shrink-0">
           {quickActions.map((action, idx) => (
             <div key={idx} className="flex-1 bg-surface-container-lowest rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-[0_4px_20px_-4px_rgba(0,61,155,0.05)] cursor-pointer hover:shadow-lg transition-shadow border border-outline-variant/10">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}>
                      <span className="material-symbols-outlined text-[24px]">{action.icon}</span>
                   </div>
                   <div>
                      <h3 className="font-bold text-on-surface mb-0.5">{action.title}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{action.desc}</p>
                   </div>
                </div>
                <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
             </div>
           ))}
        </div>
      </div>

      {/* ─── Mobile Only Current Agenda Scroller ─── */}
      <div className="md:hidden mb-8">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-headline font-bold text-on-surface">Current Agenda</h3>
           <span className="text-xs font-bold text-primary uppercase tracking-widest">OCTOBER 2024</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 snap-x no-scrollbar">
           {[
             { day: 'MON', date: 23 },
             { day: 'TUE', date: 24, active: true },
             { day: 'WED', date: 25 },
             { day: 'THU', date: 26 },
             { day: 'FRI', date: 27 }
           ].map((item, idx) => (
             <div key={idx} className={`snap-center shrink-0 w-[4.5rem] py-3 rounded-2xl flex flex-col items-center justify-center border transition-colors ${item.active ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface-container-lowest border-outline-variant/20 text-on-surface-variant'}`}>
                 <span className={`text-[10px] font-bold mb-1 tracking-wider ${item.active ? 'text-white/80' : 'text-outline-variant'}`}>{item.day}</span>
                 <span className={`text-xl font-headline font-extrabold ${item.active ? 'text-white' : 'text-on-surface'}`}>{item.date}</span>
             </div>
           ))}
        </div>
      </div>

      {/* ─── Main Content Split ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* Left Column: Appointments */}
         <div className="xl:col-span-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline font-bold text-xl text-on-surface">Upcoming Appointments</h3>
                <div className="flex items-center gap-4">
                   <button className="p-2 text-outline-variant hover:bg-surface-container rounded-full hidden md:flex"><span className="material-symbols-outlined text-[20px]">filter_list</span></button>
                   <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline cursor-pointer">View All</button>
                </div>
            </div>

            <div className="space-y-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <div key={appt.id} className={`bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-outline-variant/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${appt.status === 'Cancelled' ? 'opacity-75' : ''}`}>
                        <div className="flex items-start md:items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 relative">
                               <img 
                                  src={appt.image} 
                                  alt={appt.doctor} 
                                  className={appt.status === 'Cancelled' ? 'filter grayscale' : ''}
                                />
                               {appt.status === 'Confirmed' && (
                                 <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                               )}
                            </div>
                            <div>
                               <h4 className="font-bold text-on-surface">{appt.doctor}</h4>
                               <p className="text-sm text-on-surface-variant mb-1">{appt.speciality} • {appt.type}</p>
                               <p className={`text-xs font-medium flex items-center gap-1.5 ${appt.status === 'Cancelled' ? 'text-error' : 'text-outline-variant'}`}>
                                  <span className="material-symbols-outlined text-[14px]">{appt.status === 'Cancelled' ? 'cancel' : appt.type === 'Telehealth' ? 'videocam' : 'event'}</span> 
                                  {appt.status === 'Cancelled' ? 'Cancelled by Patient' : `${appt.date} • ${appt.time}`}
                               </p>
                            </div>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                              appt.status === 'Confirmed' ? 'bg-[#e6fcf5] text-[#0ca678]' :
                              appt.status === 'Pending' ? 'bg-surface-container-high text-on-surface-variant' :
                              'bg-error-container/50 text-error'
                            }`}>
                              {appt.status}
                            </span>
                            {appt.status === 'Cancelled' && (
                              <button className="px-4 py-2 bg-primary-fixed/20 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer">Reschedule</button>
                            )}
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-surface-container-low/50 rounded-2xl border border-dashed border-outline-variant/30 text-center">
                      <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">search_off</span>
                      <p className="text-sm font-medium text-on-surface-variant">No appointments found matching "{searchQuery}"</p>
                  </div>
                )}
            </div>

            {/* Mobile Only: Daily Health Tip */}
            <div className="md:hidden mt-8 bg-[#e3f2fd] rounded-2xl p-5 border border-primary/10 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white text-[#00a8e8] flex items-center justify-center shrink-0 shadow-sm">
                   <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                </div>
                <div>
                   <h4 className="font-bold text-on-surface text-sm mb-1">Daily Health Tip</h4>
                   <p className="text-xs text-on-surface-variant leading-relaxed">Consider a 15-minute walk today to improve circulation and reduce stress.</p>
                </div>
            </div>

         </div>

         {/* Right Column: Calendar Widget (Desktop Only) */}
         <div className="hidden xl:block xl:col-span-4 space-y-6">
             <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-[0_8px_30px_-4px_rgba(0,61,155,0.04)]">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-headline font-bold text-on-surface">October 2024</h3>
                    <div className="flex gap-2">
                        <button className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
                        <button className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
                    </div>
                 </div>

                 <div className="grid grid-cols-7 text-center mb-4">
                    <span className="text-[10px] font-bold text-outline-variant tracking-wider uppercase mb-2">su</span>
                    <span className="text-[10px] font-bold text-outline-variant tracking-wider uppercase mb-2">mo</span>
                    <span className="text-[10px] font-bold text-outline-variant tracking-wider uppercase mb-2">tu</span>
                    <span className="text-[10px] font-bold text-outline-variant tracking-wider uppercase mb-2">we</span>
                    <span className="text-[10px] font-bold text-outline-variant tracking-wider uppercase mb-2">th</span>
                    <span className="text-[10px] font-bold text-outline-variant tracking-wider uppercase mb-2">fr</span>
                    <span className="text-[10px] font-bold text-outline-variant tracking-wider uppercase mb-2">sa</span>

                    {/* Pre-fill days */}
                    <span className="p-2 text-sm font-medium text-outline-variant/30">29</span>
                    <span className="p-2 text-sm font-medium text-outline-variant/30">30</span>

                    {calendarDays.map((day) => (
                        <div key={day} className="p-1 relative flex items-center justify-center">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-colors ${day === 24 ? 'bg-primary text-white font-bold shadow-md' : 'text-on-surface hover:bg-surface-container'}`}>
                                {day}
                            </span>
                            {day === 24 && <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>}
                        </div>
                    ))}
                 </div>

                 {/* Agenda Today */}
                 <div className="pt-6 border-t border-outline-variant/20 mt-4">
                     <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">agenda: today</h4>
                     {nextAppointment && nextAppointment.status !== 'Cancelled' ? (
                       <div className="pl-4 border-l-2 border-primary relative">
                           <span className="absolute -left-1.5 top-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-primary"></span>
                           <p className="font-bold text-sm text-on-surface">{nextAppointment.doctor}</p>
                           <p className="text-xs text-on-surface-variant font-medium mt-1">{nextAppointment.time} • {nextAppointment.type}</p>
                       </div>
                     ) : (
                       <p className="text-xs text-on-surface-variant italic">No agenda items for today.</p>
                     )}
                 </div>
             </div>
         </div>

      </div>
    </div>
  );
};

export default Dashboard;
