import { motion } from 'framer-motion';
import {
  FileText,
  UploadCloud,
  Cpu,
  Sparkles,
  History,
  Download
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: 'AI Resume Builder',
      desc: 'Create highly professional resumes based on premium templates with full real-time rendering.',
      icon: FileText,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      orb: 'bg-blue-500/5'
    },
    {
      title: 'Resume Parsing',
      desc: 'Import existing PDF or DOCX documents. Our parsing engine automatically tokenizes fields to auto-fill the editor.',
      icon: UploadCloud,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      orb: 'bg-cyan-500/5'
    },
    {
      title: 'ATS Analyzer',
      desc: 'Audit your keywords, detect critical missing requirements, and receive a comprehensive match percentage score.',
      icon: Cpu,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      orb: 'bg-indigo-500/5'
    },
    {
      title: 'AI Enhancement Suite',
      desc: 'Optimize summaries, enhance experience descriptions, suggest custom sector skills, and tailor your resume for any role.',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      orb: 'bg-purple-500/5'
    },
    {
      title: 'Version History',
      desc: 'Save snapshots at key milestones. Restore previous edits in one click or run side-by-side snapshot comparisons.',
      icon: History,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      orb: 'bg-pink-500/5'
    },
    {
      title: 'PDF Export',
      desc: 'Export high-definition, multi-page layout PDFs. Retains clickable contact hyperlinks and is fully ATS-friendly.',
      icon: Download,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      orb: 'bg-emerald-500/5'
    }
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest block mb-3">
            Core Engine Competencies
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            Supercharge Your Job Search Experience
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            Discover a comprehensive suite of AI automation tools, ATS analyzers, and visual rendering modules designed to give you strategic employment advantages.
          </p>
        </div>

        {/* Features Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group rounded-3xl border border-slate-800/80 bg-slate-900/35 p-6 backdrop-blur-xl hover:border-slate-700/80 hover:bg-slate-900/50 hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px]"
              >
                {/* Glow Orb in hover */}
                <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500 ${feat.orb} pointer-events-none`} />

                <div>
                  <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center ${feat.color} shadow-inner`}>
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mt-6 group-hover:text-cyan-400 transition-colors duration-200">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
