import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Video,
  Calendar,
  MoreVertical,
  Check,
  CheckCheck,
  Search,
  ArrowLeftRight,
  Sparkles,
  User as UserIcon,
  ExternalLink,
  Clock,
  BookOpen,
  Building2,
  FileText,
  Zap,
  Info
} from 'lucide-react';
import { ChatConversation, ChatMessage, User, ActivePage } from '../types';
import { INITIAL_CHAT_CONVERSATIONS, SIMULATED_PARTNER_REPLIES } from '../data/mockChatData';

interface ChatPageProps {
  currentUser?: User | null;
  onNavigate: (page: ActivePage) => void;
  onSelectUserForProfile?: (user: User) => void;
  onOpenSessionWithPartner?: (partnerName: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  currentUser,
  onNavigate,
  onSelectUserForProfile,
  onOpenSessionWithPartner
}) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CHAT_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string>(INITIAL_CHAT_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'agreed'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === selectedConvId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isTyping]);

  const filteredConversations = conversations.filter(conv => {
    if (activeFilter === 'agreed' && !conv.isAgreedSwap) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = conv.partnerName.toLowerCase().includes(q);
      const matchesCollege = conv.partnerCollege.toLowerCase().includes(q);
      const matchesSkill = conv.partnerSkill.toLowerCase().includes(q) || conv.mySkill.toLowerCase().includes(q);
      if (!matchesName && !matchesCollege && !matchesSkill) return false;
    }
    return true;
  });

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConversation) return;

    const myId = currentUser?._id || 'usr-1';
    const myName = currentUser?.name || 'Alex Chen';

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: myId,
      senderName: myName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    const updatedConvs = conversations.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: 'Just now',
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setInputText('');

    // Simulate real-time peer reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const replies = SIMULATED_PARTNER_REPLIES[activeConversation.partnerId] || SIMULATED_PARTNER_REPLIES.default;
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const peerMessage: ChatMessage = {
        id: `msg-peer-${Date.now()}`,
        conversationId: activeConversation.id,
        senderId: activeConversation.partnerId,
        senderName: activeConversation.partnerName,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setConversations(prev =>
        prev.map(c => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              lastMessage: randomReply,
              lastMessageTime: 'Just now',
              messages: [...c.messages, peerMessage]
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Preset icebreaker chips
  const quickChips = [
    'When are you free for our first session?',
    'I uploaded the starter notes to Google Drive!',
    'Shall we meet on Google Meet or at the library?',
    'I reviewed your syllabus notes, ready to begin!'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Notification Banner */}
      <div className="mb-6 p-4 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-indigo-950 dark:text-indigo-200">
              Agreed Skill-Exchange Messaging
            </h2>
            <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400">
              Coordinate study dates, exchange lecture materials, and prepare for your bilateral swap sessions.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('sessions')}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>View Scheduled Sessions</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="h-[720px] rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Sidebar: Conversations list (4 columns) */}
        <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Messages
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                {conversations.length} Active
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students or skills..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-[11px] font-semibold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 py-1 rounded-md transition ${
                  activeFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All Chats
              </button>
              <button
                onClick={() => setActiveFilter('agreed')}
                className={`flex-1 py-1 rounded-md transition ${
                  activeFilter === 'agreed'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Agreed Swaps Only
              </button>
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching conversations found.
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = conv.id === activeConversation.id;

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`w-full p-4 text-left transition flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800/90 border-l-4 border-indigo-600 shadow-xs'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Partner Avatar + Online Badge */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={conv.partnerName}
                        className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900 ${
                          conv.onlineStatus === 'online'
                            ? 'bg-emerald-500'
                            : conv.onlineStatus === 'in-class'
                            ? 'bg-amber-400'
                            : 'bg-slate-400'
                        }`}
                        title={`Status: ${conv.onlineStatus}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {conv.partnerName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold truncate mb-1">
                        {conv.partnerSkill} ⇄ {conv.mySkill}
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-snug">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Stream & Input (8 columns) */}
        <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-slate-850">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={activeConversation.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={activeConversation.partnerName}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  referrerPolicy="no-referrer"
                />
                <span
                  className={`w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 ring-2 ring-white dark:ring-slate-900 ${
                    activeConversation.onlineStatus === 'online'
                      ? 'bg-emerald-500'
                      : activeConversation.onlineStatus === 'in-class'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeConversation.partnerName}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {activeConversation.partnerCollege}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Swapping: <strong>{activeConversation.partnerSkill}</strong> for <strong>{activeConversation.mySkill}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('sessions')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-600 text-xs font-bold transition"
                title="Go to scheduled learning session"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Session</span>
              </button>

              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Start Call</span>
              </a>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-900/20">
            {/* Agreed Swap Security / Context Notice */}
            <div className="mx-auto max-w-md p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/70 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
              <Zap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>You and {activeConversation.partnerName} both agreed on this skill swap. All messages are private and peer-to-peer.</span>
            </div>

            {activeConversation.messages.map(msg => {
              const myId = currentUser?._id || 'usr-1';
              const isMe = msg.senderId === myId;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={activeConversation.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-xl object-cover shrink-0 mb-1"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className={`max-w-[80%] sm:max-w-[70%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {msg.text}

                      {/* Attachment preview if present */}
                      {msg.attachment && (
                        <div className={`mt-2.5 p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                          isMe
                            ? 'bg-indigo-700/60 border-indigo-500/40 text-white'
                            : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                        }`}>
                          <FileText className="w-4 h-4 shrink-0" />
                          <span className="font-semibold truncate flex-1">{msg.attachment.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-75 hover:opacity-100" />
                        </div>
                      )}
                    </div>

                    {/* Timestamp & read receipts */}
                    <div className={`flex items-center gap-1 text-[10px] text-slate-400 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>
                      {isMe && (
                        <CheckCheck className="w-3 h-3 text-indigo-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated Partner Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <img
                  src={activeConversation.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={activeConversation.partnerName}
                  className="w-7 h-7 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shadow-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{activeConversation.partnerName}</span> is typing
                  <span className="inline-flex gap-0.5 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Icebreaker Suggestions Strip */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Quick Reply:
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 whitespace-nowrap transition shadow-2xs shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Message Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSendMessage("Shared resource: syllabus_notes_v1.pdf")}
                className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                title="Attach study file or link"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder={`Message ${activeConversation.partnerName} about your ${activeConversation.partnerSkill} exchange...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-xl text-white transition shrink-0 ${
                  inputText.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-95'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
