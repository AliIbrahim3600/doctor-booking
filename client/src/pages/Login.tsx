import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "../store/store";
import { loginUser } from "../store/slices/authSlice";
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiShield, FiCheckCircle, FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

/* ─── helpers ─────────────────────────────────────────── */
const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}
interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

/* ─── small reusable field-error line ─────────────────── */
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1 animate-[fadeIn_.2s_ease]">
      <FiAlertCircle size={12} /> {msg}
    </p>
  );
}

/* ─── input class helper ──────────────────────────────── */
function inputClass(hasError: boolean) {
  return (
    "w-full py-2.5 border rounded-xl outline-none transition-all " +
    (hasError
      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-400 pr-4"
      : "border-slate-200 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 pr-4")
  );
}

/* ─── Page ────────────────────────────────────────────── */
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<LoginForm>({
    email: "", password: "", remember: false,
  });
  const [errors, setErrors]     = useState<LoginErrors>({});
  const [touched, setTouched]   = useState<Record<string, boolean>>({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  /* ── validate a single field ── */
  function validateField(name: keyof LoginForm, value: string | boolean): string | undefined {
    if (name === "email") {
      if (!value) return "Email is required.";
      if (!isEmailValid(value as string)) return "Enter a valid email address.";
    }
    if (name === "password") {
      if (!value) return "Password is required.";
      if ((value as string).length < 6) return "Password must be at least 6 characters.";
    }
  }

  /* ── validate whole form, returns true if clean ── */
  function validate(): boolean {
    const e: LoginErrors = {
      email:    validateField("email",    form.email),
      password: validateField("password", form.password),
    };
    setErrors(e);
    return !e.email && !e.password;
  }

  /* ── field change ── */
  function handleChange(name: keyof LoginForm, value: string | boolean) {
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const err = validateField(name, value);
      setErrors((p) => ({ ...p, [name]: err }));
    }
  }

  /* ── blur ── */
  function handleBlur(name: keyof LoginForm) {
    setTouched((p) => ({ ...p, [name]: true }));
    const err = validateField(name, form[name]);
    setErrors((p) => ({ ...p, [name]: err }));
  }

  /* ── submit ── */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();
      navigate(result.user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard");
    } catch (err: any) {
      setErrors({ general: err || "Invalid email or password. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  /* ── side panel ── */
  const SidePanel = (
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
          Welcome back! Continue delivering exceptional care to your patients or manage your appointments smoothly.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {SidePanel}

      {/* ── Form side ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          {/* General error banner */}
          {errors.general && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiMail size={16} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`${inputClass(!!errors.email)} pl-10`}
                />
              </div>
              <FieldError msg={errors.email} />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={16} />
                </div>
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`${inputClass(!!errors.password)} pl-10 pr-10`}
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
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={form.remember}
                onChange={(e) => handleChange("remember", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-600"
              />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember for 30 days</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors mt-2 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader size={16} className="animate-spin" /> Signing in…
                </>
              ) : (
                <>Sign In <span className="text-lg">→</span></>
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
            <FcGoogle size={20} /> Sign in with Google
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              Register
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
