import { useState, useEffect, useCallback } from "react";
import { recordService } from "../../services/recordService";
import useDataContext from "../../hooks/useDataContext";
import Swal from "sweetalert2";

interface MedicalRecord {
  _id: string;
  title: string;
  category: string;
  fileUrl?: string;
  description?: string;
  date: string;
}

const CATEGORIES = [
  { value: "lab_report", label: "Lab Report" },
  { value: "prescription", label: "Prescription" },
  { value: "imaging", label: "Imaging (X-Ray, MRI)" },
  { value: "clinical_note", label: "Clinical Note" },
  { value: "other", label: "Other" },
];

const PatientRecords = () => {
  const { searchQuery, setSearchQuery } = useDataContext();
  
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({ title: "", category: "lab_report", description: "" });

  const closeModal = useCallback(() => {
    setShowAddModal(false);
    setNewRecord({ title: "", category: "lab_report", description: "" });
  }, []);

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showAddModal) closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showAddModal, closeModal]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await recordService.getRecords();
      setRecords(data);
    } catch {
      console.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recordService.createRecord(newRecord);
      Swal.fire("Success!", "Record added successfully.", "success");
      setShowAddModal(false);
      setNewRecord({ title: "", category: "lab_report", description: "" });
      fetchRecords();
    } catch {
      Swal.fire("Error", "Failed to add record.", "error");
    }
  };

  const handleDeleteRecord = (id: string) => {
    Swal.fire({
      title: "Delete Record",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await recordService.deleteRecord(id);
        Swal.fire("Deleted!", "Record has been deleted.", "success");
        fetchRecords();
      }
    });
  };

  const filteredRecords = records.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">Medical Records</h1>
          <p className="text-on-surface-variant font-body mt-1">Access all your medical history and test results in one place.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)} 
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">upload</span>
          Upload New Record
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
            <input
              type="text"
              placeholder="Search by filename or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border-0 rounded-2xl py-4 pl-12 pr-6 shadow-sm focus:ring-2 focus:ring-primary/50 font-body text-sm"
            />
          </div>
        </div>
        <div className="bg-primary-fixed/30 rounded-2xl p-4 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined">folder_open</span>
           </div>
           <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none mb-1">Total Files</p>
              <p className="text-xl font-headline font-extrabold text-on-primary-fixed">{records.length} Records</p>
           </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-low border-b border-outline-variant/20 text-[10px] font-bold text-outline-variant uppercase tracking-widest">
           <div className="col-span-4">Document Name</div>
           <div className="col-span-2">Category</div>
           <div className="col-span-3">Date</div>
           <div className="col-span-2">Actions</div>
        </div>

        <div className="divide-y divide-outline-variant/10">
          {loading ? (
            <div className="py-20 text-center text-outline-variant">Loading records...</div>
          ) : filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div key={record._id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-surface-container-low transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-600">description</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{record.title}</p>
                    {record.description && <p className="text-xs text-on-surface-variant">{record.description}</p>}
                  </div>
                </div>
                <div className="col-span-2 mt-2 md:mt-0">
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                    {getCategoryLabel(record.category)}
                  </span>
                </div>
                <div className="col-span-3 mt-2 md:mt-0">
                  <p className="text-sm text-on-surface-variant">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2 mt-4 md:mt-0 flex gap-2">
                  <button 
                    onClick={() => handleDeleteRecord(record._id)}
                    className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
               <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">folder_off</span>
               <p className="text-on-surface-variant font-body">No records found.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => closeModal()}>
          <div className="bg-surface-container-lowest rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-on-surface mb-4">Add Medical Record</h3>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Title</label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                  placeholder="e.g., Blood Test Results"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Category</label>
                <select
                  value={newRecord.category}
                  onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Description (optional)</label>
                <textarea
                  value={newRecord.description}
                  onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  placeholder="Brief description of the record..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => closeModal()}
                  className="flex-1 px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;