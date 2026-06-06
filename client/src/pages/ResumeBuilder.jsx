import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  FileEdit,
  Eye,
  UploadCloud,
  AlertTriangle,
  Download,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import UploadResumeModal from '../components/UploadResumeModal';
import html2pdf from 'html2pdf.js';
import ResumePdfTemplate from '../components/builder/ResumePdfTemplate';

import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';
import { emptyResume } from '../utils/emptyResume';
import { resumeService } from '../services/resumeService';
import useAutosave from '../hooks/useAutosave';

// ── Form Components ─────────────────────────────────────────
import BuilderSidebar from '../components/builder/BuilderSidebar';
import SaveStatus from '../components/builder/SaveStatus';
import PersonalInfoForm from '../components/builder/PersonalInfoForm';
import SummaryForm from '../components/builder/SummaryForm';
import EducationForm from '../components/builder/EducationForm';
import ExperienceForm from '../components/builder/ExperienceForm';
import ProjectsForm from '../components/builder/ProjectsForm';
import SkillsForm from '../components/builder/SkillsForm';
import CertificationsForm from '../components/builder/CertificationsForm';
import TemplateSelector from '../components/builder/TemplateSelector';
import ResumePreview from '../components/builder/ResumePreview';
import VersionHistoryModal from '../components/builder/VersionHistoryModal';
import { versionService } from '../services/versionService';

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreateMode = !id || id === 'new';

  // ── Core States ──
  const [resume, setResume] = useState(emptyResume);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [validationErrors, setValidationErrors] = useState({});

  // Mobile layout state: 'edit' or 'preview'
  const [mobileTab, setMobileTab] = useState('edit');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const tempParsedData = useRef(null);

  // Refs for tracking changes
  const isDirty = useRef(false);
  const isInitialLoad = useRef(true);

  // ── Fetch Existing Resume on Mount (Edit Mode) ──
  useEffect(() => {
    if (id && id !== 'new') {
      fetchResumeDetails(id);
    } else {
      // Create Mode — Reset to clean defaults
      setResume(emptyResume);
      isDirty.current = false;
      isInitialLoad.current = false;
      setLoading(false);
    }
  }, [id]);

  const fetchResumeDetails = async (resumeId) => {
    setLoading(true);
    isInitialLoad.current = true;
    try {
      const response = await resumeService.getResumeById(resumeId);
      if (response.data?.success) {
        const fetched = response.data.data;
        // Map empty fields safely to prevent crash
        setResume({
          ...emptyResume,
          ...fetched,
          personalInfo: {
            ...emptyResume.personalInfo,
            ...(fetched.personalInfo || {}),
          },
          education: fetched.education || [],
          experience: fetched.experience || [],
          projects: fetched.projects || [],
          skills: fetched.skills || [],
          certifications: fetched.certifications || [],
        });
      } else {
        toast.error('Failed to load resume details.');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('[fetchResumeDetails]', err);
      toast.error('Error fetching resume.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
      // Wait for React to apply state updates before resetting dirty locks
      setTimeout(() => {
        isDirty.current = false;
        isInitialLoad.current = false;
      }, 50);
    }
  };

  // ── Strict Real-time Validation Check ──
  useEffect(() => {
    if (isInitialLoad.current) return;

    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check title
    if (!resume.title || !resume.title.trim()) {
      errors.title = 'Resume document title is required.';
    }

    // Check personalInfo
    if (!resume.personalInfo?.name || !resume.personalInfo.name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!resume.personalInfo?.email || !resume.personalInfo.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(resume.personalInfo.email)) {
      errors.email =
        'Please enter a valid email address (e.g. name@domain.com).';
    }

    setValidationErrors(errors);
  }, [resume]);

  const isValid = useMemo(
    () => Object.keys(validationErrors).length === 0,
    [validationErrors]
  );

  // ── Autosave Hook mount ──
  const { saveStatus } = useAutosave({
    resumeData: resume,
    resumeId: isCreateMode ? null : id,
    isDirty,
    isValid,
    onSaveSuccess: useCallback(
      (newId) => {
        // Transition from /builder/new to /builder/:id without page reload
        navigate(`/builder/${newId}`, { replace: true });
      },
      [navigate]
    ),
  });

  const handleImportResume = (parsedData) => {
    // Check if there is existing data in current resume state
    const hasExistingData =
      (resume.personalInfo?.name && resume.personalInfo.name.trim()) ||
      (resume.personalInfo?.email && resume.personalInfo.email.trim()) ||
      resume.education?.length > 0 ||
      resume.experience?.length > 0 ||
      resume.projects?.length > 0 ||
      resume.skills?.length > 0 ||
      resume.certifications?.length > 0;

    if (hasExistingData) {
      tempParsedData.current = parsedData;
      setIsConfirmOpen(true);
    } else {
      applyImportedData(parsedData);
    }
  };

  const applyImportedData = (parsedData) => {
    isDirty.current = true;

    // Map skills array correctly: if backend returns strings ["React"], map to [{ name: "React" }]
    const mappedSkills = (parsedData.skills || []).map((s) =>
      typeof s === 'string' ? { name: s } : s
    );

    setResume((prev) => ({
      ...prev,
      title: parsedData.title || prev.title || 'Untitled Resume',
      personalInfo: {
        ...prev.personalInfo,
        ...(parsedData.personalInfo || {}),
        summary: parsedData.summary || prev.personalInfo.summary || '',
      },
      summary: parsedData.summary || prev.summary || '',
      education: (parsedData.education || []).map((edu) => ({
        degree: edu.degree || 'Degree',
        institution: edu.institution || 'University / School',
        year: edu.year || '',
        cgpa: edu.cgpa || '',
      })),
      experience: (parsedData.experience || []).map((exp) => ({
        role: exp.role || 'Role',
        company: exp.company || 'Company Name',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
      })),
      projects: (parsedData.projects || []).map((proj) => ({
        name: proj.name || 'Project Name',
        description: proj.description || '',
        techStack: proj.techStack || '',
        githubLink: proj.githubLink || '',
        liveLink: proj.liveLink || '',
      })),
      skills: mappedSkills,
      certifications: (parsedData.certifications || []).map((cert) => ({
        name: cert.name || 'Certification',
        issuer: cert.issuer || 'Credential Provider',
        year: cert.year || '',
      })),
    }));

    toast.success('Resume imported successfully');
  };

  const handleConfirmReplace = () => {
    if (tempParsedData.current) {
      applyImportedData(tempParsedData.current);
      tempParsedData.current = null;
    }
    setIsConfirmOpen(false);
  };

  const handleCancelReplace = () => {
    tempParsedData.current = null;
    setIsConfirmOpen(false);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-pdf-template-root');
    if (!element) {
      toast.error('Resume export target not found.');
      return;
    }

    const userName = (resume.personalInfo?.name || '').trim();
    const cleanName = userName
      ? userName.replace(/[^a-zA-Z0-9]/g, '_')
      : 'Resume';

    const templateName = resume.template
      ? resume.template.charAt(0).toUpperCase() + resume.template.slice(1).toLowerCase()
      : 'Modern';

    const hasResumeWord = cleanName.toLowerCase().includes('resume');
    const filename = hasResumeWord
      ? `${cleanName}_${templateName}.pdf`
      : `${cleanName}_Resume_${templateName}.pdf`;

    const opt = {
      margin: [0.4, 0.4, 0.4, 0.4], // Symmetrical 0.4 inch margins on all sides
      filename: filename,
      image: {
        type: 'jpeg',
        quality: 1,
      },
      pagebreak: { mode: ['css', 'legacy'] }, // Enforce exact dynamic breaking rules strictly based on CSS
      html2canvas: {
        scale: 3, // 3x high-definition rendering to prevent text blur
        useCORS: true,
        backgroundColor: '#020617',
      },
      jsPDF: {
        unit: 'in',
        format: 'letter', // Standard Letter size multi-page document layout
        orientation: 'portrait',
      },
    };

    const loadingToast = toast.loading(
      'Generating premium high-fidelity PDF...'
    );

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success('Premium PDF downloaded successfully!');
      })
      .catch((err) => {
        console.error('[PDF Generation Error]', err);
        toast.dismiss(loadingToast);
        toast.error('Could not download PDF. Please try again.');
      });
  };

  // ── State Mutators ──
  const handleUpdateField = useCallback((field, value) => {
    isDirty.current = true;
    setResume((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleUpdatePersonalInfo = useCallback((field, value) => {
    isDirty.current = true;
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  }, []);

  const handleUpdateSection = useCallback((section, data) => {
    isDirty.current = true;
    setResume((prev) => ({ ...prev, [section]: data }));
  }, []);

  const handleAcceptAiDraft = useCallback(async (updatedResumeData, reason) => {
    setResume(updatedResumeData);
    isDirty.current = false;
    try {
      const response = await resumeService.updateResume(id, updatedResumeData);
      if (response.data?.success) {
        await versionService.createSnapshot(id, {
          reason,
          createdByAI: true,
        });
        toast.success(`${reason} saved as a version snapshot! 💾`);
      }
    } catch (err) {
      console.error('[handleAcceptAiDraft]', err);
      toast.error('Failed to save version snapshot.');
    }
  }, [id]);

  // ── Renders active form based on activeSection selection ──
  const renderActiveForm = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <PersonalInfoForm
            data={resume.personalInfo}
            onChange={handleUpdatePersonalInfo}
            errors={validationErrors}
          />
        );
      case 'summary':
        return (
          <SummaryForm
            value={resume.summary}
            onChange={(val) => handleUpdateField('summary', val)}
            onAcceptDraft={(draftText) => {
              const updated = {
                ...resume,
                summary: draftText,
                personalInfo: {
                  ...resume.personalInfo,
                  summary: draftText,
                }
              };
              handleAcceptAiDraft(updated, 'AI Summary Accepted');
            }}
            resumeId={id}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resume.education}
            onChange={(data) => handleUpdateSection('education', data)}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            data={resume.experience}
            onChange={(data) => handleUpdateSection('experience', data)}
            onAcceptDraft={(index, newText) => {
              const list = [...resume.experience];
              list[index] = { ...list[index], description: newText };
              const updated = { ...resume, experience: list };
              handleAcceptAiDraft(updated, 'AI Experience Accepted');
            }}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={resume.projects}
            onChange={(data) => handleUpdateSection('projects', data)}
            onAcceptDraft={(index, newText) => {
              const list = [...resume.projects];
              list[index] = { ...list[index], description: newText };
              const updated = { ...resume, projects: list };
              handleAcceptAiDraft(updated, 'AI Project Accepted');
            }}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={resume.skills}
            onChange={(data) => handleUpdateSection('skills', data)}
            onAcceptDraft={(updatedSkills, skillName) => {
              const updated = { ...resume, skills: updatedSkills };
              handleAcceptAiDraft(updated, `AI Skill Accepted: ${skillName}`);
            }}
            resumeId={id}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            data={resume.certifications}
            onChange={(data) => handleUpdateSection('certifications', data)}
          />
        );
      case 'template':
        return (
          <TemplateSelector
            value={resume.template}
            onChange={(val) => handleUpdateField('template', val)}
            colorTheme={resume.colorTheme}
            onChangeColorTheme={(val) => handleUpdateField('colorTheme', val)}
          />
        );
      default:
        return null;
    }
  };

  if (loading && isInitialLoad.current) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
        <p className="text-sm font-semibold tracking-wide">
          Syncing workspace assets...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -left-36 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none no-print" />
      <div className="absolute bottom-1/4 -right-36 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none no-print" />

      <div className="no-print">
        <Navbar />
      </div>

      {/* Save Status Banner */}
      <div className="no-print">
        <SaveStatus status={saveStatus} />
      </div>

      <PageWrapper className="w-full flex flex-col h-[calc(100vh-4rem)] print-parent-wrapper">
        {/* Sub Header / Control Navigation Bar */}
        <div className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-30 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <Link
              to="/resumes"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            {/* Direct Document Title Edit */}
            <input
              type="text"
              value={resume.title || ''}
              onChange={(e) => handleUpdateField('title', e.target.value)}
              className={`text-sm font-extrabold text-white bg-transparent border-b px-1 py-0.5 focus:outline-none focus:border-blue-500 transition-all ${
                validationErrors.title
                  ? 'border-rose-500/80 text-rose-300'
                  : 'border-transparent'
              }`}
              placeholder="Untitled Resume"
            />

            {/* Upload Resume trigger */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-all shadow-inner"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload Resume</span>
            </button>

            {/* Download PDF trigger */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all shadow-inner hover:scale-[1.02] active:scale-95 duration-150"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>

            {/* Version History trigger */}
            {id && id !== 'new' && (
              <button
                onClick={() => setIsHistoryModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 transition-all shadow-inner hover:scale-[1.02] active:scale-95 duration-150"
              >
                <History className="h-3.5 w-3.5" />
                <span>Version History</span>
              </button>
            )}

          </div>

          {/* Mobile view top tab toggler */}
          <div className="flex lg:hidden items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setMobileTab('edit')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                mobileTab === 'edit'
                  ? 'bg-slate-800 text-blue-400 border border-slate-700/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileEdit className="h-3.5 w-3.5" />
              Editor
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                mobileTab === 'preview'
                  ? 'bg-slate-800 text-blue-400 border border-slate-700/60'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
          </div>

          <div className="hidden lg:block">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
              Auto-Saving Ecosystem Enabled
            </p>
          </div>
        </div>

        {/* Master Workspace Split Panel Grid */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full relative print-parent-wrapper">
          {/* Section 1: Sidebar Jump tab controls */}
          {/* For mobile view: Sidebar renders as horizontal jump bar at top of editor */}
          {(mobileTab === 'edit' || window.innerWidth >= 1024) && (
            <BuilderSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          )}

          {/* Section 2: Form Editor Center Scroll pane */}
          {mobileTab === 'edit' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 h-full w-full no-print">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {renderActiveForm()}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : null}

          {/* Section 3: Live Preview Pane */}
          {/* Desktop: renders as sticky half screen panel, mobile: renders full screen when selected */}
          {mobileTab === 'preview' ? (
            <div className="flex-1 lg:hidden overflow-y-auto p-4 sm:p-6 h-full w-full print-preview-container">
              <ResumePreview data={resume} />
            </div>
          ) : null}

          {/* Desktop Preview (Sticky Right Panel) */}
          <div className="hidden lg:block w-[42%] xl:w-[45%] h-full p-8 overflow-y-auto border-l border-slate-800 bg-slate-950/40 shrink-0 print-preview-container">
            <ResumePreview data={resume} />
          </div>
        </div>
      </PageWrapper>
      {/* Upload Resume Modal */}
      <UploadResumeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImport={handleImportResume}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        resumeId={id}
        resumeData={resume}
        onRestoreSuccess={(restoredResume) => {
          setResume(restoredResume);
          isDirty.current = false;
        }}
      />

      {/* Confirmation Dialog Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelReplace}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl z-10 backdrop-blur-xl bg-gradient-to-b from-slate-950 to-slate-900 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto mb-4 animate-pulse">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Replace existing resume data?
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                This will completely overwrite all existing fields inside the
                editor. This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6 justify-center">
                <button
                  onClick={handleCancelReplace}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReplace}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 border border-blue-500/20 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/15"
                >
                  Replace
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden high-contrast export container (fully rendered off-screen for html2canvas color preservation) */}
      <div
        id="resume-export-target"
        className="absolute no-print"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '794px', // Standard print canvas width matching perfect A4 aspect ratios
          background: '#020617',
        }}
      >
        <ResumePdfTemplate data={resume} />
      </div>
    </div>
  );
}
