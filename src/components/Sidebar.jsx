import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Star, 
  Send, 
  FileText, 
  Archive, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  Flame
} from 'lucide-react';
import { userProfile } from '../data/mockEmails';

export default function Sidebar({ 
  activeView, 
  setActiveView, 
  unreadCount, 
  highPriorityCount, 
  actionCount,
  mobileOpen,
  setMobileOpen
}) {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadCount },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'sent', label: 'Sent', icon: Send },
    { id: 'drafts', label: 'Drafts', icon: FileText, badge: 1 },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ];

  const aiFilters = [
    { id: 'filter-priority', label: 'High Priority', icon: Flame, color: 'text-rose-500', count: highPriorityCount },
    { id: 'filter-action', label: 'Action Required', icon: AlertCircle, color: 'text-amber-500', count: actionCount },
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 text-slate-200 flex flex-col justify-between
        transition-transform duration-200 ease-in-out border-r border-slate-800
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div>
          <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  IntelliMail
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Intelligent Email Co-Pilot</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-semibold
                      ${isActive ? 'bg-white text-indigo-600' : 'bg-slate-800 text-slate-300 border border-slate-700'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Quick Filters */}
          <div className="p-3 pt-2 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>AI Smart Filters</span>
            </div>
            {aiFilters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeView === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleNavClick(filter.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
                    ${isActive 
                      ? 'bg-slate-800 text-white border-l-2 border-indigo-500' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${filter.color}`} />
                    <span>{filter.label}</span>
                  </div>
                  {filter.count > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                      {filter.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom AI Status & User Card */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* AI Engine indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-xs">
              <p className="font-medium text-slate-200">AI Assistant Active</p>
              <p className="text-[10px] text-slate-400">Zero-latency triaging</p>
            </div>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 pt-1">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userProfile.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
