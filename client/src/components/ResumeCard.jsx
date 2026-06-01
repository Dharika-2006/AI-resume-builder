import { motion } from 'framer-motion';
import {
  Pencil,
  Copy,
  Trash2,
  FileText,
  Calendar,
  GraduationCap,
  Briefcase,
  Code,
  Loader2,
} from 'lucide-react';
import {
  formatResumeDate,
  getTemplateColor,
  getResumePreview,
  getCompletionPercentage,
} from '../utils/resumeHelpers';

/**
 * ResumeCard
 * - Premium interactive container card representing a single resume document
 * - Renders gradient template badges, completion progress bars, and stats badges
 * - Encapsulates edit, duplicate, and delete handlers with full loading indicators
 */
export default function ResumeCard({
  resume,
  onEdit,
  onDuplicate,
  onDelete,
  isDuplicating = false,
  isDeleting = false,
}) {
  const templateStyle = getTemplateColor(resume.template);
  const { educationCount, experienceCount, projectCount } =
    getResumePreview(resume);
  const completion = getCompletionPercentage(resume);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-slate-700/80 hover:shadow-2xl hover:shadow-blue-500/5"
    >
      {/* Background ambient light effects */}
      <div
        className={`absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-60 bg-gradient-to-tr ${templateStyle.gradient}`}
      />

      {/* Header: Title and Template Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800/60 border border-slate-700/50 shadow-inner group-hover:border-blue-500/30 group-hover:bg-slate-800 transition-colors">
            <FileText className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
          </div>
          <div>
            <h3
              className="text-base font-bold text-white leading-snug tracking-tight truncate max-w-[160px] md:max-w-[200px]"
              title={resume.title}
            >
              {resume.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              <Calendar className="h-3.5 w-3.5" />
              Updated {formatResumeDate(resume.updatedAt)}
            </span>
          </div>
        </div>

        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${templateStyle.bg}`}
        >
          {resume.template}
        </span>
      </div>

      {/* Middle Description Block */}
      <p className="mt-4 text-sm text-slate-400 line-clamp-2 h-10 leading-relaxed">
        {resume.description || 'No description provided for this resume.'}
      </p>

      {/* Complete Index Progress Bar */}
      <div className="mt-5 border-t border-slate-800/50 pt-4">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-slate-500">Completeness</span>
          <span className={templateStyle.text}>{completion}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${templateStyle.gradient} shadow-lg shadow-cyan-500/10`}
          />
        </div>
      </div>

      {/* Micro Grid Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/20 border border-slate-800/60 rounded-lg px-2 py-1">
          <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
          <span>{educationCount} Edu</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/20 border border-slate-800/60 rounded-lg px-2 py-1">
          <Briefcase className="h-3.5 w-3.5 text-cyan-400" />
          <span>{experienceCount} Exp</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/20 border border-slate-800/60 rounded-lg px-2 py-1">
          <Code className="h-3.5 w-3.5 text-indigo-400" />
          <span>{projectCount} Proj</span>
        </div>
      </div>

      {/* Card Controls Footer Toolbar */}
      <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-800/50 pt-4">
        <button
          onClick={() => onEdit(resume.id)}
          disabled={isDuplicating || isDeleting}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white bg-slate-900 border border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 hover:text-blue-400 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          onClick={() => onDuplicate(resume.id)}
          disabled={isDuplicating || isDeleting}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 hover:text-cyan-400 transition-all duration-200 text-slate-400 disabled:opacity-50 disabled:pointer-events-none"
          title="Duplicate Resume"
        >
          {isDuplicating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          onClick={() => onDelete(resume.id)}
          disabled={isDuplicating || isDeleting}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-850 hover:bg-rose-950/20 hover:border-rose-900/40 hover:text-rose-400 transition-all duration-200 text-slate-500 disabled:opacity-50 disabled:pointer-events-none"
          title="Delete Resume"
        >
          {isDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
