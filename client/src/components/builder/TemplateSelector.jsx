import { LayoutGrid, Check } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * TemplateSelector
 * - Renders cards to choose between MODERN, CORPORATE, and MINIMAL styles
 * - Instant preview switches on selection click
 */
export default function TemplateSelector({ value = 'MODERN', onChange }) {
  const templates = [
    {
      id: 'MODERN',
      name: 'Modern Accent',
      description: 'Dynamic layout equipped with sidebar accent lines and visual HSL tag highlights. Perfect for tech and creative roles.',
      style: 'border-cyan-500/20 bg-cyan-950/10 text-cyan-400 hover:border-cyan-500/50',
      activeColor: 'border-cyan-500 shadow-cyan-500/10 bg-cyan-950/20',
    },
    {
      id: 'CORPORATE',
      name: 'Corporate Formal',
      description: 'Elegant centered header layouts, crisp typography, and formal column spacing. Tailored for traditional business, finance, or law roles.',
      style: 'border-blue-500/20 bg-blue-950/10 text-blue-400 hover:border-blue-500/50',
      activeColor: 'border-blue-500 shadow-blue-500/10 bg-blue-950/20',
    },
    {
      id: 'MINIMAL',
      name: 'Minimal Clean',
      description: 'Clean thin dividers, maximum spacing, and high readability margins. Suitable for academic, research, or executive resumes.',
      style: 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400 hover:border-emerald-500/50',
      activeColor: 'border-emerald-500 shadow-emerald-500/10 bg-emerald-950/20',
    },
  ];

  return (
    <SectionWrapper
      title="Resume Design Template"
      description="Choose a pre-designed layout format. Swapping templates updates your live document rendering instantly."
      icon={LayoutGrid}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {templates.map((tpl) => {
          const isActive = value === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onChange(tpl.id)}
              className={`flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 relative select-none hover:shadow-lg ${
                isActive
                  ? `${tpl.activeColor} border-[2px] shadow-2xl`
                  : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:bg-slate-900/40 hover:border-slate-700/80'
              }`}
            >
              {/* Checkmark overlay */}
              {isActive && (
                <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/30">
                  <Check className="h-3.5 w-3.5 stroke-[3px]" />
                </div>
              )}

              <h3 className={`text-base font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {tpl.name}
              </h3>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                {tpl.description}
              </p>
            </button>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
