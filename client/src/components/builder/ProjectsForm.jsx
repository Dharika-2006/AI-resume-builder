import { useState } from 'react';
import { Code, Plus, Trash2, Sparkles, Loader2, Check, X } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { aiService } from '../../services/aiService';
import toast from 'react-hot-toast';

/**
 * ProjectsForm
 * - Dynamic list rendering of personal or academic projects
 * - Collects project names, tech stack arrays, description, and link URLs
 */
export default function ProjectsForm({ data = [], onChange, onAcceptDraft }) {
  const [enhancingIndex, setEnhancingIndex] = useState(null);
  const [activeDraft, setActiveDraft] = useState(null); // { index, text }

  const handleEnhanceProject = async (index, currentText) => {
    if (!currentText || !currentText.trim()) {
      toast.error('Please enter a project description first to enhance with AI.');
      return;
    }

    setEnhancingIndex(index);
    setActiveDraft(null);
    try {
      const response = await aiService.improveProject(currentText);
      if (response.success && response.data?.improvedText) {
        setActiveDraft({ index, text: response.data.improvedText });
        toast.success('Project description enhanced! Check draft below ✨');
      } else {
        toast.error(response.message || 'AI service temporarily unavailable.');
      }
    } catch (err) {
      console.error('[handleEnhanceProject]', err);
      const msg = err.response?.data?.message || 'AI service temporarily unavailable.';
      toast.error(msg);
    } finally {
      setEnhancingIndex(null);
    }
  };
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Project Description / Context
                  </label>
                  
                  {/* AI Project Enhancer Trigger */}
                  <button
                    type="button"
                    onClick={() => handleEnhanceProject(index, item.description)}
                    disabled={enhancingIndex === index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    {enhancingIndex === index ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-slate-300" />
                        <span>Enhancing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>Enhance Project</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="e.g. Designed a robust full-stack SaaS platform utilizing Tailwind and Zustand to deliver visual-first dashboards. Shifted data sanitization to PostgreSQL..."
                  value={item.description || ''}
                  onChange={(e) =>
                    handleFieldChange(index, 'description', e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all resize-y leading-relaxed"
                />

                {/* AI Suggestions Draft Overlay */}
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
                          toast.success('Project description updated with AI draft! 🎉');
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
          Add Project Item
        </button>
      </div>
    </SectionWrapper>
  );
}
