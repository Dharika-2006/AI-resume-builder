import { useState } from 'react';
import { Cpu, X, Sparkles, Loader2 } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

/**
 * SkillsForm
 * - Sleek tag input system for rapid skill enrichment
 * - Pressing Enter or typing a comma inserts an interactive chip
 * - Handles duplicates and trailing spaces beautifully
 */
export default function SkillsForm({ data = [], onChange, onAcceptDraft, resumeId }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggesting, setSuggesting] = useState(false);

  const handleSuggestSkills = async () => {
    if (!resumeId || resumeId === 'new') {
      toast.error('Please save your details first before requesting skill suggestions.');
      return;
    }

    setSuggesting(true);
    setSuggestions([]);
    try {
      const response = await aiService.suggestSkills(resumeId);
      if (response.success && Array.isArray(response.data?.suggestedSkills)) {
        setSuggestions(response.data.suggestedSkills);
        if (response.data.suggestedSkills.length === 0) {
          toast.success('Your skills match perfectly! No new skills suggested.');
        } else {
          toast.success('Suggested skills generated! Click to add badges. ✨');
        }
      } else {
        toast.error(response.message || 'AI service temporarily unavailable.');
      }
    } catch (err) {
      console.error('[handleSuggestSkills]', err);
      const msg = err.response?.data?.message || 'AI service temporarily unavailable.';
      toast.error(msg);
    } finally {
      setSuggesting(false);
    }
  };

  const handleAddSuggestedSkill = (skillName) => {
    const isDuplicate = data.some(
      (skill) => skill.name?.toLowerCase() === skillName.toLowerCase()
    );

    if (!isDuplicate) {
      const updated = [...data, { name: skillName }];
      onChange(updated);
      if (onAcceptDraft) {
        onAcceptDraft(updated, skillName);
      }
    }
    setSuggestions(suggestions.filter(s => s !== skillName));
  };

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
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Skill Name / Tag
            </label>

            {/* AI Skill Suggestion Button */}
            <button
              type="button"
              onClick={handleSuggestSkills}
              disabled={suggesting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {suggesting ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-slate-300" />
                  <span>Suggesting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  <span>Suggest Skills</span>
                </>
              )}
            </button>
          </div>
          <input
            type="text"
            placeholder="Type skill (e.g. React) and press Enter..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-4 py-2.5 rounded-xl text-sm text-white bg-slate-950/60 border border-slate-800 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>

        {/* Suggested Skills Panel */}
        {suggestions.length > 0 && (
          <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-3 uppercase tracking-wider">
              ✨ AI Skill Suggestions
            </span>
            <div className="flex flex-wrap gap-2 animate-fadeIn">
              {suggestions.map((skillName, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAddSuggestedSkill(skillName)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all shadow-sm transform hover:scale-105 active:scale-95 duration-100"
                >
                  + {skillName}
                </button>
              ))}
            </div>
          </div>
        )}

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
            No skill tags appended yet. Add languages or tools above to populate
            details.
          </p>
        )}
      </div>
    </SectionWrapper>
  );
}
