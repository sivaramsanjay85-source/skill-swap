import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  ExternalLink,
  Plus,
  Share2,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Check
} from 'lucide-react';
import { StudyRoadmap, RoadmapWeek, User, ActivePage } from '../types';
import { INITIAL_ROADMAPS } from '../data/advancedData';

interface RoadmapsPageProps {
  currentUser?: User | null;
  onNavigate: (page: ActivePage) => void;
  onProposeSwap: (targetSkill1: string, targetSkill2: string) => void;
}

export const RoadmapsPage: React.FC<RoadmapsPageProps> = ({
  currentUser,
  onNavigate,
  onProposeSwap
}) => {
  const [roadmaps, setRoadmaps] = useState<StudyRoadmap[]>(INITIAL_ROADMAPS);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(roadmaps[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: number]: boolean }>({ 1: true, 2: true });

  // Custom syllabus creator modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSkill1, setCustomSkill1] = useState(currentUser?.skillsTeach[0] || 'Python');
  const [customSkill2, setCustomSkill2] = useState(currentUser?.skillsLearn[0] || 'UI/UX Design');
  const [customWeeksCount, setCustomWeeksCount] = useState<number>(3);
  const [customDescription, setCustomDescription] = useState('');

  // Export notification
  const [exportedNotice, setExportedNotice] = useState(false);

  const activeRoadmap = roadmaps.find(r => r.id === selectedRoadmapId) || roadmaps[0];

  const categories = ['All', 'Programming & Design', 'Web Development & Media', 'Academics & Communication', 'Languages & Academics'];

  const filteredRoadmaps = selectedCategory === 'All'
    ? roadmaps
    : roadmaps.filter(r => r.category === selectedCategory);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const handleToggleWeekCompletion = (roadmapId: string, weekNum: number) => {
    setRoadmaps(prev =>
      prev.map(r => {
        if (r.id !== roadmapId) return r;
        const updatedWeeks = r.weeks.map(w =>
          w.week === weekNum ? { ...w, completed: !w.completed } : w
        );
        return { ...r, weeks: updatedWeeks };
      })
    );
  };

  const handleExportMarkdown = () => {
    let md = `# ${activeRoadmap.title}\n`;
    md += `**Bilateral Skill Swap Syllabus**\n`;
    md += `*Level: ${activeRoadmap.level} | Duration: ${activeRoadmap.durationWeeks} Weeks | Curated by: ${activeRoadmap.curatedBy}*\n\n`;
    md += `## Overview\n${activeRoadmap.description}\n\n`;
    md += `## Exchanged Skills\n- **Skill 1**: ${activeRoadmap.skill1}\n- **Skill 2**: ${activeRoadmap.skill2}\n\n`;
    md += `## Weekly Schedule & Deliverables\n\n`;

    activeRoadmap.weeks.forEach(w => {
      md += `### ${w.title}\n`;
      md += `- **${activeRoadmap.skill1} Focus**: ${w.skill1Focus}\n`;
      md += `- **${activeRoadmap.skill2} Focus**: ${w.skill2Focus}\n`;
      md += `#### Objectives:\n`;
      w.objectives.forEach(obj => {
        md += `  - [${w.completed ? 'x' : ' '}] ${obj}\n`;
      });
      md += `#### Key Deliverables:\n`;
      w.deliverables.forEach(del => {
        md += `  - 📦 ${del}\n`;
      });
      md += `\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeRoadmap.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-syllabus.md`;
    a.click();
    URL.revokeObjectURL(url);

    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 2500);
  };

  const handleCreateCustomSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newWeeks: RoadmapWeek[] = Array.from({ length: customWeeksCount }, (_, i) => ({
      week: i + 1,
      title: `Week ${i + 1}: Collaborative Milestones`,
      skill1Focus: `Phase ${i + 1} fundamentals of ${customSkill1}`,
      skill2Focus: `Phase ${i + 1} practical application of ${customSkill2}`,
      objectives: [
        `Complete bilateral 60-min peer teaching session`,
        `Complete practice exercise for ${customSkill1}`,
        `Review progress for ${customSkill2}`
      ],
      deliverables: [
        `Weekly project artifact or exercise submission`,
        `Peer reflection notes`
      ],
      completed: false
    }));

    const newRoadmap: StudyRoadmap = {
      id: `rdmp-custom-${Date.now()}`,
      title: customTitle,
      category: 'Custom Student Exchange',
      skill1: customSkill1,
      skill2: customSkill2,
      durationWeeks: customWeeksCount,
      level: 'Intermediate',
      description: customDescription || `A customized ${customWeeksCount}-week skill exchange between ${customSkill1} and ${customSkill2}.`,
      popularPartnerCampuses: [currentUser?.college || 'University Campus'],
      weeks: newWeeks,
      curatedBy: `${currentUser?.name || 'Student'} (Custom Syllabus)`,
      isCustom: true
    };

    setRoadmaps([newRoadmap, ...roadmaps]);
    setSelectedRoadmapId(newRoadmap.id);
    setIsCreateModalOpen(false);
    setCustomTitle('');
    setCustomDescription('');
  };

  const completedWeeks = activeRoadmap.weeks.filter(w => w.completed).length;
  const progressPercent = Math.round((completedWeeks / activeRoadmap.weeks.length) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-900 via-slate-900 to-teal-950 text-white p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Structured Campus Syllabi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Exchange Syllabi & Study Roadmaps
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Never wonder what to teach next. Follow tested 3-to-4 week bilateral curricula designed by top student mentors, complete with weekly objectives, mutual deliverables, and milestone checklists.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
            >
              <Plus className="w-4 h-4" /> Build Custom Syllabus
            </button>
            <button
              onClick={() => onNavigate('matching')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-xs border border-white/20 transition"
            >
              <Sparkles className="w-4 h-4 text-teal-400" /> Find Match for Roadmap
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Layout: Left Syllabus Selector, Right Interactive Curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Roadmap List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Curated Bilateral Tracks ({filteredRoadmaps.length})
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Custom
            </button>
          </div>

          <div className="space-y-3">
            {filteredRoadmaps.map(roadmap => {
              const isSelected = roadmap.id === activeRoadmap.id;
              const rCompletedWeeks = roadmap.weeks.filter(w => w.completed).length;
              const rPercent = Math.round((rCompletedWeeks / roadmap.weeks.length) * 100);

              return (
                <div
                  key={roadmap.id}
                  onClick={() => setSelectedRoadmapId(roadmap.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {roadmap.category}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {roadmap.durationWeeks} Weeks
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {roadmap.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {roadmap.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{roadmap.level}</span>
                    </span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {rPercent}% Completed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Roadmap View */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                    {activeRoadmap.category}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Curated by {activeRoadmap.curatedBy}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {activeRoadmap.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                  title="Download Markdown Syllabus"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => onProposeSwap(activeRoadmap.skill1, activeRoadmap.skill2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Swap with this Syllabus</span>
                </button>
              </div>
            </div>

            {exportedNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Syllabus markdown file downloaded successfully! Share it with your study partner.</span>
              </div>
            )}

            {/* Description & Skill Pairs */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeRoadmap.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  Track 1 (You Teach)
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeRoadmap.skill1}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Core fundamentals, exercises & review sessions
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Track 2 (You Learn)
                </span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  {activeRoadmap.skill2}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Hands-on workflows, design systems & practice
                </p>
              </div>
            </div>

            {/* Overall Progress Meter */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Curriculum Progress</span>
                <span className="text-indigo-600 dark:text-indigo-400">{completedWeeks} of {activeRoadmap.weeks.length} Weeks Completed ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-indigo-600 to-teal-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Weeks Accordion */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Week-by-Week Milestone Breakdown</span>
              </h3>

              {activeRoadmap.weeks.map(week => {
                const isExpanded = expandedWeeks[week.week] ?? false;

                return (
                  <div
                    key={week.week}
                    className={`rounded-2xl border transition-all ${
                      week.completed
                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850'
                    }`}
                  >
                    {/* Week Header */}
                    <div
                      onClick={() => toggleWeek(week.week)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleWeekCompletion(activeRoadmap.id, week.week);
                          }}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                            week.completed
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                          }`}
                        >
                          {week.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                              Week {week.week}
                            </span>
                            {week.completed && (
                              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                                Completed
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {week.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-400">
                        <span className="text-xs hidden sm:block">
                          {week.objectives.length} objectives · {week.deliverables.length} deliverables
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Week Expanded Body */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                        {/* Dual Focus */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-1">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {activeRoadmap.skill1}:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300">
                              {week.skill1Focus}
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 space-y-1">
                            <span className="font-bold text-teal-600 dark:text-teal-400">
                              {activeRoadmap.skill2}:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300">
                              {week.skill2Focus}
                            </p>
                          </div>
                        </div>

                        {/* Objectives List */}
                        <div className="space-y-2">
                          <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
                            Weekly Learning Objectives:
                          </span>
                          <ul className="space-y-1.5">
                            {week.objectives.map((obj, i) => (
                              <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Deliverables */}
                        <div className="space-y-2">
                          <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10px]">
                            Proof of Work Deliverables:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {week.deliverables.map((del, i) => (
                              <div
                                key={i}
                                className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/40 font-medium flex items-center gap-1.5"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>{del}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Syllabus Creator Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                Build a Custom Swap Syllabus
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design a custom multi-week learning journey with your exchange partner.
              </p>
            </div>

            <form onSubmit={handleCreateCustomSyllabus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Syllabus Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js App Router ⇄ Figma Design System Sprint"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skill You Teach
                  </label>
                  <input
                    type="text"
                    required
                    value={customSkill1}
                    onChange={e => setCustomSkill1(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Skill You Learn
                  </label>
                  <input
                    type="text"
                    required
                    value={customSkill2}
                    onChange={e => setCustomSkill2(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Weeks)
                  </label>
                  <select
                    value={customWeeksCount}
                    onChange={e => setCustomWeeksCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={2}>2 Weeks (Fast Sprint)</option>
                    <option value={3}>3 Weeks (Standard)</option>
                    <option value={4}>4 Weeks (Deep Dive)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Experience Level
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Beginner Friendly</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Exchange Goals & Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key objectives and what you hope to build together..."
                  value={customDescription}
                  onChange={e => setCustomDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition"
                >
                  Create & Save Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
