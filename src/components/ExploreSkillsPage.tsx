import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  Plus,
  ArrowLeftRight,
  Sparkles,
  BookOpen,
  Code,
  Palette,
  Video,
  Camera,
  MessageSquare,
  Globe2,
  Music,
  GraduationCap,
  Briefcase,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { SkillItem, SkillCategory, ExperienceLevel, User } from '../types';

interface ExploreSkillsPageProps {
  skills: SkillItem[];
  currentUser?: User | null;
  onProposeSwap: (skill: SkillItem) => void;
  onAddSkill: (newSkill: {
    name: string;
    category: SkillCategory;
    level: ExperienceLevel;
    description: string;
    tags: string[];
  }) => void;
}

const CATEGORIES: { id: SkillCategory | 'All'; label: string; icon: React.ReactNode }[] = [
  { id: 'All', label: 'All Skills', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'Programming', label: 'Programming', icon: <Code className="w-3.5 h-3.5" /> },
  { id: 'Web Development', label: 'Web Development', icon: <Globe2 className="w-3.5 h-3.5" /> },
  { id: 'Design', label: 'Design', icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'Video Editing', label: 'Video Editing', icon: <Video className="w-3.5 h-3.5" /> },
  { id: 'Photography', label: 'Photography', icon: <Camera className="w-3.5 h-3.5" /> },
  { id: 'Communication', label: 'Communication', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'Languages', label: 'Languages', icon: <Globe2 className="w-3.5 h-3.5" /> },
  { id: 'Music', label: 'Music', icon: <Music className="w-3.5 h-3.5" /> },
  { id: 'Academics', label: 'Academics', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { id: 'Business', label: 'Business', icon: <Briefcase className="w-3.5 h-3.5" /> },
];

export const ExploreSkillsPage: React.FC<ExploreSkillsPageProps> = ({
  skills,
  currentUser,
  onProposeSwap,
  onAddSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel | 'All'>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'swaps' | 'newest'>('rating');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Programming');
  const [newLevel, setNewLevel] = useState<ExperienceLevel>('Intermediate');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('');

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      // Category filter
      if (selectedCategory !== 'All' && skill.category !== selectedCategory) {
        return false;
      }
      // Experience level filter
      if (selectedLevel !== 'All' && skill.level !== selectedLevel) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && skill.rating < minRating) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = skill.name.toLowerCase().includes(q);
        const matchesDesc = skill.description.toLowerCase().includes(q);
        const matchesUser = skill.userName.toLowerCase().includes(q);
        const matchesCollege = skill.userCollege.toLowerCase().includes(q);
        const matchesTags = skill.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesUser && !matchesCollege && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'swaps') return b.completedSwaps - a.completedSwaps;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [skills, selectedCategory, selectedLevel, minRating, searchQuery, sortBy]);

  const handleCreateSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    onAddSkill({
      name: newSkillName,
      category: newCategory,
      level: newLevel,
      description: newDesc || `Ready to teach ${newSkillName} to fellow students!`,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setIsAddModalOpen(false);
    setNewSkillName('');
    setNewDesc('');
    setNewTags('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <BookOpen className="w-3.5 h-3.5" /> Peer Skill Marketplace
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Explore Skills
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover {skills.length} skills offered by fellow college students. Request a swap anytime.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-98 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Teach a New Skill
        </button>
      </div>

      {/* Search & Main Filter Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search skills, software, topics, or mentors (e.g. Photoshop, Python, Figma)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner Level</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced Level</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="md:col-span-2">
            <select
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>⭐ 4.5+ Stars</option>
              <option value={4.8}>⭐ 4.8+ Top Rated</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="rating">Sort: Highest Rating</option>
              <option value="swaps">Sort: Most Swaps</option>
              <option value="newest">Sort: Newly Listed</option>
            </select>
          </div>
        </div>

        {/* 10 Categories Pill Carousel / Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Showing <strong>{filteredSkills.length}</strong> available skills</span>
        {(selectedCategory !== 'All' || selectedLevel !== 'All' || minRating > 0 || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
              setMinRating(0);
              setSearchQuery('');
            }}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Skill Cards Grid */}
      {filteredSkills.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-850/50 border border-dashed border-slate-300 dark:border-slate-800">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching skills found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or select "All Skills" to see everything offered by students.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
              setMinRating(0);
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => (
            <div
              key={skill._id}
              className="group rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg hover:border-indigo-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                    {skill.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    skill.level === 'Advanced'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                      : skill.level === 'Intermediate'
                      ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {skill.level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-1">
                  {skill.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {skill.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {skill.tags.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={skill.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={skill.userName || 'Student'}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{skill.userName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{skill.userCollege}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {skill.completedSwaps} exchanges completed
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{skill.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  onClick={() => onProposeSwap(skill)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-600 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-98 shadow-2xs"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Request Exchange
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Teach a Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Offer a Skill to Teach</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Share your expertise with campus peers</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSkillSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Skill Title
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  placeholder="e.g. Modern UI/UX Design with Figma"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as SkillCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    {CATEGORIES.filter(c => c.id !== 'All').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={newLevel}
                    onChange={e => setNewLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Description & What You Will Teach
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Explain what topics or projects you can guide another student through..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="e.g. Figma, UI, Wireframing, Web"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 active:scale-98 transition"
                >
                  Publish Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
