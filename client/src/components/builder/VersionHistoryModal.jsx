import { useState, useEffect } from 'react';
import { X, History, Sparkles, User, RefreshCw, Layers, ArrowLeftRight, Play } from 'lucide-react';
import { versionService } from '../../services/versionService';
import ResumeCompareView from './ResumeCompareView';
import toast from 'react-hot-toast';

export default function VersionHistoryModal({ isOpen, onClose, resumeId, resumeData, onRestoreSuccess }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [creating, setCreating] = useState(false);

  // Comparison states
  const [showCompare, setShowCompare] = useState(false);
  const [leftCompareId, setLeftCompareId] = useState('');
  const [rightCompareId, setRightCompareId] = useState('current');
  const [leftCompareData, setLeftCompareData] = useState(null);
  const [rightCompareData, setRightCompareData] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    if (isOpen && resumeId && resumeId !== 'new') {
      fetchHistory();
    }
  }, [isOpen, resumeId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await versionService.getVersionHistory(resumeId);
      if (response.data?.success) {
        setHistory(response.data.data || []);
      }
    } catch (err) {
      console.error('[fetchHistory]', err);
      toast.error('Failed to load version history.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async (e) => {
    e.preventDefault();
    const finalReason = reason.trim() || 'Manual Snapshot';
    setCreating(true);
    try {
      const response = await versionService.createSnapshot(resumeId, {
        reason: finalReason,
        createdByAI: false,
      });
      if (response.data?.success) {
        toast.success('Resume version snapshot created successfully! 💾');
        setReason('');
        fetchHistory();
      }
    } catch (err) {
      console.error('[handleCreateSnapshot]', err);
      toast.error('Failed to create manual snapshot.');
    } finally {
      setCreating(false);
    }
  };

  const handleRestore = async (version) => {
    if (!window.confirm(`Are you sure you want to restore to Version ${version.versionNumber}? All current edits will be overwritten.`)) {
      return;
    }

    const loadToast = toast.loading(`Restoring Version ${version.versionNumber}...`);
    try {
      const response = await versionService.restoreVersion(resumeId, version.id);
      if (response.data?.success) {
        toast.dismiss(loadToast);
        toast.success(`Restored to Version ${version.versionNumber}! 🎉`);
        if (onRestoreSuccess) {
          onRestoreSuccess(response.data.data);
        }
        onClose();
      }
    } catch (err) {
      console.error('[handleRestore]', err);
      toast.dismiss(loadToast);
      toast.error('Failed to restore version snapshot.');
    }
  };

  const startComparison = async (leftId, rightId) => {
    if (!leftId || !rightId) {
      toast.error('Please select both versions to compare.');
      return;
    }
    setCompareLoading(true);
    try {
      const response = await versionService.compareVersions(resumeId, leftId, rightId);
      if (response.data?.success) {
        setLeftCompareData(response.data.data.left);
        setRightCompareData(response.data.data.right);
        setShowCompare(true);
      }
    } catch (err) {
      console.error('[startComparison]', err);
      toast.error('Failed to load comparison snapshots.');
    } finally {
      setCompareLoading(false);
    }
  };

  if (!isOpen) return null;

  // Render comparison view if active
  if (showCompare) {
    const leftLabel = leftCompareId === 'current'
      ? 'Current Live Resume'
      : `Version ${history.find(v => v.id === leftCompareId)?.versionNumber || ''}`;
    const rightLabel = rightCompareId === 'current'
      ? 'Current Live Resume'
      : `Version ${history.find(v => v.id === rightCompareId)?.versionNumber || ''}`;

    return (
      <ResumeCompareView
        leftData={leftCompareData}
        rightData={rightCompareData}
        leftLabel={leftLabel}
        rightLabel={rightLabel}
        onClose={() => {
          setShowCompare(false);
          setLeftCompareData(null);
          setRightCompareData(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />

      {/* Main dialog */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl z-10 backdrop-blur-xl bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Version History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Create Manual Snapshot Form */}
        <form onSubmit={handleCreateSnapshot} className="flex gap-2 mt-4 pb-4 border-b border-slate-900 shrink-0">
          <input
            type="text"
            placeholder="Type version reason (e.g. Milestone 1, Polished summary...)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl text-xs text-white bg-slate-950/80 border border-slate-800 placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={creating || !resumeId || resumeId === 'new'}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
          >
            {creating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Layers className="h-3.5 w-3.5" />}
            Save Version
          </button>
        </form>

        {/* Global Comparison Trigger Bar */}
        {history.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-900/40 border border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Compare:</span>
              <select
                value={leftCompareId}
                onChange={(e) => setLeftCompareId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="">Select Left...</option>
                {history.map(v => (
                  <option key={v.id} value={v.id}>Version {v.versionNumber} ({v.reason || 'Manual'})</option>
                ))}
              </select>
              <span className="text-slate-500">with</span>
              <select
                value={rightCompareId}
                onChange={(e) => setRightCompareId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="current">Current Live Resume</option>
                {history.map(v => (
                  <option key={v.id} value={v.id}>Version {v.versionNumber} ({v.reason || 'Manual'})</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => startComparison(leftCompareId, rightCompareId)}
              disabled={compareLoading || !leftCompareId || !rightCompareId}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 disabled:opacity-50 transition-all flex items-center gap-1 shrink-0"
            >
              {compareLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <ArrowLeftRight className="h-3 w-3" />}
              Compare Side-by-Side
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3 text-slate-500">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-xs">Fetching version logs...</span>
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-10 leading-relaxed">
              No snapshot versions saved yet.<br />Accept AI suggestions or save manually to populate history.
            </p>
          ) : (
            history.map((version) => (
              <div
                key={version.id}
                className="p-3.5 rounded-2xl border border-slate-900 bg-slate-950/40 hover:border-slate-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">
                      Version {version.versionNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">•</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {new Date(version.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold truncate max-w-sm">
                    {version.reason || 'Manual Snapshot'}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {version.createdByAI ? (
                      <>
                        <Sparkles className="h-3 w-3 text-blue-400" />
                        <span className="text-blue-400">AI Generated</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" />
                        <span>User Manual</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Select for comparison */}
                  <button
                    onClick={() => {
                      setLeftCompareId(version.id);
                      setRightCompareId('current');
                      startComparison(version.id, 'current');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all text-xs flex items-center gap-1"
                    title="Compare this version with current live state"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    <span>Compare</span>
                  </button>

                  {/* Restore */}
                  <button
                    onClick={() => handleRestore(version)}
                    className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-950/20 border border-emerald-900/10 hover:border-emerald-500/30 transition-all text-xs flex items-center gap-1 font-bold"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>Restore</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
