import { X, ArrowLeftRight } from 'lucide-react';

/**
 * ResumeCompareView
 * - Side-by-side comparison view presenting left vs right resume snapshot states
 * - Displays sections: Summary, Experience, Projects, Skills
 */
export default function ResumeCompareView({ leftData, rightData, leftLabel, rightLabel, onClose }) {
  const renderDetails = (data) => {
    if (!data) return <p className="text-xs text-slate-500 italic">No snapshot data</p>;

    const {
      title = 'Untitled',
      template = 'MODERN',
      colorTheme = 'BLUE',
      personalInfo = {},
      summary = '',
      experience = [],
      projects = [],
      skills = [],
    } = data;

    return (
      <div className="space-y-6 text-slate-300">
        {/* Meta details */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400">
            Document Title: <strong className="text-white">{title}</strong>
          </p>
          <p className="text-xs text-slate-400">
            Layout Template: <strong className="text-white">{template}</strong>
          </p>
          <p className="text-xs text-slate-400">
            Accent Theme: <strong className="text-white">{colorTheme}</strong>
          </p>
        </div>

        {/* Professional Summary */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Professional Summary
          </h4>
          {summary || personalInfo.summary ? (
            <p className="text-xs leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-slate-900 italic">
              "{summary || personalInfo.summary}"
            </p>
          ) : (
            <p className="text-xs text-slate-500 italic">No summary entered.</p>
          )}
        </div>

        {/* Technical & Core Skills */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Skills & Core Tools
          </h4>
          {skills && skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-[10px] font-semibold border rounded-lg bg-blue-500/5 text-blue-400 border-blue-900/40"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No skills listed.</p>
          )}
        </div>

        {/* Experience details */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Professional Experience
          </h4>
          {experience && experience.length > 0 ? (
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={idx} className="p-3 bg-slate-950/20 border border-slate-900 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>{exp.role}</span>
                    <span className="text-slate-500 font-medium">{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  <p className="text-[11px] text-slate-450 italic">{exp.company}</p>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line mt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No experience entries.</p>
          )}
        </div>

        {/* Projects details */}
        <div>
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Key Projects
          </h4>
          {projects && projects.length > 0 ? (
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-3 bg-slate-950/20 border border-slate-900 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span>{proj.name}</span>
                    <span className="text-[10px] text-blue-400 font-mono">{proj.techStack}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No project entries.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden">
      <div className="w-full max-w-6xl h-[90vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden relative">
        
        {/* Header bar */}
        <div className="h-16 border-b border-slate-900 flex items-center justify-between px-6 shrink-0 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              Resume Comparison View
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Split panels layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-900">
          
          {/* Left panel (Old Version) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="sticky top-0 bg-slate-950 pb-3 border-b border-slate-900/60 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 uppercase tracking-widest leading-none">
                Left Side
              </span>
              <span className="text-xs font-extrabold text-slate-300">
                {leftLabel}
              </span>
            </div>
            <div className="mt-4">
              {renderDetails(leftSnapshotContent(leftData))}
            </div>
          </div>

          {/* Right panel (New Version / Current) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="sticky top-0 bg-slate-950 pb-3 border-b border-slate-900/60 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 uppercase tracking-widest leading-none">
                Right Side
              </span>
              <span className="text-xs font-extrabold text-blue-400">
                {rightLabel}
              </span>
            </div>
            <div className="mt-4">
              {renderDetails(leftSnapshotContent(rightData))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function leftSnapshotContent(data) {
  if (!data) return null;
  // Handle if data is the top level snapshot wrapper
  if (data.snapshot) {
    return typeof data.snapshot === 'string' ? JSON.parse(data.snapshot) : data.snapshot;
  }
  return data;
}
