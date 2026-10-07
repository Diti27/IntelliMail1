import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, Sparkles, Bell, AlertCircle, CheckCircle, Mail } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onToggleMobile, 
  activeView,
  totalEmails,
  emails = []
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const panelRef = useRef(null);
  const getTitle = () => {
    switch(activeView) {
      case 'dashboard': return 'Overview Dashboard';
      case 'inbox': return 'Inbox';
      case 'starred': return 'Starred Messages';
      case 'sent': return 'Sent Mail';
      case 'drafts': return 'Drafts';
      case 'archive': return 'Archived';
      case 'trash': return 'Trash';
      case 'filter-priority': return 'High Priority Emails';
      case 'filter-action': return 'Action Required Queue';
      default: return 'Inbox';
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [notificationsOpen]);

  // Get notifications from emails
  const notifications = [];
  
  if (emails && Array.isArray(emails)) {
    // High priority emails
    const highPriorityEmails = emails.filter(
      e => e.aiAnalysis?.priority === 'High' && e.folder === 'inbox' && !e.read
    ).slice(0, 3);
    
    highPriorityEmails.forEach(email => {
      notifications.push({
        id: `priority-${email.id}`,
        type: 'priority',
        title: 'High Priority',
        message: email.subject,
        sender: email.sender?.name || 'Unknown',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      });
    });

    // Action required emails
    const actionRequiredEmails = emails.filter(e => {
      if (e.folder !== 'inbox' || e.read) return false;
      const action = e.aiAnalysis?.actionRequired || e.aiAnalysis?.action_required || '';
      return action && !action.toLowerCase().includes('no action');
    }).slice(0, 3);

    actionRequiredEmails.forEach(email => {
      if (!notifications.find(n => n.id === `priority-${email.id}`)) {
        notifications.push({
          id: `action-${email.id}`,
          type: 'action',
          title: 'Action Required',
          message: email.subject,
          sender: email.sender?.name || 'Unknown',
          icon: CheckCircle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
        });
      }
    });

    // Unread emails (if not already shown)
    if (notifications.length < 5) {
      const unreadEmails = emails.filter(
        e => !e.read && e.folder === 'inbox'
      ).slice(0, 5 - notifications.length);

      unreadEmails.forEach(email => {
        if (!notifications.find(n => n.id === `priority-${email.id}` || n.id === `action-${email.id}`)) {
          notifications.push({
            id: `unread-${email.id}`,
            type: 'unread',
            title: 'Unread',
            message: email.subject,
            sender: email.sender?.name || 'Unknown',
            icon: Mail,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
          });
        }
      });
    }
  }

  const notificationCount = notifications.length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
            {getTitle()}
          </h2>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {totalEmails} total
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emails, AI tags, senders..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Action buttons and Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Co-Pilot Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>IntelliCopilot Active</span>
        </div>

        <button 
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 relative transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
          )}
        </button>

        {/* Notification Dropdown Panel */}
        {notificationsOpen && (
          <div 
            ref={panelRef}
            className="absolute top-14 right-4 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              {notificationCount > 0 && (
                <p className="text-xs text-slate-500 mt-0.5">{notificationCount} unread</p>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500 text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div 
                        key={notification.id}
                        className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${notification.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${notification.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${notification.color}`}>
                                {notification.title}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              from {notification.sender}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
