import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_SKILLS,
  INITIAL_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BADGES
} from './src/data/seedData';
import { User, SkillItem, ExchangeRequest, LearningSession, Review, NotificationItem } from './src/types';

// In-Memory MongoDB-like Data Store with seed data
let users: User[] = JSON.parse(JSON.stringify(INITIAL_USERS));
let skills: SkillItem[] = JSON.parse(JSON.stringify(INITIAL_SKILLS));
let exchangeRequests: ExchangeRequest[] = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
let sessions: LearningSession[] = JSON.parse(JSON.stringify(INITIAL_SESSIONS));
let reviews: Review[] = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
let notifications: NotificationItem[] = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // REST API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- Auth & Users ---
  app.post('/api/auth/login', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (user) {
      res.json({ success: true, user });
    } else {
      // Default to Alex Chen if test user not found or fallback
      res.json({ success: true, user: users[0] });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, college, department, password, skillsTeach, skillsLearn } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const newUser: User = {
      _id: `usr-${Date.now()}`,
      name,
      email,
      college: college || 'University Campus',
      department: department || 'General Studies',
      bio: `Hello! I'm ${name}, excited to exchange skills on SkillSwap.`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      skillsTeach: skillsTeach || ['Python', 'Graphic Design'],
      skillsLearn: skillsLearn || ['UI/UX Design', 'Public Speaking'],
      experienceLevel: 'Intermediate',
      availability: 'Weekday afternoons & weekends',
      rating: 5.0,
      ratingCount: 0,
      completedExchanges: 0,
      xp: 150,
      badges: ['rising-star'],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    // Create a welcoming notification
    notifications.unshift({
      _id: `notif-${Date.now()}`,
      userId: newUser._id,
      title: 'Welcome to SkillSwap! 🚀',
      message: 'Explore skills or try Smart Skill Matching to find your first study partner.',
      type: 'match',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, user: newUser });
  });

  app.get('/api/users', (req, res) => {
    res.json({ users });
  });

  app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  });

  app.put('/api/users/:id', (req, res) => {
    const index = users.findIndex(u => u._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found' });
    users[index] = { ...users[index], ...req.body };
    res.json({ success: true, user: users[index] });
  });

  // --- Skills Marketplace ---
  app.get('/api/skills', (req, res) => {
    const { search, category, level, minRating } = req.query;
    let filtered = [...skills];

    if (category && category !== 'All') {
      filtered = filtered.filter(s => s.category.toLowerCase() === String(category).toLowerCase());
    }

    if (level && level !== 'All') {
      filtered = filtered.filter(s => s.level.toLowerCase() === String(level).toLowerCase());
    }

    if (minRating && Number(minRating) > 0) {
      filtered = filtered.filter(s => s.rating >= Number(minRating));
    }

    if (search && String(search).trim() !== '') {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.userName.toLowerCase().includes(q) ||
          s.userCollege.toLowerCase().includes(q) ||
          s.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    res.json({ skills: filtered, total: filtered.length });
  });

  app.post('/api/skills', (req, res) => {
    const { userId, name, category, level, description, tags } = req.body;
    const user = users.find(u => u._id === userId) || users[0];
    const newSkill: SkillItem = {
      _id: `sk-${Date.now()}`,
      userId: user._id,
      userName: user.name,
      userCollege: user.college,
      userAvatar: user.avatar,
      name,
      category,
      level,
      description,
      tags: tags || [name],
      rating: user.rating,
      ratingCount: user.ratingCount,
      completedSwaps: user.completedExchanges,
      createdAt: new Date().toISOString()
    };
    skills.unshift(newSkill);
    if (!user.skillsTeach.includes(name)) {
      user.skillsTeach.push(name);
    }
    res.status(201).json({ success: true, skill: newSkill });
  });

  // --- Smart Skill Matching Algorithm ---
  app.get('/api/matching/:userId', (req, res) => {
    const currentUser = users.find(u => u._id === req.params.userId) || users[0];
    const otherUsers = users.filter(u => u._id !== currentUser._id);

    const matches = otherUsers.map(student => {
      // 1. What does currentUser want to learn that student can teach?
      const teachMatch = student.skillsTeach.filter(teachSkill =>
        currentUser.skillsLearn.some(learnSkill =>
          teachSkill.toLowerCase().includes(learnSkill.toLowerCase()) ||
          learnSkill.toLowerCase().includes(teachSkill.toLowerCase())
        )
      );

      // 2. What does currentUser teach that student wants to learn?
      const learnMatch = currentUser.skillsTeach.filter(teachSkill =>
        student.skillsLearn.some(learnSkill =>
          teachSkill.toLowerCase().includes(learnSkill.toLowerCase()) ||
          learnSkill.toLowerCase().includes(teachSkill.toLowerCase())
        )
      );

      const isBilateral = teachMatch.length > 0 && learnMatch.length > 0;

      // Match scoring math
      let score = 40; // Base baseline
      if (teachMatch.length > 0) score += 28;
      if (learnMatch.length > 0) score += 20;
      if (isBilateral) score += 7; // Bonus for mutual exchange!

      // Rating boost
      if (student.rating >= 4.9) score += 4;
      else if (student.rating >= 4.7) score += 2;

      // Cap at 98%
      score = Math.min(98, Math.max(50, score));

      let explanation = '';
      if (isBilateral) {
        explanation = `Perfect 2-way match! You can teach ${learnMatch[0]} while they teach you ${teachMatch[0]}.`;
      } else if (teachMatch.length > 0) {
        explanation = `They teach ${teachMatch[0]}, which matches your learning goals.`;
      } else if (learnMatch.length > 0) {
        explanation = `They are actively looking to learn ${learnMatch[0]}, which you can teach!`;
      } else {
        explanation = `Compatible skill schedule and high mentor rating.`;
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

    // Sort by match score descending
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ matches });
  });

  // --- Exchange Requests ---
  app.get('/api/requests', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
      return res.json({ requests: exchangeRequests });
    }
    const incoming = exchangeRequests.filter(r => r.receiverId === userId);
    const sent = exchangeRequests.filter(r => r.senderId === userId);
    const accepted = exchangeRequests.filter(r => (r.receiverId === userId || r.senderId === userId) && r.status === 'accepted');
    const rejected = exchangeRequests.filter(r => (r.receiverId === userId || r.senderId === userId) && r.status === 'rejected');
    res.json({ incoming, sent, accepted, rejected, all: exchangeRequests });
  });

  app.post('/api/requests', (req, res) => {
    const {
      senderId,
      senderOfferSkill,
      senderWantSkill,
      receiverId,
      message,
      proposedTime,
      meetingType,
      meetingLocation
    } = req.body;

    const sender = users.find(u => u._id === senderId) || users[0];
    const receiver = users.find(u => u._id === receiverId);

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver student not found' });
    }

    const newRequest: ExchangeRequest = {
      _id: `req-${Date.now()}`,
      senderId: sender._id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderCollege: sender.college,
      senderOfferSkill: senderOfferSkill || sender.skillsTeach[0] || 'Python',
      senderWantSkill: senderWantSkill || receiver.skillsTeach[0] || 'Photoshop',
      receiverId: receiver._id,
      receiverName: receiver.name,
      receiverAvatar: receiver.avatar,
      receiverCollege: receiver.college,
      status: 'pending',
      message: message || `Hey ${receiver.name}, I would love to exchange skills with you!`,
      proposedTime: proposedTime || 'Flexible this week',
      meetingType: meetingType || 'online',
      meetingLocation: meetingLocation || 'Google Meet',
      createdAt: new Date().toISOString()
    };

    exchangeRequests.unshift(newRequest);

    // Notify receiver
    notifications.unshift({
      _id: `notif-${Date.now()}`,
      userId: receiver._id,
      title: 'New Exchange Request! ⚡',
      message: `${sender.name} wants to swap ${newRequest.senderOfferSkill} for your ${newRequest.senderWantSkill}.`,
      type: 'request',
      read: false,
      linkId: newRequest._id,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, request: newRequest });
  });

  app.patch('/api/requests/:id', (req, res) => {
    const { status } = req.body;
    const request = exchangeRequests.find(r => r._id === req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = status;

    // If accepted, create a learning session automatically!
    if (status === 'accepted') {
      const newSession: LearningSession = {
        _id: `sess-${Date.now()}`,
        requestId: request._id,
        user1Id: request.senderId,
        user1Name: request.senderName,
        user1Avatar: request.senderAvatar,
        user1Skill: request.senderOfferSkill,
        user2Id: request.receiverId,
        user2Name: request.receiverName,
        user2Avatar: request.receiverAvatar,
        user2Skill: request.senderWantSkill,
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        time: request.proposedTime || '4:00 PM - 5:30 PM',
        meetingType: request.meetingType,
        meetingLink: request.meetingType === 'online' ? `https://meet.google.com/skw-${Math.random().toString(36).substring(2, 7)}` : 'Campus Student Center Room 204',
        status: 'scheduled',
        milestones: [
          { id: 'm-1', title: `Phase 1: ${request.senderName} teaches ${request.senderOfferSkill} fundamentals`, completed: false },
          { id: 'm-2', title: `Phase 2: Hands-on exercise & interactive practice`, completed: false },
          { id: 'm-3', title: `Phase 3: ${request.receiverName} teaches ${request.senderWantSkill} essentials`, completed: false },
          { id: 'm-4', title: `Phase 4: Q&A, shared resource links & skill feedback`, completed: false }
        ],
        notes: `Notes for ${request.senderOfferSkill} <-> ${request.senderWantSkill} peer exchange session.\nCollaborative agenda prepared.`,
        createdAt: new Date().toISOString()
      };
      sessions.unshift(newSession);

      // Notify sender that their request was accepted
      notifications.unshift({
        _id: `notif-${Date.now()}`,
        userId: request.senderId,
        title: 'Exchange Request Accepted! 🎉',
        message: `${request.receiverName} accepted your skill exchange proposal! Your session is scheduled.`,
        type: 'accepted',
        read: false,
        linkId: newSession._id,
        createdAt: new Date().toISOString()
      });
    }

    res.json({ success: true, request });
  });

  // --- Learning Sessions ---
  app.get('/api/sessions', (req, res) => {
    const { userId } = req.query;
    if (userId) {
      const userSessions = sessions.filter(s => s.user1Id === userId || s.user2Id === userId);
      return res.json({ sessions: userSessions });
    }
    res.json({ sessions });
  });

  app.get('/api/sessions/:id', (req, res) => {
    const session = sessions.find(s => s._id === req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  });

  app.patch('/api/sessions/:id', (req, res) => {
    const session = sessions.find(s => s._id === req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const { status, notes, milestones, meetingLink, time, date } = req.body;
    if (status) session.status = status;
    if (notes !== undefined) session.notes = notes;
    if (milestones) session.milestones = milestones;
    if (meetingLink) session.meetingLink = meetingLink;
    if (time) session.time = time;
    if (date) session.date = date;

    if (status === 'completed' && !session.completedAt) {
      session.completedAt = new Date().toISOString();
      // Award XP to both users & increment completed count
      const u1 = users.find(u => u._id === session.user1Id);
      const u2 = users.find(u => u._id === session.user2Id);
      if (u1) {
        u1.completedExchanges += 1;
        u1.xp += 150;
      }
      if (u2) {
        u2.completedExchanges += 1;
        u2.xp += 150;
      }

      // Check badges for u1 and u2
      [u1, u2].forEach(usr => {
        if (!usr) return;
        if (usr.completedExchanges >= 10 && !usr.badges.includes('skill-master')) {
          usr.badges.push('skill-master');
        }
        if (usr.xp >= 1000 && !usr.badges.includes('exchange-champion')) {
          usr.badges.push('exchange-champion');
        }
      });
    }

    res.json({ success: true, session });
  });

  // --- Reviews & Ratings ---
  app.get('/api/reviews', (req, res) => {
    const { userId } = req.query;
    if (userId) {
      const userReviews = reviews.filter(r => r.toUserId === userId);
      return res.json({ reviews: userReviews });
    }
    res.json({ reviews });
  });

  app.post('/api/reviews', (req, res) => {
    const { sessionId, fromUserId, toUserId, skillName, rating, comment } = req.body;
    const fromUser = users.find(u => u._id === fromUserId) || users[0];
    const toUser = users.find(u => u._id === toUserId);

    if (!toUser) return res.status(404).json({ error: 'Target student not found' });

    const newReview: Review = {
      _id: `rev-${Date.now()}`,
      sessionId: sessionId || 'sess-custom',
      fromUserId: fromUser._id,
      fromUserName: fromUser.name,
      fromUserAvatar: fromUser.avatar,
      toUserId: toUser._id,
      toUserName: toUser.name,
      skillName: skillName || 'Skill Exchange',
      rating: Number(rating) || 5,
      comment: comment || 'Great skill swap session! Very helpful and friendly mentor.',
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);

    // Recalculate target user's rating
    const currentTotal = toUser.rating * toUser.ratingCount;
    toUser.ratingCount += 1;
    toUser.rating = Math.round(((currentTotal + newReview.rating) / toUser.ratingCount) * 100) / 100;
    toUser.xp += 30; // bonus XP for feedback

    // Notify toUser
    notifications.unshift({
      _id: `notif-${Date.now()}`,
      userId: toUser._id,
      title: 'New Review Received ⭐',
      message: `${fromUser.name} gave you a ${newReview.rating}-star review for ${newReview.skillName}!`,
      type: 'review',
      read: false,
      linkId: toUser._id,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ success: true, review: newReview, updatedUser: toUser });
  });

  // --- Notifications ---
  app.get('/api/notifications', (req, res) => {
    const { userId } = req.query;
    const userNotifs = userId ? notifications.filter(n => n.userId === userId) : notifications;
    res.json({ notifications: userNotifs, unreadCount: userNotifs.filter(n => !n.read).length });
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const notif = notifications.find(n => n._id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true, notification: notif });
  });

  app.patch('/api/notifications/read-all', (req, res) => {
    const { userId } = req.body;
    notifications.forEach(n => {
      if (!userId || n.userId === userId) n.read = true;
    });
    res.json({ success: true });
  });

  // --- Leaderboard & Badges ---
  app.get('/api/leaderboard', (req, res) => {
    const sorted = [...users].sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp;
      if (b.completedExchanges !== a.completedExchanges) return b.completedExchanges - a.completedExchanges;
      return b.rating - a.rating;
    });

    res.json({
      leaderboard: sorted.map((usr, index) => ({
        rank: index + 1,
        ...usr
      })),
      badges: INITIAL_BADGES
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillSwap Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
