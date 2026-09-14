export type SkillCategory =
  | 'Programming'
  | 'Web Development'
  | 'Design'
  | 'Video Editing'
  | 'Photography'
  | 'Communication'
  | 'Languages'
  | 'Music'
  | 'Academics'
  | 'Business';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  department: string;
  bio: string;
  avatar: string;
  skillsTeach: string[];
  skillsLearn: string[];
  experienceLevel?: ExperienceLevel;
  availability: string;
  rating: number;
  ratingCount: number;
  completedExchanges: number;
  xp: number;
  badges: string[];
  createdAt: string;
  joinedDate?: string;
}

export interface SkillItem {
  _id: string;
  userId: string;
  userName: string;
  userCollege: string;
  userAvatar: string;
  name: string;
  category: SkillCategory;
  level: ExperienceLevel;
  description: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  completedSwaps: number;
  createdAt: string;
}

export interface SmartMatchResult {
  student: User;
  matchScore: number;
  matchedTeach: string[];
  matchedLearn: string[];
  isBilateral: boolean;
  matchExplanation: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface ExchangeRequest {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderCollege: string;
  senderOfferSkill: string;
  senderWantSkill: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  receiverCollege: string;
  status: RequestStatus;
  message: string;
  proposedTime: string;
  meetingType: 'online' | 'offline';
  meetingLocation: string;
  createdAt: string;
}

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed';

export interface SessionMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface LearningSession {
  _id: string;
  requestId: string;
  user1Id: string;
  user1Name: string;
  user1Avatar: string;
  user1Skill: string;
  user2Id: string;
  user2Name: string;
  user2Avatar: string;
  user2Skill: string;
  date: string;
  time: string;
  meetingType: 'online' | 'offline';
  meetingLink: string;
  status: SessionStatus;
  milestones: SessionMilestone[];
  notes: string;
  completedAt?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  sessionId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  skillName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'accepted' | 'session' | 'review' | 'match';
  read: boolean;
  linkId?: string;
  createdAt: string;
}

export type Notification = NotificationItem;

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  criteria: string;
  unlocked?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'link' | 'resource' | 'meet';
    title: string;
    url?: string;
  };
}

export interface ChatConversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerCollege: string;
  mySkill: string;
  partnerSkill: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  onlineStatus: 'online' | 'in-class' | 'offline';
  isAgreedSwap: boolean;
  messages: ChatMessage[];
}

export type ActivePage =
  | 'home'
  | 'explore'
  | 'matching'
  | 'requests'
  | 'sessions'
  | 'chat'
  | 'analytics'
  | 'leaderboard'
  | 'profile'
  | 'notifications'
  | 'how-it-works'
  | 'about'
  | 'auth';
