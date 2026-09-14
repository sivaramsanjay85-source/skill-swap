import React from 'react';
import { Sparkles, Code, Palette, ArrowLeftRight, CheckCircle2, Star } from 'lucide-react';

export const StudentExchangeIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-4/3 flex items-center justify-center p-4">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-indigo-500/15 dark:bg-indigo-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-500/15 dark:bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Interactive Stage */}
      <div className="relative w-full h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-linear-to-b from-white/90 via-slate-50/50 to-indigo-50/30 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-indigo-950/20 shadow-xl dark:shadow-2xl dark:shadow-indigo-950/30 backdrop-blur-xs overflow-hidden flex flex-col justify-between p-6">
        {/* Top Header Bar inside illustration */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-2">
              SkillSwap Active Peer Mesh
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>95% Match Active</span>
          </div>
        </div>

        {/* Center Students and Floating Exchange Nodes */}
        <div className="relative my-auto py-4 flex items-center justify-between px-2 sm:px-6">
          {/* Student 1: Alex (Teaching Python, Learning Photoshop) */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-4 ring-indigo-500/30 shadow-lg shadow-indigo-500/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  alt="Student Alex"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Code className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Alex (Stanford)</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
                <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950">Teaches: Python</span>
              </div>
            </div>
          </div>

          {/* Central Exchange Orbit Animation */}
          <div className="relative flex flex-col items-center justify-center px-4">
            {/* SVG Connecting Flow Lines with animated dashes */}
            <svg className="w-28 sm:w-40 h-16" viewBox="0 0 160 64" fill="none">
              {/* Forward Path (Python flowing to Rahul) */}
              <path
                d="M 10 24 C 50 4, 110 4, 150 24"
                stroke="url(#gradient-flow-1)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-[dash_20s_linear_infinite]"
              />
              {/* Backward Path (Photoshop flowing to Alex) */}
              <path
                d="M 150 40 C 110 60, 50 60, 10 40"
                stroke="url(#gradient-flow-2)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-[dash_20s_linear_infinite]"
              />
              <defs>
                <linearGradient id="gradient-flow-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="gradient-flow-2" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center border-2 border-white dark:border-slate-800">
              <ArrowLeftRight className="w-5 h-5 animate-pulse" />
            </div>

            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Zero Money Swapped</span>
            </div>
          </div>

          {/* Student 2: Rahul (Teaching Photoshop, Learning Python) */}
          <div className="flex flex-col items-center text-center z-10">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-4 ring-teal-500/30 shadow-lg shadow-teal-500/20">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
                  alt="Student Rahul"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
                <Palette className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Rahul (UC Berkeley)</div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
                <span className="px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950">Teaches: Photoshop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Micro Status */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mutual 1-Hour Session Scheduled</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>4.9 Peer Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};
