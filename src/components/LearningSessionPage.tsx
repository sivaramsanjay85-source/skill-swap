import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  Circle,
  Sparkles,
  Award,
  ExternalLink,
  Edit3,
  Save,
  Check,
  Star,
  Users,
  ArrowLeftRight,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningSession, User, ActivePage } from '../types';

interface LearningSessionPageProps {
  sessions: LearningSession[];
  currentUser?: User | null;
  onUpdateSession: (sessionId: string, updates: Partial<LearningSession>) => void;
  onOpenReviewModal: (sessionId: string, partnerName: string, partnerId: string, skillName: string) => void;
  onNavigate: (page: ActivePage) => void;
}

export const LearningSessionPage: React.FC<LearningSessionPageProps> = ({
  sessions,
  currentUser,
  onUpdateSession,
  onOpenReviewModal,
  onNavigate
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions[0]?._id || ''
  );

  const activeSession = sessions.find(s => s._id === selectedSessionId) || sessions[0];
  const [noteContent, setNoteContent] = useState(activeSession?.notes || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!activeSession) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4">
          <Calendar className="w-12 h-12 text-indigo-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Learning Sessions Yet</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Accept an exchange proposal or connect with a peer on the Smart Matching page to start a collaborative learning session.
          </p>
          <button
            onClick={() => onNavigate('matching')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
          >
            Find a Skill Match
          </button>
        </div>
      </div>
    );
  }

  const isUser1 = Boolean(currentUser?._id && activeSession.user1Id === currentUser._id);
  const partnerName = isUser1 ? activeSession.user2Name : activeSession.user1Name;
  const partnerAvatar = isUser1 ? activeSession.user2Avatar : activeSession.user1Avatar;
  const partnerId = isUser1 ? activeSession.user2Id : activeSession.user1Id;
  const partnerSkill = isUser1 ? activeSession.user2Skill : activeSession.user1Skill;
  const mySkill = isUser1 ? activeSession.user1Skill : activeSession.user2Skill;

  const handleToggleMilestone = (milestoneId: string) => {
    const updatedMilestones = activeSession.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    onUpdateSession(activeSession._id, { milestones: updatedMilestones });
  };

  const handleSaveNotes = () => {
    onUpdateSession(activeSession._id, { notes: noteContent });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleMarkCompleted = () => {
    // Trigger confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const completedMilestones = activeSession.milestones.map(m => ({ ...m, completed: true }));
    onUpdateSession(activeSession._id, {
      status: 'completed',
      milestones: completedMilestones
    });

    // Open review modal
    onOpenReviewModal(activeSession._id, partnerName, partnerId, partnerSkill);
  };

  const completedCount = activeSession.milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / activeSession.milestones.length) * 100) || 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Session Selector Strip if user has multiple sessions */}
      {sessions.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-2">
            Your Sessions:
          </span>
          {sessions.map(s => {
            const pName = Boolean(currentUser?._id && s.user1Id === currentUser._id) ? s.user2Name : s.user1Name;
            const isSel = s._id === activeSession._id;
            return (
              <button
                key={s._id}
                onClick={() => {
                  setSelectedSessionId(s._id);
                  setNoteContent(s.notes);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>With {pName}</span>
                <span className={`w-2 h-2 rounded-full ${s.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Session Banner */}
      <div className="rounded-3xl bg-linear-to-r from-indigo-900 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                activeSession.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : activeSession.status === 'in_progress'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                {activeSession.status === 'completed' ? '✓ Completed Session' : activeSession.status === 'in_progress' ? '⚡ In Progress' : '📅 Scheduled Session'}
              </span>
              <span className="text-xs text-indigo-200">•</span>
              <span className="text-xs text-indigo-200 font-medium">Bilateral Peer Workshop</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
              {mySkill} <span className="text-indigo-400">⇄</span> {partnerSkill}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeSession.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeSession.time}</span>
              </span>
              <span className="flex items-center gap-1.5">
                {activeSession.meetingType === 'online' ? <Video className="w-3.5 h-3.5 text-indigo-400" /> : <MapPin className="w-3.5 h-3.5 text-teal-400" />}
                <span>{activeSession.meetingType === 'online' ? 'Google Meet Call' : 'Campus In-Person'}</span>
              </span>
            </div>
          </div>

          {/* Quick Action: Join Call or Mark Completed */}
          <div className="flex flex-wrap items-center gap-3">
            {activeSession.meetingType === 'online' && (
              <a
                href={activeSession.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/30 transition active:scale-98"
              >
                <Video className="w-4 h-4" /> Join Video Meeting
              </a>
            )}

            {activeSession.status !== 'completed' ? (
              <button
                onClick={handleMarkCompleted}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Session Completed (+150 XP)
              </button>
            ) : (
              <button
                onClick={() => onOpenReviewModal(activeSession._id, partnerName, partnerId, partnerSkill)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                <Star className="w-4 h-4 fill-slate-950" /> Leave Peer Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Partner & Milestone Tracker / Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Partner Profile & Meeting Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Partner Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Exchange Partner
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={partnerName || 'Partner'}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{partnerName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">College Student Peer</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>4.9 Peer Rating</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Teaching you:</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300">{partnerSkill}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Learning from you:</span>
                <span className="font-bold text-teal-700 dark:text-teal-300">{mySkill}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Meeting Link:</span>
                <a
                  href={activeSession.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 truncate max-w-[160px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Room</span>
                </a>
              </div>

              <button
                onClick={() => onNavigate('chat')}
                className="w-full mt-2 py-2 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message {partnerName}</span>
              </button>
            </div>
          </div>

          {/* XP & Rewards Widget */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-teal-500/10 border border-indigo-200/60 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Session Rewards</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Completion Reward:</span>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">+150 XP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Badge Progress:</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Skill Master (8/10)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Milestones & Collaborative Notes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Tracker Milestones */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Session Milestones & Progress</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {progressPercent}% Done
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Check off agenda points as you progress through your 1-on-1 swap.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-teal-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Milestone Checklist */}
            <div className="space-y-2.5 pt-2">
              {activeSession.milestones.map(milestone => (
                <div
                  key={milestone.id}
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer ${
                    milestone.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-900 dark:text-white'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <button type="button" className="mt-0.5 shrink-0">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
                    )}
                  </button>
                  <span className={`text-xs font-medium leading-relaxed ${milestone.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborative Notes Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Collaborative Notes & Code Snippets
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {isSavedNotice && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Autosaved
                  </span>
                )}
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                >
                  <Save className="w-3.5 h-3.5" /> Save Notes
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jot down links, shortcut keys, code snippets, or recommended practice tasks during the call.
            </p>

            <textarea
              rows={8}
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Type your shared study notes here..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
