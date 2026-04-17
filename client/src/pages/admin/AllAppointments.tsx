import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAppointments, updateAppointmentStatusAsync, type AppointmentStatus } from "../../store/slices/appointmentSlice";
import Loader from "../../components/common/Loader";
import Swal from "sweetalert2";

const AllAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, isLoading } = useAppSelector((state) => state.appointment);
  const { doctors } = useAppSelector((state) => state.doctor);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter === "all" || appt.status === statusFilter;
    const matchesDoctor = doctorFilter === "all" || appt.doctorId === doctorFilter;
    const matchesSearch = 
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDoctor && matchesSearch;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    Swal.fire({
      title: "Update Status",
      text: `Change appointment status to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateAppointmentStatusAsync({ id, status: newStatus as AppointmentStatus }));
        Swal.fire("Updated!", "Appointment status has been changed.", "success");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in pb-10">
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight">All Appointments</h2>
        <p className="text-on-surface-variant text-sm mt-1">Manage and view all appointments across the platform.</p>
      </header>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-outline-variant/10">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="px-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>{doc.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="text-left py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Patient</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Doctor</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date & Time</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appt) => (
                  <tr key={appt._id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-sm text-on-surface">{appt.patientName}</p>
                        <p className="text-xs text-on-surface-variant">{appt.speciality}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-on-surface font-medium">{appt.doctorName}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-on-surface">{appt.date}</p>
                      <p className="text-xs text-on-surface-variant">{appt.time}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-md ${
                        appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                        className="text-xs px-2 py-1 bg-surface-container-low rounded-lg text-on-surface focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-on-surface-variant">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isLoading && <Loader />}
    </div>
  );
};

export default AllAppointments;