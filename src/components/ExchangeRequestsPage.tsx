import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Clock,
  Check,
  X,
  MapPin,
  Video,
  Calendar,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Send,
  User as UserIcon
} from 'lucide-react';
import { ExchangeRequest, User, ActivePage } from '../types';

interface ExchangeRequestsPageProps {
  currentUser?: User | null;
  incoming: ExchangeRequest[];
  sent: ExchangeRequest[];
  accepted: ExchangeRequest[];
  rejected: ExchangeRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onNavigate: (page: ActivePage) => void;
  onOpenNewSwap: () => void;
}

export const ExchangeRequestsPage: React.FC<ExchangeRequestsPageProps> = ({
  currentUser,
  incoming,
  sent,
  accepted,
  rejected,
  onAccept,
  onReject,
  onNavigate,
  onOpenNewSwap
}) => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'sent' | 'accepted' | 'rejected'>('incoming');

  const tabs = [
    { id: 'incoming', label: 'Incoming Requests', count: incoming.length },
    { id: 'sent', label: 'Sent Requests', count: sent.length },
    { id: 'accepted', label: 'Accepted Swaps', count: accepted.length },
    { id: 'rejected', label: 'Rejected', count: rejected.length },
  ];

  const getListForTab = () => {
    switch (activeTab) {
      case 'incoming': return incoming;
      case 'sent': return sent;
      case 'accepted': return accepted;
      case 'rejected': return rejected;
      default: return [];
    }
  };

  const list = getListForTab();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Exchange Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
            Skill Swap Requests
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage incoming proposals, track sent offers, and access scheduled sessions.
          </p>
        </div>

        <button
          onClick={onOpenNewSwap}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-98 transition self-start sm:self-center"
        >
          <Send className="w-4 h-4" /> Propose New Swap
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Request Cards */}
      {list.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-850/50 border border-dashed border-slate-300 dark:border-slate-800">
          <ArrowLeftRight className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No {activeTab} requests found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'incoming'
              ? "You don't have any pending incoming swap requests. Check out Smart Matching to find partners!"
              : activeTab === 'sent'
              ? 'You haven\'t sent any swap requests yet. Browse the Explore Skills marketplace to find a mentor.'
              : 'Completed or scheduled exchange history will appear here.'}
          </p>
          <button
            onClick={() => onNavigate('matching')}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Find Partners on Smart Match
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map(req => {
            const isIncoming = Boolean(currentUser?._id && req.receiverId === currentUser._id);
            const isPending = req.status === 'pending';
            const isAccepted = req.status === 'accepted';
            const isRejected = req.status === 'rejected';

            const partnerName = isIncoming ? req.senderName : req.receiverName;
            const partnerAvatar = isIncoming ? req.senderAvatar : req.receiverAvatar;
            const partnerCollege = isIncoming ? req.senderCollege : req.receiverCollege;

            return (
              <div
                key={req._id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500/30 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={partnerName || 'Peer'}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {partnerName}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({partnerCollege})
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isAccepted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : isRejected
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    {/* Bilateral Trade Pill Banner */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {isIncoming ? `${req.senderName} Teaches:` : 'You Teach:'} {req.senderOfferSkill}
                      </span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {isIncoming ? 'You Teach:' : `${req.receiverName} Teaches:`} {req.senderWantSkill}
                      </span>
                    </div>

                    {/* Personal message */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{req.message}"
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.proposedTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        {req.meetingType === 'online' ? <Video className="w-3.5 h-3.5 text-indigo-500" /> : <MapPin className="w-3.5 h-3.5 text-emerald-500" />}
                        <span>{req.meetingLocation}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {isIncoming && isPending && (
                    <>
                      <button
                        onClick={() => onReject(req._id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                      <button
                        onClick={() => onAccept(req._id)}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-98 transition"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept & Schedule
                      </button>
                    </>
                  )}

                  {isAccepted && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('chat')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Message Partner
                      </button>
                      <button
                        onClick={() => onNavigate('sessions')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-98 transition"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Session Workspace
                      </button>
                    </div>
                  )}

                  {!isIncoming && isPending && (
                    <div className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                      Pending Partner Response...
                    </div>
                  )}

                  {isRejected && (
                    <div className="text-xs font-medium text-slate-400">
                      Exchange Closed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
