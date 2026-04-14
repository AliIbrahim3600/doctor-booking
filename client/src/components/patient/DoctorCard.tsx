import { useNavigate } from "react-router";

export interface DoctorCardProps {
  id: string;
  name: string;
  title: string;
  bio: string;
  rating: number;
  image: string;
  isOnline: boolean;
  nextAvailable: string;
  numReviews: number;
  viewMode?: 'grid' | 'list';
}

export default function DoctorCard({ id, name, title, bio, rating, numReviews, image, isOnline, nextAvailable, viewMode = 'grid' }: DoctorCardProps) {
  const navigate = useNavigate();

  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-6 ambient-shadow group hover:bg-surface-bright transition-all duration-300 flex ${viewMode === 'list' ? 'flex-col sm:flex-row sm:items-center gap-6' : 'flex-col h-full'}`}>
      
      {/* Left/Top Section: Profile & Rating */}
      <div className={`flex ${viewMode === 'list' ? 'flex-col sm:items-center gap-3 shrink-0' : 'items-start justify-between mb-4'}`}>
        <div className="relative cursor-pointer" onClick={() => navigate(`/doctor/${id}`)}>
          <img alt={name} className={`${viewMode === 'list' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-20 h-20'} rounded-2xl object-cover ring-4 ring-surface-container hover:ring-primary/20 transition-all`} src={image} />
          {isOnline && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>}
        </div>
        <div className="flex items-center justify-center gap-1 bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-1 rounded-lg text-xs font-bold">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          {rating.toFixed(1)} <span className="text-[10px] opacity-70 font-medium">({numReviews})</span>
        </div>
      </div>

      {/* Middle Section: Biodata */}
      <div className={`flex-1 ${viewMode === 'list' ? '' : 'mb-6'}`}>
        <h3 className="font-headline font-bold text-lg text-on-surface cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/doctor/${id}`)}>
          {name}
        </h3>
        <p className="text-sm font-semibold text-secondary mb-3">{title}</p>
        <p className={`text-sm text-on-surface-variant leading-relaxed ${viewMode === 'list' ? 'line-clamp-2 md:line-clamp-none' : 'line-clamp-2'}`}>{bio}</p>
      </div>

      {/* Right/Bottom Section: Actions */}
      <div className={`flex flex-col gap-3 shrink-0 ${viewMode === 'list' ? 'sm:w-56 mt-4 sm:mt-0 items-start sm:items-end' : 'mt-auto'}`}>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          Next available: {nextAvailable}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/doctor/${id}`)}
            className="flex-1 bg-surface-container text-on-surface hover:bg-surface-container-high font-bold py-2 px-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            View Profile
          </button>
          <button 
            onClick={() => navigate(`/book-appointment/${id}`)}
            className="flex-[2] bg-signature-gradient text-white font-bold py-2 px-2 rounded-xl text-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
