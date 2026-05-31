import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <motion.div
      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="animate-pulse space-y-4">
        {/* Icon placeholder */}
        <div className="w-12 h-12 rounded-xl bg-slate-800" />
        {/* Title */}
        <div className="h-4 bg-slate-800 rounded-lg w-3/4" />
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded-lg w-full" />
          <div className="h-3 bg-slate-800 rounded-lg w-2/3" />
        </div>
        {/* CTA */}
        <div className="h-8 bg-slate-800 rounded-lg w-1/3 mt-4" />
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
