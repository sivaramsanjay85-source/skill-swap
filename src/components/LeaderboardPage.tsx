import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Star,
  Target,
  Award,
  Crown,
  Medal,
  Sparkles,
  TrendingUp,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { User, Badge, ActivePage } from '../types';

interface LeaderboardPageProps {
  currentUser?: User | null;
  leaderboard: (User & { rank: number })[];
  badges: Badge[];
  onSelectUser: (user: User) => void;
  onNavigate: (page: ActivePage) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  currentUser,
  leaderboard,
  badges,
  onSelectUser,
  onNavigate
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const topThree = leaderboard.slice(0, 3);
  const restLeaderboard = leaderboard.filter(u => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.college.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
  });

  const currentUserRank = leaderboard.find(u => u._id === currentUser?._id)?.rank || 4;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
          <Trophy className="w-3.5 h-3.5" />
          <span>Campus Skill Champions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
          Student Leaderboard & Badges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Earn XP points by teaching skills, completing verified exchanges, and receiving stellar peer reviews.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">
          {/* 2nd Place: Silver */}
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-md text-center flex flex-col items-center relative transition hover:-translate-y-1">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-extrabold flex items-center justify-center text-sm shadow-md border-2 border-white dark:border-slate-900">
              2
            </div>
            <img
              src={topThree[1]?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt={topThree[1]?.name || 'Student'}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-300 dark:ring-slate-700 shadow-lg mt-2"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">{topThree[1]?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{topThree[1]?.college}</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
              {topThree[1]?.xp} XP
            </div>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
              <div>⭐ {topThree[1]?.rating} Rating</div>
              <div>{topThree[1]?.completedExchanges} completed swaps</div>
            </div>
          </div>

          {/* 1st Place: Gold Champion */}
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-linear-to-b from-amber-500/10 via-indigo-500/5 to-white dark:to-slate-850 border-2 border-amber-400/50 shadow-xl text-center flex flex-col items-center relative transition hover:-translate-y-2 -mt-4">
            <div className="absolute -top-5 w-11 h-11 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-base shadow-lg border-2 border-white dark:border-slate-900">
              <Crown className="w-5 h-5 fill-slate-950" />
            </div>
            <img
              src={topThree[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={topThree[0]?.name || 'Student'}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-400 shadow-xl mt-2"
              referrerPolicy="no-referrer"
            />
            <div className="mt-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Campus #1 Mentor
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{topThree[0]?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{topThree[0]?.college}</p>
            <div className="mt-3 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-sm shadow-md">
              {topThree[0]?.xp} XP
            </div>
            <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 space-y-1 font-semibold">
              <div>⭐ {topThree[0]?.rating} Rating ({topThree[0]?.ratingCount} reviews)</div>
              <div>{topThree[0]?.completedExchanges} verified exchanges</div>
            </div>
          </div>

          {/* 3rd Place: Bronze */}
          <div className="order-3 p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-md text-center flex flex-col items-center relative transition hover:-translate-y-1">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-700/80 text-white font-extrabold flex items-center justify-center text-sm shadow-md border-2 border-white dark:border-slate-900">
              3
            </div>
            <img
              src={topThree[2]?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt={topThree[2]?.name || 'Student'}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-700/50 shadow-lg mt-2"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">{topThree[2].name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{topThree[2].college}</p>
            <div className="mt-3 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
              {topThree[2].xp} XP
            </div>
            <div className="mt-3 text-xs text-slate-500 space-y-1">
              <div>⭐ {topThree[2].rating} Rating</div>
              <div>{topThree[2].completedExchanges} completed swaps</div>
            </div>
          </div>
        </div>
      )}

      {/* Badges Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Gamified Achievement Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(badge => {
            const hasBadge = currentUser.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition flex items-start gap-4 ${
                  hasBadge
                    ? 'bg-white dark:bg-slate-850 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                  {badge.icon}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{badge.name}</h4>
                    {hasBadge && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                  <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                    Requirement: {badge.criteria}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">All Ranked Students</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Updated in real-time as sessions conclude.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Filter by name or college..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Rank</th>
                <th className="pb-3 px-3">Student</th>
                <th className="pb-3 px-3">University</th>
                <th className="pb-3 px-3 text-center">Completed Swaps</th>
                <th className="pb-3 px-3 text-center">Rating</th>
                <th className="pb-3 px-3 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {restLeaderboard.map(student => {
                const isCurrent = student._id === currentUser._id;
                return (
                  <tr
                    key={student._id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer ${
                      isCurrent ? 'bg-indigo-50/60 dark:bg-indigo-950/30 font-semibold' : ''
                    }`}
                    onClick={() => onSelectUser(student)}
                  >
                    <td className="py-3.5 px-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        student.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : student.rank === 2
                          ? 'bg-slate-300 text-slate-900'
                          : student.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'text-slate-500'
                      }`}>
                        {student.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={student.name || 'Student'}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{student.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[9px] font-bold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{student.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">{student.college}</td>
                    <td className="py-3.5 px-3 text-center text-slate-700 dark:text-slate-300">{student.completedExchanges}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{student.rating}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xs">
                        {student.xp} XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
