import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { updateProfile } from "../../store/slices/authSlice";
import { updateDoctorProfileAsync, fetchDoctors } from "../../store/slices/doctorSlice";
import Swal from "sweetalert2";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { doctors, selectedDoctor, isLoading } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    if (user && user.email && doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [user, dispatch, doctors.length]);

  const doctorProfile = selectedDoctor || doctors.find((doc) => doc.email === user?.email);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    speciality: doctorProfile?.speciality || "General Practice",
    experience: doctorProfile?.experience || 0,
    about: doctorProfile?.about || "",
  });

  useEffect(() => {
    if (user || doctorProfile) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        speciality: doctorProfile?.speciality || "General Practice",
        experience: doctorProfile?.experience || 0,
        about: doctorProfile?.about || "",
      });
    }
  }, [user, doctorProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "experience" ? parseInt(value) || 0 : value
    }));
  };

  const handleAvatarUpdate = () => {
    const newUrl = prompt("Please enter the URL for your profile picture:", user?.avatar || "");
    if (newUrl !== null) {
      if (!doctorProfile?._id) return;
      dispatch(updateDoctorProfileAsync({
        doctorId: doctorProfile._id,
        avatar: newUrl
      }));
      dispatch(updateProfile({ avatar: newUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorProfile?._id) return;

    try {
      // 1. Update the Doctor document (which now also syncs the User doc on the backend)
      await dispatch(updateDoctorProfileAsync({
        doctorId: doctorProfile._id,
        name: formData.name,
        email: formData.email,
        speciality: formData.speciality,
        experience: formData.experience,
        about: formData.about
      })).unwrap();

      // 2. Update the local Auth state for instant UI feedback
      dispatch(updateProfile({ 
        name: formData.name, 
        email: formData.email 
      }));

      Swal.fire({
        title: "Success",
        text: "Your profile has been synchronized successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: '#fff',
        customClass: { popup: 'rounded-3xl' }
      });
    } catch (err: any) {
      Swal.fire({
        title: "Update Failed",
        text: err || "Could not save changes.",
        icon: "error",
        background: '#fff',
        customClass: { popup: 'rounded-3xl' }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <header className="mb-10">
        <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight mb-2">Professional Profile</h2>
        <p className="text-on-surface-variant text-sm">Update your personal details, credentials, and clinic information.</p>
      </header>
      
      <div className="bg-white rounded-xxl p-4 sm:p-6 lg:p-8 shadow-sm border border-outline-variant/10 w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8 mb-10 pb-10 border-b border-outline-variant/10">
          <div className="relative mx-auto sm:mx-0">
            <img 
              alt="Doctor Portrait" 
              className="w-32 h-32 rounded-2xl object-cover shadow-sm" 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name?.replace(' ', '+') || "Doctor"}&background=003d9b&color=ffffff`} 
            />
            <button onClick={handleAvatarUpdate} className="absolute -bottom-3 -right-3 w-10 h-10 bg-primary text-white rounded-xl shadow-md flex items-center justify-center hover:bg-primary-container transition-colors">
               <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div>
             <h3 className="text-xl font-bold font-manrope">{user?.name || "Doctor"}</h3>
             <p className="text-on-surface-variant text-sm mb-4">{doctorProfile?.speciality || "Speciality"} • {user?.email}</p>
             <div className="flex flex-wrap justify-center sm:justify-start gap-3">
               <button onClick={() => alert("Upload coming soon!")} className="flex-1 sm:flex-none px-4 py-2 bg-primary-container text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">Upload New</button>
               <button onClick={() => alert("Remove coming soon!")} className="flex-1 sm:flex-none px-4 py-2 border border-outline-variant/20 text-on-surface text-sm font-bold rounded-xl hover:bg-surface-container transition-colors">Remove</button>
             </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full text-sm placeholder:text-on-surface-variant transition-all text-on-surface" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full text-sm placeholder:text-on-surface-variant transition-all text-on-surface" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Specialisation</label>
              <input type="text" name="speciality" value={formData.speciality} onChange={handleChange} className="px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full text-sm placeholder:text-on-surface-variant transition-all text-on-surface" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Experience (Years)</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full text-sm placeholder:text-on-surface-variant transition-all text-on-surface" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
             <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Professional Bio</label>
             <textarea rows={4} name="about" value={formData.about} onChange={handleChange} className="px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full text-sm placeholder:text-on-surface-variant transition-all text-on-surface resize-none"></textarea>
          </div>
          
          <div className="pt-6 flex flex-col sm:flex-row justify-end">
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 py-3 bg-signature-gradient text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
