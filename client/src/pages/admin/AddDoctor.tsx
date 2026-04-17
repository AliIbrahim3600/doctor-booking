import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAppDispatch } from "../../store/store";
import { registerUser } from "../../store/slices/authSlice";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiAlertCircle } from "react-icons/fi";

const SPECIALTIES = [
  "General", "Cardiology", "Internal Medicine", "Neurology",
  "Orthopedics", "Dermatology", "Ophthalmology", "Pediatrics",
  "Dentistry", "Psychiatry", "Other",
];

interface DoctorForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
  speciality: string;
  experience: string;
  fees: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  speciality?: string;
  experience?: string;
  fees?: string;
  phone?: string;
  general?: string;
}

const inputClass = (hasError: boolean) =>
  `w-full py-2.5 px-4 border rounded-xl outline-none transition-all ${
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-400"
      : "border-slate-200 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
  }`;

const AddDoctor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<DoctorForm>({
    name: "", email: "", password: "", confirm: "", speciality: "", experience: "", fees: "", phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name: keyof DoctorForm, value: string): string | undefined => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        break;
      case "email":
        if (!value) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
        break;
      case "password":
        if (!value) return "Password is required.";
        if (value.length < 8) return "Password must be at least 8 characters.";
        break;
      case "confirm":
        if (!value) return "Please confirm your password.";
        if (value !== form.password) return "Passwords do not match.";
        break;
      case "speciality":
        if (!value) return "Please select a speciality.";
        break;
      case "experience":
        if (!value) return "Experience is required.";
        if (isNaN(Number(value)) || Number(value) < 0) return "Enter a valid experience.";
        break;
      case "fees":
        if (!value) return "Consultation fee is required.";
        if (isNaN(Number(value)) || Number(value) < 0) return "Enter a valid fee.";
        break;
      case "phone":
        if (!value) return "Phone number is required.";
        break;
    }
  };

  const validate = (): boolean => {
    const fields: (keyof DoctorForm)[] = ["name", "email", "password", "confirm", "speciality", "experience", "fees", "phone"];
    const e: FormErrors = {};
    for (const f of fields) {
      const err = validateField(f, form[f]);
      if (err) (e as Record<string, string>)[f] = err;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (name: keyof DoctorForm, value: string) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((p) => ({ ...p, [name]: err }));
    }
    if (name === "password" && touched.confirm) {
      const err = value !== form.confirm ? "Passwords do not match." : undefined;
      setErrors((p) => ({ ...p, confirm: err }));
    }
  };

  const handleBlur = (name: keyof DoctorForm) => {
    setTouched((p) => ({ ...p, [name]: true }));
    const err = validateField(name, form[name]);
    setErrors((p) => ({ ...p, [name]: err }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const allFields: (keyof DoctorForm)[] = ["name", "email", "password", "confirm", "speciality", "experience", "fees", "phone"];
    const t: Record<string, boolean> = {};
    allFields.forEach((f) => (t[f] = true));
    setTouched(t);
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      await dispatch(registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "doctor",
        speciality: form.speciality,
      })).unwrap();
      
      Swal.fire("Success!", "Doctor account created successfully.", "success");
      navigate("/admin/doctors");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create doctor. Please try again.";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto fade-in pb-10">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold font-manrope text-on-surface tracking-tight">Add New Doctor</h2>
        <p className="text-on-surface-variant text-sm mt-1">Create a new doctor account and profile.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6">
        {errors.general && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Dr. Julian Vance"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`${inputClass(!!errors.name)} pl-10`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="julian.vance@clinic.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`${inputClass(!!errors.email)} pl-10`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={16} />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`${inputClass(!!errors.password)} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={16} />
                </div>
                <input
                  type={showConf ? "text" : "password"}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={(e) => handleChange("confirm", e.target.value)}
                  onBlur={() => handleBlur("confirm")}
                  className={`${inputClass(!!errors.confirm)} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConf(!showConf)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConf ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Speciality</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiBriefcase size={16} />
                </div>
                <select
                  value={form.speciality}
                  onChange={(e) => handleChange("speciality", e.target.value)}
                  onBlur={() => handleBlur("speciality")}
                  className={`${inputClass(!!errors.speciality)} pl-10 appearance-none cursor-pointer`}
                >
                  <option value="">Select special...</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {errors.speciality && <p className="text-xs text-red-500 mt-1">{errors.speciality}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience (years)</label>
              <input
                type="number"
                placeholder="5"
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                onBlur={() => handleBlur("experience")}
                className={inputClass(!!errors.experience)}
              />
              {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                placeholder="50"
                value={form.fees}
                onChange={(e) => handleChange("fees", e.target.value)}
                onBlur={() => handleBlur("fees")}
                className={inputClass(!!errors.fees)}
              />
              {errors.fees && <p className="text-xs text-red-500 mt-1">{errors.fees}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
            >
              {loading ? "Creating..." : "Create Doctor Account"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;