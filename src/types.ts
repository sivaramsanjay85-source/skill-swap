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

export interface RoadmapWeek {
  week: number;
  title: string;
  skill1Focus: string;
  skill2Focus: string;
  objectives: string[];
  deliverables: string[];
  completed?: boolean;
}

export interface StudyRoadmap {
  id: string;
  title: string;
  category: string;
  skill1: string;
  skill2: string;
  durationWeeks: number;
  level: ExperienceLevel;
  description: string;
  popularPartnerCampuses: string[];
  weeks: RoadmapWeek[];
  curatedBy: string;
  isCustom?: boolean;
}

export interface CircleDiscussionPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorCollege: string;
  timestamp: string;
  content: string;
  likes: number;
  repliesCount: number;
  tag?: string;
}

export interface StudyCircle {
  id: string;
  title: string;
  campus: string;
  subject: string;
  description: string;
  schedule: string;
  nextSessionDate: string;
  nextSessionTime: string;
  meetingLink: string;
  meetingLocation: string;
  hostName: string;
  hostAvatar: string;
  hostRole: string;
  membersCount: number;
  isJoined?: boolean;
  tags: string[];
  discussion: CircleDiscussionPost[];
}

export interface CareerRoleBenchmark {
  id: string;
  roleName: string;
  icon: string;
  category: string;
  averageSalary: string;
  description: string;
  requiredSkills: {
    name: string;
    importance: 'critical' | 'recommended' | 'optional';
    category: SkillCategory;
  }[];
}

export interface CampusCertificate {
  certificateId: string;
  issueDate: string;
  studentName: string;
  partnerName: string;
  studentCollege: string;
  skillTaught: string;
  skillLearned: string;
  hoursCompleted: number;
  verificationHash: string;
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
  | 'roadmaps'
  | 'circles'
  | 'skill-gap'
  | 'profile'
  | 'notifications'
  | 'how-it-works'
  | 'about'
  | 'auth';
