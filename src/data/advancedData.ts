import { StudyRoadmap, StudyCircle, CareerRoleBenchmark } from '../types';

export const INITIAL_ROADMAPS: StudyRoadmap[] = [
  {
    id: 'rdmp-1',
    title: 'Python Automation ⇄ UI/UX & Design Systems',
    category: 'Programming & Design',
    skill1: 'Python Automation',
    skill2: 'UI/UX Design',
    durationWeeks: 4,
    level: 'Intermediate',
    description: 'A structured 4-week bilateral sprint where a developer teaches scripting, APIs, and data parsing, while a designer teaches user journeys, Figma component architectures, and responsive prototypes.',
    popularPartnerCampuses: ['Stanford University', 'UC Berkeley', 'UT Austin'],
    curatedBy: 'Campus Peer Tutoring Council',
    weeks: [
      {
        week: 1,
        title: 'Week 1: Foundations & Architecture',
        skill1Focus: 'Python virtual envs, syntax essentials, and file I/O operations',
        skill2Focus: 'Design thinking fundamentals, typography scale, and Figma interface setup',
        objectives: [
          'Set up GitHub repo and write first Python CSV parsing script',
          'Audit 3 popular apps and build a wireframe moodboard in Figma',
          'Conduct 1 bilateral 60-min live review session'
        ],
        deliverables: [
          'Python script parsing sample grade dataset',
          'Figma low-fidelity wireframe prototype'
        ],
        completed: true
      },
      {
        week: 2,
        title: 'Week 2: Component Design & Web APIs',
        skill1Focus: 'HTTP requests, REST APIs, JSON parsing, and error handling',
        skill2Focus: 'Auto-layout, design tokens, responsive cards, and component variants',
        objectives: [
          'Fetch live weather or student event data with Python requests',
          'Build reusable UI card components with auto-layout in Figma',
          'Exchange peer feedback on syntax and visual rhythm'
        ],
        deliverables: [
          'Working Python API client script with error handling',
          'Figma component set with hover and mobile variants'
        ],
        completed: true
      },
      {
        week: 3,
        title: 'Week 3: Interactive Prototyping & Automation Pipelines',
        skill1Focus: 'Web scraping with BeautifulSoup/Selenium, task scheduling, and cron jobs',
        skill2Focus: 'Smart animate transitions, micro-interactions, and mobile tap targets',
        objectives: [
          'Automate routine campus job or course notifications in Python',
          'Create clickable animated Figma prototype with user flow transitions',
          'Simulate user testing with 2 classmates'
        ],
        deliverables: [
          'Automated course availability notifier script',
          'High-fidelity interactive prototype link'
        ],
        completed: false
      },
      {
        week: 4,
        title: 'Week 4: Capstone Bilateral Showcase & Peer Review',
        skill1Focus: 'Packaging Python utilities into executable scripts or CLI tools',
        skill2Focus: 'Design system documentation, accessibility check (WCAG), and case study outline',
        objectives: [
          'Complete co-authored capstone project combining Python backend & UI mockup',
          'Write bilateral peer assessment and claim verified completion badge'
        ],
        deliverables: [
          'Full-stack prototype demo deck',
          'Verified Skill Certificate claim'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'rdmp-2',
    title: 'React & Frontend Web ⇄ Photoshop & Brand Identity',
    category: 'Web Development & Media',
    skill1: 'React & Tailwind CSS',
    skill2: 'Photoshop & Brand Assets',
    durationWeeks: 4,
    level: 'Beginner',
    description: 'Learn modern component-driven frontend web development while trading professional graphic design, color grading, photo retouching, and vector branding.',
    popularPartnerCampuses: ['MIT', 'Columbia University', 'NYU'],
    curatedBy: 'Digital Media Collective',
    weeks: [
      {
        week: 1,
        title: 'Week 1: Setup & Essential Tools',
        skill1Focus: 'JSX syntax, components, props, and Tailwind utility styling',
        skill2Focus: 'Photoshop layers, selection masks, pen tool, and non-destructive editing',
        objectives: [
          'Create a personalized student profile card in React',
          'Design 3 social media promotional graphics and custom avatar badges in Photoshop'
        ],
        deliverables: [
          'React responsive profile component',
          'High-res layered PSD assets for branding'
        ],
        completed: false
      },
      {
        week: 2,
        title: 'Week 2: State Management & Visual Retouching',
        skill1Focus: 'React useState, useEffect, and mapping data arrays',
        skill2Focus: 'Curves, adjustment layers, camera raw filtering, and editorial retouching',
        objectives: [
          'Build an interactive filterable skill gallery in React',
          'Create high-contrast editorial photography assets for portfolio showcase'
        ],
        deliverables: [
          'Functional filterable React gallery',
          'Photo portfolio suite before/after'
        ],
        completed: false
      },
      {
        week: 3,
        title: 'Week 3: Responsive Layouts & Composite Mockups',
        skill1Focus: 'Grid and Flexbox systems, mobile breakpoints, and drawer navigation',
        skill2Focus: 'Product mockups, smart objects, typography posters, and export presets',
        objectives: [
          'Ensure perfect mobile responsiveness across phones and laptops',
          'Create 3D-styled device mockups displaying the web app'
        ],
        deliverables: [
          'Mobile-first responsive web view',
          'App store mockup banner suite'
        ],
        completed: false
      },
      {
        week: 4,
        title: 'Week 4: Final Launch & Portfolio Integration',
        skill1Focus: 'Production deployment to Vercel/Netlify, Lighthouse audits',
        skill2Focus: 'Portfolio presentation deck, Behance case study graphics',
        objectives: [
          'Deploy live website link and verify 95+ performance score',
          'Final bilateral presentation and reciprocal peer endorsements'
        ],
        deliverables: [
          'Live production URL',
          'Behance-ready case study presentation'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'rdmp-3',
    title: 'Data Structures & Algorithms ⇄ Public Speaking & Pitching',
    category: 'Academics & Communication',
    skill1: 'Data Structures & LeetCode',
    skill2: 'Public Speaking & Debate',
    durationWeeks: 3,
    level: 'Advanced',
    description: 'Crush technical coding interviews and elevate your presentation poise. Master two pointers, binary search, and dynamic programming while mastering vocal modulation, storytelling, and pitch decks.',
    popularPartnerCampuses: ['Stanford University', 'Carnegie Mellon', 'Harvard'],
    curatedBy: 'Campus Career & Tech Society',
    weeks: [
      {
        week: 1,
        title: 'Week 1: Structured Thinking & First Impressions',
        skill1Focus: 'Time/space complexity (Big-O), arrays, hash maps, two-pointer techniques',
        skill2Focus: 'Vocal projection, eye contact, commanding stage presence, 60-second elevator pitch',
        objectives: [
          'Solve 5 medium LeetCode array/hashmap problems with clean code',
          'Record and critique 2-minute introductory pitch on personal vision'
        ],
        deliverables: [
          'Solutions writeup with Big-O breakdown',
          'Recorded 2-min elevator pitch'
        ],
        completed: false
      },
      {
        week: 2,
        title: 'Week 2: Depth & Narrative Structuring',
        skill1Focus: 'Trees, graphs (BFS/DFS), and recursion patterns',
        skill2Focus: 'Storytelling frameworks (STAR method), handling tough Q&A, slide economy',
        objectives: [
          'Implement tree traversal and graph cycle detection algorithms',
          'Deliver 5-minute technical walkthrough simulating an executive pitch'
        ],
        deliverables: [
          'Graph algorithm implementation suite',
          'Slide deck with narrative arc'
        ],
        completed: false
      },
      {
        week: 3,
        title: 'Week 3: High-Stakes Mock Simulation',
        skill1Focus: 'Dynamic programming, memoization, and live whiteboard coding',
        skill2Focus: 'Mock technical interview pitch, pressure testing, negotiation tactics',
        objectives: [
          'Conduct 45-minute live mock coding interview under real test constraints',
          'Deliver 5-minute startup or research pitch with live peer cross-examination'
        ],
        deliverables: [
          'Full interview performance evaluation rubric',
          'Reciprocal peer endorsement'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'rdmp-4',
    title: 'Conversational Spanish ⇄ Creative Writing & Essay Craft',
    category: 'Languages & Academics',
    skill1: 'Conversational Spanish',
    skill2: 'Creative Writing & Prose',
    durationWeeks: 4,
    level: 'Beginner',
    description: 'Immerse yourself in everyday native conversational Spanish while refining your literary prose, narrative rhythm, and academic essay composition.',
    popularPartnerCampuses: ['Columbia University', 'UT Austin', 'UC Berkeley'],
    curatedBy: 'Humanities & Language Guild',
    weeks: [
      {
        week: 1,
        title: 'Week 1: Voice & Expression',
        skill1Focus: 'Everyday greetings, pronunciation rules, personal introduction dialogue',
        skill2Focus: 'Sensory imagery, strong verbs, eliminating passive voice, freewriting',
        objectives: [
          'Hold a 15-minute Spanish dialogue about hobbies and daily routines',
          'Draft a 500-word descriptive personal essay with sensory details'
        ],
        deliverables: [
          'Audio recording of conversational introduction',
          'Revised personal narrative draft'
        ],
        completed: false
      },
      {
        week: 2,
        title: 'Week 2: Past Tense & Narrative Tension',
        skill1Focus: 'Pretérito vs Imperfecto with colloquial storytelling expressions',
        skill2Focus: 'Pacing, dialogue tags, subtext, showing vs telling in prose',
        objectives: [
          'Recount a memorable childhood story in conversational Spanish',
          'Write a dialogue-heavy scene between two contrasting characters'
        ],
        deliverables: [
          'Story narration in Spanish with feedback notes',
          'Character dialogue excerpt'
        ],
        completed: false
      },
      {
        week: 3,
        title: 'Week 3: Idioms, Culture & Structural Polish',
        skill1Focus: 'Regional slang (Spain vs Latin America), idioms, expressing opinions',
        skill2Focus: 'Essay structure, thematic resonance, metaphor development',
        objectives: [
          'Debate a cultural topic for 20 minutes entirely in Spanish',
          'Critique and line-edit a partner essay with structured feedback'
        ],
        deliverables: [
          'Vocab deck with 30 colloquial idioms',
          'Annotated essay edit'
        ],
        completed: false
      },
      {
        week: 4,
        title: 'Week 4: Final Bilingual Reading & Celebration',
        skill1Focus: 'Spontaneous conversation without notes, movie / book discussion',
        skill2Focus: 'Final reading performance, publication readiness, submission guidelines',
        objectives: [
          'Host a 30-minute bilingual discussion session',
          'Final reciprocal feedback and badge issuance'
        ],
        deliverables: [
          'Final dual-language reading portfolio',
          'Certificate of completion'
        ],
        completed: false
      }
    ]
  }
];

export const INITIAL_CIRCLES: StudyCircle[] = [
  {
    id: 'circle-1',
    title: 'Stanford AI & Python Working Group',
    campus: 'Stanford University',
    subject: 'Artificial Intelligence & Machine Learning',
    description: 'Weekly peer lab where we collaborate on fine-tuning open-source models, scraping research datasets, and building multi-agent automation scripts.',
    schedule: 'Every Thursday, 6:00 PM - 7:30 PM PST',
    nextSessionDate: '2026-10-08',
    nextSessionTime: '6:00 PM PST',
    meetingLink: 'https://meet.google.com/stanford-ai-peerlab',
    meetingLocation: 'Gates Computer Science Building Room 104',
    hostName: 'Alex Chen',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    hostRole: 'Junior CS & Peer Facilitator',
    membersCount: 24,
    isJoined: true,
    tags: ['Python', 'PyTorch', 'Agents', 'APIs'],
    discussion: [
      {
        id: 'post-1',
        authorId: 'usr-1',
        authorName: 'Alex Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        authorCollege: 'Stanford University',
        timestamp: '2 hours ago',
        content: 'Hey everyone! This Thursday we will do a live hands-on walkthrough on building retrieval-augmented generation pipelines using local embeddings. Bring your laptops with Python 3.11 installed!',
        likes: 12,
        repliesCount: 4,
        tag: 'Lab Announcement'
      },
      {
        id: 'post-2',
        authorId: 'usr-3',
        authorName: 'Priya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        authorCollege: 'UT Austin',
        timestamp: '5 hours ago',
        content: 'I created a set of Figma UI templates for AI prompt playgrounds if anyone wants to skin their model demos before demo night!',
        likes: 8,
        repliesCount: 2,
        tag: 'Resource Share'
      }
    ]
  },
  {
    id: 'circle-2',
    title: 'UC Berkeley UI/UX & Design Jam',
    campus: 'UC Berkeley',
    subject: 'Design & Creative Technology',
    description: 'Bi-weekly portfolio roast, Figma design systems workshop, and mobile design challenge. Open to novices and experienced designers alike.',
    schedule: 'Tuesdays, 5:30 PM - 7:00 PM PST',
    nextSessionDate: '2026-10-06',
    nextSessionTime: '5:30 PM PST',
    meetingLink: 'https://meet.google.com/cal-design-jam',
    meetingLocation: 'Jacobs Hall Studio 210',
    hostName: 'Rahul Sharma',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    hostRole: 'Senior Media Studies & Design Lead',
    membersCount: 31,
    isJoined: false,
    tags: ['Figma', 'UI/UX', 'Portfolio Review', 'Typography'],
    discussion: [
      {
        id: 'post-3',
        authorId: 'usr-2',
        authorName: 'Rahul Sharma',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        authorCollege: 'UC Berkeley',
        timestamp: '1 day ago',
        content: 'Theme for next session: Redesigning campus dining menus for extreme legibility and mobile ordering. We will do 45 minutes of speed prototyping followed by peer roasts!',
        likes: 19,
        repliesCount: 7,
        tag: 'Design Challenge'
      }
    ]
  },
  {
    id: 'circle-3',
    title: 'UT Austin LeetCode & Algorithms Peer Sprint',
    campus: 'UT Austin',
    subject: 'Computer Science & Interview Prep',
    description: 'Tackle blind 75 problems together in timed 30-minute pairs, then conduct mock whiteboard walkthroughs with peer feedback on trade-offs.',
    schedule: 'Sundays, 2:00 PM - 4:00 PM CST',
    nextSessionDate: '2026-10-11',
    nextSessionTime: '2:00 PM CST',
    meetingLink: 'https://meet.google.com/ut-leetcode-sprint',
    meetingLocation: 'Gates Dell Complex (GDC) 2.214',
    hostName: 'Priya Patel',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    hostRole: 'Junior CS & Coding Mentor',
    membersCount: 42,
    isJoined: true,
    tags: ['Algorithms', 'Data Structures', 'Tech Interviews', 'Whiteboarding'],
    discussion: [
      {
        id: 'post-4',
        authorId: 'usr-3',
        authorName: 'Priya Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        authorCollege: 'UT Austin',
        timestamp: 'Yesterday',
        content: 'This Sunday we are hitting Monotonic Stack and Sliding Window patterns. Make sure to review basic deque operations in your preferred language!',
        likes: 15,
        repliesCount: 5,
        tag: 'Problem Set'
      }
    ]
  },
  {
    id: 'circle-4',
    title: 'NYU Creative Video & Premiere Creators Lab',
    campus: 'New York University',
    subject: 'Video Editing & Visual Storytelling',
    description: 'Student video creators, YouTubers, and documentary filmmakers swapping color grading LUTs, pacing techniques, and sound design workflows in Premiere & DaVinci.',
    schedule: 'Mondays, 7:00 PM - 8:30 PM EST',
    nextSessionDate: '2026-10-05',
    nextSessionTime: '7:00 PM EST',
    meetingLink: 'https://meet.google.com/nyu-video-lab',
    meetingLocation: 'Tisch Hall Media Suite 3B',
    hostName: 'Marcus Vance',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    hostRole: 'Media Producer & Pitch Coach',
    membersCount: 18,
    isJoined: false,
    tags: ['Video Editing', 'Premiere Pro', 'DaVinci Resolve', 'Sound Design'],
    discussion: [
      {
        id: 'post-5',
        authorId: 'usr-4',
        authorName: 'Marcus Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        authorCollege: 'New York University',
        timestamp: '3 days ago',
        content: 'Shared a Google Drive folder of 15 royalty-free cinematic ambient audio beds for your student short films. Check the link in the circle bio!',
        likes: 14,
        repliesCount: 3,
        tag: 'Free Assets'
      }
    ]
  },
  {
    id: 'circle-5',
    title: 'Columbia & NYC Language Exchange Cafe',
    campus: 'Columbia University',
    subject: 'Languages & Cultural Exchange',
    description: 'Casual multi-lingual conversation tables in Spanish, French, Mandarin, Japanese, and German. Switch languages every 20 minutes over coffee or tea.',
    schedule: 'Fridays, 4:00 PM - 6:00 PM EST',
    nextSessionDate: '2026-10-09',
    nextSessionTime: '4:00 PM EST',
    meetingLink: 'https://meet.google.com/columbia-language-cafe',
    meetingLocation: 'Lerner Hall Student Lounge',
    hostName: 'Elena Rostova',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    hostRole: 'Linguistics & Comparative Literature',
    membersCount: 38,
    isJoined: false,
    tags: ['Spanish', 'French', 'Mandarin', 'Cultural Exchange'],
    discussion: [
      {
        id: 'post-6',
        authorId: 'usr-5',
        authorName: 'Elena Rostova',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        authorCollege: 'Columbia University',
        timestamp: '4 days ago',
        content: 'This week we have a special Spanish-French table pairing students from the Paris & Madrid exchange cohorts! Looking forward to seeing you all.',
        likes: 21,
        repliesCount: 6,
        tag: 'Social Meetup'
      }
    ]
  }
];

export const CAREER_BENCHMARKS: CareerRoleBenchmark[] = [
  {
    id: 'role-fullstack',
    roleName: 'Full-Stack Software Engineer',
    icon: '💻',
    category: 'Engineering & Software',
    averageSalary: '$118,000 / yr',
    description: 'Architects robust end-to-end web applications, combining intuitive reactive frontends with scalable databases and reliable cloud APIs.',
    requiredSkills: [
      { name: 'Python', importance: 'critical', category: 'Programming' },
      { name: 'React', importance: 'critical', category: 'Web Development' },
      { name: 'SQL', importance: 'critical', category: 'Programming' },
      { name: 'Data Structures', importance: 'critical', category: 'Programming' },
      { name: 'UI/UX Design', importance: 'recommended', category: 'Design' },
      { name: 'Public Speaking', importance: 'recommended', category: 'Communication' }
    ]
  },
  {
    id: 'role-aiml',
    roleName: 'AI & Machine Learning Engineer',
    icon: '🤖',
    category: 'Artificial Intelligence & Data',
    averageSalary: '$135,000 / yr',
    description: 'Designs predictive models, optimizes neural network pipelines, conducts statistical data modeling, and automates agentic workflows.',
    requiredSkills: [
      { name: 'Python', importance: 'critical', category: 'Programming' },
      { name: 'Machine Learning', importance: 'critical', category: 'Programming' },
      { name: 'Data Structures', importance: 'critical', category: 'Programming' },
      { name: 'SQL', importance: 'critical', category: 'Programming' },
      { name: 'Public Speaking', importance: 'recommended', category: 'Communication' },
      { name: 'Business Strategy', importance: 'optional', category: 'Business' }
    ]
  },
  {
    id: 'role-product-designer',
    roleName: 'Product Designer (UI/UX)',
    icon: '🎨',
    category: 'Design & Human-Computer Interaction',
    averageSalary: '$104,000 / yr',
    description: 'Crafts seamless digital user experiences, user research frameworks, component systems, and design tokens for cross-platform products.',
    requiredSkills: [
      { name: 'UI/UX Design', importance: 'critical', category: 'Design' },
      { name: 'Photoshop', importance: 'critical', category: 'Design' },
      { name: 'Graphic Design', importance: 'critical', category: 'Design' },
      { name: 'Public Speaking', importance: 'recommended', category: 'Communication' },
      { name: 'Web Development', importance: 'recommended', category: 'Web Development' },
      { name: 'Video Editing', importance: 'optional', category: 'Video Editing' }
    ]
  },
  {
    id: 'role-tech-founder',
    roleName: 'Technical Startup Founder',
    icon: '🚀',
    category: 'Entrepreneurship & Strategy',
    averageSalary: 'Equity + $95,000 base',
    description: 'Builds early minimum viable products, pitches to venture investors, recruits collegiate co-founders, and drives customer discovery.',
    requiredSkills: [
      { name: 'Public Speaking', importance: 'critical', category: 'Communication' },
      { name: 'Business Strategy', importance: 'critical', category: 'Business' },
      { name: 'Python', importance: 'recommended', category: 'Programming' },
      { name: 'UI/UX Design', importance: 'recommended', category: 'Design' },
      { name: 'Video Editing', importance: 'recommended', category: 'Video Editing' },
      { name: 'SQL', importance: 'optional', category: 'Programming' }
    ]
  },
  {
    id: 'role-digital-creator',
    roleName: 'Creative Media Director & Producer',
    icon: '🎬',
    category: 'Media & Digital Content',
    averageSalary: '$88,000 / yr',
    description: 'Produces high-impact documentary and commercial brand video, narrative motion design, audio post-production, and social campaign assets.',
    requiredSkills: [
      { name: 'Video Editing', importance: 'critical', category: 'Video Editing' },
      { name: 'Photoshop', importance: 'critical', category: 'Design' },
      { name: 'Graphic Design', importance: 'critical', category: 'Design' },
      { name: 'Public Speaking', importance: 'recommended', category: 'Communication' },
      { name: 'UI/UX Design', importance: 'optional', category: 'Design' }
    ]
  }
];
