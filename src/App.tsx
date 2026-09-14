import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ExploreSkillsPage } from './components/ExploreSkillsPage';
import { SmartMatchingPage } from './components/SmartMatchingPage';
import { ExchangeRequestsPage } from './components/ExchangeRequestsPage';
import { LearningSessionPage } from './components/LearningSessionPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { StudentProfilePage } from './components/StudentProfilePage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ChatPage } from './components/ChatPage';
import { AuthModal } from './components/AuthModal';
import { RequestSwapModal } from './components/RequestSwapModal';
import { ReviewModal } from './components/ReviewModal';

import {
  ActivePage,
  User,
  SkillItem,
  ExchangeRequest,
  LearningSession,
  Notification,
  Review,
  SmartMatchResult,
  Badge,
  SkillCategory,
  ExperienceLevel
} from './types';
import { api } from './services/api';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('skillswap_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation state
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedUserForProfile, setSelectedUserForProfile] = useState<User | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Application data states
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ExchangeRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ExchangeRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<ExchangeRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<ExchangeRequest[]>([]);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [leaderboard, setLeaderboard] = useState<(User & { rank: number })[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [smartMatches, setSmartMatches] = useState<SmartMatchResult[]>([]);

  // Modals state
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapModalTargetUser, setSwapModalTargetUser] = useState<User | null>(null);
  const [swapModalPreOffer, setSwapModalPreOffer] = useState('');
  const [swapModalPreWant, setSwapModalPreWant] = useState('');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSessionDetails, setReviewSessionDetails] = useState<{
    sessionId: string;
    partnerName: string;
    partnerId: string;
    skillName: string;
  } | null>(null);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('skillswap_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('skillswap_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Initial load
  useEffect(() => {
    async function initApp() {
      try {
        const user = await api.getCurrentUser();
        setCurrentUser(user);

        const [fetchedSkills, fetchedBadges, fetchedLeaderboard, fetchedReviews] = await Promise.all([
          api.getSkills(),
          api.getBadges(),
          api.getLeaderboard(),
          api.getReviews()
        ]);

        setSkills(fetchedSkills);
        setBadges(fetchedBadges);
        setLeaderboard(fetchedLeaderboard);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Failed initial load', err);
      }
    }
    initApp();
  }, []);

  // Fetch user-dependent data whenever currentUser changes
  const refreshUserData = useCallback(async () => {
    if (!currentUser) return;
    try {
      const [reqs, sess, notifs, matches] = await Promise.all([
        api.getRequests(currentUser._id),
        api.getSessions(currentUser._id),
        api.getNotifications(currentUser._id),
        api.getSmartMatches(currentUser._id)
      ]);

      setIncomingRequests(reqs.incoming);
      setSentRequests(reqs.sent);
      setAcceptedRequests(reqs.accepted);
      setRejectedRequests(reqs.rejected);
      setSessions(sess);
      setNotifications(notifs);
      setSmartMatches(matches);
    } catch (err) {
      console.error('Failed refreshing user data', err);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Auth handlers
  const handleLogin = async (email: string) => {
    const user = await api.login(email);
    setCurrentUser(user);
  };

  const handleRegister = async (data: any) => {
    const user = await api.register(data);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActivePage('home');
  };

  // Notification handlers
  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearAllNotifications = async () => {
    if (!currentUser) return;
    await api.clearAllNotifications(currentUser._id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Skill swap proposal trigger
  const handleOpenSwapModal = (targetUser: User, preOffer = '', preWant = '') => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setSwapModalTargetUser(targetUser);
    setSwapModalPreOffer(preOffer || currentUser.skillsTeach[0] || 'Python');
    setSwapModalPreWant(preWant || targetUser.skillsTeach[0] || 'Photoshop');
    setIsSwapModalOpen(true);
  };

  const handleProposeSwapWithSkill = (skill: SkillItem) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const targetUser: User = {
      _id: skill.userId,
      name: skill.userName,
      email: `${skill.userName.toLowerCase().replace(/\s+/g, '')}@stanford.edu`,
      college: skill.userCollege,
      department: 'College Peer',
      bio: `Teaching ${skill.name} on SkillSwap.`,
      avatar: skill.userAvatar,
      skillsTeach: [skill.name],
      skillsLearn: currentUser.skillsTeach.slice(0, 2),
      rating: skill.rating,
      ratingCount: 15,
      xp: 850,
      badges: ['skill_master'],
      availability: 'Weekends, Evenings',
      completedExchanges: skill.completedSwaps,
      createdAt: '2024-09-01T00:00:00.000Z',
      joinedDate: '2024-09'
    };

    handleOpenSwapModal(targetUser, currentUser.skillsTeach[0] || 'Python', skill.name);
  };

  const handleSendSwapProposal = async (proposalData: any) => {
    await api.createRequest(proposalData);
    await refreshUserData();
  };

  // Request actions
  const handleAcceptRequest = async (requestId: string) => {
    await api.acceptRequest(requestId);
    await refreshUserData();
  };

  const handleRejectRequest = async (requestId: string) => {
    await api.rejectRequest(requestId);
    await refreshUserData();
  };

  // Learning session updates
  const handleUpdateSession = async (sessionId: string, updates: Partial<LearningSession>) => {
    const updated = await api.updateSession(sessionId, updates);
    setSessions(prev => prev.map(s => (s._id === sessionId ? updated : s)));
    // If completed, refresh user data for updated XP & badges
    if (updates.status === 'completed') {
      const refreshedUser = await api.getCurrentUser();
      setCurrentUser(refreshedUser);
    }
  };

  // Review modal
  const handleOpenReviewModal = (sessionId: string, partnerName: string, partnerId: string, skillName: string) => {
    setReviewSessionDetails({
      sessionId,
      partnerName,
      partnerId,
      skillName
    });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (reviewData: any) => {
    await api.submitReview(reviewData);
    const [fetchedReviews, refreshedUser] = await Promise.all([
      api.getReviews(),
      api.getCurrentUser()
    ]);
    setReviews(fetchedReviews);
    setCurrentUser(refreshedUser);
    await refreshUserData();
  };

  // Add new skill
  const handleAddSkill = async (newSkillData: {
    name: string;
    category: SkillCategory;
    level: ExperienceLevel;
    description: string;
    tags: string[];
  }) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const created = await api.createSkill({
      ...newSkillData,
      userId: currentUser._id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userCollege: currentUser.college
    });
    setSkills(prev => [created, ...prev]);
    // Also add to currentUser's skillsTeach if not present
    if (!currentUser.skillsTeach.includes(newSkillData.name)) {
      const updatedTeach = [...currentUser.skillsTeach, newSkillData.name];
      const updatedUser = await api.updateProfile(currentUser._id, { skillsTeach: updatedTeach });
      setCurrentUser(updatedUser);
    }
  };

  // Update profile
  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = await api.updateProfile(currentUser._id, updatedData);
    setCurrentUser(updated);
  };

  // Navigate to profile of specific user or current user
  const handleViewUserProfile = (user: User) => {
    setSelectedUserForProfile(user);
    setActivePage('profile');
  };

  const handleNavigate = (page: ActivePage) => {
    if (page === 'profile') {
      setSelectedUserForProfile(currentUser);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active user for the profile page
  const profileTargetUser = selectedUserForProfile || currentUser || {
    _id: 'guest',
    name: 'College Student',
    email: 'student@university.edu',
    college: 'University Campus',
    department: 'Student Body',
    bio: 'Looking to trade skills and collaborate.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    skillsTeach: ['Python'],
    skillsLearn: ['Photoshop'],
    rating: 5.0,
    ratingCount: 1,
    xp: 100,
    badges: ['rising_star'],
    availability: 'Weekends',
    completedExchanges: 1,
    createdAt: '2024-09-01T00:00:00.000Z',
    joinedDate: '2024-09'
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Universal Navigation Header */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenLogin={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthModalMode('register');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        incomingRequestsCount={incomingRequests.length}
      />

      {/* Main Routed Content */}
      <main className="flex-1 w-full">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            popularSkills={skills}
            onProposeSwapWithSkill={handleProposeSwapWithSkill}
            currentUser={currentUser || profileTargetUser}
          />
        )}

        {activePage === 'explore' && (
          <ExploreSkillsPage
            skills={skills}
            currentUser={currentUser || profileTargetUser}
            onProposeSwap={handleProposeSwapWithSkill}
            onAddSkill={handleAddSkill}
          />
        )}

        {activePage === 'matching' && (
          <SmartMatchingPage
            currentUser={currentUser || profileTargetUser}
            matches={smartMatches}
            onConnect={(targetStudent, offerSkill, wantSkill) =>
              handleOpenSwapModal(targetStudent, offerSkill, wantSkill)
            }
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'requests' && (
          <ExchangeRequestsPage
            currentUser={currentUser || profileTargetUser}
            incoming={incomingRequests}
            sent={sentRequests}
            accepted={acceptedRequests}
            rejected={rejectedRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            onNavigate={handleNavigate}
            onOpenNewSwap={() => {
              if (leaderboard.length > 1) {
                const partner = leaderboard.find(u => u._id !== currentUser?._id) || leaderboard[1];
                handleOpenSwapModal(partner);
              }
            }}
          />
        )}

        {activePage === 'sessions' && (
          <LearningSessionPage
            sessions={sessions}
            currentUser={currentUser || profileTargetUser}
            onUpdateSession={handleUpdateSession}
            onOpenReviewModal={handleOpenReviewModal}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'chat' && (
          <ChatPage
            currentUser={currentUser || profileTargetUser}
            onNavigate={handleNavigate}
            onSelectUserForProfile={handleViewUserProfile}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'leaderboard' && (
          <LeaderboardPage
            currentUser={currentUser || profileTargetUser}
            leaderboard={leaderboard}
            badges={badges}
            onSelectUser={handleViewUserProfile}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'profile' && (
          <StudentProfilePage
            user={profileTargetUser}
            isCurrentUser={Boolean(currentUser && profileTargetUser._id === currentUser._id)}
            reviews={reviews}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={handleNavigate}
            onProposeSwap={target => handleOpenSwapModal(target)}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {currentUser && swapModalTargetUser && (
        <RequestSwapModal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          currentUser={currentUser}
          targetUser={swapModalTargetUser}
          onSubmit={handleSendSwapProposal}
          preselectedOfferSkill={swapModalPreOffer}
          preselectedWantSkill={swapModalPreWant}
        />
      )}

      {currentUser && reviewSessionDetails && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          sessionId={reviewSessionDetails.sessionId}
          partnerName={reviewSessionDetails.partnerName}
          partnerId={reviewSessionDetails.partnerId}
          skillName={reviewSessionDetails.skillName}
          currentUserId={currentUser._id}
          currentUserName={currentUser.name}
          currentUserAvatar={currentUser.avatar}
          onSubmitReview={handleSubmitReview}
        />
      )}
    </div>
  );
}
