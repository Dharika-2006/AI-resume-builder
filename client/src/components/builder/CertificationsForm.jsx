import { Award, Plus, Trash2 } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * CertificationsForm
 * - Dynamic list rendering of certifications and achievements
 * - Houses credentials names, issuers, and years
 */
export default function CertificationsForm({ data = [], onChange }) {
  const handleAdd = () => {
    onChange([...data, { name: '', issuer: '', year: '' }]);
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
      title="Certifications & Awards"
      description="List your professional licenses, online certifications, or awards. Keep your credentials fully documented."
      icon={Award}
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
              title="Remove Certification Slot"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Certification Name */}
              <div className="flex flex-col md:col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Certification Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={item.name || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'name', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Issuer */}
              <div className="flex flex-col md:col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Web Services"
                  value={item.issuer || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'issuer', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Year */}
              <div className="flex flex-col md:col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Year Achieved
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2023"
                  value={item.year || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'year', e.target.value)
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
          Add Certification Item
        </button>
      </div>
    </SectionWrapper>
  );
}
