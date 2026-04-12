import { useState } from "react";
import { useAppSelector } from "../../store/store";

const PatientProfile = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || "The Clinical Atelier",
    email: user?.email || "patient@example.com",
    phone: "+1 (555) 000-0000",
    dob: "1992-05-15",
    gender: "Other",
    bloodGroup: "O+",
    address: "123 Medical Plaza, Apartment 4B",
    city: "San Francisco",
    emergencyContact: "John Doe (+1 555-1234)",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (saveMessage) setSaveMessage("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Profile updated successfully!");
    }, 1000);
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
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-xl shadow-lg flex items-center justify-center border-2 border-white hover:opacity-90 transition-opacity cursor-pointer">
                     <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
               </div>
               <h2 className="font-headline font-extrabold text-xl text-on-surface mb-1">{formData.name}</h2>
               <p className="text-sm font-bold text-primary mb-6 uppercase tracking-widest">{user?.role || "Patient"}</p>
               
               <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-surface-container-low p-3 rounded-2xl">
                     <p className="text-[10px] font-bold text-outline-variant uppercase mb-1">Blood Group</p>
                     <p className="font-headline font-extrabold text-on-surface">{formData.bloodGroup}</p>
                  </div>
                  <div className="bg-surface-container-low p-3 rounded-2xl">
                     <p className="text-[10px] font-bold text-outline-variant uppercase mb-1">Age</p>
                     <p className="font-headline font-extrabold text-on-surface">31 Yrs</p>
                  </div>
               </div>
            </div>
        </div>

        {/* Right Column: Detailed Form */}
        <div className="lg:col-span-8">
           <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/20 shadow-sm">
              <h3 className="font-headline font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">person</span>
                 Personal Details
              </h3>
              
              <form className="space-y-6">
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
                         value={formData.email}
                         onChange={handleInputChange}
                         className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
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
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-extrabold text-outline-variant uppercase tracking-widest px-1">Date of Birth</label>
                       <input 
                         type="date" 
                         name="dob"
                         value={formData.dob}
                         onChange={handleInputChange}
                         className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5 pt-4">
                    <h3 className="font-headline font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary">location_on</span>
                       Address & Security
                    </h3>
                    <div className="space-y-6">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-outline-variant uppercase tracking-widest px-1">Residential Address</label>
                          <input 
                            type="text" 
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-outline-variant uppercase tracking-widest px-1">Emergency Contact</label>
                          <input 
                            type="text" 
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            className="w-full bg-surface-container-low border-0 rounded-xl px-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 flex flex-col md:flex-row gap-4 items-center">
                    <button 
                      type="submit" 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full md:flex-1 bg-primary text-white py-4 rounded-xl font-headline font-extrabold shadow-lg hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, name: user?.name || "", email: user?.email || "" })}
                      className="w-full md:flex-1 border border-outline-variant text-on-surface-variant py-4 rounded-xl font-headline font-extrabold hover:bg-surface-container transition-colors cursor-pointer"
                    >
                       Reset Form
                    </button>
                 </div>
                 {saveMessage && (
                   <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm font-bold rounded-lg text-center animate-pulse">
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
