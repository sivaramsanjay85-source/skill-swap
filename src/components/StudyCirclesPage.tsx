import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Video,
  Plus,
  MessageSquare,
  ThumbsUp,
  Share2,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  Tag,
  ArrowRight,
  Send
} from 'lucide-react';
import { StudyCircle, CircleDiscussionPost, User, ActivePage } from '../types';
import { INITIAL_CIRCLES } from '../data/advancedData';

interface StudyCirclesPageProps {
  currentUser?: User | null;
  onNavigate: (page: ActivePage) => void;
}

export const StudyCirclesPage: React.FC<StudyCirclesPageProps> = ({
  currentUser,
  onNavigate
}) => {
  const [circles, setCircles] = useState<StudyCircle[]>(INITIAL_CIRCLES);
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCircleId, setActiveCircleId] = useState<string>(circles[0].id);

  // New post in circle discussion
  const [discussionInput, setDiscussionInput] = useState<string>('');
  const [discussionTag, setDiscussionTag] = useState<string>('Discussion');

  // Create circle modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCampus, setNewCampus] = useState(currentUser?.college || 'Stanford University');
  const [newSchedule, setNewSchedule] = useState('Wednesdays, 5:00 PM - 6:30 PM');
  const [newLocation, setNewLocation] = useState('Campus Student Center or Google Meet');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('Python, OpenSource, GroupStudy');

  const campuses = ['All', 'Stanford University', 'UC Berkeley', 'UT Austin', 'New York University', 'Columbia University'];

  const filteredCircles = circles.filter(c => {
    const matchCampus = selectedCampus === 'All' || c.campus === selectedCampus;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCampus && matchSearch;
  });

  const activeCircle = circles.find(c => c.id === activeCircleId) || circles[0];

  const handleToggleJoinCircle = (circleId: string) => {
    setCircles(prev =>
      prev.map(c => {
        if (c.id !== circleId) return c;
        const nextJoined = !c.isJoined;
        return {
          ...c,
          isJoined: nextJoined,
          membersCount: nextJoined ? c.membersCount + 1 : c.membersCount - 1
        };
      })
    );
  };

  const handleAddDiscussionPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;

    const newPost: CircleDiscussionPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser?._id || 'usr-guest',
      authorName: currentUser?.name || 'College Student',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      authorCollege: currentUser?.college || 'University Campus',
      timestamp: 'Just now',
      content: discussionInput.trim(),
      likes: 0,
      repliesCount: 0,
      tag: discussionTag
    };

    setCircles(prev =>
      prev.map(c => {
        if (c.id !== activeCircle.id) return c;
        return {
          ...c,
          discussion: [newPost, ...c.discussion]
        };
      })
    );

    setDiscussionInput('');
  };

  const handleLikePost = (postId: string) => {
    setCircles(prev =>
      prev.map(c => {
        if (c.id !== activeCircle.id) return c;
        return {
          ...c,
          discussion: c.discussion.map(p =>
            p.id === postId ? { ...p, likes: p.likes + 1 } : p
          )
        };
      })
    );
  };

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdCircle: StudyCircle = {
      id: `circle-${Date.now()}`,
      title: newTitle,
      campus: newCampus,
      subject: newSubject || 'Collaborative Study',
      description: newDescription || 'A peer learning group for campus students to collaborate on projects.',
      schedule: newSchedule,
      nextSessionDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      nextSessionTime: '5:00 PM',
      meetingLink: 'https://meet.google.com/campus-peer-circle',
      meetingLocation: newLocation,
      hostName: currentUser?.name || 'Alex Chen',
      hostAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      hostRole: 'Student Peer Host',
      membersCount: 1,
      isJoined: true,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      discussion: [
        {
          id: `post-init-${Date.now()}`,
          authorId: currentUser?._id || 'usr-init',
          authorName: currentUser?.name || 'Alex Chen',
          authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          authorCollege: newCampus,
          timestamp: 'Just now',
          content: `Welcome to ${newTitle}! Post here to introduce yourself or share what you hope to work on together.`,
          likes: 1,
          repliesCount: 0,
          tag: 'Welcome'
        }
      ]
    };

    setCircles([createdCircle, ...circles]);
    setActiveCircleId(createdCircle.id);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Campus Co-Learning Groups</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Campus Study Circles & Peer Labs
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Take skill swapping beyond 1-on-1. Join weekly subject labs, hackathon prep groups, portfolio roasts, and language tables hosted by student mentors on your campus.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/30 transition"
            >
              <Plus className="w-4 h-4" /> Host New Campus Circle
            </button>
            <button
              onClick={() => onNavigate('roadmaps')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-xs border border-white/20 transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" /> Explore Study Roadmaps
            </button>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Campus Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {campuses.map(campus => (
            <button
              key={campus}
              onClick={() => setSelectedCampus(campus)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCampus === campus
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-teal-400'
              }`}
            >
              {campus}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circles by topic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Main Grid: Left Circle Directory, Right Active Circle Hub & Forum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Circles Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Campus Labs ({filteredCircles.length})
            </h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Create
            </button>
          </div>

          <div className="space-y-3.5">
            {filteredCircles.map(circle => {
              const isSelected = circle.id === activeCircle.id;

              return (
                <div
                  key={circle.id}
                  onClick={() => setActiveCircleId(circle.id)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-teal-50/60 dark:bg-teal-950/30 border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                      {circle.campus}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {circle.membersCount} members
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {circle.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {circle.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {circle.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{circle.schedule}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleJoinCircle(circle.id);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        circle.isJoined
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-teal-600 hover:bg-teal-500 text-white'
                      }`}
                    >
                      {circle.isJoined ? '✓ Joined' : 'RSVP / Join'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Circle Details & Community Forum */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Circle Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                    {activeCircle.campus}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activeCircle.membersCount} Active Students
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                  {activeCircle.title}
                </h2>
              </div>

              <button
                onClick={() => handleToggleJoinCircle(activeCircle.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shrink-0 shadow-xs ${
                  activeCircle.isJoined
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                {activeCircle.isJoined ? '✓ You Are Attending' : 'RSVP & Join Circle'}
              </button>
            </div>

            {/* Next Session Details Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  <Clock className="w-3.5 h-3.5" /> Next Lab Session
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeCircle.nextSessionDate} at {activeCircle.nextSessionTime}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeCircle.schedule}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  <MapPin className="w-3.5 h-3.5" /> Venue / Room
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeCircle.meetingLocation}
                </p>
                <a
                  href={activeCircle.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Video className="w-3 h-3" /> Open Video Room Link
                </a>
              </div>
            </div>

            {/* Host info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeCircle.hostAvatar}
                  alt={activeCircle.hostName}
                  className="w-11 h-11 rounded-xl object-cover ring-2 ring-teal-500/20 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Facilitated by {activeCircle.hostName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeCircle.hostRole}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('chat')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Message Host
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                About this Peer Lab
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeCircle.description}
              </p>
            </div>

            {/* Discussion & Resource Forum */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Circle Discussion & Shared Resources</span>
              </h3>

              {/* New Post Form */}
              <form onSubmit={handleAddDiscussionPost} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Category:</span>
                  {['Discussion', 'Resource Share', 'Question', 'Announcement'].map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setDiscussionTag(tag)}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition ${
                        discussionTag === tag
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Ask a question or share a link with the ${activeCircle.title} group...`}
                    value={discussionInput}
                    onChange={e => setDiscussionInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              {/* Discussion Thread */}
              <div className="space-y-3 pt-2">
                {activeCircle.discussion.map(post => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-7 h-7 rounded-lg object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {post.authorName}
                            </span>
                            <span className="text-[10px] text-slate-400">• {post.authorCollege}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                        </div>
                      </div>

                      {post.tag && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300">
                          {post.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likes} Helpful</span>
                      </button>
                      <span>{post.repliesCount} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Host New Circle Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
                Host a Campus Study Circle
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Launch a recurring peer lab or study sprint for your college community.
              </p>
            </div>

            <form onSubmit={handleCreateCircle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Circle Name & Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Berkeley Quantitative Trading & Python Circle"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Campus
                  </label>
                  <input
                    type="text"
                    required
                    value={newCampus}
                    onChange={e => setNewCampus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Discipline / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Finance & Data Science"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Schedule (Recurring)
                  </label>
                  <input
                    type="text"
                    required
                    value={newSchedule}
                    onChange={e => setNewSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Meeting Location / Room
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="What will participants learn, build, or practice during sessions?"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="Python, Finance, Algorithms"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500"
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
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition"
                >
                  Publish Campus Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
