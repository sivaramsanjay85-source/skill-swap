import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Download,
  Copy,
  FileCode,
  ShieldCheck,
  Printer,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningSession, User, ActivePage, CampusCertificate } from '../types';

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
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'notes' | 'python' | 'javascript' | 'markdown'>('notes');

  // Dual-Teaching Pomodoro Timer State
  // Bilateral swap: 25 min for user1 to teach, then 25 min for user2 to teach
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerTurn, setTimerTurn] = useState<'user1' | 'user2'>('user1');
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certificateData, setCertificateData] = useState<CampusCertificate | null>(null);

  useEffect(() => {
    if (activeSession) {
      setNoteContent(activeSession.notes);
    }
  }, [activeSession?._id]);

  // Pomodoro audio chime using browser Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Audio chime unavailable', e);
    }
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setPomodoroSeconds(prev => {
          if (prev <= 1) {
            playChime();
            // Switch turn
            setTimerTurn(current => (current === 'user1' ? 'user2' : 'user1'));
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

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

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(noteContent);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const handleDownloadNotes = () => {
    const blob = new Blob([noteContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillswap-session-${activeSession._id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMarkCompleted = () => {
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.6 }
    });

    const completedMilestones = activeSession.milestones.map(m => ({ ...m, completed: true }));
    onUpdateSession(activeSession._id, {
      status: 'completed',
      milestones: completedMilestones
    });

    // Auto-generate certificate
    handleOpenCertificate();

    // Trigger review modal after a short delay
    setTimeout(() => {
      onOpenReviewModal(activeSession._id, partnerName, partnerId, partnerSkill);
    }, 1500);
  };

  const handleOpenCertificate = () => {
    const cert: CampusCertificate = {
      certificateId: `SKW-${activeSession._id.slice(-6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      studentName: currentUser?.name || 'Alex Chen',
      partnerName: partnerName,
      studentCollege: currentUser?.college || 'Stanford University',
      skillTaught: mySkill,
      skillLearned: partnerSkill,
      hoursCompleted: 2.5,
      verificationHash: `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };
    setCertificateData(cert);
    setIsCertModalOpen(true);
  };

  const completedCount = activeSession.milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / activeSession.milestones.length) * 100) || 0;

  // Format pomodoro minutes and seconds
  const timerMinutes = Math.floor(pomodoroSeconds / 60);
  const timerSecs = pomodoroSeconds % 60;
  const currentTeachingStudent = timerTurn === 'user1' ? activeSession.user1Name : activeSession.user2Name;
  const currentTeachingSkill = timerTurn === 'user1' ? activeSession.user1Skill : activeSession.user2Skill;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Session Selector Strip */}
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
              <span className="text-xs text-indigo-200 font-medium">Bilateral Peer Workspace</span>
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

          {/* Quick Actions */}
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
                <CheckCircle2 className="w-4 h-4" /> Complete & Award XP (+150)
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenCertificate}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  <ShieldCheck className="w-4 h-4" /> View Certificate
                </button>
                <button
                  onClick={() => onOpenReviewModal(activeSession._id, partnerName, partnerId, partnerSkill)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  <Star className="w-4 h-4 fill-slate-950" /> Leave Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Partner & Dual-Timer, Right Column Notes & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
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
              <button
                onClick={() => onNavigate('chat')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message {partnerName}</span>
              </button>
            </div>
          </div>

          {/* Bilateral Pomodoro Focus Timer */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-teal-500/10 border border-indigo-200/60 dark:border-indigo-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Bilateral Teaching Timer</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                25m Equal Blocks
              </span>
            </div>

            {/* Current Teaching Block */}
            <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Currently Teaching:
              </span>
              <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                {currentTeachingStudent} ({currentTeachingSkill})
              </p>
            </div>

            {/* Timer Display */}
            <div className="text-center py-2">
              <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums tracking-wider">
                {String(timerMinutes).padStart(2, '0')}:{String(timerSecs).padStart(2, '0')}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                Audio chime alerts both students when block switches
              </span>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsTimerRunning(prev => !prev)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition ${
                  isTimerRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setPomodoroSeconds(25 * 60);
                }}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setTimerTurn(current => (current === 'user1' ? 'user2' : 'user1'));
                  setPomodoroSeconds(25 * 60);
                }}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100"
              >
                Switch Turn
              </button>
            </div>
          </div>

          {/* XP & Micro-Credential Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Campus Micro-Credential</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upon completion, generate a verifiable certificate of exchange recognized across collegiate student organizations.
            </p>
            <button
              onClick={handleOpenCertificate}
              className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800 flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Preview Skill Certificate</span>
            </button>
          </div>
        </div>

        {/* Right Column: Milestones & Collaborative Notes / Code Sandbox */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress Milestones */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Session Agenda & Progress</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {progressPercent}% Done
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Check off agenda points as you progress through your 1-on-1 bilateral exchange.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-indigo-600 to-teal-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Milestone Checklist */}
            <div className="space-y-2.5 pt-2">
              {activeSession.milestones.map(milestone => (
                <div
                  key={milestone.id}
                  onClick={() => handleToggleMilestone(milestone.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${
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

          {/* Interactive Collaborative Notes & Code Scratchpad */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Collaborative Scratchpad & Shared Notes
                </h3>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 flex-wrap">
                {isSavedNotice && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
                {copiedNotice && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied
                  </span>
                )}

                <button
                  onClick={handleCopyNotes}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs transition"
                  title="Copy to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleDownloadNotes}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs transition"
                  title="Download notes file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-xs transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs w-fit">
              {(['notes', 'python', 'javascript', 'markdown'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-3 py-1 rounded-lg font-semibold uppercase text-[10px] tracking-wider transition ${
                    activeCodeTab === tab
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <textarea
              rows={12}
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              placeholder="Paste code snippets, API endpoints, design links, or study notes..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{noteContent.length} characters</span>
              <span>Markdown formatting supported · autosaved locally</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Micro-Credential Certificate Modal */}
      {isCertModalOpen && certificateData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative bg-white dark:bg-slate-900 border-2 border-indigo-500/30 rounded-3xl max-w-2xl w-full p-8 sm:p-10 space-y-6 shadow-2xl overflow-hidden">
            {/* Certificate Header Ornament */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-linear-to-r from-indigo-600 via-teal-400 to-indigo-600" />

            <button
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 mx-auto flex items-center justify-center shadow-md">
                <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Official Campus Micro-Credential
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                Certificate of Peer Skill Exchange
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Issued by SkillSwap Collegiate Exchange Network
              </p>
            </div>

            {/* Certificate Body */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                This verifies that <strong className="text-slate-900 dark:text-white font-bold">{certificateData.studentName}</strong> from <span className="underline decoration-indigo-400">{certificateData.studentCollege}</span> has successfully completed an intensive reciprocal peer learning sprint with <strong className="text-slate-900 dark:text-white font-bold">{certificateData.partnerName}</strong>.
              </p>

              <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Taught Competency</span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{certificateData.skillTaught}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Acquired Competency</span>
                  <span className="text-sm font-extrabold text-teal-600 dark:text-teal-400">{certificateData.skillLearned}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-left text-xs text-slate-500 dark:text-slate-400 pt-2">
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white">Date Issued:</span>
                  <span>{certificateData.issueDate}</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-slate-900 dark:text-white">Certificate ID:</span>
                  <span className="font-mono text-[11px]">{certificateData.certificateId}</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate">
                Hash: {certificateData.verificationHash}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Verifiable on Campus Ledger
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
