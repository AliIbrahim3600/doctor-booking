import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { updatePatientProfileAsync, clearAuthError, updateProfile } from "../../store/slices/authSlice";
import Swal from "sweetalert2";

const PatientProfile = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [saveMessage, setSaveMessage] = useState("");

  const handleAvatarUpdate = () => {
    const newUrl = prompt("Please enter the URL for your profile picture:", user?.avatar || "");
    if (newUrl !== null) {
      dispatch(updatePatientProfileAsync({ avatar: newUrl }));
      dispatch(updateProfile({ avatar: newUrl }));
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (saveMessage) setSaveMessage("");
    if (error) dispatch(clearAuthError());
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updatePatientProfileAsync({ name: formData.name, phone: formData.phone })).unwrap();
      dispatch(updateProfile({ name: formData.name, phone: formData.phone }));
      
      Swal.fire({
        title: "Success",
        text: "Your profile has been updated.",
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
    <div className="p-4 md:p-8 max-w-[1000px] mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">Account Settings</h1>
        <p className="text-on-surface-variant font-body mt-1">Manage your personal information and privacy settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-4 flex flex-col items-center">
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-sm w-full flex flex-col items-center text-center">
               <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                      <img 
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Patient")}&background=random`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                  </div>
                  <button onClick={handleAvatarUpdate} className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center border-2 border-white hover:opacity-90 transition-opacity cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
               </div>
               <h2 className="font-headline font-extrabold text-xl text-on-surface mb-1">{user?.name}</h2>
               <p className="text-sm font-bold text-primary mb-6 uppercase tracking-widest">{user?.role || "Patient"}</p>
            </div>
        </div>

        {/* Right Column: Detailed Form */}
        <div className="lg:col-span-8">
           <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-sm">
              <h3 className="font-headline font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">person</span>
                 Personal Details
              </h3>
              
              <form className="space-y-6" onSubmit={handleSave}>
                 {error && (
                   <div className="p-3 bg-red-50 text-red-700 text-sm font-bold rounded-lg mb-4">
                     {error}
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-extrabold text-outline-variant uppercase tracking-widest px-1">Full Name</label>
                       <input 
                         type="text" 
                         name="name"
                         value={formData.name}
                         onChange={handleInputChange}
                         className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-extrabold text-outline-variant uppercase tracking-widest px-1">Email Address</label>
                       <input 
                         type="email" 
                         name="email"
                         readOnly
                         value={formData.email}
                         className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm font-body outline-none opacity-70 cursor-not-allowed font-medium"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-extrabold text-outline-variant uppercase tracking-widest px-1">Phone Number</label>
                       <input 
                         type="tel" 
                         name="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                         className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                       />
                    </div>
                 </div>

                 <div className="pt-8 flex flex-col md:flex-row gap-4 items-center">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full md:flex-1 bg-primary text-white py-4 rounded-xl font-headline font-extrabold shadow-lg hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
                        setSaveMessage("");
                        dispatch(clearAuthError());
                      }}
                      className="w-full md:flex-1 border border-outline-variant text-on-surface-variant py-4 rounded-xl font-headline font-extrabold hover:bg-surface-container transition-colors cursor-pointer"
                    >
                       Reset Form
                    </button>
                 </div>
                 {saveMessage && (
                   <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm font-bold rounded-lg text-center animate-[fadeIn_0.5s_ease]">
                      {saveMessage}
                   </div>
                 )}
              </form>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PatientProfile;
