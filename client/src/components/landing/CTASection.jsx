import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 md:p-12 text-center backdrop-blur-2xl shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/30 to-slate-950/80"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Empower Your Career Now
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mx-auto">
            Start Building Your Resume Today
          </h2>
          <p className="mt-4 text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Join other career-driven builders optimizing their job hunting pipeline. Parse, refine, scan, and export resume documents in minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:opacity-95 shadow-lg shadow-cyan-500/10 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
            >
              <span>Create Free Resume</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-950/60 border border-slate-800 hover:text-white hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-98"
            >
              Sign In to Account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
