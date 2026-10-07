import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import AiAnalysisPanel from './components/AiAnalysisPanel';
import SuggestedReplyPanel from './components/SuggestedReplyPanel';
import { initialEmails } from './data/mockEmails';
import { Sparkles, X } from 'lucide-react';

// Helper to normalize Supabase/backend email records into the frontend model
function normalizeBackendEmail(item) {
  let sender = item.sender;
  if (typeof sender === 'string') {
    let name = sender;
    let email = sender;
    if (sender.includes('<') && sender.includes('>')) {
      const match = sender.match(/^(.*?)\s*<([^>]+)>/);
      if (match) {
        name = match[1].trim() || match[2].trim();
        email = match[2].trim();
      }
    } else if (sender.includes('@')) {
      const prefix = sender.split('@')[0].replace(/[._-]/g, ' ');
      name = prefix
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Sender';
      email = sender;
    }
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'EM';

    sender = {
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      initials,
      company: '',
    };
  } else if (!sender || typeof sender !== 'object') {
    sender = {
      name: 'Unknown Sender',
      email: 'unknown@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Unknown&background=6366f1&color=fff',
      initials: 'UN',
      company: '',
    };
  }

  let date = item.date;
  let timestamp = item.timestamp;
  if (!date && item.created_at) {
    try {
      const d = new Date(item.created_at);
      if (!isNaN(d.getTime())) {
        date = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const datePart = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
        timestamp = `${datePart} • ${date}`;
      }
    } catch {
      date = 'Recently';
      timestamp = 'Recently';
    }
  }

  const snippet =
    item.snippet ||
    (item.body ? item.body.replace(/\s+/g, ' ').slice(0, 95) + (item.body.length > 95 ? '...' : '') : '');

  let actionText = 'No action required';
  if (typeof item.action_required === 'boolean') {
    actionText = item.action_required ? 'Action required: Review and follow up' : 'No action required';
  } else if (typeof item.action_required === 'string') {
    actionText = item.action_required;
  } else if (item.aiAnalysis?.actionRequired || item.aiAnalysis?.action_required) {
    const rawAction = item.aiAnalysis.actionRequired || item.aiAnalysis.action_required;
    actionText = typeof rawAction === 'boolean'
      ? (rawAction ? 'Action required: Review and follow up' : 'No action required')
      : String(rawAction);
  }

  let confidenceStr = '95%';
  const confVal = item.confidence ?? item.aiAnalysis?.confidence;
  if (typeof confVal === 'number') {
    confidenceStr = `${Math.round(confVal <= 1 ? confVal * 100 : confVal)}%`;
  } else if (confVal) {
    confidenceStr = String(confVal).includes('%') ? String(confVal) : `${confVal}%`;
  }

  const aiAnalysis = {
    category: item.category || item.aiAnalysis?.category || 'General Communication',
    priority: item.priority || item.aiAnalysis?.priority || 'Medium',
    sentiment: item.sentiment || item.aiAnalysis?.sentiment || 'Neutral / Informational',
    intent: item.intent || item.aiAnalysis?.intent || 'General communication or inquiry.',
    summary: item.summary || item.aiAnalysis?.summary || snippet,
    actionRequired: actionText,
    action_required: actionText,
    confidence: confidenceStr,
  };

  const suggestedReplies = item.suggested_replies || item.suggestedReplies || [];

  return {
    id: String(item.id),
    sender,
    recipient: item.recipient || 'alex.rivera@intellimail.ai',
    subject: item.subject || '(No Subject)',
    snippet,
    date: date || '10:00 AM',
    timestamp: timestamp || 'Today • 10:00 AM',
    read: Boolean(item.read),
    starred: Boolean(item.starred),
    folder: item.folder || 'inbox',
    body: item.body || '',
    aiAnalysis,
    suggestedReplies,
    fromBackend: true,
  };
}

