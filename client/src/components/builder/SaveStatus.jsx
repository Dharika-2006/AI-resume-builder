import { motion, AnimatePresence } from 'framer-motion';
import { CloudCheck, CloudLightning, CloudUpload, AlertCircle } from 'lucide-react';

/**
 * SaveStatus
 * - Renders a sleek saving status indicator at the top right
 * - Color codes the status dynamically: Saved (green/emerald), Saving (cyan/blue), Unsaved (amber/slate)
 */
export default function SaveStatus({ status }) {
  const statusConfig = {
    saved: {
      text: 'Saved',
      icon: CloudCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    saving: {
      text: 'Saving...',
      icon: CloudUpload,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    unsaved: {
      text: 'Unsaved Changes',
      icon: CloudLightning,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  };

  const config = statusConfig[status] || statusConfig.unsaved;
  const Icon = config.icon;

  return (
    <div className="fixed top-20 right-4 z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-xl backdrop-blur-xl ${config.color}`}
        >
          <Icon className="h-4 w-4 shrink-0 animate-pulse" />
          <span>{config.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
export { CloudLightning as CloudCheck }; // Export helper for icons compatibility
