import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchDoctors } from "../store/slices/doctorSlice";
import { createAppointment } from "../store/slices/appointmentSlice";
import Swal from 'sweetalert2';
import Loader from "../components/common/Loader";

const BookAppointment = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { doctors, isLoading: isDoctorLoading } = useAppSelector((state) => state.doctor);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedDate, setSelectedDate] = useState<number>(10);
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "General Checkup",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length]);

  const doctor = doctors.find((d) => d._id === doctorId);

  if (isDoctorLoading && !doctor) {
    return <Loader />;
  }

  if (!doctor && !isDoctorLoading) {
    return (
      <div className="pt-32 text-center h-screen flex flex-col items-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">error</span>
        <h2 className="text-2xl font-bold font-headline mb-4">Doctor not found</h2>
        <button onClick={() => navigate('/doctors')} className="px-6 py-2 bg-primary text-white rounded-xl shadow-md">Back to Doctors</button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Selection',
        text: 'Please select a valid date and time.',
        confirmButtonColor: '#003d9b'
      });
      return;
    }

    try {
      // Create a date for the current year/month based on selectedDate
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const dayStr = String(selectedDate).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayStr}`;

      const appointmentData = {
        patientId: user?._id || "guest",
        patientName: formData.name,
        doctorId: doctor?._id || "",
        doctorName: doctor?.name || "",
        speciality: doctor?.speciality || "",
        date: formattedDate,
        time: selectedTime,
        fees: doctor?.fees || 0,
        notes: formData.notes
      };

      await dispatch(createAppointment(appointmentData)).unwrap();

      await Swal.fire({
        icon: 'success',
        title: 'Appointment Confirmed!',
        text: `Your appointment with ${doctor?.name} has been booked successfully.`,
        confirmButtonColor: '#003d9b',
        timer: 3000
      });

      navigate('/patient/appointments');
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err || "An error occurred while booking.",
        confirmButtonColor: '#003d9b'
      });
    }
  };

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const availableSlots = [
    "09:00 AM", "10:30 AM", "11:15 AM", "12:00 PM", "02:30 PM", "04:00 PM"
  ];

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Doctor Profile Summary & Appointment Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Doctor Card */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_-4px_rgba(0,61,155,0.06)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden mb-6 bg-surface-container">
                <img 
                  alt={doctor?.name} 
                  src={doctor?.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(doctor?.name || "Doctor") + "&background=random"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="font-headline text-2xl font-bold text-on-surface mb-1">{doctor?.name}</h1>
              <p className="text-on-surface-variant font-medium mb-4">{doctor?.speciality} • Clinic</p>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-semibold">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {doctor?.rating || 4.8} (124 Reviews)
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-outline-variant/20 space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary-fixed/30 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Medical Plaza West</p>
                  <p className="text-xs text-on-surface-variant">Virtual & In-person available</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary-fixed/30 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">${doctor?.fees}.00</p>
                  <p className="text-xs text-on-surface-variant">Consultation Fee</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Guidance Info */}
          <div className="bg-secondary-fixed/10 rounded-xl p-6 border border-secondary-container/20">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-secondary">info</span>
              <h3 className="font-headline font-bold text-secondary">Pre-Visit Checklist</h3>
            </div>
            <ul className="space-y-2 text-sm text-on-surface-variant leading-relaxed">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Bring latest medical reports
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                List of current medications
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Insurance ID card
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section: Booking Flow */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Calendar & Time Selection Card */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_-4px_rgba(0,61,155,0.06)]">
            <h2 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_month</span>
              Select Date & Time
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Date Picker */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-on-surface">October 2024</span>
                  <div className="flex gap-2">
                    <button className="material-symbols-outlined p-1 text-on-surface-variant hover:bg-surface-container rounded transition-colors cursor-pointer">chevron_left</button>
                    <button className="material-symbols-outlined p-1 text-on-surface-variant hover:bg-surface-container rounded transition-colors cursor-pointer">chevron_right</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-2 text-xs font-bold text-on-surface-variant">
                  <span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span><span>SU</span>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                  <span className="p-2 text-sm text-outline/40">28</span>
                  <span className="p-2 text-sm text-outline/40">29</span>
                  <span className="p-2 text-sm text-outline/40">30</span>
                  
                  {calendarDays.map((day) => (
                    <button 
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 text-sm rounded-lg transition-colors cursor-pointer ${selectedDate === day ? 'bg-primary text-on-primary font-bold shadow-md' : 'hover:bg-surface-container'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <p className="font-semibold text-on-surface mb-4">Available Slots</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => slot !== "12:00 PM" && setSelectedTime(slot)} // Simulate booked slot
                      disabled={slot === "12:00 PM"}
                      className={`py-3 px-2 text-sm font-medium rounded-xl transition-all ${
                        slot === "12:00 PM" ? 'bg-surface-container-low text-outline cursor-not-allowed opacity-50' :
                        selectedTime === slot ? 'bg-primary text-on-primary font-bold shadow-md' : 
                        'border border-outline-variant/30 hover:bg-primary-fixed/20 hover:border-primary text-on-surface cursor-pointer'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-on-surface-variant mt-6 uppercase tracking-widest font-bold">Slot Duration: 45 Mins</p>
              </div>
            </div>
          </div>

          {/* Patient Information Form */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_12px_32px_-4px_rgba(0,61,155,0.06)]">
            <h2 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Patient Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-on-surface transition-all placeholder:text-outline" 
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-on-surface transition-all placeholder:text-outline" 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-on-surface transition-all placeholder:text-outline" 
                    placeholder="+1 (555) 000-0000" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Visit Reason</label>
                  <select 
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-on-surface transition-all"
                  >
                    <option>General Checkup</option>
                    <option>Follow-up</option>
                    <option>Specific Symptom</option>
                    <option>Emergency Consultation</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Symptoms or Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-low border-0 focus:ring-2 focus:ring-primary rounded-xl px-4 py-3 text-on-surface transition-all placeholder:text-outline" 
                  placeholder="Briefly describe your symptoms or reason for visit..." 
                  rows={4}
                ></textarea>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#003d9b] to-[#0052cc] w-full py-5 text-on-primary font-headline font-extrabold text-lg rounded-xl shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98] duration-150 cursor-pointer"
                >
                  Confirm Appointment
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-4">
                  By confirming, you agree to our <a href="#" className="text-primary hover:underline">Booking Terms</a> & <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookAppointment;
