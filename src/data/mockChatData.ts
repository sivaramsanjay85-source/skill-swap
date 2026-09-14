import { ChatConversation, ChatMessage } from '../types';

export const INITIAL_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-rahul-photoshop',
    partnerId: 'usr-2',
    partnerName: 'Rahul Sharma',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    partnerCollege: 'UC Berkeley',
    mySkill: 'Python & Automation',
    partnerSkill: 'Photoshop & Retouching',
    lastMessage: 'Awesome! I uploaded the sample RAW photos to our shared Drive. See you tomorrow at 4 PM!',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    onlineStatus: 'online',
    isAgreedSwap: true,
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-rahul-photoshop',
        senderId: 'usr-2',
        senderName: 'Rahul Sharma',
        text: 'Hey Alex! So pumped we agreed on this swap. I really need Python for parsing video metadata, and I can walk you through frequency separation in Photoshop!',
        timestamp: 'Yesterday 3:15 PM',
        status: 'read'
      },
      {
        id: 'msg-2',
        conversationId: 'conv-rahul-photoshop',
        senderId: 'usr-1',
        senderName: 'Alex Chen',
        text: "Hey Rahul! That sounds perfect. I already put together a Jupyter notebook with beginner data structures and automation scripts so we can hit the ground running.",
        timestamp: 'Yesterday 3:24 PM',
        status: 'read'
      },
      {
        id: 'msg-3',
        conversationId: 'conv-rahul-photoshop',
        senderId: 'usr-2',
        senderName: 'Rahul Sharma',
        text: 'That is super helpful! How about we do 45 mins of Photoshop masking & layers first, then switch to Python loops?',
        timestamp: 'Yesterday 3:30 PM',
        status: 'read'
      },
      {
        id: 'msg-4',
        conversationId: 'conv-rahul-photoshop',
        senderId: 'usr-1',
        senderName: 'Alex Chen',
        text: 'Deal! Does tomorrow at 4:00 PM PST work for you? We can hop on the Google Meet link attached to our session.',
        timestamp: '10:30 AM',
        status: 'read'
      },
      {
        id: 'msg-5',
        conversationId: 'conv-rahul-photoshop',
        senderId: 'usr-2',
        senderName: 'Rahul Sharma',
        text: 'Awesome! I uploaded the sample RAW photos to our shared Drive. See you tomorrow at 4 PM!',
        timestamp: '10:42 AM',
        status: 'read',
        attachment: {
          type: 'resource',
          title: 'berkeley_sample_photos_psd.zip (42 MB)',
          url: '#'
        }
      }
    ]
  },
  {
    id: 'conv-priya-uiux',
    partnerId: 'usr-3',
    partnerName: 'Priya Patel',
    partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    partnerCollege: 'UT Austin',
    mySkill: 'Machine Learning',
    partnerSkill: 'UI/UX & Figma Systems',
    lastMessage: 'Check out the auto-layout and typography tokens I set up in Figma! Can you explain convolutional layers next?',
    lastMessageTime: '9:15 AM',
    unreadCount: 0,
    onlineStatus: 'in-class',
    isAgreedSwap: true,
    messages: [
      {
        id: 'msg-p1',
        conversationId: 'conv-priya-uiux',
        senderId: 'usr-3',
        senderName: 'Priya Patel',
        text: 'Hi Alex! Thanks for accepting the exchange request. Excited to learn how PyTorch models process image vectors!',
        timestamp: '2 days ago',
        status: 'read'
      },
      {
        id: 'msg-p2',
        conversationId: 'conv-priya-uiux',
        senderId: 'usr-1',
        senderName: 'Alex Chen',
        text: "Hey Priya! Thrilled to work together. Your portfolio on Behance is stunning. I've been struggling with building responsive design tokens in Figma.",
        timestamp: '2 days ago',
        status: 'read'
      },
      {
        id: 'msg-p3',
        conversationId: 'conv-priya-uiux',
        senderId: 'usr-3',
        senderName: 'Priya Patel',
        text: 'Check out the auto-layout and typography tokens I set up in Figma! Can you explain convolutional layers next?',
        timestamp: '9:15 AM',
        status: 'read',
        attachment: {
          type: 'link',
          title: 'Figma: Design System 2026 Component Library',
          url: 'https://figma.com/@skillswap-college'
        }
      }
    ]
  },
  {
    id: 'conv-marcus-speaking',
    partnerId: 'usr-4',
    partnerName: 'Marcus Vance',
    partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    partnerCollege: 'NYU Stern',
    mySkill: 'Web Development (React)',
    partnerSkill: 'Public Speaking & Pitching',
    lastMessage: "I reviewed your pitch deck slides! Let's rehearse the 2-minute elevator pitch over audio.",
    lastMessageTime: 'Sep 12',
    unreadCount: 0,
    onlineStatus: 'offline',
    isAgreedSwap: true,
    messages: [
      {
        id: 'msg-m1',
        conversationId: 'conv-marcus-speaking',
        senderId: 'usr-4',
        senderName: 'Marcus Vance',
        text: 'Hey Alex! Confirming our swap: 2 hours of pitch rehearsal & storytelling drills for 2 hours of React component troubleshooting.',
        timestamp: 'Sep 12, 2:00 PM',
        status: 'read'
      },
      {
        id: 'msg-m2',
        conversationId: 'conv-marcus-speaking',
        senderId: 'usr-1',
        senderName: 'Alex Chen',
        text: 'Confirmed Marcus! I checked your code repository and spotted where the state re-renders were slowing down your dashboard.',
        timestamp: 'Sep 12, 2:15 PM',
        status: 'read'
      },
      {
        id: 'msg-m3',
        conversationId: 'conv-marcus-speaking',
        senderId: 'usr-4',
        senderName: 'Marcus Vance',
        text: "I reviewed your pitch deck slides! Let's rehearse the 2-minute elevator pitch over audio.",
        timestamp: 'Sep 12, 3:00 PM',
        status: 'read'
      }
    ]
  }
];

// Contextual responses when user types a message in mock chat
export const SIMULATED_PARTNER_REPLIES: Record<string, string[]> = {
  'usr-2': [ // Rahul Sharma
    "Got it! That sounds like a solid plan. I'll have my layers prep sheet ready.",
    "Sounds great! Should we hop on Google Meet or test the camera feed first?",
    "Perfect! I will test out that Python script on my terminal right away.",
    "Thanks for explaining that! Looking forward to mastering loops and list comprehensions tomorrow.",
    "Awesome! Feel free to ping me if you need any other sample PSD assets before we begin."
  ],
  'usr-3': [ // Priya Patel
    "Awesome note! I'm bookmarking that article on convolutional networks.",
    "Totally agree. When setting up nested frames in Figma, auto-layout with min/max widths makes everything responsive.",
    "Sounds like a plan! Let's meet on Discord or Google Meet after my 2 PM studio class.",
    "Super cool! Excited to see how we can hook up this interface to the model."
  ],
  'usr-4': [ // Marcus Vance
    "Brilliant! The main thing in pitching is pacing and pausing at key metrics.",
    "I'll pull up the Vite server locally and test out the hooks you mentioned.",
    "Great advice! Let's do a quick mock session this Thursday evening."
  ],
  default: [
    "Thanks for the message! I'm reviewing our swap milestones now and will be ready for our session.",
    "Sounds great! Let's make sure we both log our learning hours on the platform after.",
    "Awesome, see you then! Looking forward to leveling up our skills together."
  ]
};
