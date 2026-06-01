import { Globe, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

/**
 * ResumePreview
 * - Renders a high-fidelity real-time visual preview of the user's resume
 * - Dynamically shifts layouts based on MODERN, CORPORATE, or MINIMAL values
 */
export default function ResumePreview({ data = {}, isExport = false }) {
  const {
    title = 'Untitled Resume',
    template = 'MODERN',
    personalInfo = {},
    summary = '',
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = [],
  } = data;

  // ── Template Color Styling Maps ──
  const tplStyles = {
    MODERN: {
      accentText: 'text-cyan-400',
      accentBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      borderLine: 'border-cyan-500/30',
      tagBadge: 'bg-cyan-950/40 text-cyan-400 border-cyan-900/60',
    },
    CORPORATE: {
      accentText: 'text-blue-400',
      accentBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      borderLine: 'border-blue-500/30',
      tagBadge: 'bg-blue-950/40 text-blue-400 border-blue-900/60',
    },
    MINIMAL: {
      accentText: 'text-slate-300',
      accentBg: 'bg-slate-800 text-slate-300 border-slate-700/60',
      borderLine: 'border-slate-800',
      tagBadge: 'bg-slate-900/50 text-slate-300 border-slate-850',
    },
  };

  const currentStyle = tplStyles[template] || tplStyles.MODERN;

  // Render Section Helper
  const SectionHeader = ({ text }) => (
    <div className="flex flex-col mb-4">
      <h4
        className={`text-xs font-bold uppercase tracking-widest ${currentStyle.accentText}`}
      >
        {text}
      </h4>
      <div
        className={`mt-1.5 border-b-[1.5px] ${currentStyle.borderLine} w-full`}
      />
    </div>
  );

  return (
    <div
      id={isExport ? 'resume-export-root' : 'resume-preview-root'}
      className={
        isExport
          ? 'resume-export-theme w-full bg-[#020617] p-8 font-sans leading-relaxed select-none'
          : 'w-full bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[calc(100vh-6rem)] sticky top-20 text-slate-300 font-sans leading-relaxed select-none'
      }
    >
      {/* Dynamic Template Containers */}

      {/* ── MODERN TEMPLATE ────────────────────────────────────── */}
      {template === 'MODERN' && (
        <div className="space-y-6">
          {/* Header Panel */}
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {personalInfo.name || 'Your Full Name'}
            </h1>
            <p className="text-sm font-semibold text-cyan-400 leading-none">
              {title}
            </p>
            {/* Contact Grid */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-slate-400 font-medium">
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-cyan-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo.github && (
                <span className="flex items-center gap-1">
                  <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                  {personalInfo.github}
                </span>
              )}
              {personalInfo.portfolio && (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  {personalInfo.portfolio}
                </span>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {summary && (
            <div>
              <SectionHeader text="Professional Summary" />
              <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Experience Array */}
          {experience.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Work Experience" />
              <div className="space-y-4">
                {experience.map((item, idx) => (
                  <div key={idx} className="flex flex-col experience-item">
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-white">
                      <span>{item.role || 'Job Role'}</span>
                      <span className="text-cyan-400 font-semibold">
                        {item.startDate}{' '}
                        {item.endDate ? `- ${item.endDate}` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold mt-0.5">
                      {item.company || 'Company Name'}
                    </span>
                    <p className="mt-1.5 text-xs text-slate-350 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Array */}
          {education.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Education" />
              <div className="space-y-4">
                {education.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs md:text-sm education-item"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.degree || 'Degree Title'}</span>
                      <span className="text-cyan-400 font-semibold">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mt-0.5">
                      <span>{item.institution || 'Institution School'}</span>
                      {item.cgpa && <span>GPA: {item.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Array */}
          {projects.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Projects" />
              <div className="space-y-4">
                {projects.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs md:text-sm project-card"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.name || 'Project Name'}</span>
                      {item.techStack && (
                        <span className="text-xs text-cyan-400 font-semibold">
                          {item.techStack}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-350 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {item.githubLink && (
                        <a
                          href={item.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Repo: {item.githubLink}
                        </a>
                      )}
                      {item.liveLink && (
                        <a
                          href={item.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Live: {item.liveLink}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Skills & Tools" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[11px] font-semibold border rounded-lg bg-cyan-950/40 text-cyan-400 border-cyan-900/60"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Array */}
          {certifications.length > 0 && (
            <div className="resume-section resume-section-certifications">
              <SectionHeader text="Certifications" />
              <div className="certifications-grid">
                {certifications.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs border border-slate-800 bg-slate-950/30 p-3 rounded-xl certification-card"
                  >
                    <span className="font-bold text-white break-words">
                      {item.name || 'Credential'}
                    </span>
                    <span className="text-slate-500 font-semibold mt-0.5 break-words">
                      {item.issuer || 'Issuer'}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold mt-1">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CORPORATE TEMPLATE ─────────────────────────────────── */}
      {template === 'CORPORATE' && (
        <div className="space-y-6">
          {/* Header Panel */}
          <div className="flex flex-col items-center text-center gap-2 border-b border-slate-800 pb-5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none">
              {personalInfo.name || 'Your Full Name'}
            </h1>
            <p className="text-xs uppercase tracking-widest text-blue-400 font-bold">
              {title}
            </p>
            {/* Contact horizontal block */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-2 text-xs text-slate-450 font-medium">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
              {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
              {personalInfo.github && <span>• {personalInfo.github}</span>}
              {personalInfo.portfolio && (
                <span>• {personalInfo.portfolio}</span>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {summary && (
            <div>
              <SectionHeader text="Executive Summary" />
              <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Experience Array */}
          {experience.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Employment History" />
              <div className="space-y-4">
                {experience.map((item, idx) => (
                  <div key={idx} className="flex flex-col experience-item">
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-white">
                      <span>{item.role || 'Job Role'}</span>
                      <span className="text-blue-450 font-semibold">
                        {item.startDate}{' '}
                        {item.endDate ? `- ${item.endDate}` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
                      {item.company || 'Company Name'}
                    </span>
                    <p className="mt-1.5 text-xs text-slate-350 leading-relaxed whitespace-pre-line border-l-2 border-blue-900/40 pl-3 ml-0.5">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Array */}
          {education.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Education Details" />
              <div className="space-y-3">
                {education.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs md:text-sm education-item"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.degree || 'Degree Title'}</span>
                      <span className="text-blue-450 font-semibold">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mt-0.5">
                      <span>{item.institution || 'Institution School'}</span>
                      {item.cgpa && <span>Performance Index: {item.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Array */}
          {projects.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Technical Projects" />
              <div className="space-y-4">
                {projects.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs md:text-sm project-card"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.name || 'Project Name'}</span>
                      {item.techStack && (
                        <span className="text-xs text-blue-400 font-semibold">
                          {item.techStack}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-350 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {item.githubLink && (
                        <a
                          href={item.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Source: {item.githubLink}
                        </a>
                      )}
                      {item.liveLink && (
                        <a
                          href={item.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Production: {item.liveLink}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Key Expertise & Skills" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[11px] font-semibold border rounded-lg bg-blue-950/40 text-blue-400 border-blue-900/60"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Array */}
          {certifications.length > 0 && (
            <div className="resume-section resume-section-certifications">
              <SectionHeader text="Certifications & Endorsements" />
              <div className="certifications-grid">
                {certifications.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs border border-slate-800/80 bg-slate-900/10 p-3 rounded-xl certification-card"
                  >
                    <span className="font-bold text-white break-words">
                      {item.name || 'Credential'}
                    </span>
                    <span className="text-slate-500 font-semibold mt-0.5 break-words">
                      {item.issuer || 'Issuer'}
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold mt-1">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MINIMAL TEMPLATE ───────────────────────────────────── */}
      {template === 'MINIMAL' && (
        <div className="space-y-6">
          {/* Header Panel */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-none uppercase">
              {personalInfo.name || 'Your Full Name'}
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold leading-none">
              {title}
            </p>
            {/* Contact blocks vertical list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mt-2 text-xs text-slate-500 font-semibold">
              {personalInfo.email && <span>Email: {personalInfo.email}</span>}
              {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
              {personalInfo.location && (
                <span>Loc: {personalInfo.location}</span>
              )}
              {personalInfo.linkedin && (
                <span>LinkedIn: {personalInfo.linkedin}</span>
              )}
              {personalInfo.github && (
                <span>GitHub: {personalInfo.github}</span>
              )}
              {personalInfo.portfolio && (
                <span>Web: {personalInfo.portfolio}</span>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {summary && (
            <div>
              <SectionHeader text="Background" />
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Experience Array */}
          {experience.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Experience" />
              <div className="space-y-4">
                {experience.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs md:text-sm experience-item"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.role || 'Job Role'}</span>
                      <span className="text-slate-450 font-semibold">
                        {item.startDate}{' '}
                        {item.endDate ? `- ${item.endDate}` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold mt-0.5 italic">
                      {item.company || 'Company Name'}
                    </span>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Array */}
          {education.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Academic Profile" />
              <div className="space-y-3">
                {education.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs md:text-sm education-item"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.degree || 'Degree Title'}</span>
                      <span className="text-slate-450 font-semibold">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-550 mt-0.5">
                      <span>{item.institution || 'Institution School'}</span>
                      {item.cgpa && <span>GPA: {item.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Array */}
          {projects.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Key Projects" />
              <div className="space-y-3">
                {projects.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs md:text-sm project-card"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.name || 'Project Name'}</span>
                      <span className="text-xs text-slate-450 font-semibold">
                        {item.techStack}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {item.githubLink && (
                        <a
                          href={item.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Repo: {item.githubLink}
                        </a>
                      )}
                      {item.liveLink && (
                        <a
                          href={item.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Link: {item.liveLink}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Core Skills" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[11px] font-semibold border rounded-lg bg-slate-900/50 text-slate-300 border-slate-850"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Array */}
          {certifications.length > 0 && (
            <div className="resume-section resume-section-certifications">
              <SectionHeader text="Certifications" />
              <div className="certifications-grid">
                {certifications.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs border border-slate-850 bg-slate-900/10 p-3 rounded-xl certification-card"
                  >
                    <span className="font-bold text-white break-words">
                      {item.name || 'Credential'}
                    </span>
                    <span className="text-slate-550 font-semibold mt-0.5 break-words">
                      {item.issuer || 'Issuer'}
                    </span>
                    <span className="text-[10px] text-slate-450 font-bold mt-1">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
