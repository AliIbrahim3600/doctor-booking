import useDataContext from "../../hooks/useDataContext";

const PatientRecords = () => {
  const { searchQuery, setSearchQuery } = useDataContext();

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">Medical Records</h1>
          <p className="text-on-surface-variant font-body mt-1">Access all your medical history and test results in one place.</p>
        </div>
        
        <button onClick={() => alert("Feature coming soon!")} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity cursor-pointer">
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
              <p className="text-xl font-headline font-extrabold text-on-primary-fixed">0 Records</p>
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
            <div className="py-20 text-center flex flex-col items-center">
               <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">folder_off</span>
               <p className="text-on-surface-variant font-body">No data available.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
