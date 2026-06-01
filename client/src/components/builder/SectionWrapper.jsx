import { motion } from 'framer-motion';

/**
 * SectionWrapper
 * - Wraps form editor sub-modules (Personal, Summary, Education, etc.) uniformly
 * - Standardizes glassmorphic card borders, paddings, and header styles
 * - Displays entry slide-up transitions via Framer Motion
 */
export default function SectionWrapper({
  title,
  description,
  icon: Icon,
  children,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden mb-6 shadow-2xl ${className}`}
    >
      {/* Background visual light balance */}
      <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="border-b border-slate-800/60 pb-5 mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h2 className="text-xl font-bold tracking-tight text-white">
            {title}
          </h2>
        </div>
        {description && (
          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Inputs Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
