import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  SlidersHorizontal,
  AlertCircle,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../services/api';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';
import ResumeCard from '../components/ResumeCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import { sortResumes, duplicateResumePayload } from '../utils/resumeHelpers';

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Loading states for card specific actions
  const [actionStates, setActionStates] = useState({
    duplicatingId: null,
    deletingId: null,
  });

  // Fetch summaries on mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/resumes');
      if (response.data?.success) {
        setResumes(response.data.data || []);
      } else {
        setError(response.data?.message || 'Failed to retrieve resumes.');
      }
    } catch (err) {
      console.error('[fetchResumes]', err);
      setError(
        err.response?.data?.message || 'Server error while fetching resumes.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Edit Handler ──
  const handleEdit = (id) => {
    navigate(`/builder/${id}`);
  };

  // ── Deletion Handler ──
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      'Are you absolutely sure you want to delete this resume? All associated sections will be permanently removed.'
    );
    if (!isConfirmed) return;

    setActionStates((prev) => ({ ...prev, deletingId: id }));
    try {
      const response = await api.delete(`/resumes/${id}`);
      if (response.data?.success) {
        setResumes((prev) => prev.filter((res) => res.id !== id));
        toast.success('Resume deleted successfully.');
      } else {
        toast.error(response.data?.message || 'Failed to delete resume.');
      }
    } catch (err) {
      console.error('[handleDelete]', err);
      toast.error(
        err.response?.data?.message || 'An error occurred while deleting.'
      );
    } finally {
      setActionStates((prev) => ({ ...prev, deletingId: null }));
    }
  };

  // ── Duplication Handler ──
  const handleDuplicate = async (id) => {
    setActionStates((prev) => ({ ...prev, duplicatingId: id }));
    try {
      // 1. Fetch full nested tree details
      const response = await api.get(`/resumes/${id}`);
      if (!response.data?.success) {
        throw new Error(
          response.data?.message || 'Failed to fetch details for duplication.'
        );
      }

      // 2. Format complete clone payload using helpers
      const clonePayload = duplicateResumePayload(response.data.data);

      // 3. Dispatch POST creation query
      const postResponse = await api.post('/resumes', clonePayload);
      if (postResponse.data?.success) {
        // Fetch new list to keep metrics/counts clean and synchronized
        const listResponse = await api.get('/resumes');
        if (listResponse.data?.success) {
          setResumes(listResponse.data.data || []);
        }
        toast.success('Resume duplicated successfully! 📋');
      } else {
        toast.error(postResponse.data?.message || 'Failed to create copy.');
      }
    } catch (err) {
      console.error('[handleDuplicate]', err);
      toast.error(
        err.response?.data?.message || 'An error occurred while duplicating.'
      );
    } finally {
      setActionStates((prev) => ({ ...prev, duplicatingId: null }));
    }
  };

  // ── Filter & Sort Logic ──
  const filteredResumes = resumes.filter((resume) =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const sortedAndFilteredResumes = sortResumes(filteredResumes, sortBy);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -left-36 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Sticky Header */}
      <Navbar />

      <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Header Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-800/50 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              My{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Resumes
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-md">
              Create, duplicate, manage, or analyze your resume copies easily
              from a centralized control panel.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            onClick={() => navigate('/builder/new')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all duration-200"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            Create Resume
          </motion.button>
        </div>

        {/* Toolbar Panel (Search + Sort Dropdowns) */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-slate-900/30 border border-slate-850 p-4 rounded-2xl backdrop-blur-xl">
          {/* Search Bar Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search resumes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white bg-slate-950/60 border border-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>

          {/* Sort Dropdown Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t border-slate-800/40 md:border-none pt-3 md:pt-0">
            <SlidersHorizontal className="h-4 w-4 text-slate-500 shrink-0" />
            <div className="relative w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-48 appearance-none pl-4 pr-10 py-2.5 rounded-xl text-sm text-slate-300 bg-slate-950/60 border border-slate-800 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Title A-Z</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 border-l border-slate-850 pl-2">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <div>
          {loading ? (
            /* 1. Loading Skeleton State */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : error ? (
            /* 2. Error Display State */
            <div className="flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-rose-900/30 bg-rose-950/5 backdrop-blur-xl">
              <AlertCircle className="h-12 w-12 text-rose-400 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-white">Retrieval Failed</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-sm">{error}</p>
              <button
                onClick={fetchResumes}
                className="mt-6 px-4 py-2 text-sm font-semibold text-white bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Retry Request
              </button>
            </div>
          ) : sortedAndFilteredResumes.length === 0 ? (
            /* 3. Empty State Fallback */
            <EmptyState
              title={
                searchQuery ? 'No Matching Resumes' : 'Build Your First Resume'
              }
              description={
                searchQuery
                  ? "We couldn't find any resumes matching your search filters. Clear typing to display all copies."
                  : 'Establish a premium career profile! Build resumes from modern templates and unlock tailored AI review scores.'
              }
              icon={FileText}
              actionText={searchQuery ? 'Clear Search' : 'Build Now'}
              onActionClick={
                searchQuery
                  ? () => setSearchQuery('')
                  : () => navigate('/builder/new')
              }
            />
          ) : (
            /* 4. Complete Resumes Grid Display */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedAndFilteredResumes.map((resume) => (
                  <motion.div
                    key={resume.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ResumeCard
                      resume={resume}
                      onEdit={handleEdit}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                      isDuplicating={actionStates.duplicatingId === resume.id}
                      isDeleting={actionStates.deletingId === resume.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}
