import React, { useState } from 'react';
import { X, Send, Sparkles, Clock, MapPin, Video, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface RequestSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  targetStudent?: {
    _id?: string;
    name?: string;
    avatar?: string;
    college?: string;
    teachSkill?: string;
    wantSkill?: string;
    skillsTeach?: string[];
  };
  targetUser?: User | null;
  preselectedOfferSkill?: string;
  preselectedWantSkill?: string;
  onSubmit: (data: {
    senderOfferSkill: string;
    senderWantSkill: string;
    receiverId: string;
    message: string;
    proposedTime: string;
    meetingType: 'online' | 'offline';
    meetingLocation: string;
  }) => void;
}

export const RequestSwapModal: React.FC<RequestSwapModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  targetStudent,
  targetUser,
  preselectedOfferSkill,
  preselectedWantSkill,
  onSubmit
}) => {
  const partner = targetStudent || targetUser || {
    _id: 'usr-2',
    name: 'Peer Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    college: 'Campus College',
    teachSkill: 'UI/UX Design',
    skillsTeach: ['UI/UX Design']
  };

  const [offerSkill, setOfferSkill] = useState(
    preselectedOfferSkill || currentUser?.skillsTeach?.[0] || 'Python Programming'
  );
  const [wantSkill, setWantSkill] = useState(
    preselectedWantSkill ||
      partner.teachSkill ||
      (partner.skillsTeach && partner.skillsTeach[0]) ||
      'Photoshop'
  );
  const [meetingType, setMeetingType] = useState<'online' | 'offline'>('online');
  const [proposedTime, setProposedTime] = useState('This Thursday, 4:00 PM');
  const [meetingLocation, setMeetingLocation] = useState('Google Meet');
  const [message, setMessage] = useState(
    `Hey ${partner.name || 'there'}! I would love to learn ${wantSkill} from you. In return, I can teach you ${offerSkill}. Let's do a 1-hour swap!`
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      senderOfferSkill: offerSkill,
      senderWantSkill: wantSkill,
      receiverId: partner._id || 'usr-peer',
      message,
      proposedTime,
      meetingType,
      meetingLocation: meetingType === 'online' ? (meetingLocation || 'Google Meet') : (meetingLocation || 'Campus Library')
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Propose Skill Swap</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Trading skills with {partner.name || 'Student'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Partner Preview */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <img
              src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={partner.name || 'Student'}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white truncate">{partner.name || 'Student'}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{partner.college || 'Campus Peer'}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 dark:text-indigo-400">
                <span className="font-medium">Teaches:</span>
                <span className="truncate">{partner.teachSkill || (partner.skillsTeach && partner.skillsTeach.join(', ')) || 'Various skills'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Skill I Will Teach
              </label>
              <select
                value={offerSkill}
                onChange={e => setOfferSkill(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {currentUser.skillsTeach.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Skill I Want In Return
              </label>
              <input
                type="text"
                value={wantSkill}
                onChange={e => setWantSkill(e.target.value)}
                placeholder="e.g. Photoshop, UI/UX"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Proposed Date & Time
              </label>
              <input
                type="text"
                value={proposedTime}
                onChange={e => setProposedTime(e.target.value)}
                placeholder="e.g. Thursday 4:00 PM"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Meeting Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMeetingType('online');
                    setMeetingLocation('Google Meet');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition ${
                    meetingType === 'online'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Online
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMeetingType('offline');
                    setMeetingLocation('Campus Library 2nd Floor');
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium border transition ${
                    meetingType === 'offline'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" /> In-Person
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Personal Message
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Introduce yourself and mention what you'd like to work on..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-500/20 transition active:scale-98"
            >
              <Send className="w-4 h-4" /> Send Swap Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
