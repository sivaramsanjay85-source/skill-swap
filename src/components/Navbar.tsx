import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  Award,
  ArrowLeftRight,
  CheckCheck,
  Compass,
  Calendar,
  Layers,
  ChevronDown,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { ActivePage, User, NotificationItem } from '../types';
import { INITIAL_USERS } from '../data/seedData';

interface NavbarProps {
  currentPage?: ActivePage;
  activePage?: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentUser?: User | null;
  onSelectUser?: (user: User) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  notifications?: NotificationItem[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  onClearAllNotifications?: () => void;
  pendingRequestsCount?: number;
  incomingRequestsCount?: number;
  activeSessionsCount?: number;
  onOpenAuth?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
  onOpenSwapModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  activePage,
  onNavigate,
  currentUser,
  onSelectUser,
  isDarkMode,
  onToggleDarkMode,
  notifications = [],
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onClearAllNotifications,
  pendingRequestsCount,
  incomingRequestsCount,
  activeSessionsCount = 0,
  onOpenAuth,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onOpenSwapModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const notifsRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const activeTab = activePage || currentPage || 'home';
  const effectiveRequestsCount = pendingRequestsCount ?? incomingRequestsCount ?? 0;
  const unreadCount = (notifications || []).filter(n => !n.isRead && !n.read).length;

  const handleAuthClick = () => {
    if (onOpenAuth) onOpenAuth();
    else if (onOpenLogin) onOpenLogin();
    else if (onOpenRegister) onOpenRegister();
  };

  const handleClearNotifs = () => {
    if (onClearAllNotifications) onClearAllNotifications();
    else if (onMarkAllNotificationsRead) onMarkAllNotificationsRead();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(event.target as Node)) {
        setNotifsOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActivePage; label: string; icon: React.ReactNode; badge?: number; isSpecial?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Skills', icon: <Search className="w-4 h-4" /> },
    { id: 'matching', label: 'Smart Match', icon: <Sparkles className="w-4 h-4" />, isSpecial: true },
    { id: 'requests', label: 'Requests', icon: <ArrowLeftRight className="w-4 h-4" />, badge: effectiveRequestsCount },
    { id: 'sessions', label: 'Sessions', icon: <Calendar className="w-4 h-4" />, badge: activeSessionsCount },
    { id: 'chat', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 p-0.5 shadow-md shadow-indigo-500/25 group-hover:scale-105 transition">
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 transform -rotate-12 group-hover:rotate-0 transition duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                    Skill<span className="text-indigo-600 dark:text-indigo-400">Swap</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                    College
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Peer Skill Exchange
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.isSpecial && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-amber-500 to-indigo-500 text-white leading-none animate-pulse">
                        98%
                      </span>
                    )}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Swap CTA button */}
            {onOpenSwapModal && (
              <button
                onClick={onOpenSwapModal}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs shadow-indigo-500/20 active:scale-98 transition"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Propose Swap</span>
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => setNotifsOpen(!notifsOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {notifsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleClearNotifs}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div
                          key={n._id}
                          onClick={() => {
                            if (onMarkNotificationRead) onMarkNotificationRead(n._id);
                            if (n.type === 'request') onNavigate('requests');
                            else if (n.type === 'session' || n.type === 'accepted') onNavigate('sessions');
                            else if (n.type === 'match') onNavigate('matching');
                            else if (n.type === 'review') onNavigate('profile');
                            setNotifsOpen(false);
                          }}
                          className={`py-3 px-2 rounded-xl transition cursor-pointer flex items-start gap-3 ${
                            !n.read && !n.isRead ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.read && !n.isRead ? 'bg-indigo-600' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        onNavigate('notifications');
                        setNotifsOpen(false);
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Student Avatar & Profile Menu */}
            {!currentUser ? (
              <button
                onClick={handleAuthClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={currentUser.name || 'Student'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {(currentUser.name || 'Student').split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {currentUser.xp ?? 0} XP
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img
                        src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={currentUser.name || 'Student'}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name || 'Student'}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.college || 'Campus Peer'}</div>
                        <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          ⭐ {currentUser.rating ?? 5.0} ({currentUser.completedExchanges ?? 0} swaps)
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Student Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('matching');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span>My Skill Matches</span>
                      </button>
                    </div>

                    {/* Switch Demo Student */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Switch Demo Student
                      </div>
                      <div className="space-y-0.5">
                        {INITIAL_USERS.slice(0, 4).map(u => (
                          <button
                            key={u._id}
                            onClick={() => {
                              if (onSelectUser) onSelectUser(u);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                              u._id === currentUser?._id
                                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            <span className="text-[10px] text-slate-400 truncate">{u.college.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                      <button
                        onClick={() => {
                          handleAuthClick();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-center py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Register New Student / Login
                      </button>

                      {onLogout && (
                        <button
                          onClick={() => {
                            onLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-center py-1 text-xs text-rose-500 hover:text-rose-600 hover:underline"
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === item.id
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              My Profile
            </button>
            {onOpenSwapModal && (
              <button
                onClick={() => {
                  onOpenSwapModal();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-xs"
              >
                Propose Swap
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
