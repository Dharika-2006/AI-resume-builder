import { FileText } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * SummaryForm
 * - High-fidelity text summary editor area
 * - Renders live character and word counters under the input area
 */
export default function SummaryForm({ value = '', onChange }) {
  const getWordCount = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <SectionWrapper
      title="Professional Summary"
      description="Write a brief, compelling introduction highlighting your core strengths, experiences, and career objectives."
      icon={FileText}
    >
      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Profile Statement
        </label>

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
      </div>
    </SectionWrapper>
  );
}
