export interface TrendingSkill {
  rank: number;
  name: string;
  category: string;
  demandScore: number; // 0-100
  growthRate: string; // e.g. "+34%"
  totalSwaps: number;
  avgRating: number;
  topCollege: string;
  ratio: string; // e.g. "4:1 Demand/Offer"
}

export interface CollegeAnalytics {
  collegeName: string;
  shortName: string;
  totalSwaps: number;
  activeHours: number;
  activeStudents: number;
  topCategory: string;
  badge: string;
}

export interface CategoryDistribution {
  category: string;
  swaps: number;
  percentage: number;
  color: string;
  hours: number;
}

export interface WeeklyActivityPoint {
  day: string;
  hours: number;
  swaps: number;
}

export const PLATFORM_ANALYTICS = {
  totalSkillsSwapped: 3482,
  swapsMonthOverMonth: '+28.4%',
  totalActiveHours: 5218,
  activeStudents: 12400,
  averageSessionRating: 4.89,
  estimatedStudentSavingsUSD: 234810, // based on $45/hr average private tutor cost
  topCampusesCount: 48,
  skillsOfferedCount: 860,
  bilateralMatchRate: '92.6%',

  // Top trending skills at college
  trendingSkills: [
    {
      rank: 1,
      name: 'Python for AI & Automation',
      category: 'Programming',
      demandScore: 98,
      growthRate: '+44%',
      totalSwaps: 842,
      avgRating: 4.95,
      topCollege: 'Stanford University',
      ratio: '5.2:1 Want vs Have'
    },
    {
      rank: 2,
      name: 'Figma UI/UX & Design Systems',
      category: 'Design',
      demandScore: 94,
      growthRate: '+38%',
      totalSwaps: 715,
      avgRating: 4.92,
      topCollege: 'UT Austin',
      ratio: '4.1:1 Want vs Have'
    },
    {
      rank: 3,
      name: 'Photoshop & Digital Retouching',
      category: 'Design',
      demandScore: 89,
      growthRate: '+29%',
      totalSwaps: 590,
      avgRating: 4.88,
      topCollege: 'UC Berkeley',
      ratio: '3.6:1 Want vs Have'
    },
    {
      rank: 4,
      name: 'Fullstack React & Next.js',
      category: 'Web Development',
      demandScore: 86,
      growthRate: '+31%',
      totalSwaps: 524,
      avgRating: 4.86,
      topCollege: 'MIT',
      ratio: '3.3:1 Want vs Have'
    },
    {
      rank: 5,
      name: 'Video Editing & Premiere / DaVinci',
      category: 'Video Editing',
      demandScore: 82,
      growthRate: '+25%',
      totalSwaps: 418,
      avgRating: 4.84,
      topCollege: 'NYU Tisch',
      ratio: '2.8:1 Want vs Have'
    },
    {
      rank: 6,
      name: 'Spanish Conversational Fluency',
      category: 'Languages',
      demandScore: 78,
      growthRate: '+22%',
      totalSwaps: 375,
      avgRating: 4.91,
      topCollege: 'UCLA',
      ratio: '2.5:1 Want vs Have'
    },
    {
      rank: 7,
      name: 'Public Speaking & Startup Pitching',
      category: 'Communication',
      demandScore: 74,
      growthRate: '+19%',
      totalSwaps: 320,
      avgRating: 4.79,
      topCollege: 'Harvard Business',
      ratio: '2.1:1 Want vs Have'
    },
    {
      rank: 8,
      name: 'Acoustic & Electric Guitar',
      category: 'Music',
      demandScore: 68,
      growthRate: '+16%',
      totalSwaps: 260,
      avgRating: 4.93,
      topCollege: 'Berklee / Boston Univ',
      ratio: '1.9:1 Want vs Have'
    }
  ] as TrendingSkill[],

  // Campus Analytics Breakdown
  collegeLeaderboard: [
    {
      collegeName: 'UC Berkeley',
      shortName: 'Cal',
      totalSwaps: 812,
      activeHours: 1240,
      activeStudents: 2890,
      topCategory: 'Design & Web Dev',
      badge: '🏆 #1 Exchange Hub'
    },
    {
      collegeName: 'Stanford University',
      shortName: 'Stanford',
      totalSwaps: 740,
      activeHours: 1120,
      activeStudents: 2450,
      topCategory: 'AI & Python',
      badge: '🔥 Highest Rated'
    },
    {
      collegeName: 'UT Austin',
      shortName: 'Longhorns',
      totalSwaps: 615,
      activeHours: 940,
      activeStudents: 2100,
      topCategory: 'UI/UX & Creative Tech',
      badge: '⚡ Fastest Growing'
    },
    {
      collegeName: 'MIT',
      shortName: 'MIT',
      totalSwaps: 498,
      activeHours: 780,
      activeStudents: 1680,
      topCategory: 'Algorithms & Robotics',
      badge: '💡 Deep Tech'
    },
    {
      collegeName: 'New York University',
      shortName: 'NYU',
      totalSwaps: 462,
      activeHours: 690,
      activeStudents: 1540,
      topCategory: 'Media, Film & Pitching',
      badge: '🎬 Creative Power'
    },
    {
      collegeName: 'University of Michigan',
      shortName: 'UMich',
      totalSwaps: 355,
      activeHours: 448,
      activeStudents: 1180,
      topCategory: 'Business & Coding',
      badge: '🌟 High Engagement'
    }
  ] as CollegeAnalytics[],

  // Category Distribution
  categoryBreakdown: [
    { category: 'Programming & AI', swaps: 980, percentage: 28, color: '#6366f1', hours: 1470 },
    { category: 'Design & 3D Modeling', swaps: 760, percentage: 22, color: '#14b8a6', hours: 1140 },
    { category: 'Web Development', swaps: 560, percentage: 16, color: '#0ea5e9', hours: 840 },
    { category: 'Video Editing & Media', swaps: 420, percentage: 12, color: '#f59e0b', hours: 630 },
    { category: 'Languages & Culture', swaps: 350, percentage: 10, color: '#ec4899', hours: 525 },
    { category: 'Communication & Business', swaps: 250, percentage: 7, color: '#8b5cf6', hours: 375 },
    { category: 'Music & Audio', swaps: 162, percentage: 5, color: '#10b981', hours: 238 }
  ] as CategoryDistribution[],

  // Weekly study hours trends
  weeklyActivity: [
    { day: 'Mon', hours: 740, swaps: 48 },
    { day: 'Tue', hours: 890, swaps: 62 },
    { day: 'Wed', hours: 960, swaps: 69 },
    { day: 'Thu', hours: 910, swaps: 64 },
    { day: 'Fri', hours: 680, swaps: 45 },
    { day: 'Sat', hours: 1040, swaps: 78 },
    { day: 'Sun', hours: 1120, swaps: 84 }
  ] as WeeklyActivityPoint[]
};
