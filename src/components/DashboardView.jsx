import React from 'react';
import { 
  Inbox, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Mail, 
  Bot
} from 'lucide-react';

export default function DashboardView({ emails, onSelectEmail, onNavigateToInbox }) {
  const totalEmails = emails.length;
  const unreadEmails = emails.filter(e => !e.read).length;
  const highPriorityEmails = emails.filter(e => e.aiAnalysis?.priority === 'High');
  const actionRequiredEmails = emails.filter(e => 
    e.aiAnalysis?.actionRequired && !e.aiAnalysis.actionRequired.toLowerCase().includes('no action')
  );

  const urgentItems = emails.filter(e => 
    e.aiAnalysis?.priority === 'High' || 
    (e.aiAnalysis?.actionRequired && !e.aiAnalysis.actionRequired.toLowerCase().includes('no action'))
  ).slice(0, 4);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome & AI Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>IntelliMail AI Co-Pilot Summary</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Good morning, Alex. You have {actionRequiredEmails.length} items needing action.
              </h2>
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                Our AI has automatically categorized, summarized, and drafted contextual replies for your incoming inbox. 1 critical high-priority issue detected on US-East prod cluster.
              </p>
            </div>
            
            <button
              onClick={() => onNavigateToInbox()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:scale-102 active:scale-98 whitespace-nowrap cursor-pointer"
            >
              <Inbox className="w-4 h-4" />
              <span>Go to Inbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Emails</span>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Mail className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{totalEmails}</span>
              <span className="text-xs text-slate-500">({unreadEmails} unread)</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Synchronized & indexed</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Action Required</span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-600">{actionRequiredEmails.length}</span>
              <span className="text-xs text-slate-500">pending tasks</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">AI identified follow-ups</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Priority</span>
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-600">{highPriorityEmails.length}</span>
              <span className="text-xs text-slate-500">urgent items</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Critical customer & investor threads</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Triaged</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">100%</span>
              <span className="text-xs text-slate-500">processed</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Full analysis & suggested replies ready</p>
          </div>

        </div>

        {/* Priority AI Action Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Immediate Attention Queue</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Ranked by AI Severity & Intent</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {urgentItems.map((email) => {
              const isHigh = email.aiAnalysis?.priority === 'High';
              return (
                <div 
                  key={email.id}
                  onClick={() => onSelectEmail(email.id)}
                  className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={email.sender.avatar} 
                          alt={email.sender.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {email.sender.name}
                          </h4>
                          <p className="text-xs text-slate-500">{email.sender.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isHigh 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {email.aiAnalysis?.priority} Priority
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {email.subject}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {email.aiAnalysis?.summary}
                      </p>
                    </div>

                    {/* Action required highlight */}
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                      <span className="font-semibold text-slate-700">Action: </span>
                      <span className="text-slate-600">{email.aiAnalysis?.actionRequired}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {email.date}
                    </span>
                    <span className="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Review & Reply
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Capabilities & Insights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Top Categories
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Support & Escalation', count: 1, color: 'bg-rose-500' },
                { label: 'Investor Relations', count: 1, color: 'bg-indigo-500' },
                { label: 'Sales & Security', count: 1, color: 'bg-blue-500' },
                { label: 'Product & Design', count: 1, color: 'bg-purple-500' },
                { label: 'Billing & Informational', count: 2, color: 'bg-slate-400' },
              ].map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                    {cat.label}
                  </span>
                  <span className="font-semibold text-slate-900">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Sentiment Distribution
            </h4>
            <div className="space-y-2.5">
              {[
                { sentiment: 'Urgent / Frustrated', count: 1, bar: 'w-1/6 bg-rose-500', text: 'text-rose-600' },
                { sentiment: 'Enthusiastic / Positive', count: 2, bar: 'w-2/6 bg-emerald-500', text: 'text-emerald-600' },
                { sentiment: 'Neutral / Informational', count: 3, bar: 'w-3/6 bg-slate-400', text: 'text-slate-600' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700">{item.sentiment}</span>
                    <span className={`font-semibold ${item.text}`}>{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.bar}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50/70 p-5 rounded-xl border border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-700 mb-2">
                <Bot className="w-5 h-5" />
                <h4 className="text-sm font-bold">IntelliMail Assistant</h4>
              </div>
              <p className="text-xs text-indigo-950/80 leading-relaxed">
                AI replies have been pre-computed for your urgent messages. Click any email from the inbox list to preview sentiments, action items, and draft responses.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100/80 text-[11px] text-indigo-700 font-medium">
              💡 Tip: Use the "Regenerate" button in the reply panel to switch tone between Urgent, Concise, and Friendly.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
