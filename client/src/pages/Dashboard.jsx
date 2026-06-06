import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  FileText,
  Cpu,
  UserCog,
  Calendar,
  TrendingUp,
  Sparkles,
  Award,
  Sliders,
  Activity,
  Loader2,
  CheckCircle2,
  History
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';
import FeatureCard from '../components/FeatureCard';
import { quickActions } from '../constants/dashboardData';

// Map icon strings from constant data to actual components
const iconMap = {
  PlusCircle,
  FileText,
  Cpu,
  UserCog,
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper for greeting message based on time of day
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = (name) => {
    if (!name) return 'User';
    return name.split(' ')[0];
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await authService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('[fetchDashboardStats]', err);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    return `${diffDay}d ago`;
  };

  const renderTrendChart = () => {
    const history = stats?.scoreHistory || [];
    if (history.length < 2) {
      return (
        <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/20 text-xs text-slate-500 font-medium p-4 text-center">
          <TrendingUp className="h-6 w-6 text-slate-700 mb-2" />
          <span>Perform multiple ATS scans to generate score history graphs.</span>
        </div>
      );
    }

    const padding = 20;
    const chartWidth = 500;
    const chartHeight = 120;

    const points = history.map((item, idx) => {
      const x = padding + (idx * (chartWidth - 2 * padding)) / (history.length - 1);
      const y = chartHeight - padding - (item.score / 100) * (chartHeight - 2 * padding);
      return { x, y, score: item.score };
    });

    const pathD = points.reduce((acc, p, idx) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      return `${acc} L ${p.x} ${p.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

    return (
      <div className="w-full overflow-x-auto pt-2 custom-scrollbar">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[320px] h-32 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(51, 65, 85, 0.1)" strokeWidth="1" strokeDasharray="3" />
          <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(51, 65, 85, 0.1)" strokeWidth="1" strokeDasharray="3" />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(51, 65, 85, 0.2)" strokeWidth="1" />

          {/* Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="3.5" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="8" fill="#3b82f6" opacity="0" className="hover:opacity-20 transition-opacity" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1 py-0.5 rounded pointer-events-none">
                {p.score}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderAiUsageBreakdown = () => {
    const aiStats = stats?.aiStats || {};
    const categories = [
      { key: 'SUMMARY', label: 'Summary Optimizer', color: 'bg-blue-500', text: 'text-blue-400' },
      { key: 'EXPERIENCE', label: 'Experience Enhancer', color: 'bg-indigo-500', text: 'text-indigo-400' },
      { key: 'PROJECT', label: 'Project Refiner', color: 'bg-purple-500', text: 'text-purple-400' },
      { key: 'SKILLS', label: 'Skill Suggester', color: 'bg-teal-500', text: 'text-teal-400' },
      { key: 'TAILOR', label: 'Resume Tailoring', color: 'bg-cyan-500', text: 'text-cyan-400' },
      { key: 'ATS_INSIGHTS', label: 'ATS Auditor', color: 'bg-emerald-500', text: 'text-emerald-400' },
    ];

    const maxVal = Math.max(...categories.map(c => aiStats[c.key] || 0), 1);

    return (
      <div className="space-y-3 pt-2">
        {categories.map((cat) => {
          const val = aiStats[cat.key] || 0;
          const pct = Math.round((val / maxVal) * 100);
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-355">{cat.label}</span>
                <span className={`${cat.text} font-bold`}>{val} gen{val === 1 ? '' : 's'}</span>
              </div>
              <div className="h-1.5 bg-slate-950/60 rounded-full border border-slate-800/45 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full ${cat.color} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 -left-36 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[90px] pointer-events-none" />

      {/* Sticky Header */}
      <Navbar />

      <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Welcome Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800/50 pb-8 mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-blue-400 font-medium text-sm tracking-wider uppercase"
            >
              <Calendar className="h-4 w-4" />
              <span>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-2 text-3xl font-extrabold sm:text-4xl tracking-tight text-white leading-none"
            >
              {getGreeting()},{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {getFirstName(user?.name)}
              </span>
              !
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-3 text-slate-400 text-sm md:text-base max-w-xl leading-relaxed"
            >
              Ready to construct your next professional chapter? Utilize our
              advanced AI analyzers and builder systems to gain strategic career
              advantages.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl md:self-end"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Account Tier
              </p>
              <p className="text-sm font-bold text-white mt-0.5">
                Professional (Free)
              </p>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Statistics Panel */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Workspace Statistics
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="min-h-[115px] rounded-2xl border border-slate-850 bg-slate-900/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {/* Stat: Total Resumes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resumes</span>
                  <FileText className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.totalResumes || 0}</p>
              </motion.div>

              {/* Stat: ATS Scan Count */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analyses</span>
                  <Cpu className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.totalAnalyses || 0}</p>
              </motion.div>

              {/* Stat: AI Operations */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Gens</span>
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.aiGenerations || 0}</p>
              </motion.div>

              {/* Stat: AI Acceptance Rate */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Accept</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.aiAcceptanceRate || 0}%</p>
              </motion.div>

              {/* Stat: Versions Created */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Versions</span>
                  <History className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.versionsCreated || 0}</p>
              </motion.div>

              {/* Stat: Average ATS Score */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg ATS</span>
                  <Award className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.averageAtsScore || 0}%</p>
              </motion.div>

              {/* Stat: Best ATS Score */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Best ATS</span>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.bestAtsScore || 0}%</p>
              </motion.div>

              {/* Stat: Tailored Resumes Count */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-4 min-h-[115px] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tailored</span>
                  <Sliders className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-3xl font-black mt-2 text-white">{stats?.metrics?.tailoredResumesCount || 0}</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Features Hub and Feeds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Quick Actions & Trend Chart (7/12 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Actions Panel */}
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {quickActions.map((action, idx) => {
                  // Dynamically format badges for saved counts if available
                  let badge = action.badgeText;
                  if (action.title === 'My Resumes' && stats) {
                    badge = `${stats.metrics.totalResumes} Saved`;
                  }
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 * idx + 0.1 }}
                    >
                      <FeatureCard
                        title={action.title}
                        description={action.description}
                        icon={iconMap[action.iconName]}
                        badgeText={badge}
                        badgeType={action.badgeType}
                        linkTo={action.linkTo}
                        actionText={action.actionText}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic visual charts grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score History Graph */}
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between min-h-[240px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4.5 w-4.5 text-blue-400" />
                  ATS Score Trend History
                </h3>
                {loading ? (
                  <div className="h-32 flex items-center justify-center my-auto">
                    <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
                  </div>
                ) : (
                  <div className="my-auto">{renderTrendChart()}</div>
                )}
              </div>

              {/* AI Usage Breakdown */}
              <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl relative flex flex-col justify-between min-h-[240px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                  AI Optimization Breakdown
                </h3>
                {loading ? (
                  <div className="h-32 flex items-center justify-center my-auto">
                    <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
                  </div>
                ) : (
                  <div className="my-auto">{renderAiUsageBreakdown()}</div>
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Recent Activity (5/12 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl relative min-h-[460px]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6">
                <Activity className="h-4.5 w-4.5 text-indigo-400" />
                Recent Activity
              </h3>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <Loader2 className="h-7 w-7 text-indigo-500 animate-spin" />
                  <span className="text-xs text-slate-500">Retrieving log feed...</span>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {stats?.recentActivity?.map((activity, idx) => (
                      <li key={idx}>
                        <div className="relative pb-6">
                          {idx !== stats.recentActivity.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-800/60" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3 items-start">
                            <div>
                              <span className={`h-8 w-8 rounded-lg flex items-center justify-center ring-4 ring-slate-950 ${
                                activity.type.startsWith('AI_') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25' :
                                activity.type === 'ATS_SCAN' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' :
                                activity.type === 'RESUME_DUPLICATE' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25' :
                                activity.type === 'VERSION_CREATE' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25' :
                                activity.type === 'VERSION_RESTORE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                                'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                              }`}>
                                {activity.type.startsWith('AI_') ? <Sparkles className="h-4 w-4" /> :
                                 activity.type === 'ATS_SCAN' ? <Cpu className="h-4 w-4" /> :
                                 activity.type === 'VERSION_RESTORE' || activity.type === 'VERSION_CREATE' ? <History className="h-4 w-4" /> :
                                 <FileText className="h-4 w-4" />}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-xs text-slate-300 font-medium leading-relaxed">{activity.message}</p>
                              </div>
                              <div className="text-right text-[9px] whitespace-nowrap text-slate-550 font-bold uppercase tracking-wider pt-0.5">
                                {getRelativeTime(activity.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                    {!stats?.recentActivity?.length && (
                      <div className="text-center py-20 text-xs text-slate-500 leading-relaxed italic">
                        No activity recorded yet.<br />Create a resume or perform a scan to start logs.
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>

      </PageWrapper>
    </div>
  );
}
