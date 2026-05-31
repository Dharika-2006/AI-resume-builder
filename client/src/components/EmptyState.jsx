import { motion } from 'framer-motion';

/**
 * EmptyState
 * - Sleek, generic empty state display using glassmorphic container
 * - Houses pulsating graphic backgrounds to represent missing content nicely
 * - Fully customizable titles, subtitles, and button triggers
 */
export default function EmptyState({
  title = 'No records found',
  description = 'Add new information to see lists and analytics here.',
  icon: Icon,
  actionText,
  onActionClick,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-xl ${className}`}
    >
      {/* Icon Wrapper with Ambient Glow */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute -inset-2 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative z-10">
          {Icon ? (
            <Icon className="h-8 w-8 text-slate-400" />
          ) : (
            <svg
              className="h-8 w-8 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.5m12 3v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Headings */}
      <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>

      {/* Optional Call to Action Button */}
      {actionText && onActionClick && (
        <motion.button
          whileHover={{ scale: 1.025 }}
          whileTap={{ scale: 0.975 }}
          onClick={onActionClick}
          className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all duration-200"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
}
