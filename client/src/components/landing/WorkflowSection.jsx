import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileEdit,
  Cpu,
  Sparkles,
  Download
} from 'lucide-react';

export default function WorkflowSection() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Upload Resume',
      desc: 'Import your existing PDF/DOCX resume file or build from scratch.',
      icon: UploadCloud,
      color: 'text-blue-405 bg-blue-500/10 border-blue-500/20'
    },
    {
      step: 'Step 2',
      title: 'Edit & Improve',
      desc: 'Use the interactive editor to structure details and enhance fields.',
      icon: FileEdit,
      color: 'text-cyan-405 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      step: 'Step 3',
      title: 'Analyze ATS Score',
      desc: 'Perform a deep ATS score analysis against standard parsing requirements.',
      icon: Cpu,
      color: 'text-indigo-405 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      step: 'Step 4',
      title: 'Tailor for Job',
      desc: 'Accept tailored AI summaries and skills tailored to target job posts.',
      icon: Sparkles,
      color: 'text-purple-405 bg-purple-500/10 border-purple-500/20'
    },
    {
      step: 'Step 5',
      title: 'Export PDF',
      desc: 'Download a pixel-perfect, recruiter-ready professional PDF document.',
      icon: Download,
      color: 'text-emerald-405 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-950/40 relative border-t border-b border-slate-900 overflow-hidden">
      
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">
            Product Workflow
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            The Optimization Lifecycle
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            Follow our high-fidelity workspace path to transform raw experience descriptions into highly refined, ATS-vetted resume assets.
          </p>
        </div>

        {/* Visual Timeline Path */}
        <div className="relative">
          {/* Connecting Line for large displays */}
          <div className="absolute top-16 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-emerald-500/40 hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center relative group"
                >
                  {/* Icon Circle */}
                  <div className="relative z-10 h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-slate-700 transition-all duration-300">
                    <div className="absolute inset-0 rounded-2xl opacity-10 bg-slate-500" />
                    <Icon className={`h-7 w-7 shrink-0 ${item.color.split(' ')[0]}`} />
                  </div>

                  {/* Step label */}
                  <span className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[9px] font-bold text-slate-500 bg-slate-900/60 border border-slate-800/80 uppercase tracking-widest leading-none">
                    {item.step}
                  </span>

                  {/* Text details */}
                  <h3 className="text-base font-extrabold text-white mt-3 leading-none">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
