import React, { useState } from 'react';
import { X, Lock, Mail, User, School, BookOpen, Sparkles, CheckCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { INITIAL_USERS } from '../data/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [teachSkills, setTeachSkills] = useState('Python, Data Analysis');
  const [learnSkills, setLearnSkills] = useState('Photoshop, UI/UX Design');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) {
      onLoginSuccess(matched);
    } else {
      // Create guest session with provided email
      const fallbackUser: UserType = {
        _id: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'Student',
        email: email,
        college: 'State University',
        department: 'General Studies',
        bio: 'Enthusiastic student eager to learn and teach skills!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        skillsTeach: ['Python', 'SQL'],
        skillsLearn: ['Photoshop', 'Web Development'],
        experienceLevel: 'Intermediate',
        availability: 'Weekdays 3-6 PM',
        rating: 5.0,
        ratingCount: 1,
        completedExchanges: 0,
        xp: 150,
        badges: ['rising-star'],
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(fallbackUser);
    }
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      _id: `usr-${Date.now()}`,
      name: name || 'New Student',
      email: email,
      college: college || 'University Campus',
      department: department || 'Undergraduate',
      bio: `Hi, I'm ${name}! Excited to trade skills on SkillSwap.`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      skillsTeach: teachSkills.split(',').map(s => s.trim()).filter(Boolean),
      skillsLearn: learnSkills.split(',').map(s => s.trim()).filter(Boolean),
      experienceLevel: 'Intermediate',
      availability: 'Flexible weekday evenings',
      rating: 5.0,
      ratingCount: 0,
      completedExchanges: 0,
      xp: 200,
      badges: ['rising-star'],
      createdAt: new Date().toISOString()
    };
    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemo = (user: UserType) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Tabs */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setTab('login'); setForgotPasswordMessage(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                tab === 'login'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setForgotPasswordMessage(null); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                tab === 'register'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Register as Student
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Quick Demo Student Switcher Banner */}
          <div className="mb-5 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Instant One-Click Demo Personas</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo(INITIAL_USERS[0])}
                className="text-left p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Alex Chen</div>
                <div className="text-[10px] text-slate-500 truncate">Python → Photoshop</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo(INITIAL_USERS[1])}
                className="text-left p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Rahul Sharma</div>
                <div className="text-[10px] text-slate-500 truncate">Photoshop → Python</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo(INITIAL_USERS[2])}
                className="text-left p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Priya Patel</div>
                <div className="text-[10px] text-slate-500 truncate">UI/UX → Python</div>
              </button>
            </div>
          </div>

          {/* Google Login UI button */}
          <button
            type="button"
            onClick={() => handleQuickDemo(INITIAL_USERS[0])}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-750 transition mb-4 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with College Google Account
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="shrink-0 mx-3 text-xs uppercase tracking-wider text-slate-400">or with student email</span>
            <div className="grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Student College Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="alex.chen@stanford.edu"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMessage('Password reset link sent to your student email address.')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {forgotPasswordMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{forgotPasswordMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition active:scale-98"
              >
                Sign In to SkillSwap
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jordan Lee"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  College / University
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Department / Major
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science, Design"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Student Email (.edu or campus domain)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="jordan.lee@campus.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Skills I Can Teach
                  </label>
                  <input
                    type="text"
                    value={teachSkills}
                    onChange={e => setTeachSkills(e.target.value)}
                    placeholder="Python, Public Speaking"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Skills I Want to Learn
                  </label>
                  <input
                    type="text"
                    value={learnSkills}
                    onChange={e => setLearnSkills(e.target.value)}
                    placeholder="Photoshop, UI/UX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition active:scale-98 mt-2"
              >
                Create Free Student Account (+200 XP)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