export default function App() {
  const [emails, setEmails] = useState(initialEmails);
  const [selectedEmailId, setSelectedEmailId] = useState(initialEmails[0]?.id || null);
  const [activeView, setActiveView] = useState('inbox');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to show temporary toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  // Fetch emails from backend/Supabase on mount
  useEffect(() => {
    let isCurrent = true;

    const fetchEmails = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/emails');
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        const data = await response.json();
        if (isCurrent && Array.isArray(data) && data.length > 0) {
          const transformed = data.map(normalizeBackendEmail);
          setEmails(transformed);
          setSelectedEmailId((prevId) => {
            const exists = transformed.some((e) => e.id === prevId);
            return exists ? prevId : transformed[0].id;
          });
        }
      } catch (err) {
        console.error('Failed to load emails from backend:', err);
      }
    };

    fetchEmails();

    return () => {
      isCurrent = false;
    };
  }, []);

  // Find the currently selected email object
  const selectedEmail = useMemo(() => {
    return emails.find((e) => e.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  const emailSubject = selectedEmail?.subject;
  const emailBody = selectedEmail?.body;
  const emailSender = selectedEmail?.sender?.email || selectedEmail?.sender?.name || '';

  // Connect to FastAPI backend: POST /api/emails/analyze for the selected email
  useEffect(() => {
    if (!selectedEmailId || !emailSubject) return;
    // Skip re-analyzing if the email was already loaded from backend with complete AI data
    if (selectedEmail?.fromBackend) return;

    let isCurrent = true;

    const fetchAnalysis = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/emails/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: emailSubject,
            body: emailBody,
            sender: emailSender,
          }),
        });

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        // Only apply if this effect instance is still the active one
        if (isCurrent && data?.ai_analysis) {
          setEmails((prevEmails) =>
            prevEmails.map((item) => {
              if (item.id === selectedEmailId) {
                return {
                  ...item,
                  aiAnalysis: {
                    ...item.aiAnalysis,
                    category: data.ai_analysis.category,
                    priority: data.ai_analysis.priority,
                    sentiment: data.ai_analysis.sentiment,
                    intent: data.ai_analysis.intent,
                    summary: data.ai_analysis.summary,
                    actionRequired: data.ai_analysis.action_required,
                    action_required: data.ai_analysis.action_required,
                    confidence: data.ai_analysis.confidence,
                  },
                  suggestedReplies: data.suggested_replies || item.suggestedReplies,
                };
              }
              return item;
            })
          );
        }
      } catch (err) {
        console.error('FastAPI analysis request failed:', err);
      }
    };

    fetchAnalysis();

    return () => {
      isCurrent = false;
    };
  }, [selectedEmailId, emailSubject, emailBody, emailSender, selectedEmail?.fromBackend]);

  // Toggle star
  const handleToggleStar = (id) => {
    const targetEmail = emails.find((email) => String(email.id) === String(id));
    const nextStarred = targetEmail ? !targetEmail.starred : true;

    setEmails((prev) =>
      prev.map((email) =>
        String(email.id) === String(id) ? { ...email, starred: nextStarred } : email
      )
    );

    fetch(`http://127.0.0.1:8000/api/emails/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ starred: nextStarred }),
    }).catch((err) => {
      console.error('Failed to update star status:', err);
    });
  };

  // Mark as read and select email
  const handleSelectEmail = async (id) => {
    setSelectedEmailId(id);

    const email = emails.find((e) => e.id === id);
    if (!email || email.read) return;

    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, read: true } : email
      )
    );

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/emails/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            read: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark email as read: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to persist read status:', error);
    }
  };

  // Archive email
  const handleArchive = async (id) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, folder: 'archive' } : email
      )
    );

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/emails/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folder: 'archive',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to archive email: ${response.status}`);
      }

      showToast('Email moved to Archive');
    } catch (error) {
      console.error('Failed to persist archive status:', error);
    }
  };

  // Delete email
  const handleDelete = async (id) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, folder: 'trash' } : email
      )
    );

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/emails/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folder: 'trash',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to move email to trash: ${response.status}`);
      }

      showToast('Email moved to Trash');
    } catch (error) {
      console.error('Failed to persist trash status:', error);
    }
  };

  // Send reply and persist to Supabase
  const handleSendReply = async ({ emailId, text, tone } = {}) => {
    showToast('AI response dispatched successfully');
    if (!emailId || !text) return;
    try {
      await fetch('http://127.0.0.1:8000/api/emails/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId, text, tone }),
      });
    } catch (err) {
      console.error('Failed to persist reply:', err);
    }
  };

  // Counts for badges
  const unreadCount = emails.filter((e) => !e.read && e.folder === 'inbox').length;
  const draftsCount = emails.filter((e) => e.folder === 'drafts').length;
  const highPriorityCount = emails.filter(
    (e) => e.aiAnalysis?.priority === 'High'
  ).length;
  const actionCount = emails.filter((e) => {
    const action = e.aiAnalysis?.actionRequired || e.aiAnalysis?.action_required || '';
    return action && !action.toLowerCase().includes('no action');
  }).length;

  // Filtered emails based on active view, filter tab, and search query
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      const actionText = email.aiAnalysis?.actionRequired || email.aiAnalysis?.action_required || '';
      const hasAction = actionText && !actionText.toLowerCase().includes('no action');

      // 1. Folder / View filtering
      if (activeView === 'inbox' && email.folder !== 'inbox') return false;
      if (activeView === 'starred' && !email.starred) return false;
      if (activeView === 'sent' && email.folder !== 'sent') return false;
      if (activeView === 'drafts' && email.folder !== 'drafts') return false;
      if (activeView === 'archive' && email.folder !== 'archive') return false;
      if (activeView === 'trash' && email.folder !== 'trash') return false;
      if (activeView === 'filter-priority' && email.aiAnalysis?.priority !== 'High') return false;
      if (activeView === 'filter-action' && !hasAction) return false;

      // 2. Filter tabs (inside Inbox)
      if (currentFilter === 'unread' && email.read) return false;
      if (currentFilter === 'high_priority' && email.aiAnalysis?.priority !== 'High') return false;
      if (currentFilter === 'action_required' && !hasAction) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSender = email.sender.name.toLowerCase().includes(query);
        const matchesEmail = email.sender.email.toLowerCase().includes(query);
        const matchesSubject = email.subject.toLowerCase().includes(query);
        const matchesBody = email.body.toLowerCase().includes(query);
        const matchesCategory = email.aiAnalysis?.category?.toLowerCase().includes(query);
        const matchesIntent = email.aiAnalysis?.intent?.toLowerCase().includes(query);

        if (
          !matchesSender &&
          !matchesEmail &&
          !matchesSubject &&
          !matchesBody &&
          !matchesCategory &&
          !matchesIntent
        ) {
          return false;
        }
      }

      return true;
    });
  }, [emails, activeView, currentFilter, searchQuery]);

  return (
    <div className="h-screen flex bg-slate-100 font-sans overflow-hidden">

      {/* Sidebar navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        unreadCount={unreadCount}
        draftsCount={draftsCount}
        highPriorityCount={highPriorityCount}
        actionCount={actionCount}
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleMobile={() => setMobileNavOpen(!mobileNavOpen)}
          activeView={activeView}
          totalEmails={filteredEmails.length}
          emails={emails}
        />

        {/* View Switcher: Dashboard vs Inbox Workspace */}
        {activeView === 'dashboard' ? (
          <DashboardView
            emails={emails}
            onSelectEmail={(id) => {
              handleSelectEmail(id);
              setActiveView('inbox');
            }}
            onNavigateToInbox={() => setActiveView('inbox')}
          />
        ) : (
          /* Email Workspace */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-slate-100">

            {/* 1. Email List Column */}
            <EmailList
              emails={filteredEmails}
              selectedEmailId={selectedEmail?.id}
              onSelectEmail={handleSelectEmail}
              onToggleStar={handleToggleStar}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />

            {/* 2. Middle & Right Panes: Reading Pane + AI Panels */}
            <div className="flex-1 flex flex-col xl:flex-row overflow-hidden min-h-0 bg-white">

              {/* Email Reading Panel */}
              <div className="flex-1 overflow-hidden flex flex-col min-w-0">
                <EmailDetail
                  email={selectedEmail}
                  onToggleStar={handleToggleStar}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                  onReplyClick={() => showToast('Reviewing suggested reply in right panel')}
                />
              </div>

              {/* AI Intelligence Cockpit (AI Analysis + Suggested Reply) */}
              <div className="w-full xl:w-96 2xl:w-[420px] bg-slate-50 border-t xl:border-t-0 xl:border-l border-slate-200 p-4 overflow-y-auto space-y-4 shrink-0">
                <AiAnalysisPanel aiAnalysis={selectedEmail?.aiAnalysis} />
                <SuggestedReplyPanel
                  key={`${selectedEmail?.id}-${selectedEmail?.suggestedReplies?.[0]?.text || ''}`}
                  email={selectedEmail}
                  onSendReply={handleSendReply}
                  onNotify={showToast}
                />
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
