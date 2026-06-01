import { motion } from 'framer-motion';
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Cpu,
  Award,
  LayoutGrid,
} from 'lucide-react';

/**
 * BuilderSidebar
 * - Left control navigation sidebar pinning builder form sections
 * - Hover spring shifts and left cyan active indicator line animations
 * - Responsive rendering support (collapses on mobile/tablet viewports)
 */
export default function BuilderSidebar({ activeSection, setActiveSection }) {
  const sidebarLinks = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Profile Summary', icon: FileText },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'projects', name: 'Projects', icon: Code },
    { id: 'skills', name: 'Skills', icon: Cpu },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'template', name: 'Select Template', icon: LayoutGrid },
  ];

  return (
    <aside className="w-full lg:w-64 lg:border-r border-slate-800/80 bg-slate-950/20 backdrop-blur-xl lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 p-4 overflow-y-auto z-20 shrink-0">
      <div className="mb-4 hidden lg:block px-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
          Resume Architecture
        </p>
      </div>

      <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none shrink-0 w-full">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeSection === link.id;

          return (
            <button
              key={link.id}
              onClick={() => setActiveSection(link.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 shrink-0 select-none relative ${
                isActive
                  ? 'bg-slate-900 text-blue-400 border border-slate-800/60 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
              }`}
            >
              {/* Cyan Indicator dot / bar */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-r-full hidden lg:block"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}

              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`}
              />
              <span className="truncate">{link.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
