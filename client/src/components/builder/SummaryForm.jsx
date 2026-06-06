import { useState } from 'react';
import { FileText, Loader2, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

/**
 * SummaryForm
 * - High-fidelity text summary editor area
 * - Incorporates premium AI summary generation and Accept/Discard preview flows
 */
export default function SummaryForm({ value = '', onChange, onAcceptDraft, resumeId }) {
  const [draft, setDraft] = useState('');
  const [generating, setGenerating] = useState(false);

  const getWordCount = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleGenerateSummary = async () => {
    if (!resumeId || resumeId === 'new') {
      toast.error('Please save your personal info details first before generating an AI summary.');
      return;
    }

    setGenerating(true);
    setDraft('');
    try {
      const response = await aiService.generateSummary(resumeId);
      if (response.success && response.data?.summary) {
        setDraft(response.data.summary);
        toast.success('AI Summary draft generated! ✨');
      } else {
        toast.error(response.message || 'AI service temporarily unavailable.');
      }
    } catch (err) {
      console.error('[handleGenerateSummary]', err);
      const msg = err.response?.data?.message || 'AI service temporarily unavailable.';
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SectionWrapper
      title="Professional Summary"
      description="Write a brief, compelling introduction highlighting your core strengths, experiences, and career objectives."
      icon={FileText}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Profile Statement
          </label>
          
          {/* AI Generator Trigger */}
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
          >
            {generating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-slate-300" />
                <span>Drafting...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                <span>Generate With AI</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={6}
          placeholder="e.g. Dynamic Software Engineer with 4+ years of experience constructing high-scale SaaS web layers. Specialized in Node.js, React, and relational database systems..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-3 rounded-xl text-sm text-white bg-slate-950/60 border border-slate-800 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all resize-y leading-relaxed"
        />

        {/* Counter Indicators */}
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Words: {getWordCount(value)}</span>
          <span>Characters: {value.length}</span>
        </div>

        {/* AI Suggestion Preview Panel */}
        <AnimatePresence>
          {draft && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-xl relative"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 uppercase tracking-wider">
                  ✨ AI Suggested Summary
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{draft}"
              </p>
              
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDraft('');
                    toast.success('AI draft discarded.');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
                >
                  <X className="h-3 w-3 mr-1" />
                  Discard Draft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(draft);
                    if (onAcceptDraft) {
                      onAcceptDraft(draft);
                    }
                    setDraft('');
                    toast.success('Summary updated with AI draft! 🎉');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 shadow-lg shadow-blue-500/10 transition-all"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Accept AI Draft
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
