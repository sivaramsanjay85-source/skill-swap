import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  ArrowLeftRight,
  Sparkles,
  GraduationCap,
  Award,
  DollarSign,
  Star,
  Users,
  Search,
  Filter,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Zap,
  Building2,
  BookOpen
} from 'lucide-react';
import {
  PLATFORM_ANALYTICS,
  TrendingSkill,
  CollegeAnalytics,
  CategoryDistribution
} from '../data/analyticsData';
import { ActivePage } from '../types';

interface AnalyticsPageProps {
  onNavigate: (page: ActivePage) => void;
  onExploreCategory?: (category: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onNavigate,
  onExploreCategory
}) => {
  const [selectedCampus, setSelectedCampus] = useState<string>('All Campuses');
  const [timeframe, setTimeframe] = useState<'All Time' | 'This Semester' | 'Past 30 Days'>('This Semester');
  const [searchSkill, setSearchSkill] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Multiplier for timeframe
  const timeMultiplier = useMemo(() => {
    if (timeframe === 'Past 30 Days') return 0.35;
    if (timeframe === 'This Semester') return 0.75;
    return 1;
  }, [timeframe]);

  // Filtered colleges
  const campuses = ['All Campuses', ...PLATFORM_ANALYTICS.collegeLeaderboard.map(c => c.collegeName)];

  // Campus-specific or aggregated stats
  const activeCollegeData = useMemo(() => {
    if (selectedCampus === 'All Campuses') return null;
    return PLATFORM_ANALYTICS.collegeLeaderboard.find(c => c.collegeName === selectedCampus) || null;
  }, [selectedCampus]);

  const totalSwaps = useMemo(() => {
    if (activeCollegeData) {
      return Math.round(activeCollegeData.totalSwaps * timeMultiplier);
    }
    return Math.round(PLATFORM_ANALYTICS.totalSkillsSwapped * timeMultiplier);
  }, [activeCollegeData, timeMultiplier]);

  const totalHours = useMemo(() => {
    if (activeCollegeData) {
      return Math.round(activeCollegeData.activeHours * timeMultiplier);
    }
    return Math.round(PLATFORM_ANALYTICS.totalActiveHours * timeMultiplier);
  }, [activeCollegeData, timeMultiplier]);

  const totalSavings = useMemo(() => {
    return Math.round(totalHours * 45); // $45/hour estimated private tutor rate
  }, [totalHours]);

  const filteredTrendingSkills = useMemo(() => {
    return PLATFORM_ANALYTICS.trendingSkills.filter(skill => {
      if (selectedCategoryFilter !== 'All' && skill.category !== selectedCategoryFilter) {
        return false;
      }
      if (searchSkill.trim()) {
        const q = searchSkill.toLowerCase();
        const matchesName = skill.name.toLowerCase().includes(q);
        const matchesCat = skill.category.toLowerCase().includes(q);
        const matchesCol = skill.topCollege.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesCol) return false;
      }
      return true;
    });
  }, [selectedCategoryFilter, searchSkill]);

  const categories = ['All', 'Programming', 'Design', 'Web Development', 'Video Editing', 'Languages', 'Communication', 'Music'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400">
              Campus Intelligence
            </span>
            <span className="text-xs text-slate-400">• Updated Daily</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            SkillSwap Analytics & Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time telemetry across college campuses: total skills swapped, peer learning hours logged, and high-demand student proficiencies.
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Campus Selector */}
          <div className="relative">
            <select
              value={selectedCampus}
              onChange={e => setSelectedCampus(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
            >
              {campuses.map(campus => (
                <option key={campus} value={campus}>
                  {campus}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold">
            {(['Past 30 Days', 'This Semester', 'All Time'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. KEY ANALYTIC METRICS (3 core pillars + impact metric) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Skills Swapped */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              {PLATFORM_ANALYTICS.swapsMonthOverMonth}
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {totalSwaps.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Total Skills Swapped
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {selectedCampus === 'All Campuses' ? 'Across 48 collegiate chapters' : `At ${selectedCampus}`}
          </p>
        </div>

        {/* Active Student Hours */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-teal-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
              <Zap className="w-3 h-3" /> Active
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {totalHours.toLocaleString()} hrs
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Active Student Hours
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Logged in peer workshops & code sessions
          </p>
        </div>

        {/* Student Tuition / Money Saved */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              100% Free Peer Trades
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            ${totalSavings.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Estimated Student Savings
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Calculated at standard $45/hr tutor rates
          </p>
        </div>

        {/* Peer Satisfaction / Bilateral Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group hover:border-indigo-500/50 transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Star className="w-5 h-5 fill-purple-500 text-purple-500" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              {PLATFORM_ANALYTICS.bilateralMatchRate} match rate
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            {PLATFORM_ANALYTICS.averageSessionRating} / 5.0
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Average Exchange Rating
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Based on post-session student reviews
          </p>
        </div>
      </div>

      {/* 2. TOP-TRENDING SKILLS AT COLLEGE TABLE & INSIGHTS */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                Top-Trending Skills at College
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Skills with the highest search volume, bilateral demand ratio, and exchange completions this semester.
            </p>
          </div>

          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search trending skills..."
                value={searchSkill}
                onChange={e => setSearchSkill(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trending Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-4">Skill & Focus Area</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Demand Meter</th>
                <th className="py-3 px-4">Growth Rate</th>
                <th className="py-3 px-4">Swaps Completed</th>
                <th className="py-3 px-4">Top Campus Hub</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredTrendingSkills.map(skill => (
                <tr
                  key={skill.rank}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                >
                  <td className="py-4 px-3 font-bold text-slate-900 dark:text-white">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-heading text-xs ${
                      skill.rank === 1
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 font-extrabold'
                        : skill.rank === 2
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-bold'
                        : skill.rank === 3
                        ? 'bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold'
                        : 'text-slate-400'
                    }`}>
                      #{skill.rank}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {skill.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Demand Ratio: <span className="font-semibold text-slate-700 dark:text-slate-300">{skill.ratio}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                      {skill.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 min-w-[140px]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{skill.demandScore}%</span>
                      <span className="text-slate-400 text-[10px]">Very High</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-indigo-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${skill.demandScore}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {skill.growthRate}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {skill.totalSwaps} swaps
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{skill.avgRating} rating</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[130px]">{skill.topCollege}</span>
                    </div>
                  </td>

                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => onNavigate('explore')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition inline-flex items-center gap-1"
                    >
                      <span>Find Peer</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. VISUAL CHARTS: CATEGORY DISTRIBUTION & PEAK STUDY HOURS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Weekly Study & Swap Hours Heat Distribution */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Weekly Student Study & Exchange Hours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Total hours students spent learning collaboratively across the week.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400">
              Peak: Weekend Sessions
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-56">
              {PLATFORM_ANALYTICS.weeklyActivity.map(item => {
                const maxHours = 1200;
                const heightPercent = Math.round((item.hours / maxHours) * 100);
                const isPeak = item.day === 'Sun' || item.day === 'Sat';

                return (
                  <div key={item.day} className="flex flex-col items-center h-full justify-end group">
                    {/* Tooltip / Hours badge */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 mb-1.5 whitespace-nowrap">
                      {item.hours}h
                    </div>

                    {/* Bar Pill */}
                    <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-xl transition-all duration-500 ${
                          isPeak
                            ? 'bg-linear-to-t from-indigo-600 to-teal-400 group-hover:brightness-110 shadow-sm shadow-indigo-500/20'
                            : 'bg-indigo-400 dark:bg-indigo-500/70 group-hover:bg-indigo-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <div className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {item.day}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.swaps} swaps
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              <span><strong>Insight:</strong> Students report 40% higher learning retention during 1-on-1 weekend sessions compared to solo studying.</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Category Share & Demand */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Skills by Category Share
              </h3>
              <span className="text-xs text-slate-400">3,482 Swaps</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of peer trades by academic & creative subject area.
            </p>

            {/* Category Bars */}
            <div className="space-y-3.5 mt-5">
              {PLATFORM_ANALYTICS.categoryBreakdown.map(cat => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.category}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold">
                      {cat.percentage}% ({cat.hours}h)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage * 2.5}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('matching')}
            className="w-full mt-4 py-3 rounded-2xl bg-linear-to-r from-indigo-600 to-teal-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Find a Bilateral Match in Any Category</span>
          </button>
        </div>
      </div>

      {/* 4. CAMPUS LEADERBOARD: TOP EXCHANGE HUBS */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Top Skill-Exchanging Campuses
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Universities with the most active peer mentorship hours this academic year.
            </p>
          </div>

          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900">
            UC Berkeley is leading this month!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORM_ANALYTICS.collegeLeaderboard.map((col, idx) => (
            <div
              key={col.collegeName}
              className={`p-5 rounded-2xl border transition ${
                selectedCampus === col.collegeName
                  ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">#{idx + 1} Campus</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  {col.badge}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {col.collegeName}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Primary Specialty: <strong className="text-slate-700 dark:text-slate-300">{col.topCategory}</strong>
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-center">
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {col.totalSwaps}
                  </div>
                  <div className="text-[10px] text-slate-400">Swaps</div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    {col.activeHours}h
                  </div>
                  <div className="text-[10px] text-slate-400">Hours</div>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {col.activeStudents}
                  </div>
                  <div className="text-[10px] text-slate-400">Students</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
