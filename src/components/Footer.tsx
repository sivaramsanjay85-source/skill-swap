import React from 'react';
import { ArrowLeftRight, Heart, Shield, Sparkles, GraduationCap, Github } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 p-0.5 shadow-md shadow-indigo-500/20">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                Skill<span className="text-indigo-600 dark:text-indigo-400">Swap</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering college students worldwide to exchange knowledge freely. No cash, no tuition—just pure peer mentorship.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Verified .edu & college student network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Explore Skill Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('matching')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1.5">
                  <span>Smart Matching</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">AI</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('chat')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Agreed Swap Messages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Campus Analytics & Trends
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('leaderboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Campus Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('requests')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Exchange Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Top Skill Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><span className="hover:text-indigo-500 cursor-pointer" onClick={() => onNavigate('explore')}>Programming & AI</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer" onClick={() => onNavigate('explore')}>UI/UX & Figma Design</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer" onClick={() => onNavigate('explore')}>Video Editing & Motion</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer" onClick={() => onNavigate('explore')}>Public Speaking & Debate</span></li>
              <li><span className="hover:text-indigo-500 cursor-pointer" onClick={() => onNavigate('explore')}>Foreign Languages</span></li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Student Safety
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Every profile is protected by peer reviews, anti-harassment community guidelines, and campus-level ratings.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span>Zero Commercial Policy</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                100% cashless. Knowledge is traded purely as an equal exchange of student effort.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SkillSwap Inc. Built for college learners worldwide.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for university peers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
