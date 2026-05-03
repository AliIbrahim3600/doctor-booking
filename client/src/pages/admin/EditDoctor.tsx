import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchDoctors, adminUpdateDoctorAsync } from "../../store/slices/doctorSlice";
import Swal from "sweetalert2";

const EditDoctor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { doctors, isLoading } = useAppSelector((state) => state.doctor);

  const doctor = doctors.find((d) => d._id === id);

  const [form, setForm] = useState({
    name: "",
    email: "",
    speciality: "",
    experience: "",
    fees: "",
    phone: "",
    about: "",
    avatar: "",
    isApproved: false,
  });

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(fetchDoctors());
    }
  }, [dispatch, doctors.length]);

  // Sync form data when doctor data loads
  useEffect(() => {
    if (doctor) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: doctor.name || "",
        email: doctor.email || "",
        speciality: doctor.speciality || "",
        experience: String(doctor.experience || 0),
        fees: String(doctor.fees || 0),
        phone: doctor.phone || "",
        about: doctor.about || "",
        avatar: doctor.avatar || "",
        isApproved: doctor.isApproved || false,
      });
    }
  }, [doctor?._id, doctor]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant">person_off</span>
        <h2 className="text-xl font-bold font-manrope">Doctor not found</h2>
        <button onClick={() => navigate("/admin/doctors")} className="px-6 py-2 bg-primary text-white rounded-xl">Back to Doctors</button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(adminUpdateDoctorAsync({
        doctorId: doctor._id,
        data: {
          name: form.name,
          email: form.email,
          speciality: form.speciality,
          experience: parseInt(form.experience),
          fees: parseInt(form.fees),
          phone: form.phone,
          about: form.about,
          avatar: form.avatar,
          isApproved: form.isApproved,
        },
      })).unwrap();

      Swal.fire("Success!", "Doctor profile updated successfully.", "success");
      navigate("/admin/doctors");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update doctor";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in pb-10">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/admin/doctors")} className="p-2 rounded-xl hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight">Edit Doctor</h2>
          <p className="text-on-surface-variant text-sm mt-1">Update profile, availability, and approval status.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Speciality</label>
            <input
              type="text"
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              required
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              min="0"
              required
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Consultation Fee ($)</label>
            <input
              type="number"
              name="fees"
              value={form.fees}
              onChange={handleChange}
              min="0"
              required
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Avatar URL</label>
            <input
              type="text"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">About</label>
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={4}
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
          <input
            type="checkbox"
            id="isApproved"
            name="isApproved"
            checked={form.isApproved}
            onChange={handleChange}
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <label htmlFor="isApproved" className="text-sm font-bold text-on-surface cursor-pointer">
            {form.isApproved ? "Doctor is approved and active" : "Doctor is pending approval"}
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-3.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/doctors")}
            className="px-8 py-3.5 bg-surface-container text-on-surface-variant font-bold rounded-xl hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
