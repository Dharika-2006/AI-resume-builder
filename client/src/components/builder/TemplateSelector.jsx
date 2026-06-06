import { LayoutGrid, Check, Palette } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

function TemplateThumbnail({ templateId, activeColorClass = 'bg-blue-500' }) {
  switch (templateId) {
    case 'MODERN':
      return (
        <div className="w-full h-20 bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex flex-col gap-1 overflow-hidden select-none mb-3">
          <div className="flex gap-1.5 items-center">
            <div className={`w-2 h-2 rounded-full ${activeColorClass}`} />
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="w-10 h-1 bg-white/80 rounded-full" />
              <div className="w-6 h-0.5 bg-slate-500 rounded-full" />
            </div>
          </div>
          <div className="flex gap-1.5 flex-1">
            <div className="w-1/3 flex flex-col gap-0.5 border-r border-slate-900 pr-1">
              <div className="w-full h-0.5 bg-slate-700 rounded-full" />
              <div className="w-2/3 h-0.5 bg-slate-800 rounded-full" />
              <div className="w-3/4 h-0.5 bg-slate-800 rounded-full" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="w-3/4 h-0.5 bg-slate-700 rounded-full" />
              <div className="w-full h-0.5 bg-slate-800 rounded-full" />
              <div className="w-5/6 h-0.5 bg-slate-800 rounded-full" />
            </div>
          </div>
        </div>
      );
    case 'CORPORATE':
      return (
        <div className="w-full h-20 bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex flex-col gap-1 overflow-hidden select-none mb-3 items-center text-center">
          <div className="flex flex-col gap-0.5 items-center w-full pb-1 border-b border-slate-900">
            <div className="w-12 h-1 bg-white/80 rounded-full" />
            <div className={`w-8 h-0.5 ${activeColorClass} rounded-full`} />
          </div>
          <div className="w-full flex flex-col gap-0.5 mt-1">
            <div className="flex justify-between w-full">
              <div className="w-1/3 h-0.5 bg-slate-700 rounded-full" />
              <div className="w-1/5 h-0.5 bg-slate-850 rounded-full" />
            </div>
            <div className="w-full h-0.5 bg-slate-800 rounded-full" />
            <div className="flex justify-between w-full">
              <div className="w-1/4 h-0.5 bg-slate-700 rounded-full" />
              <div className="w-1/6 h-0.5 bg-slate-850 rounded-full" />
            </div>
          </div>
        </div>
      );
    case 'MINIMAL':
      return (
        <div className="w-full h-20 bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex flex-col gap-1 overflow-hidden select-none mb-3">
          <div className="flex flex-col gap-0.5">
            <div className="w-10 h-1 bg-white/80 rounded-full" />
            <div className="w-6 h-0.5 bg-slate-500 rounded-full" />
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            <div className="w-full h-px bg-slate-900" />
            <div className="flex justify-between w-full">
              <div className="w-2/5 h-0.5 bg-slate-600 rounded-full" />
              <div className="w-1/6 h-0.5 bg-slate-800 rounded-full" />
            </div>
            <div className="w-full h-px bg-slate-900 mt-0.5" />
            <div className="flex justify-between w-full">
              <div className="w-1/3 h-0.5 bg-slate-600 rounded-full" />
              <div className="w-1/5 h-0.5 bg-slate-800 rounded-full" />
            </div>
          </div>
        </div>
      );
    case 'EXECUTIVE':
      return (
        <div className="w-full h-20 bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex flex-col gap-1 overflow-hidden select-none mb-3 items-center">
          <div className="flex flex-col gap-0.5 items-center pb-1 border-b-2 border-slate-900 w-full">
            <div className="w-16 h-1.5 bg-white/80 rounded-sm" />
            <div className={`w-6 h-0.5 ${activeColorClass} rounded-full`} />
          </div>
          <div className="w-full flex flex-col gap-0.5 mt-1">
            <div className="w-full h-0.5 bg-slate-800 rounded-full" />
            <div className="flex justify-between w-full">
              <div className="w-1/4 h-0.5 bg-slate-700 rounded-sm" />
              <div className="w-1/6 h-0.5 bg-slate-800 rounded-full" />
            </div>
          </div>
        </div>
      );
    case 'TECH':
      return (
        <div className="w-full h-20 bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex flex-col gap-1 overflow-hidden select-none mb-3">
          <div className="flex justify-between items-center pb-1 border-b border-slate-900">
            <div>
              <div className="w-10 h-1 bg-white/80 rounded-full" />
              <div className={`w-8 h-0.5 ${activeColorClass} rounded-full mt-0.5`} />
            </div>
          </div>
          <div className="flex gap-1 mt-0.5">
            <div className="w-5 h-1.5 bg-slate-850 rounded border border-slate-800" />
            <div className="w-7 h-1.5 bg-slate-850 rounded border border-slate-800" />
          </div>
          <div className="w-full h-0.5 bg-slate-800 rounded-full" />
        </div>
      );
    case 'CREATIVE':
      return (
        <div className="w-full h-20 bg-slate-950 rounded-xl border border-slate-800/80 p-2 flex flex-col gap-1 overflow-hidden select-none mb-3">
          <div className={`pl-1 border-l-2 ${activeColorClass.replace('bg-', 'border-')} flex flex-col gap-0.5`}>
            <div className="w-12 h-1 bg-white/80 rounded-full" />
            <div className="w-6 h-0.5 bg-slate-500 rounded-full" />
          </div>
          <div className="flex gap-1.5 flex-1 pl-1 mt-0.5">
            <div className="w-0.5 bg-slate-900 relative flex flex-col gap-1 pt-0.5">
              <div className={`w-1 h-1 rounded-full ${activeColorClass} -left-[1px] absolute`} />
              <div className={`w-1 h-1 rounded-full ${activeColorClass} -left-[1px] absolute top-[8px]`} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="w-1/2 h-0.5 bg-slate-700 rounded-full" />
              <div className="w-3/4 h-0.5 bg-slate-800 rounded-full" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function TemplateSelector({
  value = 'MODERN',
  onChange,
  colorTheme = 'BLUE',
  onChangeColorTheme,
}) {
  const templates = [
    {
      id: 'MODERN',
      name: 'Modern Accent',
      description:
        'Dynamic layout with sidebar accent lines and tag highlights. Perfect for tech and creative roles.',
      style: 'border-blue-500/20 text-blue-400 hover:border-blue-500/50',
      activeColor: 'border-blue-500 shadow-blue-500/10 bg-blue-950/20',
    },
    {
      id: 'CORPORATE',
      name: 'Corporate Formal',
      description:
        'Elegant centered layouts and formal column spacing. Tailored for business, finance, or law roles.',
      style: 'border-indigo-500/20 text-indigo-400 hover:border-indigo-500/50',
      activeColor: 'border-indigo-500 shadow-indigo-500/10 bg-indigo-950/20',
    },
    {
      id: 'MINIMAL',
      name: 'Minimal Clean',
      description:
        'Clean thin dividers and high readability margins. Suitable for academic or executive resumes.',
      style: 'border-slate-500/20 text-slate-300 hover:border-slate-500/50',
      activeColor: 'border-slate-500 shadow-slate-500/10 bg-slate-950/20',
    },
    {
      id: 'EXECUTIVE',
      name: 'Executive Leadership',
      description:
        'Serif typography with management focus and double-line sections. Tailored for MBA and senior roles.',
      style: 'border-purple-500/20 text-purple-400 hover:border-purple-500/50',
      activeColor: 'border-purple-500 shadow-purple-500/10 bg-purple-950/20',
    },
    {
      id: 'TECH',
      name: 'Tech Professional',
      description:
        'Skills-focused and projects-heavy high density layout. Optimized for Software Developers.',
      style: 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50',
      activeColor: 'border-emerald-500 shadow-emerald-500/10 bg-emerald-950/20',
    },
    {
      id: 'CREATIVE',
      name: 'Creative Timeline',
      description:
        'Striking timeline layout with modern visual accents. Fully ATS-compatible single column layout.',
      style: 'border-fuchsia-500/20 text-fuchsia-400 hover:border-fuchsia-500/50',
      activeColor: 'border-fuchsia-500 shadow-fuchsia-500/10 bg-fuchsia-950/20',
    },
  ];

  const colorThemes = [
    { id: 'BLUE', name: 'Ocean Blue', bgClass: 'bg-blue-500', ringClass: 'ring-blue-500/40 shadow-blue-500/20 border-blue-500/40' },
    { id: 'PURPLE', name: 'Royal Purple', bgClass: 'bg-purple-500', ringClass: 'ring-purple-500/40 shadow-purple-500/20 border-purple-500/40' },
    { id: 'EMERALD', name: 'Emerald', bgClass: 'bg-emerald-500', ringClass: 'ring-emerald-500/40 shadow-emerald-500/20 border-emerald-500/40' },
    { id: 'SLATE', name: 'Slate Gray', bgClass: 'bg-slate-400', ringClass: 'ring-slate-400/40 shadow-slate-400/20 border-slate-400/40' },
  ];

  const activeColorTheme = colorThemes.find(theme => theme.id === colorTheme) || colorThemes[0];
  const activeColorBg = activeColorTheme.bgClass;

  return (
    <div className="space-y-8">
      <SectionWrapper
        title="Resume Design Template"
        description="Choose a pre-designed layout format. Swapping templates updates your live document rendering instantly."
        icon={LayoutGrid}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {templates.map((tpl) => {
            const isActive = value === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => onChange(tpl.id)}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-300 relative select-none hover:shadow-lg ${
                  isActive
                    ? `${tpl.activeColor} border-[2px] shadow-2xl scale-[1.01]`
                    : 'border-slate-800 bg-slate-950/30 text-slate-400 hover:bg-slate-900/40 hover:border-slate-700/80'
                }`}
              >
                {/* Thumbnail graphic */}
                <TemplateThumbnail templateId={tpl.id} activeColorClass={activeColorBg} />

                {/* Checkmark overlay */}
                {isActive && (
                  <div className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-md ${activeColorBg}`}>
                    <Check className="h-3 w-3 stroke-[3px]" />
                  </div>
                )}

                <h3
                  className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-350'}`}
                >
                  {tpl.name}
                </h3>
                <p className="mt-1.5 text-xs text-slate-455 leading-relaxed">
                  {tpl.description}
                </p>
              </button>
            );
          })}
        </div>
      </SectionWrapper>

      {onChangeColorTheme && (
        <SectionWrapper
          title="Theme Accent Color"
          description="Select an accent highlight color to customize headings, borders, and badges across the preview and exported PDF."
          icon={Palette}
        >
          <div className="flex flex-wrap gap-4 mt-2">
            {colorThemes.map((theme) => {
              const isActive = colorTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onChangeColorTheme(theme.id)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? `${theme.ringClass} border-2 bg-slate-950/50 shadow-lg`
                      : 'border-slate-800 bg-slate-950/15 text-slate-400 hover:border-slate-700 hover:bg-slate-950/35 hover:text-slate-300'
                  }`}
                >
                  {/* Swatch circle */}
                  <div className={`w-5 h-5 rounded-full ${theme.bgClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner`}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionWrapper>
      )}
    </div>
  );
}
