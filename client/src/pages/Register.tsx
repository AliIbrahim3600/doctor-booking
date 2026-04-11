import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "../store/store";
import { registerUser } from "../store/slices/authSlice";
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff,
  FiShield, FiCheckCircle, FiAlertCircle,
  FiLoader, FiBriefcase,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

/* ─── helpers ─────────────────────────────────────────── */
const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function passwordStrength(pw: string): { level: 0 | 1 | 2 | 3; label: string; color: string } {
  if (pw.length === 0) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  if (score <= 1) return { level: 1, label: "Weak",   color: "bg-red-400"    };
  if (score === 2) return { level: 2, label: "Fair",   color: "bg-amber-400"  };
  return              { level: 3, label: "Strong", color: "bg-emerald-500" };
}

interface RegForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
  specialty: string;
  role: "Patient" | "Doctor";
}
interface RegErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  specialty?: string;
  general?: string;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <FiAlertCircle size={12} /> {msg}
    </p>
  );
}

function inputClass(hasError: boolean, extraPad = "") {
  return (
    "w-full py-2.5 border rounded-xl outline-none transition-all " +
    extraPad + " " +
    (hasError
      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-400"
      : "border-slate-200 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600")
  );
}

const SPECIALTIES = [
  "General Practitioner", "Cardiologist", "Neurologist",
  "Orthopedic Surgeon", "Dermatologist", "Ophthalmologist",
  "Pediatrician", "Psychiatrist", "Radiologist", "Other",
];

