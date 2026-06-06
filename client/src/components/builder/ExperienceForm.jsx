import { useState } from 'react';
import { Briefcase, Plus, Trash2, Sparkles, Loader2, Check, X } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

/**
 * ExperienceForm
 * - Dynamic list rendering of professional positions
 * - Integrates inline AI Description Polishing with Accept/Discard verification
 */
export default function ExperienceForm({ data = [], onChange, onAcceptDraft }) {
  const [improvingIndex, setImprovingIndex] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null); // { index, text }

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
    if (activeDraft?.index === index) {
      setActiveDraft(null);
    }
  };

  const handleFieldChange = (index, field, value) => {
    const list = [...data];
    list[index] = { ...list[index], [field]: value };
    onChange(list);
  };

  const handleImproveExperience = async (index, currentText) => {
    if (!currentText || !currentText.trim()) {
      toast.error('Please enter an experience description first to improve with AI.');
      return;
    }

    setImprovingIndex(index);
    setActiveDraft(null);
    try {
      const response = await aiService.improveExperience(currentText);
      if (response.success && response.data?.improvedText) {
        setActiveDraft({ index, text: response.data.improvedText });
        toast.success('Description improved! Check draft below ✨');
      } else {
        toast.error(response.message || 'AI service temporarily unavailable.');
      }
    } catch (err) {
      console.error('[handleImproveExperience]', err);
      const msg = err.response?.data?.message || 'AI service temporarily unavailable.';
      toast.error(msg);
    } finally {
      setImprovingIndex(null);
    }
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
                  onChange={(e) =>
                    handleFieldChange(index, 'role', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFieldChange(index, 'company', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFieldChange(index, 'startDate', e.target.value)
                  }
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
                  onChange={(e) =>
                    handleFieldChange(index, 'endDate', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Job Description / Achievements
                  </label>
                  
                  {/* AI Polisher Trigger */}
                  <button
                    type="button"
                    onClick={() => handleImproveExperience(index, item.description)}
                    disabled={improvingIndex === index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {improvingIndex === index ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-slate-350" />
                        <span>Polishing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>Improve With AI</span>
                      </>
                    )}
                  </button>
                </div>
                
                <textarea
                  rows={4}
                  placeholder="e.g. Spearheaded development of dynamic dashboard controls, yielding a 35% decrease in page latency. Mentored 4 engineers and established strict unit test standards..."
                  value={item.description || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'description', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all resize-y leading-relaxed"
                />

                {/* AI Polish Preview Card */}
                {activeDraft && activeDraft.index === index && (
                  <div className="mt-3 p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-xl relative">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-2 uppercase tracking-wider">
                      ✨ AI Suggested Rewrite
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{activeDraft.text}"
                    </p>
                    <div className="flex gap-2 mt-4 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDraft(null);
                          toast.success('AI suggestion discarded.');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Discard Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldChange(index, 'description', activeDraft.text);
                          if (onAcceptDraft) {
                            onAcceptDraft(index, activeDraft.text);
                          }
                          setActiveDraft(null);
                          toast.success('Description updated with AI draft! 🎉');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 shadow-lg shadow-blue-500/10 transition-all"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept AI Draft
                      </button>
                    </div>
                  </div>
                )}
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
