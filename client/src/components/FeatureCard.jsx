import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * FeatureCard
 * - Premium interactive card component featuring glassmorphic borders
 * - Handles ambient orb glows that light up when hovered
 * - Fully animated via Framer Motion scale transitions
 */
export default function FeatureCard({
  title,
  description,
  icon: Icon,
  badgeText,
  badgeType = 'default',
  linkTo,
  actionText = 'Explore',
  className = '',
}) {
  const badgeColors = {
    default: 'bg-slate-800 text-slate-300 border-slate-700/60',
    primary: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    accent: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 ${className}`}
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-cyan-500/5 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />

      {/* Header Grid: Icon & Badge */}
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-850 to-slate-900 border border-slate-800 shadow-md transition-colors group-hover:border-slate-750 group-hover:bg-slate-850/80">
          {Icon && (
            <Icon className="h-6 w-6 text-slate-400 transition-colors duration-300 group-hover:text-blue-400" />
          )}
        </div>
        {badgeText && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${badgeColors[badgeType]}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-5">
        <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-blue-300">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      </div>

      {/* Footer Action */}
      <div className="mt-6 flex items-center justify-start">
        {linkTo ? (
          <Link
            to={linkTo}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {actionText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : (
          <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            {actionText}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
