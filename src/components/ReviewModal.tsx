import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudentName?: string;
  partnerName?: string;
  skillName: string;
  sessionId?: string;
  partnerId?: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  onSubmit?: (rating: number, comment: string) => void;
  onSubmitReview?: (reviewData: {
    sessionId: string;
    partnerId: string;
    skillName: string;
    rating: number;
    comment: string;
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  targetStudentName,
  partnerName,
  skillName,
  sessionId,
  partnerId,
  onSubmit,
  onSubmitReview
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const displayName = partnerName || targetStudentName || 'Student Peer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalComment = comment || 'Excellent session! Super informative and friendly exchange.';

    if (onSubmitReview && sessionId && partnerId) {
      onSubmitReview({
        sessionId,
        partnerId,
        skillName,
        rating,
        comment: finalComment
      });
    } else if (onSubmit) {
      onSubmit(rating, finalComment);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Rate Skill Exchange</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reviewing {displayName} for {skillName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="text-center py-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              How was your learning experience?
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-110 focus:outline-hidden"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-2">
              {rating === 5 ? 'Exceptional Mentor! ⭐⭐⭐⭐⭐' : rating === 4 ? 'Great Exchange! ⭐⭐⭐⭐' : 'Helpful Session!'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Review & Testimonial
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={`Share what you learned from ${displayName}, how patient they were, or any highlights...`}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2.5 text-xs text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 shrink-0 text-indigo-500" />
            <span>Submitting a review awards you <strong>+30 XP</strong> and boosts your community rating!</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-md shadow-indigo-500/20 active:scale-98 transition"
            >
              Submit Rating & XP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
