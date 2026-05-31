import { useState } from 'react';
import { Cpu, X } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

/**
 * SkillsForm
 * - Sleek tag input system for rapid skill enrichment
 * - Pressing Enter or typing a comma inserts an interactive chip
 * - Handles duplicates and trailing spaces beautifully
 */
export default function SkillsForm({ data = [], onChange }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputValue.trim().replace(/,/g, '');
      if (!val) return;

      // Check for duplicate names case-insensitively
      const isDuplicate = data.some(
        (skill) => skill.name?.toLowerCase() === val.toLowerCase()
      );

      if (!isDuplicate) {
        onChange([...data, { name: val }]);
      }
      setInputValue('');
    }
  };

  const handleRemove = (index) => {
    const list = [...data];
    list.splice(index, 1);
    onChange(list);
  };

  return (
    <SectionWrapper
      title="Professional Skills"
      description="Add tags representing your core technical tools, programming languages, and industry frameworks. Type and press Enter or comma."
      icon={Cpu}
    >
      <div className="space-y-4">
        {/* Input box */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Skill Name / Tag
          </label>
          <input
            type="text"
            placeholder="Type skill (e.g. React) and press Enter..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-4 py-2.5 rounded-xl text-sm text-white bg-slate-950/60 border border-slate-800 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>

        {/* Dynamic Chips List */}
        {data.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-950/30 border border-slate-900 min-h-[50px] items-center">
            {data.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-xl group/chip select-none hover:bg-blue-500/15 transition-all"
              >
                {skill.name}
                <button
                  onClick={() => handleRemove(index)}
                  className="p-0.5 rounded-md hover:bg-blue-400 hover:text-slate-950 text-blue-400/80 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic pl-1">
            No skill tags appended yet. Add languages or tools above to populate details.
          </p>
        )}
      </div>
    </SectionWrapper>
  );
}
