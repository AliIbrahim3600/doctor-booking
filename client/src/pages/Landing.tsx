import { Link } from "react-router";
import {
  FiCalendar,
  FiSearch,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiHeart,
  FiCpu,
  FiActivity,
  FiEye,
  FiSmile,
  FiBriefcase,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchDoctors, setSpecialityFilter } from "../store/slices/doctorSlice";

/* ─── Data ─────────────────────────────────────────────── */
// Remove static DOCTORS array, now fetched from Redux

const SPECIALTY_ICONS: Record<string, any> = {
  "Cardiology": FiHeart,
  "Neurology": FiCpu,
  "Orthopedics": FiActivity,
  "Ophthalmology": FiEye,
  "Dentistry": FiSmile,
  "General": FiBriefcase,
  "Internal Medicine": FiActivity,
  "Pediatrics": FiSmile,
  "Dermatology": FiEye,
};

const DEFAULT_SPECIALTIES = [
  "Cardiology", "Neurology", "Orthopedics", "Ophthalmology", "Dentistry", "General"
];

const STEPS = [
  {
    num: "01",
    icon: FiSearch,
    title: "Find Doctor",
    desc: "Search from our world-class medical professionals across various specialties, filtered by location and empathy.",
  },
  {
    num: "02",
    icon: FiCalendar,
    title: "Select Time",
    desc: "Choose a time slot that fits your schedule. We offer flexible hours including evenings and weekends.",
  },
  {
    num: "03",
    icon: FiCheckCircle,
    title: "Confirm",
    desc: "Instantly confirm your booking and receive a notification with clinical instructions.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The booking experience was so fluid. I found a cardiologist within minutes and had my consultation the very next day. Truly exceptional.",
    name: "Emily Carter",
    role: "Patient since 2023",
    stars: 5,
  },
  {
    quote:
      "As someone who manages multiple family appointments, The Clinical Atelier has been a life-saver. The reminders and record-keeping are seamless.",
    name: "David Miller",
    role: "Patient since 2022",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "How do I cancel my appointment?",
    a: 'You can cancel or reschedule your appointment directly through the "My Appointments" tab in your dashboard at least 24 hours in advance without any penalty.',
  },
  {
    q: "Are the doctors verified?",
    a: "Yes. Every doctor on our platform goes through a rigorous credential verification process, including license checks and peer reviews.",
  },
  {
    q: "Do you accept insurance?",
    a: "Many of our doctors accept insurance. You can filter by insurance provider when searching for a specialist.",
  },
  {
    q: "Can I book for a family member?",
    a: "Absolutely. You can manage multiple patient profiles from a single account and book on behalf of family members.",
  },
];

