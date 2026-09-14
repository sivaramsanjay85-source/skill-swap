import {
  User,
  SkillItem,
  SmartMatchResult,
  ExchangeRequest,
  LearningSession,
  Review,
  NotificationItem,
  Badge,
  SkillCategory,
  ExperienceLevel
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SKILLS,
  INITIAL_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BADGES
} from '../data/seedData';

// Fallback in-memory cache for seamless client responsiveness
let localUsers = [...INITIAL_USERS];
let localSkills = [...INITIAL_SKILLS];
let localRequests = [...INITIAL_REQUESTS];
let localSessions = [...INITIAL_SESSIONS];
let localReviews = [...INITIAL_REVIEWS];
let localNotifs = [...INITIAL_NOTIFICATIONS];

async function apiFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: () => T): Promise<T> {
  try {
    const res = await fetch(endpoint, options);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[SkillSwap API] Using fallback for ${endpoint}:`, err);
    if (fallbackData) {
      return fallbackData();
    }
    throw err;
  }
}

export const SkillSwapApi = {
  // --- Auth & Users ---
  async login(email: string): Promise<{ success: boolean; user: User }> {
    return apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }, () => {
      const user = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || localUsers[0];
      return { success: true, user };
    });
  },

  async register(data: {
    name: string;
    email: string;
    college: string;
    department: string;
    skillsTeach?: string[];
    skillsLearn?: string[];
  }): Promise<{ success: boolean; user: User }> {
    return apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const newUser: User = {
        _id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        college: data.college || 'University Campus',
        department: data.department || 'General Studies',
        bio: `Hello! I'm ${data.name}, excited to exchange skills on SkillSwap.`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        skillsTeach: data.skillsTeach || ['Python', 'Graphic Design'],
        skillsLearn: data.skillsLearn || ['UI/UX Design', 'Public Speaking'],
        experienceLevel: 'Intermediate',
        availability: 'Weekday afternoons & weekends',
        rating: 5.0,
        ratingCount: 0,
        completedExchanges: 0,
        xp: 150,
        badges: ['rising-star'],
        createdAt: new Date().toISOString()
      };
      localUsers.push(newUser);
      return { success: true, user: newUser };
    });
  },

  async getUsers(): Promise<{ users: User[] }> {
    return apiFetch('/api/users', undefined, () => ({ users: localUsers }));
  },

  async getUserById(id: string): Promise<{ user: User }> {
    return apiFetch(`/api/users/${id}`, undefined, () => {
      const user = localUsers.find(u => u._id === id) || localUsers[0];
      return { user };
    });
  },

  async updateUser(id: string, updates: Partial<User>): Promise<{ success: boolean; user: User }> {
    return apiFetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }, () => {
      const idx = localUsers.findIndex(u => u._id === id);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...updates };
        return { success: true, user: localUsers[idx] };
      }
      return { success: false, user: localUsers[0] };
    });
  },

  // --- Skills ---
  async getSkills(params?: {
    search?: string;
    category?: string;
    level?: string;
    minRating?: number;
  }): Promise<{ skills: SkillItem[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.level) query.set('level', params.level);
    if (params?.minRating) query.set('minRating', String(params.minRating));

    const url = `/api/skills${query.toString() ? `?${query.toString()}` : ''}`;
    return apiFetch(url, undefined, () => {
      let filtered = [...localSkills];
      if (params?.category && params.category !== 'All') {
        filtered = filtered.filter(s => s.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.level && params.level !== 'All') {
        filtered = filtered.filter(s => s.level.toLowerCase() === params.level!.toLowerCase());
      }
      if (params?.minRating && params.minRating > 0) {
        filtered = filtered.filter(s => s.rating >= params.minRating!);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          s =>
            s.name.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.userName.toLowerCase().includes(q) ||
            s.userCollege.toLowerCase().includes(q)
        );
      }
      return { skills: filtered, total: filtered.length };
    });
  },

  async createSkill(data: {
    userId: string;
    name: string;
    category: SkillCategory;
    level: ExperienceLevel;
    description: string;
    tags?: string[];
  }): Promise<{ success: boolean; skill: SkillItem }> {
    return apiFetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const user = localUsers.find(u => u._id === data.userId) || localUsers[0];
      const newSkill: SkillItem = {
        _id: `sk-${Date.now()}`,
        userId: user._id,
        userName: user.name,
        userCollege: user.college,
        userAvatar: user.avatar,
        name: data.name,
        category: data.category,
        level: data.level,
        description: data.description,
        tags: data.tags || [data.name],
        rating: user.rating,
        ratingCount: user.ratingCount,
        completedSwaps: user.completedExchanges,
        createdAt: new Date().toISOString()
      };
      localSkills.unshift(newSkill);
      return { success: true, skill: newSkill };
    });
  },

  // --- Smart Matching ---
  async getSmartMatches(userId: string): Promise<{ matches: SmartMatchResult[] }> {
    return apiFetch(`/api/matching/${userId}`, undefined, () => {
      const currentUser = localUsers.find(u => u._id === userId) || localUsers[0];
      const otherUsers = localUsers.filter(u => u._id !== currentUser._id);

      const matches = otherUsers.map(student => {
        const teachMatch = student.skillsTeach.filter(teachSkill =>
          currentUser.skillsLearn.some(learnSkill =>
            teachSkill.toLowerCase().includes(learnSkill.toLowerCase()) ||
            learnSkill.toLowerCase().includes(teachSkill.toLowerCase())
          )
        );

        const learnMatch = currentUser.skillsTeach.filter(teachSkill =>
          student.skillsLearn.some(learnSkill =>
            teachSkill.toLowerCase().includes(learnSkill.toLowerCase()) ||
            learnSkill.toLowerCase().includes(teachSkill.toLowerCase())
          )
        );

        const isBilateral = teachMatch.length > 0 && learnMatch.length > 0;
        let score = 45;
        if (teachMatch.length > 0) score += 26;
        if (learnMatch.length > 0) score += 21;
        if (isBilateral) score += 8;
        if (student.rating >= 4.8) score += 3;
        score = Math.min(98, Math.max(50, score));

        let explanation = '';
        if (isBilateral) {
          explanation = `Perfect 2-way match! You can teach ${learnMatch[0]} while they teach you ${teachMatch[0]}.`;
        } else if (teachMatch.length > 0) {
          explanation = `They teach ${teachMatch[0]}, aligning directly with your goals.`;
        } else if (learnMatch.length > 0) {
          explanation = `They are eager to learn ${learnMatch[0]} from you!`;
        } else {
          explanation = 'High mentor score & compatible study availability.';
        }

        return {
          student,
          matchScore: score,
          matchedTeach: teachMatch,
          matchedLearn: learnMatch,
          isBilateral,
          matchExplanation: explanation
        };
      });

      matches.sort((a, b) => b.matchScore - a.matchScore);
      return { matches };
    });
  },

  // --- Exchange Requests ---
  async getRequests(userId: string): Promise<{
    incoming: ExchangeRequest[];
    sent: ExchangeRequest[];
    accepted: ExchangeRequest[];
    rejected: ExchangeRequest[];
    all: ExchangeRequest[];
  }> {
    return apiFetch(`/api/requests?userId=${userId}`, undefined, () => {
      const incoming = localRequests.filter(r => r.receiverId === userId);
      const sent = localRequests.filter(r => r.senderId === userId);
      const accepted = localRequests.filter(r => (r.receiverId === userId || r.senderId === userId) && r.status === 'accepted');
      const rejected = localRequests.filter(r => (r.receiverId === userId || r.senderId === userId) && r.status === 'rejected');
      return { incoming, sent, accepted, rejected, all: localRequests };
    });
  },

  async createRequest(data: {
    senderId: string;
    senderOfferSkill: string;
    senderWantSkill: string;
    receiverId: string;
    message: string;
    proposedTime?: string;
    meetingType?: 'online' | 'offline';
    meetingLocation?: string;
  }): Promise<{ success: boolean; request: ExchangeRequest }> {
    return apiFetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const sender = localUsers.find(u => u._id === data.senderId) || localUsers[0];
      const receiver = localUsers.find(u => u._id === data.receiverId) || localUsers[1];
      const newReq: ExchangeRequest = {
        _id: `req-${Date.now()}`,
        senderId: sender._id,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        senderCollege: sender.college,
        senderOfferSkill: data.senderOfferSkill,
        senderWantSkill: data.senderWantSkill,
        receiverId: receiver._id,
        receiverName: receiver.name,
        receiverAvatar: receiver.avatar,
        receiverCollege: receiver.college,
        status: 'pending',
        message: data.message,
        proposedTime: data.proposedTime || 'Flexible this week',
        meetingType: data.meetingType || 'online',
        meetingLocation: data.meetingLocation || 'Google Meet',
        createdAt: new Date().toISOString()
      };
      localRequests.unshift(newReq);
      return { success: true, request: newReq };
    });
  },

  async updateRequestStatus(id: string, status: 'accepted' | 'rejected'): Promise<{ success: boolean }> {
    return apiFetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }, () => {
      const req = localRequests.find(r => r._id === id);
      if (req) {
        req.status = status;
        if (status === 'accepted') {
          const newSession: LearningSession = {
            _id: `sess-${Date.now()}`,
            requestId: req._id,
            user1Id: req.senderId,
            user1Name: req.senderName,
            user1Avatar: req.senderAvatar,
            user1Skill: req.senderOfferSkill,
            user2Id: req.receiverId,
            user2Name: req.receiverName,
            user2Avatar: req.receiverAvatar,
            user2Skill: req.senderWantSkill,
            date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            time: req.proposedTime || '4:00 PM',
            meetingType: req.meetingType,
            meetingLink: 'https://meet.google.com/skw-new',
            status: 'scheduled',
            milestones: [
              { id: 'm-1', title: `Phase 1: ${req.senderOfferSkill} Overview`, completed: false },
              { id: 'm-2', title: `Phase 2: Practice & Sandbox Exercises`, completed: false },
              { id: 'm-3', title: `Phase 3: ${req.senderWantSkill} In-depth Walkthrough`, completed: false },
              { id: 'm-4', title: `Phase 4: Feedback & Next Steps`, completed: false }
            ],
            notes: 'Interactive session ready to start.',
            createdAt: new Date().toISOString()
          };
          localSessions.unshift(newSession);
        }
      }
      return { success: true };
    });
  },

  // --- Sessions ---
  async getSessions(userId?: string): Promise<{ sessions: LearningSession[] }> {
    const url = userId ? `/api/sessions?userId=${userId}` : '/api/sessions';
    return apiFetch(url, undefined, () => {
      const userSessions = userId
        ? localSessions.filter(s => s.user1Id === userId || s.user2Id === userId)
        : localSessions;
      return { sessions: userSessions };
    });
  },

  async getSessionById(id: string): Promise<{ session: LearningSession }> {
    return apiFetch(`/api/sessions/${id}`, undefined, () => {
      const session = localSessions.find(s => s._id === id) || localSessions[0];
      return { session };
    });
  },

  async updateSession(id: string, updates: Partial<LearningSession>): Promise<{ success: boolean; session: LearningSession }> {
    return apiFetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }, () => {
      const idx = localSessions.findIndex(s => s._id === id);
      if (idx !== -1) {
        localSessions[idx] = { ...localSessions[idx], ...updates };
        return { success: true, session: localSessions[idx] };
      }
      return { success: false, session: localSessions[0] };
    });
  },

  // --- Reviews ---
  async getReviews(userId?: string): Promise<{ reviews: Review[] }> {
    const url = userId ? `/api/reviews?userId=${userId}` : '/api/reviews';
    return apiFetch(url, undefined, () => {
      const userReviews = userId ? localReviews.filter(r => r.toUserId === userId) : localReviews;
      return { reviews: userReviews };
    });
  },

  async submitReview(data: {
    sessionId?: string;
    fromUserId: string;
    toUserId: string;
    skillName: string;
    rating: number;
    comment: string;
  }): Promise<{ success: boolean; review: Review }> {
    return apiFetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, () => {
      const fromUser = localUsers.find(u => u._id === data.fromUserId) || localUsers[0];
      const toUser = localUsers.find(u => u._id === data.toUserId) || localUsers[1];
      const newRev: Review = {
        _id: `rev-${Date.now()}`,
        sessionId: data.sessionId || 'sess-custom',
        fromUserId: fromUser._id,
        fromUserName: fromUser.name,
        fromUserAvatar: fromUser.avatar,
        toUserId: toUser._id,
        toUserName: toUser.name,
        skillName: data.skillName,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString()
      };
      localReviews.unshift(newRev);
      return { success: true, review: newRev };
    });
  },

  // --- Notifications ---
  async getNotifications(userId: string): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    return apiFetch(`/api/notifications?userId=${userId}`, undefined, () => {
      const notifs = localNotifs.filter(n => n.userId === userId);
      return { notifications: notifs, unreadCount: notifs.filter(n => !n.read).length };
    });
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' }, () => {
      const notif = localNotifs.find(n => n._id === id);
      if (notif) notif.read = true;
      return { success: true };
    });
  },

  async markAllNotificationsRead(userId: string): Promise<{ success: boolean }> {
    return apiFetch('/api/notifications/read-all', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    }, () => {
      localNotifs.forEach(n => {
        if (n.userId === userId) n.read = true;
      });
      return { success: true };
    });
  },

  // --- Leaderboard ---
  async getLeaderboard(): Promise<{ leaderboard: (User & { rank: number })[]; badges: Badge[] }> {
    return apiFetch('/api/leaderboard', undefined, () => {
      const sorted = [...localUsers].sort((a, b) => b.xp - a.xp);
      return {
        leaderboard: sorted.map((usr, i) => ({ ...usr, rank: i + 1 })),
        badges: INITIAL_BADGES
      };
    });
  }
};

