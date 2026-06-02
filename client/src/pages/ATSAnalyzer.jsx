import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  FileText,
  CheckCircle2,
  AlertCircle,
  Award,
  User,
  Briefcase,
  Code,
  GraduationCap,
  ChevronRight,
  Loader2,
  History,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronUp,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { atsService } from '../services/atsService';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';

export default function ATSAnalyzer() {
  const [resumes, setResumes] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Loading states
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Results display state
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  useEffect(() => {
    fetchResumes();
    fetchHistory();
  }, []);

  const fetchResumes = async () => {
    setLoadingResumes(true);
    try {
      const response = await api.get('/resumes');
      if (response.data?.success) {
        const list = response.data.data || [];
        setResumes(list);
        if (list.length > 0) {
          setSelectedResumeId(list[0].id);
        }
      }
    } catch (error) {
      console.error('[fetchResumes]', error);
      toast.error('Failed to load resumes.');
    } finally {
      setLoadingResumes(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await atsService.getHistory();
      if (result.success) {
        setHistory(result.data || []);
      }
    } catch (error) {
      console.error('[fetchHistory]', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error('Please select or create a resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description.');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await atsService.analyzeResume(selectedResumeId, jobDescription);
      if (result.success && result.data) {
        setActiveAnalysis(result.data);
        toast.success('ATS Analysis completed! Check your score 🚀');
        fetchHistory();
      } else {
        toast.error(result.message || 'Analysis failed.');
      }
    } catch (error) {
      console.error('[handleAnalyze]', error);
      const message = error.response?.data?.message || 'Error occurred during scan.';
      toast.error(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreTheme = (score) => {
    if (score >= 90) {
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        stroke: 'stroke-emerald-500',
        fill: 'fill-emerald-500/10',
        glow: 'shadow-emerald-500/20',
        label: 'Excellent'
      };
    } else if (score >= 75) {
      return {
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        stroke: 'stroke-blue-500',
        fill: 'fill-blue-500/10',
        glow: 'shadow-blue-500/20',
        label: 'Good'
      };
    } else if (score >= 60) {
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        stroke: 'stroke-amber-500',
        fill: 'fill-amber-500/10',
        glow: 'shadow-amber-500/20',
        label: 'Fair'
      };
    } else {
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        stroke: 'stroke-rose-500',
        fill: 'fill-rose-500/10',
        glow: 'shadow-rose-500/20',
        label: 'Needs Improvement'
      };
    }
  };

  const activeTheme = activeAnalysis ? getScoreTheme(activeAnalysis.score) : null;

  // SVG parameters for circular meter
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = activeAnalysis 
    ? circumference - (activeAnalysis.score / 100) * circumference
    : circumference;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -left-36 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[90px] pointer-events-none" />

      {/* Header Navbar */}
      <Navbar />

      <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Title Heading */}
        <div className="border-b border-slate-800/50 pb-8 mb-8">
          <div className="flex items-center gap-3 text-blue-400 font-medium text-sm tracking-wider uppercase">
            <Cpu className="h-5 w-5" />
            <span>AI Ready Rules-Engine</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl tracking-tight text-white leading-none">
            Smart{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              ATS Analyzer
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Audit your resume keyword match rate, profile metadata structure, and sector alignment using our rules-based ATS analysis system. Compare against any job specification instantly.
          </p>
        </div>

        {/* Main Columns Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & History (5/12 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Form Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-blue-400" />
                Configure ATS Scan
              </h2>

              {loadingResumes ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="text-sm text-slate-400">Loading your resumes...</span>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-white">No Resumes Found</h3>
                  <p className="text-xs text-slate-500 mt-2 mb-4 max-w-xs mx-auto leading-relaxed">
                    No resumes available. Create your first resume to run ATS analysis.
                  </p>
                  <a
                    href="/builder/new"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    Build Resume Now
                  </a>
                </div>
              ) : (
                <form onSubmit={handleAnalyze} className="space-y-5">
                  {/* Resume Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Select Target Resume
                    </label>
                    <div className="relative">
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer font-medium"
                      >
                        {resumes.map((res) => (
                          <option key={res.id} value={res.id}>
                            {res.title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 border-l border-slate-850 pl-2">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Job Description Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Job Description Text
                      </label>
                      <span className="text-xs text-slate-500">
                        {jobDescription.length} characters
                      </span>
                    </div>
                    <textarea
                      placeholder="Paste the target job description requirements, technical qualifications, and expectations here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={8}
                      className="w-full p-4 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: analyzing ? 1 : 1.02 }}
                    whileTap={{ scale: analyzing ? 1 : 0.98 }}
                    disabled={analyzing}
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 transition-all"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        Running ATS Scan...
                      </>
                    ) : (
                      <>
                        <Cpu className="h-4 w-4" />
                        Analyze Match Score
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>

            {/* Scan History Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl relative">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-indigo-400" />
                Scan History
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Review scores and reports from your previous scans.
              </p>

              <div className="max-h-72 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs leading-relaxed">
                    No previous analyses found.<br />Run your first ATS scan.
                  </div>
                ) : (
                  history.map((item) => {
                    const theme = getScoreTheme(item.score);
                    const isActive = activeAnalysis?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveAnalysis(item)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                          isActive 
                            ? 'bg-slate-900 border-blue-500/60 shadow-lg' 
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/20'
                        }`}
                      >
                        <div className="truncate">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.resumeTitle}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className={`text-xs font-bold px-2 py-1 rounded-lg ${theme.bg} ${theme.text}`}>
                            {item.score}%
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-600" />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Dashboard Results (7/12 cols) */}
          <div className="lg:col-span-7">
            
            <AnimatePresence mode="wait">
              {analyzing ? (
                /* Scanning Skeleton Screen */
                <motion.div
                  key="analyzing-skeleton"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl h-full flex flex-col items-center justify-center text-center py-20 min-h-[500px]"
                >
                  <div className="relative mb-6">
                    <div className="h-20 w-20 rounded-full border border-blue-500/10 border-t-blue-500 animate-spin flex items-center justify-center" />
                    <Cpu className="h-8 w-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Running Domain-Agnostic Scan</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm">
                    Our rule-based engine is tokenizing content, filtering stop-words, extracting keywords, and assessing profile structures...
                  </p>
                </motion.div>

              ) : activeAnalysis ? (
                /* Full Results Dashboard */
                <motion.div
                  key="results-dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  
                  {/* Score & Breakdown Summary Card */}
                  <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Radial Meter & Summary Stats */}
                      <div className="relative flex-shrink-0 flex flex-col items-center">
                        <div className="relative">
                          <svg className="w-36 h-36 transform -rotate-90">
                            {/* Background Track */}
                            <circle
                              cx="72"
                              cy="72"
                              r={radius}
                              className="stroke-slate-800/60"
                              strokeWidth="10"
                              fill="transparent"
                            />
                            {/* Foreground progress */}
                            <motion.circle
                              cx="72"
                              cy="72"
                              r={radius}
                              className={`${activeTheme.stroke} stroke-linecap-round`}
                              strokeWidth="10"
                              fill="transparent"
                              strokeDasharray={circumference}
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </svg>
                          {/* Score Text inside SVG */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white leading-none">
                              {activeAnalysis.score}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase mt-1 tracking-wider">
                              ATS Score
                            </span>
                          </div>
                        </div>

                        {/* Quick Summary Section (Score Summary Card) */}
                        <div className="w-full mt-4 bg-slate-950/60 border border-slate-800/60 rounded-2xl p-3.5 text-center space-y-1 shadow-inner">
                          <p className="text-xs text-slate-400">
                            Keyword Match: <strong className="text-white">{activeAnalysis.keywordMatchPercent}%</strong>
                          </p>
                          <p className="text-xs text-slate-400">
                            Matched Keywords: <strong className="text-emerald-400 font-bold">{activeAnalysis.matchedKeywords?.length || 0}</strong>
                          </p>
                          <p className="text-xs text-slate-400">
                            Missing Keywords: <strong className="text-rose-400 font-bold">{activeAnalysis.missingKeywords?.length || 0}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Summary Data */}
                      <div className="flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                              Scan Outcome
                            </span>
                            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                              <h3 className={`text-2xl font-black ${activeTheme.text}`}>
                                {activeAnalysis.scoreLabel || activeTheme.label}
                              </h3>
                              <span className="text-slate-600">|</span>
                              <span className="text-sm font-semibold text-slate-300">
                                {activeAnalysis.keywordMatchPercent}% Match
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-500 md:text-right">
                            <p>Analyzed Resume: <strong className="text-slate-300">{activeAnalysis.resumeTitle}</strong></p>
                            <p className="mt-0.5">Date: {new Date(activeAnalysis.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}</p>
                          </div>
                        </div>

                        {/* Point breakdown bar tags */}
                        {activeAnalysis.breakdown && (
                          <div className="mt-6 pt-4 border-t border-slate-800/40 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                            <div>
                              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                                <span>Keywords</span>
                                <span>{activeAnalysis.breakdown.keywordCoverage}/50</span>
                              </div>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(activeAnalysis.breakdown.keywordCoverage / 50) * 100}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                                <span>Profile Details</span>
                                <span>{activeAnalysis.breakdown.profileCompleteness}/10</span>
                              </div>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(activeAnalysis.breakdown.profileCompleteness / 10) * 100}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                                <span>Education</span>
                                <span>{activeAnalysis.breakdown.education}/10</span>
                              </div>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(activeAnalysis.breakdown.education / 10) * 100}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                                <span>Experience</span>
                                <span>{activeAnalysis.breakdown.experience}/15</span>
                              </div>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(activeAnalysis.breakdown.experience / 15) * 100}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                                <span>Projects</span>
                                <span>{activeAnalysis.breakdown.projects}/10</span>
                              </div>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(activeAnalysis.breakdown.projects / 10) * 100}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                                <span>Certifications</span>
                                <span>{activeAnalysis.breakdown.certifications}/5</span>
                              </div>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(activeAnalysis.breakdown.certifications / 5) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Keyword analysis panels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Matched Keywords */}
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-xl flex flex-col">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                        Matched Keywords ({activeAnalysis.matchedKeywords?.length || 0})
                      </h3>
                      {activeAnalysis.matchedKeywords?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-48 pr-1">
                          {activeAnalysis.matchedKeywords.map((kw, i) => (
                            <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-900/50">
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 py-6 my-auto text-center font-medium">
                          No keywords matched yet. Incorporate target skills in your sections.
                        </p>
                      )}
                    </div>

                    {/* Missing Keywords */}
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-xl flex flex-col">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3.5">
                        <XCircle className="h-4.5 w-4.5 text-rose-400" />
                        Missing Keywords ({activeAnalysis.missingKeywords?.length || 0})
                      </h3>
                      {activeAnalysis.missingKeywords?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-48 pr-1">
                          {activeAnalysis.missingKeywords.map((kw, i) => (
                            <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/50">
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-400 font-semibold py-6 my-auto text-center">
                          Zero missing keywords! Fantastic coverage.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Strengths & Suggestions sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths Panel */}
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-xl">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                        <ShieldCheck className="h-4.5 w-4.5 text-blue-400" />
                        Detected Strengths
                      </h3>
                      <ul className="space-y-3">
                        {activeAnalysis.strengths?.map((str, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                            <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions Panel */}
                    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-xl">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-4.5 w-4.5 text-amber-400" />
                        Actionable Improvements
                      </h3>
                      <ul className="space-y-3">
                        {activeAnalysis.suggestions?.map((sug, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                            <ChevronUp className="h-4 w-4 rotate-90 text-amber-500 shrink-0 mt-0.5" />
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </motion.div>
              ) : (
                /* Dashboard Idle / Empty State */
                <motion.div
                  key="results-empty"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="rounded-3xl border border-slate-800/80 bg-slate-900/20 p-8 backdrop-blur-xl text-center py-20 min-h-[500px] flex flex-col items-center justify-center"
                >
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-6 shadow-inner">
                    <Cpu className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No Analysis Active</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    Select a resume from the list and paste a target job description on the left panel to execute a high-fidelity scan report.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      Domain Agnostic
                    </div>
                    <span className="hidden sm:inline text-slate-700">•</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      Instant Scoring
                    </div>
                    <span className="hidden sm:inline text-slate-700">•</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      AI-Ready Architecture
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </PageWrapper>
    </div>
  );
}
