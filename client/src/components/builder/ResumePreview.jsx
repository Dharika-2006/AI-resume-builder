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
    colorTheme = 'BLUE',
    personalInfo = {},
    summary = '',
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = [],
  } = data;

  // ── Template Color Styling Maps ──
  const accentColors = {
    BLUE: {
      accentText: 'text-blue-400',
      accentBg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      borderLine: 'border-blue-500/30',
      tagBadge: 'bg-blue-950/40 text-blue-400 border-blue-900/60',
      solidText: '#3b82f6',
      solidBg: '#0f172a',
      solidBorder: '#1e3a8a',
    },
    PURPLE: {
      accentText: 'text-purple-400',
      accentBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      borderLine: 'border-purple-500/30',
      tagBadge: 'bg-purple-950/40 text-purple-400 border-purple-900/60',
      solidText: '#a855f7',
      solidBg: '#1e112c',
      solidBorder: '#4a1d6d',
    },
    EMERALD: {
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      borderLine: 'border-emerald-500/30',
      tagBadge: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60',
      solidText: '#10b981',
      solidBg: '#062016',
      solidBorder: '#064e3b',
    },
    SLATE: {
      accentText: 'text-slate-300',
      accentBg: 'bg-slate-800 text-slate-350 border-slate-700/60',
      borderLine: 'border-slate-800',
      tagBadge: 'bg-slate-900/50 text-slate-300 border-slate-850',
      solidText: '#94a3b8',
      solidBg: '#1e293b',
      solidBorder: '#334155',
    },
  };

  const defaultThemeForTemplate = {
    MODERN: 'BLUE',
    CORPORATE: 'BLUE',
    MINIMAL: 'SLATE',
    EXECUTIVE: 'BLUE',
    TECH: 'EMERALD',
    CREATIVE: 'PURPLE',
  };

  const activeColorTheme = colorTheme || defaultThemeForTemplate[template] || 'BLUE';
  const currentStyle = accentColors[activeColorTheme] || accentColors.BLUE;

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
            <p className={`text-sm font-semibold leading-none ${currentStyle.accentText}`}>
              {title}
            </p>
            {/* Contact Grid */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-slate-400 font-medium">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1 hover:underline">
                  <Mail className={`h-3.5 w-3.5 ${currentStyle.accentText}`} />
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-1 hover:underline">
                  <Phone className={`h-3.5 w-3.5 ${currentStyle.accentText}`} />
                  {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className={`h-3.5 w-3.5 ${currentStyle.accentText}`} />
                  {personalInfo.location}
                </span>
              )}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <LinkIcon className={`h-3.5 w-3.5 ${currentStyle.accentText}`} />
                  {personalInfo.linkedin}
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <LinkIcon className={`h-3.5 w-3.5 ${currentStyle.accentText}`} />
                  {personalInfo.github}
                </a>
              )}
              {personalInfo.portfolio && (
                <a
                  href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Globe className={`h-3.5 w-3.5 ${currentStyle.accentText}`} />
                  {personalInfo.portfolio}
                </a>
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
                  <div key={idx} className="flex flex-col experience-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
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
            <p className={`text-xs uppercase tracking-widest font-bold ${currentStyle.accentText}`}>
              {title}
            </p>
            {/* Contact horizontal block */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-2 text-xs text-slate-400 font-medium">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="hover:underline">
                  • {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  • {personalInfo.linkedin}
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  • {personalInfo.github}
                </a>
              )}
              {personalInfo.portfolio && (
                <a
                  href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  • {personalInfo.portfolio}
                </a>
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
                  <div key={idx} className="flex flex-col experience-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-white">
                      <span>{item.role || 'Job Role'}</span>
                      <span className={`font-semibold ${currentStyle.accentText}`}>
                        {item.startDate}{' '}
                        {item.endDate ? `- ${item.endDate}` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-450 font-semibold mt-0.5 uppercase tracking-wider">
                      {item.company || 'Company Name'}
                    </span>
                    <p className={`mt-1.5 text-xs text-slate-350 leading-relaxed whitespace-pre-line border-l-2 pl-3 ml-0.5 ${currentStyle.borderLine}`}>
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.degree || 'Degree Title'}</span>
                      <span className={`font-semibold ${currentStyle.accentText}`}>
                        {item.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-455 font-semibold mt-0.5">
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.name || 'Project Name'}</span>
                      {item.techStack && (
                        <span className={`text-xs font-semibold ${currentStyle.accentText}`}>
                          {item.techStack}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-350 leading-relaxed">
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
                    className={`px-2.5 py-1 text-[11px] font-semibold border rounded-lg ${currentStyle.tagBadge}`}
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <span className="font-bold text-white break-words">
                      {item.name || 'Credential'}
                    </span>
                    <span className="text-slate-500 font-semibold mt-0.5 break-words">
                      {item.issuer || 'Issuer'}
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${currentStyle.accentText}`}>
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
            <p className={`text-xs uppercase tracking-widest font-bold leading-none ${currentStyle.accentText}`}>
              {title}
            </p>
            {/* Contact blocks vertical list with links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 mt-2 text-xs text-slate-500 font-semibold">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  Email: {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="hover:underline">
                  Phone: {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && <span>Loc: {personalInfo.location}</span>}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn: {personalInfo.linkedin}
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub: {personalInfo.github}
                </a>
              )}
              {personalInfo.portfolio && (
                <a
                  href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Web: {personalInfo.portfolio}
                </a>
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.name || 'Project Name'}</span>
                      <span className="text-xs text-slate-455 font-semibold">
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
                    className={`px-2.5 py-1 text-[11px] font-semibold border rounded-lg ${currentStyle.tagBadge}`}
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
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
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

      {/* ── EXECUTIVE TEMPLATE ─────────────────────────────────── */}
      {template === 'EXECUTIVE' && (
        <div className="space-y-5 text-slate-350">
          {/* Elegant Centered Header */}
          <div className="flex flex-col items-center text-center gap-2 pb-4 border-b-2 border-slate-800">
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-tight uppercase">
              {personalInfo.name || 'Your Full Name'}
            </h1>
            <p className={`text-xs font-semibold tracking-widest uppercase ${currentStyle.accentText}`}>
              {title}
            </p>
            {/* Inline bulleted contact info wrapped in active anchors */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-2 text-xs text-slate-400 font-medium">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <>
                  <span className="text-slate-600">•</span>
                  <a href={`tel:${personalInfo.phone}`} className="hover:underline">
                    {personalInfo.phone}
                  </a>
                </>
              )}
              {personalInfo.location && (
                <>
                  <span className="text-slate-600">•</span>
                  <span>{personalInfo.location}</span>
                </>
              )}
              {personalInfo.linkedin && (
                <>
                  <span className="text-slate-600">•</span>
                  <a
                    href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                </>
              )}
              {personalInfo.github && (
                <>
                  <span className="text-slate-600">•</span>
                  <a
                    href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </>
              )}
              {personalInfo.portfolio && (
                <>
                  <span className="text-slate-600">•</span>
                  <a
                    href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Portfolio
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {summary && (
            <div className="text-center italic px-4 md:px-8 text-xs md:text-sm text-slate-300 leading-relaxed font-serif">
              "{summary}"
            </div>
          )}

          {/* Experience Array */}
          {experience.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Professional Experience" />
              <div className="space-y-4 font-serif">
                {experience.map((item, idx) => (
                  <div key={idx} className="flex flex-col experience-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-white">
                      <span>{item.role || 'Job Role'}</span>
                      <span className="text-xs font-semibold text-slate-400 font-sans">
                        {item.startDate} {item.endDate ? `– ${item.endDate}` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-450 font-medium italic mt-0.5">
                      {item.company || 'Company Name'}
                    </span>
                    <p className="mt-1.5 text-xs text-slate-350 leading-relaxed font-sans whitespace-pre-line">
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
              <SectionHeader text="Academic Credentials" />
              <div className="space-y-3 font-serif">
                {education.map((item, idx) => (
                  <div key={idx} className="flex flex-col text-xs md:text-sm education-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.degree || 'Degree Title'}</span>
                      <span className="text-xs font-semibold text-slate-400 font-sans">{item.year}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-0.5 text-slate-450 italic font-sans">
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
              <div className="space-y-4 font-serif">
                {projects.map((item, idx) => (
                  <div key={idx} className="flex flex-col text-xs md:text-sm project-card" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.name || 'Project Name'}</span>
                      {item.techStack && (
                        <span className="text-xs font-semibold text-slate-450 font-sans">
                          {item.techStack}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-350 leading-relaxed font-sans">
                      {item.description}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-slate-500 font-sans font-bold uppercase tracking-wider">
                      {item.githubLink && (
                        <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Repo: {item.githubLink}
                        </a>
                      )}
                      {item.liveLink && (
                        <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
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
              <SectionHeader text="Areas of Expertise" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-[11px] font-semibold border rounded bg-slate-950/20 text-slate-300 border-slate-800"
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
              <SectionHeader text="Professional Certifications" />
              <div className="certifications-grid">
                {certifications.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col text-xs border border-slate-800 bg-slate-950/20 p-3 rounded certification-card font-serif"
                    style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                  >
                    <span className="font-bold text-white break-words">
                      {item.name || 'Credential'}
                    </span>
                    <span className="text-slate-500 font-semibold mt-0.5 break-words italic">
                      {item.issuer || 'Issuer'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold mt-1 font-sans">
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TECH TEMPLATE ──────────────────────────────────────── */}
      {template === 'TECH' && (
        <div className="space-y-4 text-slate-350">
          {/* Clean Compact Header */}
          <div className="flex flex-col gap-2 border-b border-slate-850 pb-3">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight whitespace-nowrap min-w-0">
                {personalInfo.name || 'Your Full Name'}
              </h1>
              <p className={`text-sm font-semibold tracking-wider font-mono shrink-0 ${currentStyle.accentText}`}>
                {`// ${title}`}
              </p>
            </div>
            {/* Compact Contact info inline with active anchors */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 font-mono">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="hover:underline flex items-center gap-1">
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="hover:underline flex items-center gap-1">
                  {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  in/linkedin
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  git/github
                </a>
              )}
              {personalInfo.portfolio && (
                <a
                  href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  web/portfolio
                </a>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {summary && (
            <div>
              <SectionHeader text="const overview = () => {" />
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed pl-0">
                {summary}
              </p>
            </div>
          )}

          {/* Skills Section (First, because tech is skills-first!) */}
          {skills.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Technical Stack" />
              <div className="flex flex-wrap gap-2 items-center mt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-mono border rounded bg-slate-900 border-slate-800 ${currentStyle.accentText}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Array */}
          {experience.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Work History" />
              <div className="space-y-3">
                {experience.map((item, idx) => (
                  <div key={idx} className="flex flex-col experience-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-white">
                      <span>{item.role || 'Job Role'}</span>
                      <span className="text-xs font-mono font-medium text-slate-500">
                        {item.startDate} {item.endDate ? `- ${item.endDate}` : ''}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-400 mt-0.5 font-mono">
                      {`@ ${item.company || 'Company'}`}
                    </div>
                    <p className="mt-1 text-xs text-slate-350 leading-relaxed whitespace-pre-line pl-0">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Array */}
          {projects.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Open Source & Projects" />
              <div className="space-y-3">
                {projects.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col project-card"
                    style={{
                      breakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      position: 'relative',
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 text-xs md:text-sm font-bold text-white w-full">
                      <span className="max-w-[75%] break-words">{item.name || 'Project Name'}</span>
                      {item.techStack && (
                        <span
                          className="text-[10px] font-mono border rounded px-1.5 py-0.5 bg-slate-950 text-slate-400 border-slate-850"
                          style={{
                            maxWidth: '80%',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                          }}
                        >
                          {item.techStack}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-350 leading-relaxed pl-0">
                      {item.description}
                    </p>
                    <div className="flex gap-3 mt-1.5 text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider pl-0">
                      {item.githubLink && (
                        <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          git: {item.githubLink}
                        </a>
                      )}
                      {item.liveLink && (
                        <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          url: {item.liveLink}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Array */}
          {education.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Education" />
              <div className="space-y-2">
                {education.map((item, idx) => (
                  <div key={idx} className="flex flex-col text-xs md:text-sm education-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.degree || 'Degree Title'}</span>
                      <span className="text-xs font-mono font-medium text-slate-500">{item.year}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-0.5 font-mono">
                      <span>{item.institution || 'Institution School'}</span>
                      {item.cgpa && <span>GPA: {item.cgpa}</span>}
                    </div>
                  </div>
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
                  <div key={idx} className="flex flex-col text-xs border border-slate-850 bg-slate-900/10 p-3 rounded-lg certification-card font-mono" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <span className="font-bold text-white break-words">{item.name || 'Credential'}</span>
                    <span className="text-slate-500 mt-0.5 break-words">{`// issuer: ${item.issuer}`}</span>
                    <span className={`text-[10px] mt-1 ${currentStyle.accentText}`}>{item.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CREATIVE TEMPLATE ──────────────────────────────────── */}
      {template === 'CREATIVE' && (
        <div className="space-y-6 text-slate-350">
          {/* Striking Left-Bordered Modern Header */}
          <div className={`relative pl-6 border-l-4 py-1 border-blue-500/50`} style={{ borderColor: isExport ? currentStyle.solidText : undefined }} className={isExport ? 'relative pl-6 border-l-4 py-1' : `relative pl-6 border-l-4 py-1 ${currentStyle.borderLine.replace('border-', 'border-')}`}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
              {personalInfo.name || 'Your Full Name'}
            </h1>
            <p className={`text-xs uppercase tracking-widest font-bold mt-1 ${currentStyle.accentText}`}>
              {title}
            </p>
            {/* Creative grid of contact details */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-400 font-semibold">
              {personalInfo.email && (
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                  {personalInfo.email}
                </a>
              )}
              {personalInfo.phone && (
                <a href={`tel:${personalInfo.phone}`} className="hover:underline">
                  {personalInfo.phone}
                </a>
              )}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && (
                <a
                  href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub
                </a>
              )}
              {personalInfo.portfolio && (
                <a
                  href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          {summary && (
            <div className="relative p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
              <p className="text-xs md:text-sm text-slate-350 leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          {/* Experience (Timeline Style) */}
          {experience.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Career Timeline" />
              <div className="relative border-l-2 border-slate-800 pl-5 ml-2 space-y-5">
                {experience.map((item, idx) => (
                  <div key={idx} className="relative experience-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    {/* Timeline dot */}
                    <div className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-slate-900 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: isExport ? currentStyle.solidText : undefined }} className={isExport ? '' : `bg-${activeColorTheme.toLowerCase()}-400 bg-blue-400`} />
                    </div>
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold text-white">
                      <span>{item.role || 'Job Role'}</span>
                      <span className={`text-xs font-semibold ${currentStyle.accentText}`}>
                        {item.startDate} {item.endDate ? `– ${item.endDate}` : ''}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-450 mt-0.5">
                      {item.company || 'Company Name'}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-350 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Array */}
          {projects.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Creative Projects" />
              <div className="space-y-4">
                {projects.map((item, idx) => (
                  <div key={idx} className="flex flex-col project-card p-4 rounded-xl border border-slate-850 bg-slate-900/10 hover:border-slate-800 transition-colors" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between font-bold text-white text-xs md:text-sm">
                      <span>{item.name || 'Project Name'}</span>
                      {item.techStack && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${currentStyle.accentBg}`}>
                          {item.techStack}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-350 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex gap-3 mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {item.githubLink && (
                        <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Source
                        </a>
                      )}
                      {item.liveLink && (
                        <a href={item.liveLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Array */}
          {education.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Education Background" />
              <div className="space-y-3">
                {education.map((item, idx) => (
                  <div key={idx} className="flex flex-col text-xs md:text-sm education-item" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{item.degree || 'Degree Title'}</span>
                      <span className="text-xs font-semibold text-slate-450">{item.year}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-450 mt-0.5 font-medium">
                      <span>{item.institution || 'Institution School'}</span>
                      {item.cgpa && <span>GPA: {item.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tags */}
          {skills.length > 0 && (
            <div className="resume-section">
              <SectionHeader text="Skills & Core Capabilities" />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 text-[11px] font-semibold border rounded-lg ${currentStyle.accentBg}`}
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
              <SectionHeader text="Certifications & Focus Areas" />
              <div className="certifications-grid">
                {certifications.map((item, idx) => (
                  <div key={idx} className="flex flex-col text-xs border border-slate-850 bg-slate-900/10 p-3 rounded-xl certification-card" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                    <span className="font-bold text-white break-words">{item.name || 'Credential'}</span>
                    <span className="text-slate-500 font-semibold mt-0.5 break-words">{item.issuer || 'Issuer'}</span>
                    <span className={`text-[10px] font-bold mt-1 ${currentStyle.accentText}`}>{item.year}</span>
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