/* ─── Sub-components ────────────────────────────────────── */

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          size={13}
          className={i < count ? "text-amber-400 fill-amber-400" : "text-slate-300"}
        />
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-5 text-left text-slate-800 font-medium hover:bg-slate-50 transition-colors"
      >
        <span>{q}</span>
        {open ? <FiChevronUp className="text-blue-600 shrink-0" /> : <FiChevronDown className="text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed border-t border-slate-100">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

const year = new Date().getFullYear();

/* ─── Page ──────────────────────────────────────────────── */

export default function Landing() {
  const dispatch = useAppDispatch();
  const { doctors } = useAppSelector((state) => state.doctor);

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length]);

  const featuredDoctors = doctors.slice(0, 3);

  const allSpecialtyLabels = Array.from(new Set([
    ...DEFAULT_SPECIALTIES,
    ...doctors.map(d => d.speciality).filter(Boolean)
  ]));

  const dynamicSpecialties = allSpecialtyLabels.map(label => ({
    icon: SPECIALTY_ICONS[label] || FiBriefcase,
    label,
    count: doctors.filter(d => d.speciality === label).length
  }));

  return (
    <div className="bg-white text-slate-900">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left copy */}
            <div>
              {/* pill badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Trusted by 50,000+ patients
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
                Book Doctor <br />
                <span className="text-blue-600">Appointments</span> <br />
                Easily & Quickly
              </h1>
              <p className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed">
                Find the right doctor and schedule your visit in seconds. Professional care with empathetic service, available 24/7.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors"
                >
                  Book Now <FiArrowRight />
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                >
                  Find Doctors
                </Link>
              </div>

              {/* stat row */}
              <div className="flex flex-wrap gap-8">
                {[
                  { val: "500+", label: "Specialists" },
                  { val: "98%", label: "Satisfaction" },
                  { val: "50K+", label: "Patients Served" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-slate-900">{val}</p>
                    <p className="text-sm text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image + floating badge */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[480px]">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=900"
                  alt="Modern medical clinic interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-blue-900/30 to-transparent" />
              </div>

              {/* HIPAA badge */}
              <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FiShield className="text-emerald-600" size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">HIPAA Compliant</p>
                  <p className="text-xs text-slate-400">Your data is secured with clinical precision.</p>
                </div>
              </div>

              {/* floating card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  +
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Aura Health</p>
                  <p className="text-xs text-slate-400">Instant Booking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ SPECIALTIES ══════════════════ */}
      <section id="specialties" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Browse by Category</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Our Specialties</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dynamicSpecialties.map(({ icon: Icon, label, count }) => (
              <Link
                key={label}
                to="/doctors"
                onClick={() => dispatch(setSpecialityFilter(label))}
                className="group flex flex-col items-center gap-3 bg-white rounded-2xl px-4 py-6 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center transition-colors">
                  <Icon className="text-blue-600 group-hover:text-white transition-colors" size={22} />
                </div>
                <p className="text-sm font-semibold text-slate-800 text-center">{label}</p>
                <p className="text-xs text-slate-400">{count} doctors</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURED SPECIALISTS ══════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Hand-Picked</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Featured Specialists</h2>
              <p className="text-slate-400 mt-2 max-w-lg text-sm">
                Outstanding medical professionals selected for their excellence and empathy.
              </p>
            </div>
            <Link
              to="/doctors"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All Doctors <FiArrowRight size={15} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={doc.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(doc.name) + "&background=random"}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold text-amber-500">
                    <FiStar className="fill-amber-400" size={11} /> {doc.rating || 4.8}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold mt-0.5">{doc.speciality}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-slate-400">Availability</p>
                      <p className="text-sm font-medium text-slate-700">
                        {doc.availability && doc.availability.length > 0 
                          ? `${doc.availability[0].day}, ${doc.availability[0].startTime}`
                          : "Check Available Slots"}
                      </p>
                    </div>
                    <Link
                      to={`/doctor/${doc._id}`}
                      className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                    >
                      <FiCalendar size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How it Works</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Our streamlined process ensures that you get the care you need without the administrative friction.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* connecting line */}
            <div className="hidden sm:block absolute top-14 left-1/6 right-1/6 h-px bg-blue-100 z-0" />

            {STEPS.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                    <Icon className="text-white" size={26} />
                  </div>
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center border border-blue-100">
                    {num}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Patient Experiences</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map(({ quote, name, role, stars }) => (
              <div
                key={name}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"
              >
                <StarRating count={stars} />
                <blockquote className="mt-4 text-slate-600 text-sm leading-relaxed italic">
                  "{quote}"
                </blockquote>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FAQ/ABOUT ══════════════════ */}
      <section id="about" className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Support</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA BANNER ══════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-blue-600 overflow-hidden px-8 py-16 text-center text-white">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto relative">
              Join thousands of patients who trust Aura Health for seamless, professional medical care.
            </p>
            <div className="flex flex-wrap justify-center gap-3 relative">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-sm"
              >
                Get Started Free <FiArrowRight />
              </Link>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/40 text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
              >
                Browse Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-slate-100 bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">+</div>
                <span className="font-bold text-slate-900">Aura <span className="text-blue-600">Health</span></span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Professional healthcare, reimagined for the modern patient.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {["Find Doctors", "Specialties", "How It Works"].map((l) => (
                  <li key={l}>
                    <Link to="/doctors" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Company</h4>
              <ul className="space-y-2.5">
                {["About Us", "Careers", "Contact Support"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Compliance */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Compliance</h4>
              <ul className="space-y-2.5">
                {["HIPAA Compliance", "Privacy Policy", "Terms of Service"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>© {year} Aura Health. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><FiShield className="text-emerald-500" /> HIPAA Secure</span>
              <span className="flex items-center gap-1"><FiCheckCircle className="text-blue-500" /> SSL Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
