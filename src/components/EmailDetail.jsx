import React from 'react';
import { 
  Reply, 
  Archive, 
  Trash2, 
  Star, 
  Clock, 
  Mail
} from 'lucide-react';

export default function EmailDetail({ 
  email, 
  onToggleStar, 
  onArchive, 
  onDelete,
  onReplyClick 
}) {
  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white text-slate-400">
        <Mail className="w-12 h-12 text-slate-200 mb-3" />
        <p className="text-sm font-medium text-slate-600">Select an email to view details</p>
        <p className="text-xs text-slate-400">Choose from the list on the left to read and inspect AI insights</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col h-full overflow-y-auto border-r border-slate-200">
      
      {/* Top Action Toolbar */}
      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onReplyClick?.()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Reply"
          >
            <Reply className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Reply</span>
          </button>
          <button
            onClick={() => onArchive?.(email.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Archive"
          >
            <Archive className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Archive</span>
          </button>
          <button
            onClick={() => onDelete?.(email.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleStar(email.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-100 transition-colors cursor-pointer"
            title={email.starred ? 'Starred' : 'Star message'}
          >
            <Star className={`w-4 h-4 ${email.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Email Content */}
      <div className="p-6 space-y-6">
        
        {/* Subject and Header Badges */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              {email.aiAnalysis?.category || 'General'}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
              email.aiAnalysis?.priority === 'High'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : email.aiAnalysis?.priority === 'Medium'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {email.aiAnalysis?.priority} Priority
            </span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">
            {email.subject}
          </h1>
        </div>

        {/* Sender and Recipient Card */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <img 
              src={email.sender.avatar} 
              alt={email.sender.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
            />
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {email.sender.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  &lt;{email.sender.email}&gt;
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                to <span className="text-slate-700 font-medium">me ({email.recipient})</span>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{email.timestamp || email.date}</span>
            </div>
            {email.sender.company && (
              <span className="inline-block mt-1 text-[11px] font-medium text-slate-400">
                {email.sender.company}
              </span>
            )}
          </div>
        </div>

        {/* Email Body text */}
        <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal space-y-4 pt-2">
          {email.body}
        </div>

      </div>

    </div>
  );
}
