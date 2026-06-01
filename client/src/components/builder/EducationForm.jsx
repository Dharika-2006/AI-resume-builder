import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * EducationForm
 * - Dynamic list rendering of user's educational credentials
 * - Allows adding new degree forms and sweeping them via custom handlers
 */
export default function EducationForm({ data = [], onChange }) {
  const handleAdd = () => {
    onChange([...data, { degree: '', institution: '', year: '', cgpa: '' }]);
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
      title="Education History"
      description="List your degrees, institutions, graduation dates, and performance indices. Unlimited academic slots."
      icon={GraduationCap}
    >
      <div className="space-y-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl border border-slate-800/80 bg-slate-950/40 relative group/entry transition-all hover:border-slate-700/60"
          >
            {/* Trash Sweep Button */}
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-all opacity-0 group-hover/entry:opacity-100"
              title="Remove Academic Slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Degree */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Degree / Program
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.S. in Computer Science"
                  value={item.degree || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'degree', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Institution */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  School / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford University"
                  value={item.institution || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'institution', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Year */}
              <div className="flex flex-col col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Graduation Year / Period
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2020 - 2024"
                  value={item.year || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'year', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* CGPA */}
              <div className="flex flex-col col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  GPA / CGPA (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3.8 / 4.0 or 9.2 / 10"
                  value={item.cgpa || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'cgpa', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
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
          Add Education Item
        </button>
      </div>
    </SectionWrapper>
  );
}
