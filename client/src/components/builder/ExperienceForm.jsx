import { Briefcase, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * ExperienceForm
 * - Dynamic list rendering of professional positions
 * - Houses description textareas for job responsibilities
 */
export default function ExperienceForm({ data = [], onChange }) {
  const handleAdd = () => {
    onChange([
      ...data,
      { role: '', company: '', startDate: '', endDate: '', description: '' },
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
      title="Work Experience"
      description="Outline your professional employment history. Describe your core achievements, responsibilities, and technologies."
      icon={Briefcase}
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
              title="Remove Position Slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Job Title / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer"
                  value={item.role || ''}
                  onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google LLC"
                  value={item.company || ''}
                  onChange={(e) => handleFieldChange(index, 'company', e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Start Date */}
              <div className="flex flex-col col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Start Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jan 2022"
                  value={item.startDate || ''}
                  onChange={(e) => handleFieldChange(index, 'startDate', e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  End Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Present or Dec 2023"
                  value={item.endDate || ''}
                  onChange={(e) => handleFieldChange(index, 'endDate', e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Job Description / Achievements
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Spearheaded development of dynamic dashboard controls, yielding a 35% decrease in page latency. Mentored 4 engineers and established strict unit test standards..."
                  value={item.description || ''}
                  onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
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
          Add Experience Item
        </button>
      </div>
    </SectionWrapper>
  );
}