/* ─── Page ────────────────────────────────────────────── */
export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<RegForm>({
    name: "", email: "", password: "", confirm: "", specialty: "", role: "Patient",
  });
  const [errors, setErrors]       = useState<RegErrors>({});
  const [touched, setTouched]     = useState<Record<string, boolean>>({});
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [loading, setLoading]     = useState(false);

  const strength = passwordStrength(form.password);

  /* ── validate single field ── */
  function validateField(name: keyof RegForm, value: string): string | undefined {
    switch (name) {
      case "name":
        if (!value.trim())       return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        break;
      case "email":
        if (!value)              return "Email is required.";
        if (!isEmailValid(value)) return "Enter a valid email address.";
        break;
      case "password":
        if (!value)              return "Password is required.";
        if (value.length < 8)   return "Password must be at least 8 characters.";
        break;
      case "confirm":
        if (!value)              return "Please confirm your password.";
        if (value !== form.password) return "Passwords do not match.";
        break;
      case "specialty":
        if (form.role === "Doctor" && !value)
          return "Please select your specialty.";
        break;
    }
  }

  /* ── validate whole form ── */
  function validate(): boolean {
    const fields: (keyof RegForm)[] = ["name", "email", "password", "confirm"];
    if (form.role === "Doctor") fields.push("specialty");

    const e: RegErrors = {};
    for (const f of fields) {
      const err = validateField(f, form[f] as string);
      if (err) (e as Record<string, string>)[f] = err;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ── field change ── */
  function handleChange(name: keyof RegForm, value: string) {
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((p) => ({ ...p, [name]: err }));
    }
    // re-validate confirm whenever password changes
    if (name === "password" && touched["confirm"]) {
      const err = value !== form.confirm ? "Passwords do not match." : undefined;
      setErrors((p) => ({ ...p, confirm: err }));
    }
  }

  /* ── blur ── */
  function handleBlur(name: keyof RegForm) {
    setTouched((p) => ({ ...p, [name]: true }));
    const err = validateField(name, form[name] as string);
    setErrors((p) => ({ ...p, [name]: err }));
  }

  /* ── role switch clears specialty error ── */
  function handleRole(r: "Patient" | "Doctor") {
    setForm((p) => ({ ...p, role: r, specialty: "" }));
    setErrors((p) => ({ ...p, specialty: undefined }));
    setTouched((p) => ({ ...p, specialty: false }));
  }

  /* ── submit ── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const allFields: (keyof RegForm)[] = ["name", "email", "password", "confirm"];
    if (form.role === "Doctor") allFields.push("specialty");
    const t: Record<string, boolean> = {};
    allFields.forEach((f) => (t[f] = true));
    setTouched(t);
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const userData: Record<string, string> = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role.toLowerCase(),
      };
      if (form.role === "Doctor") {
        userData.speciality = form.specialty; // Backend expects `speciality`
      }

      await dispatch(registerUser(userData)).unwrap();
      navigate(form.role === "Doctor" ? "/doctor/dashboard" : "/patient/dashboard");
    } catch (err: any) {
      setErrors({ general: err || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  /* ─── render ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">

      {/* Side panel */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-700 opacity-20" />
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200"
          alt="Healthcare Professional"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-600 font-bold text-xl">+</div>
            <h2 className="text-2xl font-bold">Aura Health</h2>
          </div>
          <p className="text-xl text-blue-100 max-w-lg">
            Join the community of modern clinical practitioners and deliver exceptional patient care.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Join the community of modern clinical practitioners.</p>
          </div>

          {/* Role toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
            {(["Patient", "Doctor"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRole(r)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  form.role === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* General error */}
          {errors.general && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
              <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiUser size={16} />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  placeholder={form.role === "Doctor" ? "Dr. Julian Vance" : "John Doe"}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={`${inputClass(!!errors.name, "pl-10")}`}
                />
              </div>
              <FieldError msg={errors.name} />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail size={16} />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder={form.role === "Doctor" ? "julian.vance@clinic.com" : "john@example.com"}
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`${inputClass(!!errors.email, "pl-10")}`}
                />
              </div>
              <FieldError msg={errors.email} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={16} />
                </div>
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`${inputClass(!!errors.password, "pl-10 pr-10")}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <FieldError msg={errors.password} />

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          strength.level >= i ? strength.color : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.level === 1 ? "text-red-500" :
                    strength.level === 2 ? "text-amber-500" : "text-emerald-600"
                  }`}>
                    {strength.label} password
                    {strength.level < 3 && <span className="font-normal text-slate-400"> — add uppercase, numbers or symbols</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={16} />
                </div>
                <input
                  id="reg-confirm"
                  type={showConf ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={(e) => handleChange("confirm", e.target.value)}
                  onBlur={() => handleBlur("confirm")}
                  className={`${inputClass(!!errors.confirm, "pl-10 pr-10")}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConf((p) => !p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showConf ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {/* Match indicator */}
              {form.confirm.length > 0 && !errors.confirm && (
                <p className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                  <FiCheckCircle size={12} /> Passwords match
                </p>
              )}
              <FieldError msg={errors.confirm} />
            </div>

            {/* Specialty (Doctor only) */}
            {form.role === "Doctor" && (
              <div>
                <label htmlFor="reg-specialty" className="block text-sm font-medium text-slate-700 mb-1">Medical Specialty</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <FiBriefcase size={16} />
                  </div>
                  <select
                    id="reg-specialty"
                    value={form.specialty}
                    onChange={(e) => handleChange("specialty", e.target.value)}
                    onBlur={() => handleBlur("specialty")}
                    className={`${inputClass(!!errors.specialty, "pl-10")} appearance-none cursor-pointer`}
                  >
                    <option value="">Select your specialty…</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <FieldError msg={errors.specialty} />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors mt-2 flex justify-center items-center gap-2"
            >
              {loading ? (
                <><FiLoader size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <>Create Account <span className="text-lg">→</span></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-4 text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-colors flex justify-center items-center gap-2"
          >
            <FcGoogle size={20} /> Continue with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Login
            </Link>
          </p>

          <div className="flex justify-center items-center gap-4 mt-7 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1"><FiShield className="text-emerald-500" /> HIPAA SECURE</span>
            <span className="flex items-center gap-1"><FiCheckCircle className="text-blue-500" /> SSL ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
