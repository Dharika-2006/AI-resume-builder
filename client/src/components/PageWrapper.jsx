import { motion } from 'framer-motion';

/**
 * PageWrapper
 * - Standardizes Framer Motion animations across different views
 * - Incorporates slide-up, fade-in, and smooth layout transition properties
 */
export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1], // Custom premium ease-out curve
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
