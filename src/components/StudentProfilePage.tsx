import React, { useState } from 'react';
import {
  User as UserIcon,
  GraduationCap,
  Star,
  Edit2,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Plus,
  X,
  BookOpen,
  Sparkles,
  ArrowLeftRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { User, Review, ActivePage } from '../types';
import { INITIAL_USERS } from '../data/seedData';

interface StudentProfilePageProps {
  user?: User | null;
  isCurrentUser: boolean;
  reviews: Review[];
  onUpdateProfile?: (updatedData: Partial<User>) => void;
  onNavigate: (page: ActivePage) => void;
  onProposeSwap?: (targetUser: User) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  user: rawUser,
  isCurrentUser,
  reviews = [],
  onUpdateProfile,
  onNavigate,
  onProposeSwap
}) => {
  const user = rawUser || INITIAL_USERS[0];
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user.name || 'Student');
  const [editCollege, setEditCollege] = useState(user.college || 'Stanford University');
  const [editDepartment, setEditDepartment] = useState(user.department || 'Computer Science');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editAvailability, setEditAvailability] = useState(user.availability || 'Weekdays after 4 PM');
  const [skillsTeach, setSkillsTeach] = useState<string[]>([...(user.skillsTeach || ['Python'])]);
  const [skillsLearn, setSkillsLearn] = useState<string[]>([...(user.skillsLearn || ['Design'])]);
  const [newTeachInput, setNewTeachInput] = useState('');
  const [newLearnInput, setNewLearnInput] = useState('');

  const userReviews = (reviews || []).filter(r => r.targetUserId === user._id);

  const handleAddTeach = () => {
    if (newTeachInput.trim() && !skillsTeach.includes(newTeachInput.trim())) {
      setSkillsTeach([...skillsTeach, newTeachInput.trim()]);
      setNewTeachInput('');
    }
  };

  const handleRemoveTeach = (item: string) => {
    setSkillsTeach(skillsTeach.filter(s => s !== item));
  };

  const handleAddLearn = () => {
    if (newLearnInput.trim() && !skillsLearn.includes(newLearnInput.trim())) {
      setSkillsLearn([...skillsLearn, newLearnInput.trim()]);
      setNewLearnInput('');
    }
  };

  const handleRemoveLearn = (item: string) => {
    setSkillsLearn(skillsLearn.filter(s => s !== item));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editName,
        college: editCollege,
        department: editDepartment,
        bio: editBio,
        availability: editAvailability,
        skillsTeach,
        skillsLearn
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Cover banner with university vibes */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-700 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-8 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.name || 'Student'}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-850 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-850 flex items-center justify-center text-white" title="Verified College Student">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                    {user.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {user.xp} XP
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>{user.college}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span>{user.department}</span>
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{user.rating}</span>
                    <span className="text-slate-400 font-normal">({user.ratingCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span><strong>{user.completedExchanges}</strong> exchanges completed</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              {isCurrentUser ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition active:scale-98 shadow-2xs"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => onProposeSwap && onProposeSwap(user)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-98 transition"
                >
                  <ArrowLeftRight className="w-4 h-4" /> Request Swap
                </button>
              )}
            </div>
          </div>

          {/* Bio & Availability */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About Me</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {user.bio}
              </p>
            </div>
            <div className="md:col-span-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Availability
              </h3>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user.availability}
              </div>
              <p className="text-[11px] text-slate-400">
                Prefers flexible 1-hour sessions with video or library meetups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix (Teach vs Learn) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills I Can Teach */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Skills I Can Teach</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Strengths open for trade</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {user.skillsTeach.length} Topics
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {user.skillsTeach.map(skill => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shadow-2xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Skills I Want to Learn</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Wishlist for matching</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {user.skillsLearn.length} Desired
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {user.skillsLearn.map(skill => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 shadow-2xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>Peer Ratings & Reviews</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified feedback from students who completed exchanges with {user.name}.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{user.rating}</div>
            <div className="text-[11px] text-slate-400">{userReviews.length} total reviews</div>
          </div>
        </div>

        {userReviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No peer reviews yet for this student.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userReviews.map(r => (
              <div
                key={r._id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={r.authorAvatar}
                      alt={r.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{r.authorName}</div>
                      <div className="text-[10px] text-slate-400">Learned: {r.skillExchanged}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{r.comment}"
                </p>
                <div className="text-[10px] text-slate-400 pt-1">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Edit Student Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={editCollege}
                    onChange={e => setEditCollege(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={e => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Availability
                  </label>
                  <select
                    value={editAvailability}
                    onChange={e => setEditAvailability(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                  >
                    <option value="Weekends, Evenings">Weekends, Evenings</option>
                    <option value="Weekdays After 4 PM">Weekdays After 4 PM</option>
                    <option value="Flexible / By Appointment">Flexible / By Appointment</option>
                    <option value="Saturday & Sunday Mornings">Saturday & Sunday Mornings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              {/* Skills I Can Teach Management */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills I Can Teach
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skillsTeach.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      {s}
                      <button type="button" onClick={() => handleRemoveTeach(s)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTeachInput}
                    onChange={e => setNewTeachInput(e.target.value)}
                    placeholder="Add a skill you can teach..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTeach(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTeach}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Skills I Want to Learn Management */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills I Want to Learn
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skillsLearn.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1">
                      {s}
                      <button type="button" onClick={() => handleRemoveLearn(s)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLearnInput}
                    onChange={e => setNewLearnInput(e.target.value)}
                    placeholder="Add a skill you want to learn..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLearn(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddLearn}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