let currentSessionUser: User = localUsers[0];

export const api = {
  getCurrentUser: async (): Promise<User> => {
    return currentSessionUser;
  },

  login: async (email: string): Promise<User> => {
    const res = await SkillSwapApi.login(email);
    currentSessionUser = res.user;
    return res.user;
  },

  register: async (data: any): Promise<User> => {
    const res = await SkillSwapApi.register(data);
    currentSessionUser = res.user;
    return res.user;
  },

  logout: () => {
    currentSessionUser = localUsers[0];
  },

  getSkills: async (params?: any): Promise<SkillItem[]> => {
    const res = await SkillSwapApi.getSkills(params);
    return res.skills;
  },

  createSkill: async (data: any): Promise<SkillItem> => {
    const res = await SkillSwapApi.createSkill(data);
    return res.skill;
  },

  getBadges: async (): Promise<Badge[]> => {
    const res = await SkillSwapApi.getLeaderboard();
    return res.badges;
  },

  getLeaderboard: async (): Promise<(User & { rank: number })[]> => {
    const res = await SkillSwapApi.getLeaderboard();
    return res.leaderboard;
  },

  getReviews: async (userId?: string): Promise<Review[]> => {
    const res = await SkillSwapApi.getReviews(userId);
    return res.reviews;
  },

  submitReview: async (data: any): Promise<Review> => {
    const res = await SkillSwapApi.submitReview(data);
    return res.review;
  },

  getRequests: async (userId: string) => {
    return await SkillSwapApi.getRequests(userId);
  },

  createRequest: async (data: any): Promise<ExchangeRequest> => {
    const res = await SkillSwapApi.createRequest(data);
    return res.request;
  },

  acceptRequest: async (requestId: string): Promise<void> => {
    await SkillSwapApi.updateRequestStatus(requestId, 'accepted');
  },

  rejectRequest: async (requestId: string): Promise<void> => {
    await SkillSwapApi.updateRequestStatus(requestId, 'rejected');
  },

  getSessions: async (userId?: string): Promise<LearningSession[]> => {
    const res = await SkillSwapApi.getSessions(userId);
    return res.sessions;
  },

  updateSession: async (sessionId: string, updates: Partial<LearningSession>): Promise<LearningSession> => {
    const res = await SkillSwapApi.updateSession(sessionId, updates);
    return res.session;
  },

  getNotifications: async (userId: string): Promise<NotificationItem[]> => {
    const res = await SkillSwapApi.getNotifications(userId);
    return res.notifications;
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await SkillSwapApi.markNotificationRead(id);
  },

  clearAllNotifications: async (userId: string): Promise<void> => {
    await SkillSwapApi.markAllNotificationsRead(userId);
  },

  getSmartMatches: async (userId: string): Promise<SmartMatchResult[]> => {
    const res = await SkillSwapApi.getSmartMatches(userId);
    return res.matches;
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    const res = await SkillSwapApi.updateUser(userId, updates);
    if (currentSessionUser._id === userId) {
      currentSessionUser = res.user;
    }
    return res.user;
  }
};
