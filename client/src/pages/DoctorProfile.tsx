import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchDoctors } from "../store/slices/doctorSlice";
import Loader from "../components/common/Loader";

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { doctors, isLoading } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length]);

  const doctor = doctors.find((d) => d._id === id);

  if (isLoading && !doctor) {
    return <Loader />;
  }

  if (!doctor && !isLoading) {
    return (
      <div className="pt-32 text-center h-screen flex flex-col items-center justify-center fade-in">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">person_off</span>
        <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Doctor Not Found</h2>
        <p className="text-on-surface-variant mb-6 max-w-xs">We couldn't find the medical professional you're looking for.</p>
        <button 
          onClick={() => navigate('/doctors')} 
          className="px-8 py-3 bg-primary text-white rounded-xl shadow-md hover:opacity-90 transition-opacity font-bold cursor-pointer"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      {/* ─── Hero Header Section ─── */}
      <section className="relative bg-surface-container-lowest rounded-[2.5rem] p-6 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,61,155,0.08)] overflow-hidden border border-outline-variant/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-signature-gradient opacity-5 hidden lg:block" style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }}></div>
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 relative z-10">
          {/* Avatar Container */}
          <div className="shrink-0 relative">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl ambient-shadow">
              <img 
                src={doctor?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(doctor?.name || "Doctor") + "&background=random"} 
                alt={doctor?.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-outline-variant/10">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span>{doctor?.rating || 4.8}</span>
                </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4 justify-center lg:justify-start">
               <span className="inline-block bg-primary-fixed/30 text-primary px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest">
                  {doctor?.speciality}
               </span>
               <div className="flex items-center gap-2 justify-center lg:justify-start text-on-surface-variant text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Verified Specialist
               </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-4">{doctor?.name}</h1>
            <p className="text-on-surface-variant text-lg max-w-2xl mb-8 leading-relaxed italic">
                "{doctor?.about || "Dedicated to providing exceptional care with clinical precision and patient-centered empathy."}"
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">work_history</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Experience</p>
                        <p className="font-bold text-on-surface">{doctor?.experience || 5}+ Years</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-outline-variant/30 hidden md:block"></div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Consultation</p>
                        <p className="font-bold text-on-surface">${doctor?.fees || 100}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
               <Link 
                to={`/book-appointment/${doctor?._id}`}
                className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-headline font-extrabold text-lg shadow-lg hover:shadow-primary/20 hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
               >
                  <span className="material-symbols-outlined">calendar_month</span>
                  Book Appointment
               </Link>
               <button className="w-full sm:w-auto px-8 py-4 border-2 border-outline-variant/50 text-on-surface rounded-2xl font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined">share</span>
                  Share Profile
               </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Biography */}
          <section>
             <h3 className="text-2xl font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                Professional Biography
             </h3>
             <div className="bg-white rounded-3xl p-8 border border-outline-variant/10 shadow-sm leading-relaxed text-on-surface-variant">
                <p className="mb-4">
                  {doctor?.name} is a leading expert in {doctor?.speciality} with a focus on holistic treatment and advanced clinical methodologies. Throughout their career, they have consistently demonstrated a commitment to excellence and patient safety.
                </p>
                <p>
                  Specializing in complex diagnostics and patient-first care strategies, {doctor?.name.split(' ').pop()} integrates the latest medical research with a gentle, communicative bedside manner. Their practice is built on trust, transparency, and a relentless pursuit of clinical perfection.
                </p>
             </div>
          </section>

          {/* Specialities & Skills */}
          <section>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                Core Competencies
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { title: "Patient Assessment", icon: "assignment" },
                    { title: "Diagnostic Accuracy", icon: "biotech" },
                    { title: "Preventative Care", icon: "health_and_safety" },
                    { title: "Specialized Therapy", icon: "medication" }
                ].map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10 trans-hover">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">{skill.icon}</span>
                        </div>
                        <span className="font-bold text-on-surface">{skill.title}</span>
                    </div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Col: Side Info */}
        <div className="lg:col-span-4 space-y-8">
            {/* Availability Widget */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <span className="material-symbols-outlined text-6xl">schedule</span>
                </div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Clinic Hours</h3>
                <div className="space-y-4">
                   {doctor?.availability && doctor.availability.length > 0 ? (
                       doctor.availability.map((slot, idx) => (
                           <div key={idx} className="flex items-center justify-between border-b border-outline-variant/10 pb-3 last:border-0 last:pb-0">
                               <span className="font-bold text-on-surface-variant">{slot.day}</span>
                               <span className="text-sm font-medium text-primary bg-primary-fixed/20 px-3 py-1 rounded-lg">
                                   {slot.startTime} - {slot.endTime}
                               </span>
                           </div>
                       ))
                   ) : (
                       <p className="text-sm text-on-surface-variant italic py-2">Consultation hours vary. Please check the booking calendar for specific availability.</p>
                   )}
                </div>
                
                <Link 
                    to={`/book-appointment/${doctor?._id}`}
                    className="mt-8 w-full py-4 bg-on-surface-variant text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    View Full Schedule
                </Link>
            </div>

            {/* Insurance Info */}
            <div className="bg-[#e3f2fd]/50 rounded-3xl p-8 border border-blue-200/30 shadow-sm">
                <h3 className="text-xl font-headline font-bold text-[#1565c0] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                    Insurance
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Most major insurance providers are accepted. Contact our front desk to verify your specific plan coverage.
                </p>
                <div className="flex flex-wrap gap-2">
                    {["Aetna", "Cigna", "UnitedHealth"].map(i => (
                        <span key={i} className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-slate-500 border border-slate-100 shadow-sm">{i}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default DoctorProfile;
