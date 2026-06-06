import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-950">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/10 via-cyan-500/10 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 -left-48 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Sparkles pill tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 uppercase tracking-widest mb-6"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Career Co-pilot</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto"
        >
          Build{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            ATS-Optimized Resumes
          </span>{' '}
          with AI
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Generate professional resumes, improve content with AI, analyze ATS scores, tailor resumes for job descriptions, and export premium PDFs.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:opacity-95 shadow-xl shadow-cyan-500/10 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
          >
            <span>Create Free Resume</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-slate-350 bg-slate-900 border border-slate-800 hover:text-white hover:bg-slate-850 hover:scale-[1.02] active:scale-98 transition-all"
          >
            Sign In to Account
          </Link>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"
        >
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
          <span>Double-checked for ATS rules & parser compatibility</span>
        </motion.div>

        {/* Visual Mockup Container (Glassmorphic) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-16 md:mt-20 max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/10 p-2.5 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden">
            <img
              src="/builder_mock.png"
              alt="ResumeAI Resume Builder Dashboard Interface Mockup"
              className="w-full h-auto object-cover select-none"
              draggable="false"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
