import useDataContext from "../../hooks/useDataContext";

const RECORDS_MOCK = [
  {
    id: "1",
    name: "Annual Physical Exam.pdf",
    type: "PDF",
    date: "Oct 12, 2024",
    doctor: "Dr. Sarah Jenkins",
    category: "General Health",
    size: "1.2 MB",
  },
  {
    id: "2",
    name: "Blood Test Results - Full Panel.pdf",
    type: "PDF",
    date: "Sep 28, 2024",
    doctor: "City Labs Inc.",
    category: "Lab Results",
    size: "450 KB",
  },
  {
    id: "3",
    name: "Chest X-Ray.jpg",
    type: "IMAGE",
    date: "Aug 15, 2024",
    doctor: "Dr. James Wilson",
    category: "Radiology",
    size: "4.8 MB",
  },
  {
    id: "4",
    name: "Immunization Record Update.pdf",
    type: "PDF",
    date: "Jan 05, 2024",
    doctor: "Dr. Sarah Jenkins",
    category: "Vaccination",
    size: "890 KB",
  },
  {
    id: "5",
    name: "Dental Cleaning Report.pdf",
    type: "PDF",
    date: "Jul 22, 2024",
    doctor: "Smile Dental Clinic",
    category: "Dental",
    size: "1.1 MB",
  },
  {
    id: "6",
    name: "EKG Monitor Report.pdf",
    type: "PDF",
    date: "Oct 01, 2024",
    doctor: "Dr. Sarah Jenkins",
    category: "Cardiology",
    size: "2.4 MB",
  },
  {
    id: "7",
    name: "Skin Allergy Test.jpg",
    type: "IMAGE",
    date: "May 14, 2024",
    doctor: "Dr. Lisa Wong",
    category: "Dermatology",
    size: "3.2 MB",
  },
];

const PatientRecords = () => {
  const { searchQuery, setSearchQuery } = useDataContext();

  const filteredRecords = RECORDS_MOCK.filter((record) =>
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">Medical Records</h1>
          <p className="text-on-surface-variant font-body mt-1">Access all your medical history and test results in one place.</p>
        </div>
        
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">upload</span>
          Upload New Record
        </button>
      </div>

      {/* Search & Stats */}
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
              <p className="text-xl font-headline font-extrabold text-on-primary-fixed">{RECORDS_MOCK.length} Records</p>
           </div>
        </div>
      </div>

      {/* Records Table/List */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-container-low border-b border-outline-variant/20 text-[10px] font-bold text-outline-variant uppercase tracking-widest">
           <div className="col-span-5">Document Name</div>
           <div className="col-span-2">Category</div>
           <div className="col-span-2">Date</div>
           <div className="col-span-2">Doctor/Source</div>
           <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-outline-variant/10">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div key={record.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-surface-container-low/30 transition-colors">
                <div className="col-span-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    record.type === "PDF" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                  }`}>
                    <span className="material-symbols-outlined">{record.type === "PDF" ? "picture_as_pdf" : "image"}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface line-clamp-1">{record.name}</h4>
                    <p className="text-[10px] text-outline-variant font-medium">{record.size}</p>
                  </div>
                </div>
                <div className="col-span-2 hidden md:block">
                  <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                    {record.category}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-on-surface-variant md:text-on-surface">{record.date}</p>
                </div>
                <div className="col-span-2 hidden md:block">
                   <p className="text-xs font-semibold text-on-surface-variant truncate">{record.doctor}</p>
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                   <button className="p-2 rounded-lg hover:bg-surface-container text-outline-variant hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">download</span>
                   </button>
                   <button className="p-2 rounded-lg hover:bg-surface-container text-outline-variant hover:text-primary transition-colors cursor-pointer md:hidden">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
               <p className="text-on-surface-variant font-body">No records found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
