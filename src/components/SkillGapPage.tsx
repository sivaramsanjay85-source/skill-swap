import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Compass,
  Star,
  Zap,
  ArrowLeftRight
} from 'lucide-react';
import { CareerRoleBenchmark, User, ActivePage, SkillItem } from '../types';
import { CAREER_BENCHMARKS } from '../data/advancedData';

interface SkillGapPageProps {
  currentUser?: User | null;
  skills: SkillItem[];
  onNavigate: (page: ActivePage) => void;
  onProposeSwap: (targetUser: User, offerSkill: string, wantSkill: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({
  currentUser,
  skills,
  onNavigate,
  onProposeSwap
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(CAREER_BENCHMARKS[0].id);

  const activeRole = CAREER_BENCHMARKS.find(r => r.id === selectedRoleId) || CAREER_BENCHMARKS[0];

  const userTeach = currentUser?.skillsTeach || ['Python', 'SQL'];
  const userLearn = currentUser?.skillsLearn || ['UI/UX Design', 'Photoshop'];

  // Check matching status for each required skill
  const skillAnalysis = activeRole.requiredSkills.map(req => {
    const isMastered = userTeach.some(t =>
      t.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(t.toLowerCase())
    );
    const isInProgress = !isMastered && userLearn.some(l =>
      l.toLowerCase().includes(req.name.toLowerCase()) || req.name.toLowerCase().includes(l.toLowerCase())
    );
    const isMissing = !isMastered && !isInProgress;

    // Find peer students teaching this missing or in-progress skill
    const matchingPeerSkills = skills.filter(s =>
      s.name.toLowerCase().includes(req.name.toLowerCase()) ||
      req.name.toLowerCase().includes(s.name.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(req.name.toLowerCase()))
    );

    return {
      ...req,
      isMastered,
      isInProgress,
      isMissing,
      matchingPeerSkills
    };
  });

  const totalRequired = activeRole.requiredSkills.length;
  const masteredCount = skillAnalysis.filter(s => s.isMastered).length;
  const inProgressCount = skillAnalysis.filter(s => s.isInProgress).length;
  const missingCount = skillAnalysis.filter(s => s.isMissing).length;

  // Weighted readiness score calculation
  const rawScore = (masteredCount * 1.0 + inProgressCount * 0.5) / totalRequired;
  const readinessPercent = Math.min(100, Math.round(rawScore * 100));

  const getScoreVerdict = (score: number) => {
    if (score >= 80) return { label: 'High Career Readiness', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    if (score >= 50) return { label: 'Moderate Readiness — Bridge 1-2 Gaps', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' };
    return { label: 'Foundational Phase — Great Swap Opportunity', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
  };

  const verdict = getScoreVerdict(readinessPercent);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>Career Diagnostic & Skill Mapping</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Career Skill Gap Analyzer
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Select your dream job or internship role. We calculate your career readiness score, pinpoint critical missing competencies, and immediately connect you with verified peers on campus who can teach you those exact skills.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('matching')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition"
            >
              <Sparkles className="w-4 h-4" /> Go to Smart Matching
            </button>
            <button
              onClick={() => onNavigate('roadmaps')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-xs border border-white/20 transition"
            >
              <BookOpen className="w-4 h-4 text-purple-400" /> View Bilateral Roadmaps
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Target Role Selector Chips */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Your Target Career Path:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CAREER_BENCHMARKS.map(role => {
            const isSelected = role.id === selectedRoleId;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-2xl mb-2">{role.icon}</div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {role.roleName}
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Avg {role.averageSalary}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Readiness Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card: Score Summary & Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Diagnostic Assessment
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-heading">
                {activeRole.roleName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {activeRole.description}
              </p>
            </div>

            {/* Radial Score Gauge Mock */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-linear-to-b from-purple-500/5 to-indigo-500/5 border border-purple-100 dark:border-purple-900/50 space-y-2">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-200 dark:stroke-slate-800 fill-none stroke-[8]"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-purple-600 dark:stroke-purple-400 fill-none stroke-[8] transition-all duration-1000 ease-out"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * readinessPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
                    {readinessPercent}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                    Readiness
                  </span>
                </div>
              </div>

              <div className={`mt-2 p-2.5 rounded-xl border text-center text-xs font-bold ${verdict.bg} ${verdict.color}`}>
                {verdict.label}
              </div>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {masteredCount}
                </span>
                <span className="text-[10px] block font-semibold text-slate-500 dark:text-slate-400">
                  Mastered
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                  {inProgressCount}
                </span>
                <span className="text-[10px] block font-semibold text-slate-500 dark:text-slate-400">
                  In Progress
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                  {missingCount}
                </span>
                <span className="text-[10px] block font-semibold text-slate-500 dark:text-slate-400">
                  Gap Skills
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>National Entry Salary:</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                {activeRole.averageSalary}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Skill Matrix & One-Click Peer Recommendations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Skill Matrix & Campus Mentor Matches</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Review your current competencies against benchmark expectations. Click any campus peer to propose a swap!
              </p>
            </div>

            {/* Skill rows */}
            <div className="space-y-4">
              {skillAnalysis.map((skill, index) => {
                const statusBadge = skill.isMastered ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mastered (You Teach)</span>
                  </span>
                ) : skill.isInProgress ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                    <span>In Progress (Learning)</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Missing Critical Gap</span>
                  </span>
                );

                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {skill.importance}
                        </span>
                      </div>
                      {statusBadge}
                    </div>

                    {/* Mentors available for this skill */}
                    {skill.isMissing || skill.isInProgress ? (
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          Campus Peers Teaching {skill.name}:
                        </span>

                        {skill.matchingPeerSkills.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {skill.matchingPeerSkills.slice(0, 2).map(peerSkill => {
                              const peerUser: User = {
                                _id: peerSkill.userId,
                                name: peerSkill.userName,
                                email: `${peerSkill.userName.toLowerCase().replace(/\s+/g, '')}@stanford.edu`,
                                college: peerSkill.userCollege,
                                department: 'Campus Peer',
                                bio: peerSkill.description,
                                avatar: peerSkill.userAvatar,
                                skillsTeach: [peerSkill.name],
                                skillsLearn: userTeach.slice(0, 2),
                                rating: peerSkill.rating,
                                ratingCount: peerSkill.ratingCount,
                                xp: 850,
                                badges: ['top-mentor'],
                                availability: 'Weekends & Evenings',
                                completedExchanges: peerSkill.completedSwaps,
                                createdAt: new Date().toISOString()
                              };

                              return (
                                <div
                                  key={peerSkill._id}
                                  className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <img
                                      src={peerSkill.userAvatar}
                                      alt={peerSkill.userName}
                                      className="w-9 h-9 rounded-xl object-cover shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="min-w-0">
                                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {peerSkill.userName}
                                      </h4>
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                        {peerSkill.userCollege}
                                      </p>
                                      <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                        <Star className="w-3 h-3 fill-amber-500" />
                                        <span>{peerSkill.rating}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => onProposeSwap(peerUser, userTeach[0] || 'Python', peerSkill.name)}
                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shrink-0 shadow-xs transition flex items-center gap-1"
                                  >
                                    <ArrowLeftRight className="w-3 h-3" />
                                    <span>Swap</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                            <span>No immediate matches online for {skill.name}.</span>
                            <button
                              onClick={() => onNavigate('matching')}
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <span>Run Smart Match</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                        ✓ You already teach this competency! You can offer this skill to other students in exchange for your target gaps.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
