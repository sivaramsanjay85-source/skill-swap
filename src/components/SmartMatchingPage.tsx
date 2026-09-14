import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeftRight,
  Star,
  CheckCircle2,
  Filter,
  User as UserIcon,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { User, SmartMatchResult, ActivePage } from '../types';
import { INITIAL_USERS } from '../data/seedData';

interface SmartMatchingPageProps {
  currentUser?: User | null;
  matches: SmartMatchResult[];
  onConnect: (targetStudent: User, offerSkill: string, wantSkill: string) => void;
  onNavigate: (page: ActivePage) => void;
}

export const SmartMatchingPage: React.FC<SmartMatchingPageProps> = ({
  currentUser: rawUser,
  matches,
  onConnect,
  onNavigate
}) => {
  const currentUser = rawUser || INITIAL_USERS[0];
  const [highMatchOnly, setHighMatchOnly] = useState(false);
  const [sameCollegeOnly, setSameCollegeOnly] = useState(false);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (highMatchOnly && m.matchScore < 90) return false;
      if (sameCollegeOnly && m.student.college.toLowerCase() !== (currentUser?.college || '').toLowerCase()) return false;
      return true;
    });
  }, [matches, highMatchOnly, sameCollegeOnly, currentUser?.college]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Current User's Profile Equation */}
      <div className="rounded-3xl bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-xs text-indigo-200 border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Bilateral Match Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Skill Compatibility Radar
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl font-normal leading-relaxed">
              We analyze your teaching strengths against other college students' wishlists, and vice-versa,
              to find optimal 2-way peer learning partnerships with zero payment required.
            </p>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="self-start lg:self-center px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <span>Update My Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current User's Matrix Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> What I Can Teach
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(currentUser?.skillsTeach || ['Python']).map(s => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> What I Want to Learn
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(currentUser?.skillsLearn || ['UI/UX Design']).map(s => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Quick Filters:
          </span>
          <button
            onClick={() => setHighMatchOnly(!highMatchOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              highMatchOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            🔥 90%+ Super Matches
          </button>
          <button
            onClick={() => setSameCollegeOnly(!sameCollegeOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              sameCollegeOnly
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            🏫 Same University Only
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <strong>{filteredMatches.length}</strong> compatible students
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map(({ student, matchScore, matchedTeach, matchedLearn, isBilateral, matchExplanation }) => {
          // Identify offer/want recommendations for connect
          const offerSkill = matchedLearn[0] || currentUser?.skillsTeach?.[0] || 'Python';
          const wantSkill = matchedTeach[0] || student?.skillsTeach?.[0] || 'Photoshop';

          return (
            <div
              key={student._id}
              className={`rounded-3xl p-6 border transition shadow-xs hover:shadow-lg flex flex-col justify-between ${
                matchScore >= 90
                  ? 'bg-white dark:bg-slate-850 border-indigo-200 dark:border-indigo-900/60 ring-1 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header: Student photo, name, match score badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={student.name || 'Student'}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md"
                        referrerPolicy="no-referrer"
                      />
                      {isBilateral && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-slate-900" title="2-Way Bilateral Match!">
                          ⚡
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{student.name}</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {student.college} • {student.department}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{student.rating} Rating</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {student.completedExchanges} swaps completed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Percentage Badge */}
                  <div className="shrink-0 text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-black tracking-tight ${
                        matchScore >= 90
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{matchScore}% Match</span>
                    </div>
                    {isBilateral && (
                      <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase tracking-wider">
                        2-Way Trade
                      </div>
                    )}
                  </div>
                </div>

                {/* Explanation Banner */}
                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 mb-4 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <span>{matchExplanation}</span>
                </div>

                {/* Bilateral Comparison Row */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-20 shrink-0 font-bold text-slate-700 dark:text-slate-300">Can teach:</span>
                    <div className="flex flex-wrap gap-1">
                      {student.skillsTeach.map(s => {
                        const isMatch = currentUser.skillsLearn.some(
                          l => l.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(l.toLowerCase())
                        );
                        return (
                          <span
                            key={s}
                            className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                              isMatch
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {s} {isMatch && '✓'}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-20 shrink-0 font-bold text-slate-700 dark:text-slate-300">Wants to learn:</span>
                    <div className="flex flex-wrap gap-1">
                      {student.skillsLearn.map(s => {
                        const isMatch = currentUser.skillsTeach.some(
                          t => t.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(t.toLowerCase())
                        );
                        return (
                          <span
                            key={s}
                            className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                              isMatch
                                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold ring-1 ring-indigo-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {s} {isMatch && '★'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 italic">
                  "{student.bio}"
                </p>
              </div>

              {/* Connect Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onConnect(student, offerSkill, wantSkill)}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 active:scale-98 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Connect & Propose Swap</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
