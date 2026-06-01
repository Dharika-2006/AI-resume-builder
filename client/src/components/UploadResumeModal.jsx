import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileCode,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadService } from '../services/uploadService';

/**
 * UploadResumeModal
 * - Stunning premium glassmorphism drag & drop modal
 * - Displays active states: Uploading... -> Parsing... -> Import Complete
 * - Blocks controls and navigation during ingestion to ensure sync integrity
 */
export default function UploadResumeModal({ isOpen, onClose, onImport }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'parsing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const validateFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      return 'Unsupported file format. Only PDF and DOCX documents are allowed.';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File exceeds the 10MB limit.';
    }
    return null;
  };

  const handleFile = async (file) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      setErrorMessage(error);
      setUploadState('error');
      return;
    }

    setFileName(file.name);
    setUploadState('uploading');
    setErrorMessage('');

    try {
      // Step 1: Uploading (simulated short delay or active stream progress)
      await new Promise((r) => setTimeout(r, 600));
      setUploadState('parsing');

      // Step 2: Parsing (calling API)
      const res = await uploadService.uploadResume(file);

      if (res.success) {
        setUploadState('success');
        toast.success('Resume parsed successfully!');
        // Step 3: Trigger the merge callback in the parent component
        onImport(res.data.parsedData);
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        throw new Error(res.message || 'Failed to parse resume');
      }
    } catch (err) {
      console.error('[UploadResumeModal Error]', err);
      const msg =
        err.response?.data?.message || err.message || 'Failed to parse resume';
      setErrorMessage(msg);
      setUploadState('error');
      toast.error(msg);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState === 'uploading' || uploadState === 'parsing') return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (uploadState === 'uploading' || uploadState === 'parsing') return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (uploadState === 'uploading' || uploadState === 'parsing') return;
    fileInputRef.current.click();
  };

  const handleClose = () => {
    if (uploadState === 'uploading' || uploadState === 'parsing') return;
    setUploadState('idle');
    setFileName('');
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl z-10 backdrop-blur-xl bg-gradient-to-b from-slate-950 to-slate-900"
        >
          {/* Ambient lighting orb inside modal */}
          <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={uploadState === 'uploading' || uploadState === 'parsing'}
            className="absolute top-4 right-4 p-1.5 rounded-xl border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-bold tracking-tight text-white">
              Import Your Resume
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload your existing resume to populate fields automatically in
              real-time.
            </p>
          </div>

          {/* Drag & Drop Container */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 min-h-[220px] transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                : 'border-slate-800 bg-slate-950/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleChange}
              className="hidden"
            />

            {/* Display based on current uploadState */}
            {uploadState === 'idle' && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 transition-transform group-hover:scale-105">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Drag & Drop Resume Here
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Supports PDF or DOCX (Max 10MB)
                </p>
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/20 rounded-xl transition-all shadow-md shadow-blue-500/15"
                >
                  Choose File
                </button>
              </div>
            )}

            {(uploadState === 'uploading' || uploadState === 'parsing') && (
              <div className="flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p className="text-sm font-bold text-slate-200 uppercase tracking-widest leading-none">
                  {uploadState === 'uploading' ? 'Uploading...' : 'Parsing...'}
                </p>
                <p className="text-xs text-slate-500 mt-2 truncate max-w-[280px]">
                  Analyzing {fileName}
                </p>
              </div>
            )}

            {uploadState === 'success' && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-4 animate-bounce">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Import Complete!
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Integrating fields into editor...
                </p>
              </div>
            )}

            {uploadState === 'error' && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-4">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Failed to parse resume
                </p>
                <p className="text-xs text-rose-400/80 mt-1 max-w-[260px]">
                  {errorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setUploadState('idle')}
                  className="px-4 py-2 mt-4 text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Guidelines Footer */}
          <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-900 pt-4 text-slate-600 text-[10px]">
            <FileCode className="h-3 w-3" />
            <span>Deterministic Regex Parsing System Active</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
