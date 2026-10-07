import React from 'react';
import { 
  Sparkles, 
  Tag, 
  Flame, 
  Smile, 
  Frown, 
  Meh, 
  Target, 
  FileText, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';

export default function AiAnalysisPanel({ aiAnalysis }) {
  if (!aiAnalysis) {
    return (
      <div className="p-5 text-center text-slate-400">
        <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="text-xs">Select an email to view AI analysis</p>
      </div>
    );
  }

  const { category, priority, sentiment, intent, summary, confidence } = aiAnalysis;
  const actionRequired = aiAnalysis.action_required || aiAnalysis.actionRequired || '';

  // Sentiment icon & color styling
  const getSentimentDisplay = (sent = '') => {
    const s = sent.toLowerCase();
    if (s.includes('frustrated') || s.includes('urgent') || s.includes('negative')) {
      return {
        icon: Frown,
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        dotColor: 'bg-rose-500'
      };
    }
    if (s.includes('positive') || s.includes('enthusiastic')) {
      return {
        icon: Smile,
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        dotColor: 'bg-emerald-500'
      };
    }
    return {
      icon: Meh,
      textColor: 'text-slate-700',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      dotColor: 'bg-slate-400'
    };
  };

  const sentimentStyle = getSentimentDisplay(sentiment);
  const SentimentIcon = sentimentStyle.icon;

  const isHighPriority = priority === 'High';
  const isMediumPriority = priority === 'Medium';
  const hasAction = actionRequired && !actionRequired.toLowerCase().includes('no action');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Panel Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Analysis</h3>
            <p className="text-[10px] text-slate-500">Autonomous email triage</p>
          </div>
        </div>

        {confidence && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
            {confidence} Match
          </span>
        )}
      </div>

      <div className="p-4 space-y-4 text-xs">
        
        {/* Category & Priority Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Category */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              <Tag className="w-3 h-3 text-slate-500" />
              <span>Category</span>
            </div>
            <p className="font-bold text-slate-800 text-xs truncate">
              {category}
            </p>
          </div>

          {/* Priority */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
              <Flame className="w-3 h-3 text-slate-500" />
              <span>Priority</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                isHighPriority ? 'bg-rose-500' : isMediumPriority ? 'bg-amber-500' : 'bg-slate-400'
              }`} />
              <span className={`font-bold text-xs ${
                isHighPriority ? 'text-rose-700' : isMediumPriority ? 'text-amber-700' : 'text-slate-700'
              }`}>
                {priority}
              </span>
            </div>
          </div>
        </div>

        {/* Sentiment */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              <SentimentIcon className="w-3 h-3 text-slate-500" />
              <span>Sentiment</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs ${sentimentStyle.bgColor} ${sentimentStyle.textColor} border ${sentimentStyle.borderColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sentimentStyle.dotColor}`} />
              {sentiment}
            </span>
          </div>
        </div>

        {/* Intent */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
            <Target className="w-3 h-3 text-indigo-600" />
            <span>Intent</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">
            {intent}
          </p>
        </div>

        {/* Summary */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
            <FileText className="w-3 h-3 text-slate-500" />
            <span>Summary</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Action Required */}
        <div className={`p-3 rounded-lg border ${
          hasAction 
            ? 'bg-amber-50/70 border-amber-300 text-amber-950' 
            : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-1">
            {hasAction ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-800">Action Required</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-800">Action Required</span>
              </>
            )}
          </div>
          <p className="text-xs font-medium leading-relaxed">
            {actionRequired}
          </p>
        </div>

      </div>

    </div>
  );
}
