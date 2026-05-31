import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, FileEdit, Eye, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    setValidationErrors(errors);
  }, [resume]);

  const isValid = useMemo(() => Object.keys(validationErrors).length === 0, [validationErrors]);

  // ── Autosave Hook mount ──
  const { saveStatus } = useAutosave({
    resumeData: resume,
    resumeId: isCreateMode ? null : id,
    isDirty,
    isValid,
    onSaveSuccess: useCallback((newId) => {
      // Transition from /builder/new to /builder/:id without page reload
      navigate(`/builder/${newId}`, { replace: true });
    }, [navigate]),
  });

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
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={resume.projects}
            onChange={(data) => handleUpdateSection('projects', data)}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={resume.skills}
            onChange={(data) => handleUpdateSection('skills', data)}
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
        <p className="text-sm font-semibold tracking-wide">Syncing workspace assets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -left-36 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <Navbar />

      {/* Save Status Banner */}
      <SaveStatus status={saveStatus} />

      <PageWrapper className="w-full flex flex-col h-[calc(100vh-4rem)]">
        {/* Sub Header / Control Navigation Bar */}
        <div className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 z-30 shrink-0">
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
                validationErrors.title ? 'border-rose-500/80 text-rose-300' : 'border-transparent'
              }`}
              placeholder="Untitled Resume"
            />
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
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full relative">
          
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 h-full w-full">
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
            <div className="flex-1 lg:hidden overflow-y-auto p-4 sm:p-6 h-full w-full">
              <ResumePreview data={resume} />
            </div>
          ) : null}

          {/* Desktop Preview (Sticky Right Panel) */}
          <div className="hidden lg:block w-[42%] xl:w-[45%] h-full p-8 overflow-y-auto border-l border-slate-800 bg-slate-950/40 shrink-0">
            <ResumePreview data={resume} />
          </div>

        </div>
      </PageWrapper>
    </div>
  );
}
