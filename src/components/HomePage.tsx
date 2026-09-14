import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  Users,
  Award,
  Star,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowLeftRight,
  GraduationCap,
  MessageSquare,
  Zap,
  Code,
  Palette,
  Video,
  Languages
} from 'lucide-react';
import { ActivePage, SkillItem, User } from '../types';
import { StudentExchangeIllustration } from './StudentExchangeIllustration';

interface HomePageProps {
  onNavigate: (page: ActivePage) => void;
  popularSkills: SkillItem[];
  onProposeSwapWithSkill: (skill: SkillItem) => void;
  currentUser?: User | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  popularSkills,
  onProposeSwapWithSkill,
  currentUser
}) => {
  const [quickTeach, setQuickTeach] = useState('Python');
  const [quickLearn, setQuickLearn] = useState('Photoshop');

  const testimonials = [
    {
      name: 'Rahul Sharma',
      college: 'UC Berkeley',
      major: 'Media Studies',
      quote:
        'I needed Python to automate my video subtitle pipeline. Alex taught me in two 1-hour sessions, and I taught him professional photo manipulation in return. It felt 10x better than paying $50/hr for an online tutor!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      swapped: 'Photoshop ⇄ Python'
    },
    {
      name: 'Priya Patel',
      college: 'UT Austin',
      major: 'Design & Creative Tech',
      quote:
        'SkillSwap is the most wholesome student community on campus. Exchanging Figma design frameworks for machine learning concepts gave me confidence to build my dream hackathon project.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      swapped: 'Figma UI/UX ⇄ PyTorch'
    },
    {
      name: 'Kenji Takahashi',
      college: 'MIT',
      major: 'Computer Science',
      quote:
        'Trading React state architecture for conversational Japanese with international students opened up so many friendships. The milestone tracker in the learning session makes each call super productive.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
      swapped: 'React 19 ⇄ Japanese'
    }
  ];

  return (
    <div className="w-full space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-200/70 dark:border-slate-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span>The 100% Cashless Student Skill Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] font-heading">
                Learn What You Want.{' '}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-indigo-500 to-teal-400">
                  Teach What You Know.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                SkillSwap connects college students for 1-on-1 reciprocal skill trades.
                Swap Python for Photoshop, UI design for public speaking, or guitar for conversational Spanish.
                Zero tuition, zero payments—just mutual student growth.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('matching')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 active:scale-98 transition group"
                >
                  <span>Find Your Skill Match</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => onNavigate('explore')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Explore 380+ Skills</span>
                </button>
              </div>

              {/* Live Bilateral Quick Match Interactive Widget */}
              <div className="mt-8 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Try Instant Match Simulation
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    95% Match Potential
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-medium shrink-0">I know:</span>
                    <input
                      type="text"
                      value={quickTeach}
                      onChange={e => setQuickTeach(e.target.value)}
                      className="w-full bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 font-medium shrink-0">I want:</span>
                    <input
                      type="text"
                      value={quickLearn}
                      onChange={e => setQuickLearn(e.target.value)}
                      className="w-full bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Matched with Rahul (UC Berkeley) who teaches {quickLearn} & wants {quickTeach}</span>
                  <button
                    onClick={() => onNavigate('matching')}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    View Match →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Animated Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <StudentExchangeIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATISTICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs text-center sm:text-left transition hover:border-indigo-500/40">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">12,400+</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Active College Students</div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs text-center sm:text-left transition hover:border-indigo-500/40">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">380+</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Verified Unique Skills</div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs text-center sm:text-left transition hover:border-indigo-500/40">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">8,950+</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Successful Exchanges</div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs text-center sm:text-left transition hover:border-indigo-500/40">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-3 mx-auto sm:mx-0">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">4.9 / 5.0</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Average Peer Rating</div>
          </div>
        </div>
      </section>

      {/* 3. HOW SKILLSWAP WORKS (3 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Simple 3-Step Process
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            How SkillSwap Works
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Never pay for expensive courses again. Learn directly from peers who already mastered what you want to learn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative p-7 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-lg font-heading shadow-md shadow-indigo-500/20 mb-5">
              01
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">List Your Skills</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Add the topics you are confident teaching (like Python, DSLR photography, or essay writing) and the skills you are dying to learn.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-4 h-4" /> Takes less than 60 seconds
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-7 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-extrabold text-lg font-heading shadow-md shadow-teal-500/20 mb-5">
              02
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Smart Skill Match</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our bilateral matching engine pairs you with compatible students where your teaching skill answers their learning desire, and vice-versa.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Zap className="w-4 h-4" /> 90%+ match accuracy
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-7 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-900 dark:bg-indigo-700 text-white flex items-center justify-center font-extrabold text-lg font-heading shadow-md mb-5">
              03
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Swap, Learn & Level Up</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Meet online via Google Meet or in-person at the campus library. Track progress milestones, take notes together, and earn XP badges.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Award className="w-4 h-4" /> Earn XP & climb leaderboard
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR SKILLS MARKETPLACE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Trending Exchanges
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Popular Skills on Campus
            </h3>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Explore all categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSkills.slice(0, 6).map(skill => (
            <div
              key={skill._id}
              className="group rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-lg hover:border-indigo-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                    {skill.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {skill.level}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-1">
                  {skill.name}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {skill.description}
                </p>

                {/* Mentor info */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img
                    src={skill.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={skill.userName || 'Mentor'}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{skill.userName}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{skill.userCollege}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{skill.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <button
                  onClick={() => onProposeSwapWithSkill(skill)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-600 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Request Exchange
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
            Student Stories
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Trusted by Students Across Top Campuses
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{t.college} • {t.major}</div>
                  <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {t.swapped}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-700 text-white p-8 sm:p-12 shadow-xl shadow-indigo-600/20 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Ready to trade skills with your fellow students?
            </h3>
            <p className="text-sm text-indigo-100 font-normal">
              Join thousands of college learners exchanging design, coding, languages, and music today. Free forever.
            </p>
          </div>
          <button
            onClick={() => onNavigate('matching')}
            className="shrink-0 px-8 py-3.5 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm shadow-md active:scale-98 transition"
          >
            Find Your Skill Match
          </button>
        </div>
      </section>
    </div>
  );
};
