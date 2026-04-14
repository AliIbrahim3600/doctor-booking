import { useState } from "react";
import { FiStar, FiX } from "react-icons/fi";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  doctorName: string;
}

export default function RatingModal({ isOpen, onClose, onSubmit, doctorName }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit(rating, review);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <FiX className="text-slate-400" size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiStar className="text-blue-600" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Rate your experience</h3>
          <p className="text-slate-500 mt-2">How was your visit with {doctorName}?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition-transform active:scale-90"
              >
                <FiStar 
                  size={36} 
                  className={`transition-colors ${
                    (hover || rating) >= star ? "fill-amber-400 text-amber-400" : "text-slate-200"
                  }`} 
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Write a Review (Optional)</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us more about your consultation..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
