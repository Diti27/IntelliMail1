import React from 'react';
import { Star, Flame, AlertCircle, Mail } from 'lucide-react';

export default function EmailList({ 
  emails, 
  selectedEmailId, 
  onSelectEmail, 
  onToggleStar,
  currentFilter,
  setCurrentFilter 
}) {
  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'high_priority', label: 'High Priority' },
    { id: 'action_required', label: 'Action Needed' },
  ];

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <Flame className="w-3 h-3 text-rose-500" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Low
          </span>
        );
    }
  };

  return (
    <div className="w-full lg:w-96 border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
      
      {/* Quick Filter Tabs */}
      <div className="p-3 border-b border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentFilter(tab.id)}
              className={`
                px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer
                ${currentFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {emails.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Mail className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No emails found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search query</p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = email.id === selectedEmailId;
            const actionText = email.aiAnalysis?.actionRequired || email.aiAnalysis?.action_required || '';
            const hasAction = actionText && !actionText.toLowerCase().includes('no action');

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                className={`
                  p-3.5 cursor-pointer transition-all border-l-4 relative group
                  ${isSelected 
                    ? 'bg-indigo-50/70 border-indigo-600' 
                    : !email.read 
                      ? 'bg-slate-50/60 border-transparent hover:bg-slate-100/70' 
                      : 'bg-white border-transparent hover:bg-slate-50'}
                `}
              >
                {/* Header line: Sender & Date */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Unread indicator */}
                    {!email.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" title="Unread" />
                    )}
                    <span className={`text-xs truncate ${!email.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {email.sender.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {email.date}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(email.id);
                      }}
                      className="p-0.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                      title={email.starred ? 'Starred' : 'Star message'}
                    >
                      <Star className={`w-3.5 h-3.5 ${email.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Subject */}
                <h4 className={`text-xs mt-1 truncate ${!email.read ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                  {email.subject}
                </h4>

                {/* Snippet preview */}
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-relaxed">
                  {email.snippet}
                </p>

                {/* AI Tags and Priority */}
                <div className="mt-2.5 flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 truncate max-w-[140px]">
                    {email.aiAnalysis?.category || 'General'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {hasAction && (
                      <span className="inline-flex items-center text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200" title="Action required">
                        <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
                        Action
                      </span>
                    )}
                    {getPriorityBadge(email.aiAnalysis?.priority)}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
