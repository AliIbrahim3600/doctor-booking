import { useAppDispatch, useAppSelector } from "../../store/store";
import { setSpecialityFilter, setAvailabilityFilter, setMinRatingFilter, clearFilters } from "../../store/slices/doctorSlice";

export default function SpecialityFilter() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.doctor.filters);
  const currentSpeciality = filters.speciality;
  const currentAvailability = filters.availability;
  const currentRating = filters.minRating;

  const specialities = [
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Pediatrics",
    "Internal Medicine"
  ];

  const handleToggle = (spec: string) => {
    if (currentSpeciality === spec) {
      dispatch(setSpecialityFilter(""));
    } else {
      dispatch(setSpecialityFilter(spec));
    }
  };

  return (
    <aside className="w-72 hidden lg:flex flex-col gap-8 shrink-0">
      <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold text-lg">Filters</h2>
          <button 
            onClick={() => dispatch(clearFilters())}
            className="text-xs font-semibold text-primary uppercase tracking-wider cursor-pointer hover:underline"
          >
            Reset
          </button>
        </div>
        {/* Specialty */}
        <div className="mb-8">
          <label className="block font-headline font-semibold text-sm mb-4 text-on-surface">Specialty</label>
          <div className="flex flex-col gap-3">
            {specialities.map((spec) => (
              <label key={spec} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={currentSpeciality === spec}
                  onChange={() => handleToggle(spec)}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-sm font-body text-on-surface-variant group-hover:text-on-surface">{spec}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Availability */}
        <div className="mb-8">
          <label className="block font-headline font-semibold text-sm mb-4 text-on-surface">Availability</label>
          <div className="flex flex-wrap gap-2">
            {["Today", "This Week", "Next Week"].map((avail) => {
              const isSelected = currentAvailability === avail;
              return (
                <button 
                  key={avail}
                  onClick={() => dispatch(setAvailabilityFilter(isSelected ? "" : avail))}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected 
                      ? "bg-primary text-white" 
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {avail}
                </button>
              );
            })}
          </div>
        </div>
        {/* Rating */}
        <div>
          <label className="block font-headline font-semibold text-sm mb-4 text-on-surface">Minimum Rating</label>
          <div className="flex items-center justify-between gap-2">
            {[3, 4, 4.5].map((rating) => {
              const isSelected = currentRating === rating;
              return (
                <button 
                  key={rating}
                  onClick={() => dispatch(setMinRatingFilter(isSelected ? 0 : rating))}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                    isSelected
                      ? "border-2 border-primary bg-primary-fixed/20 font-bold text-primary"
                      : "border border-outline-variant/30 font-medium text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {rating}{rating !== 4.5 && <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                  {rating === 4.5 && "+"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Ad/Promo Card */}
      <div className="relative overflow-hidden rounded-2xl h-64 bg-primary p-6 flex flex-col justify-end group">
        <div className="absolute inset-0 z-0">
          <img
            alt="Telehealth promotion"
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyfjm-f0QsyJL20tf2uzBT0k1k0ORtDGjl8N6uwX0-MlLRjsEST9Ol4hNIfqz6yQn2j6cWoDUMYIk4UTyZxEu8Sc8CYtODm8F4w8RVvNuked7OqHu4jlP-ZJL8v9pFSCinEh9yRPq0z6sJ8n8MB0T8anYYbN-j9P0LEsYpN8U7RBoxXBdX5f0h0Mo2Y07i31xORQlnBBwpjjLkYFspvkQCmJMnvDoUlQq_50dODExLRFz3fvYyoek5Z7TAE3aQTK16NUC1JczGgboi"
          />
        </div>
        <div className="relative z-10">
          <h3 className="text-white font-headline font-bold text-xl mb-2 leading-tight">Instant Care <br />via Telehealth</h3>
          <p className="text-blue-100 text-xs mb-4">Connect with top specialists from the comfort of your home.</p>
          <button className="bg-white text-primary font-bold py-2 px-4 rounded-lg text-sm w-full">Learn More</button>
        </div>
      </div>
    </aside>
  );
}
