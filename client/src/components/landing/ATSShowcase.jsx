import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, XCircle, Sparkles, TrendingUp } from 'lucide-react';

export default function ATSShowcase() {
  const matchedKeywords = ['React', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Tailwind CSS', 'TypeScript'];
  const missingKeywords = ['Docker', 'CI/CD Pipelines', 'Unit Testing', 'Redis'];
  
  return (
    <section id="ats-demo" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -left-36 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block mb-3">
            Real-Time Analysis Engine
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight">
            ATS Compatibility Analyzer
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            Applicant Tracking Systems screen out over 70% of resumes. Our rules-based scoring engine audits your document structure and keyword densities to guarantee compatibility.
          </p>
        </div>

        {/* Master Showcase Layout: Side-by-Side (Screenshot on Left, Live Mock Scanner on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Panel: Real Screenshot mock (5/12 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/10 p-2.5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden">
                <img
                  src="/ats_mock.png"
                  alt="ResumeAI ATS Analyzer System Interface Screenshot Mockup"
                  className="w-full h-auto object-cover select-none group-hover:scale-[1.02] duration-300"
                  draggable="false"
                />
              </div>
            </div>
            
            <div className="rounded-2xl border border-slate-850/60 bg-slate-900/15 p-5 text-center flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-left text-xs text-slate-400 font-semibold leading-relaxed">
                "Our scans evaluate semantic content groupings, keyword frequencies, contact hyperlinking, and layout breaking rules."
              </p>
            </div>
          </div>

          {/* Right Panel: Interactive Mock Dashboard (7/12 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative">
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-800/50 pb-6 mb-6">
              
              {/* Radial Meter & Summary Stats */}
              <div className="relative shrink-0">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-36 h-36 transform -rotate-90">
                    <circle cx="72" cy="72" r="60" className="stroke-slate-800/60" strokeWidth="10" fill="transparent" />
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="stroke-cyan-500 stroke-linecap-round"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      whileInView={{ strokeDashoffset: 2 * Math.PI * 60 * 0.15 }} // 85% score
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white leading-none">85</span>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">ATS Score</span>
                  </div>
                </div>
              </div>

              {/* Stats description */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 uppercase tracking-wider">
                  Scan Summary
                </span>
                <h3 className="text-xl font-extrabold text-white leading-none">Good Candidate Match</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  The resume matches senior fullstack software engineer requirements, but lacks some core testing and containerization keywords needed to pass filter thresholds.
                </p>
              </div>

            </div>

            {/* Keyword Chip Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matched Keywords */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-850 p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  Matched Keywords ({matchedKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {matchedKeywords.map((kw) => (
                    <span key={kw} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-900/40">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-850 p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  <XCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
                  Missing Keywords ({missingKeywords.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw) => (
                    <span key={kw} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/40">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Suggestions Card */}
            <div className="mt-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 p-4 flex gap-3.5 items-start">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">AI Recommendations</h4>
                <p className="text-[11px] text-slate-350 mt-1.5 leading-relaxed font-medium">
                  "Integrate **Docker** inside your experience bullet points under your current role, and mention **CI/CD Pipelines** or **Unit Testing** in your project description fields to reach a 95% match rate."
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
