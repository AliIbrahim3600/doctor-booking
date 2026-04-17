import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchDoctors, approveDoctor, deleteDoctor } from "../../store/slices/doctorSlice";
import Loader from "../../components/common/Loader";
import Swal from "sweetalert2";

const AllDoctors = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { doctors, isLoading } = useAppSelector((state) => state.doctor);

  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [specialityFilter, setSpecialityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const specialities = [...new Set(doctors.map(d => d.speciality).filter(Boolean))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesApproval = approvalFilter === "all" || 
      (approvalFilter === "approved" && doc.isApproved) ||
      (approvalFilter === "pending" && !doc.isApproved);
    const matchesSpeciality = specialityFilter === "all" || doc.speciality === specialityFilter;
    const matchesSearch = 
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.speciality?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesApproval && matchesSpeciality && matchesSearch;
  });

  const handleApproveDoctor = (id: string, approve: boolean) => {
    Swal.fire({
      title: approve ? "Approve Doctor" : "Reject Doctor",
      text: approve ? "Are you sure you want to approve this doctor?" : "Are you sure you want to reject this doctor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: approve ? "Approve" : "Reject",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(approveDoctor({ id, isApproved: approve }));
        Swal.fire(approve ? "Approved!" : "Rejected!", `Doctor has been ${approve ? "approved" : "rejected"}.`, "success");
      }
    });
  };

  const handleDeleteDoctor = (id: string) => {
    Swal.fire({
      title: "Delete Doctor",
      text: "Are you sure you want to permanently delete this doctor? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDoctor(id));
        Swal.fire("Deleted!", "Doctor has been permanently deleted.", "success");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in pb-10">
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold font-manrope text-on-surface tracking-tight">All Doctors</h2>
        <p className="text-on-surface-variant text-sm mt-1">Manage doctor profiles and approvals.</p>
      </header>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-outline-variant/10">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              type="text"
              placeholder="Search by name or special..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="px-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Doctors</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Approval</option>
          </select>
          <select
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
            className="px-4 py-3 bg-surface-container-low rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Specialities</option>
            {specialities.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div key={doc._id} className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={doc.avatar || `https://ui-avatars.com/api/?name=${doc.name?.replace(' ', '+') || "Doctor"}&background=random`}
                    alt={doc.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">{doc.name}</h4>
                    <p className="text-sm text-on-surface-variant">{doc.speciality}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                      <span className="text-xs font-bold text-on-surface">{doc.rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-xs text-on-surface-variant">({doc.numReviews || 0})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Experience</span>
                    <span className="font-medium text-on-surface">{doc.experience || "0"} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Consultation Fee</span>
                    <span className="font-medium text-on-surface">${doc.fees || "0"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-md text-center ${
                    doc.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {doc.isApproved ? "Approved" : "Pending Approval"}
                  </span>
                  
                  {!doc.isApproved ? (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApproveDoctor(doc._id, true)}
                        className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproveDoctor(doc._id, false)}
                        className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => navigate(`/doctor/${doc._id}`)}
                        className="w-full py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doc._id)}
                        className="w-full py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-on-surface-variant">
              No doctors found.
            </div>
          )}
        </div>
      </div>

      {isLoading && <Loader />}
    </div>
  );
};

export default AllDoctors;