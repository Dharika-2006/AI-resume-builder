import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const features = [
  'AI Resume Generation',
  'ATS Score Analysis',
  'Multiple Resume Templates',
  'Job Description Matching',
  'Resume Upload & Enhancement',
  'AI Summary Generation',
  'PDF Export',
];

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* ── Left Brand Panel ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950" />
        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-extrabold text-lg">R</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Resume<span className="text-cyan-400">AI</span>
            </span>
          </motion.div>

          {/* Main headline */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4"
            >
              Build ATS-Optimized
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Resumes with AI
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-400 text-lg leading-relaxed mb-10"
            >
              Generate, improve, analyze and tailor resumes using
              <br />
              AI-powered workflows built for modern job seekers.
            </motion.p>

            {/* Feature list */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="space-y-3"
            >
              {features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.07 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Footer trust badge */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-slate-600 text-xs"
          >
            Trusted by job seekers worldwide · Powered by Groq AI
          </motion.p>
        </div>
      </div>

      {/* ── Right Form Panel ──────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-bold text-lg">
              Resume<span className="text-cyan-400">AI</span>
            </span>
          </div>

          {/* Glassmorphism card */}
          <motion.div
            whileHover={{ boxShadow: '0 0 40px rgba(59,130,246,0.08)' }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
          >
            {/* Card header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
              <p className="text-slate-400 text-sm">{subtitle}</p>
            </div>

            {/* Form content injected via children */}
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
