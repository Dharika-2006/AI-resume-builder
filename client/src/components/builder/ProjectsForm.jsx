import { Code, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * ProjectsForm
 * - Dynamic list rendering of personal or academic projects
 * - Collects project names, tech stack arrays, description, and link URLs
 */
export default function ProjectsForm({ data = [], onChange }) {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        name: '',
        techStack: '',
        description: '',
        githubLink: '',
        liveLink: '',
      },
    ]);
  };

  const handleRemove = (index) => {
    const list = [...data];
    list.splice(index, 1);
    onChange(list);
  };

  const handleFieldChange = (index, field, value) => {
    const list = [...data];
    list[index] = { ...list[index], [field]: value };
    onChange(list);
  };

  return (
    <SectionWrapper
      title="Personal & Team Projects"
      description="Showcase your key accomplishments, coding highlights, and deployments. Dynamic URL support."
      icon={Code}
    >
      <div className="space-y-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/40 relative group/entry transition-all hover:border-slate-700/60"
          >
            {/* Remove button */}
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all opacity-0 group-hover/entry:opacity-100"
              title="Remove Project Slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Name */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Resume Builder SaaS"
                  value={item.name || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'name', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Tech Stack / Languages
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Tailwind CSS, PostgreSQL"
                  value={item.techStack || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'techStack', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* GitHub Link */}
              <div className="flex flex-col col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  GitHub Repository Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. github.com/johndoe/resume-builder"
                  value={item.githubLink || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'githubLink', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Live Link */}
              <div className="flex flex-col col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Live Deployment URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. resume-builder.dev"
                  value={item.liveLink || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'liveLink', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Project Description / Context
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Designed a robust full-stack SaaS platform utilizing Tailwind and Zustand to deliver visual-first dashboards. Shifted data sanitization to PostgreSQL..."
                  value={item.description || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'description', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Entry CTA */}
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-800 hover:border-slate-600 rounded-2xl text-xs font-bold text-slate-400 hover:text-white transition-all bg-slate-900/10 hover:bg-slate-900/30"
        >
          <Plus className="h-4 w-4" />
          Add Project Item
        </button>
      </div>
    </SectionWrapper>
  );
}
