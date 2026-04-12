import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchDoctors, setSearchFilter } from "../store/slices/doctorSlice";
import SpecialityFilter from "../components/patient/SpecialityFilter";
import DoctorCard from "../components/patient/DoctorCard";
import Loader from "../components/common/Loader";

const Doctors = () => {
  const dispatch = useAppDispatch();
  const { doctors, isLoading, error, filters } = useAppSelector((state) => state.doctor);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<"Recommended" | "Rating" | "Experience" | "Fees">("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset pagination when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  // Handle loading state
  if (isLoading) {
    return <Loader />;
  }

  // Apply filters
  const filteredDoctors = doctors.filter(doc => {
    // 1. Speciality
    if (filters.speciality && doc.speciality !== filters.speciality) {
      return false;
    }
    // 2. Search
    if (filters.search && !doc.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    // 3. Minimum Rating
    const docRating = doc.rating !== undefined ? doc.rating : 4.5; 
    if (filters.minRating && docRating < filters.minRating) {
      return false;
    }
    // 4. Availability
    if (filters.availability) {
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const hasAvailability = doc.availability && doc.availability.length > 0;
      
      if (filters.availability === "Today") {
        if (!hasAvailability || !doc.availability.some(slot => slot.day === today)) return false;
      }
      if (filters.availability === "This Week" || filters.availability === "Next Week") {
        if (!hasAvailability) return false;
      }
    }
    return true;
  });

  // Apply Sorting
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === "Rating") {
      return (b.rating ?? 4.5) - (a.rating ?? 4.5);
    }
    if (sortBy === "Experience") {
      return (b.experience || 0) - (a.experience || 0);
    }
    if (sortBy === "Fees") {
      return (a.fees || 0) - (b.fees || 0);
    }
    // "Recommended" default -> Combines rating footprint + experience roughly
    const scoreA = (a.rating ?? 4.5) * (a.experience || 1);
    const scoreB = (b.rating ?? 4.5) * (b.experience || 1);
    return scoreB - scoreA;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(sortedDoctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = sortedDoctors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <main className="pt-28 pb-12 px-8 max-w-screen-2xl mx-auto flex gap-8">
      {/* Filters Sidebar */}
      <SpecialityFilter />

      {/* Main Content */}
      <section className="flex-1">

        {/* Responsive Search Bar */}
        <div className="mb-8 relative w-full lg:hidden block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">search</span>
            <input 
              type="text" 
              value={filters.search}
              onChange={(e) => dispatch(setSearchFilter(e.target.value))}
              placeholder="Search by doctor name..." 
              className="w-full bg-surface-container-lowest text-on-surface p-4 pl-12 pr-12 rounded-2xl ambient-shadow outline-none focus:ring-2 focus:ring-primary transition-all font-body text-sm"
            />
            {filters.search && (
              <button 
                onClick={() => dispatch(setSearchFilter(""))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
        </div>

        {/* Header & Sort */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2">Available Specialists</h1>
            <p className="text-on-surface-variant font-body">Showing {sortedDoctors.length} specialists available</p>
          </div>

          <div className="hidden lg:flex relative flex-1 max-w-md mx-4">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none">search</span>
              <input 
                type="text" 
                value={filters.search}
                onChange={(e) => dispatch(setSearchFilter(e.target.value))}
                placeholder="Search by doctor name..." 
                className="w-full bg-surface-container-lowest text-on-surface py-2.5 pl-11 pr-10 rounded-xl ambient-shadow outline-none focus:ring-2 focus:ring-primary transition-all font-body text-sm"
              />
              {filters.search && (
                <button 
                  onClick={() => dispatch(setSearchFilter(""))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
          </div>

          <div className="flex items-center gap-4 bg-surface-container-lowest p-1.5 rounded-2xl ambient-shadow">
            
            <div className="relative flex items-center bg-surface text-on-surface-variant rounded-xl cursor-pointer">
              <span className="material-symbols-outlined text-sm absolute left-4 pointer-events-none">sort</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-transparent pl-10 pr-8 py-2 font-semibold text-sm outline-none cursor-pointer w-full"
              >
                <option value="Recommended">Sort by: Recommended</option>
                <option value="Rating">Sort by: Highest Rating</option>
                <option value="Experience">Sort by: Most Experienced</option>
                <option value="Fees">Sort by: Lowest Fees</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 text-sm pointer-events-none" style={{fontSize: '18px'}}>expand_more</span>
            </div>

            <div className="h-6 w-px bg-outline-variant/30"></div>
            <div className="flex gap-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-primary-fixed/30 text-primary' : 'text-outline-variant hover:bg-surface'}`}
              >
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-primary-fixed/30 text-primary' : 'text-outline-variant hover:bg-surface'}`}
              >
                <span className="material-symbols-outlined">view_list</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Empty State vs Grid/List */}
        {sortedDoctors.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl ambient-shadow text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">medical_information</span>
            <h2 className="text-xl font-headline font-bold text-on-surface mb-2">No doctors right now</h2>
            <p className="text-on-surface-variant max-w-sm">We could not find any doctors available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
            {paginatedDoctors.map((doc) => {
              const nextAvail = doc.availability && doc.availability.length > 0 
                ? `${doc.availability[0].day}, ${doc.availability[0].startTime}`
                : "Not Available";

              return (
                <DoctorCard 
                  key={doc._id} 
                  id={doc._id}
                  name={doc.name}
                  title={doc.speciality}
                  bio={doc.about || "Experienced medical professional."}
                  rating={doc.rating !== undefined ? doc.rating : 4.8}
                  image={doc.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(doc.name) + "&background=random"}
                  isOnline={true}
                  nextAvailable={nextAvail}
                  viewMode={viewMode}
                />
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-surface-container/50 text-outline-variant' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant cursor-pointer'}`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, index) => (
              <button 
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-colors cursor-pointer ${
                  currentPage === index + 1 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-surface-container/50 text-outline-variant' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant cursor-pointer'}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
              
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Doctors;
