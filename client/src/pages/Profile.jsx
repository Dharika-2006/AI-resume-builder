import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Key,
  ShieldCheck,
  FileText,
  Cpu,
  Sparkles,
  Award,
  Loader2,
  Save,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';

export default function Profile() {
  const { user, fetchProfile } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Profile Edit Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const response = await authService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('[fetchDashboardStats]', err);
      toast.error('Failed to load profile statistics.');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    if (password) {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
    }

    setUpdating(true);
    try {
      const response = await authService.updateProfile({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password.trim() || undefined,
      });

      if (response.success) {
        toast.success('Profile updated successfully! 🚀');
        setPassword('');
        setConfirmPassword('');
        await fetchProfile();
      } else {
        toast.error(response.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('[handleUpdateProfile]', err);
      const msg = err.response?.data?.message || 'Server error during update.';
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const getJoinDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper to render AI usage progress bars
  const getAiStatPercentage = (val, max = 20) => {
    return Math.min(Math.round((val / max) * 100), 100);
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
        
        {/* Title Heading */}
        <div className="border-b border-slate-800/50 pb-8 mb-8">
          <div className="flex items-center gap-3 text-indigo-400 font-medium text-sm tracking-wider uppercase">
            <User className="h-5 w-5" />
            <span>Profile Settings</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl tracking-tight text-white leading-none">
            Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Career Workspace
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
            Manage your account credentials, view automated metric audit summaries, and track your platform logs.
          </p>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cards & Metrics (7/12 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Orb */}
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/10 shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">{user?.name}</h2>
                  <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    <span>Member since: {getJoinDate(user?.createdAt)}</span>
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  Verified
                </div>
              </div>
            </motion.div>

            {/* Workspace Stats Panel */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Workspace Metrics
              </h3>
              
              {loadingStats ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3 rounded-3xl border border-slate-800 bg-slate-900/10">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="text-sm text-slate-400">Computing statistics...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Resumes */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 backdrop-blur-xl relative overflow-hidden flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Resumes</p>
                      <p className="text-2xl font-black text-white mt-1">{stats?.metrics?.totalResumes || 0}</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  {/* ATS Analyses */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 backdrop-blur-xl relative overflow-hidden flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">ATS Analyses</p>
                      <p className="text-2xl font-black text-white mt-1">{stats?.metrics?.totalAnalyses || 0}</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                      <Cpu className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  {/* AI Generations */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 backdrop-blur-xl relative overflow-hidden flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Generations</p>
                      <p className="text-2xl font-black text-white mt-1">{stats?.metrics?.aiGenerations || 0}</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  {/* Avg ATS Score */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 backdrop-blur-xl relative overflow-hidden flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Average ATS Score</p>
                      <p className="text-2xl font-black text-white mt-1">{stats?.metrics?.averageAtsScore || 0}%</p>
                    </div>
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Usage Breakdown */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-xl space-y-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-indigo-400" />
                AI Usage Statistics
              </h3>
              
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-slate-600 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary progress bar */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-350 mb-1.5">
                      <span>Executive Summary Generations</span>
                      <span>{stats?.aiStats?.SUMMARY || 0} calls</span>
                    </div>
                    <div className="h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${getAiStatPercentage(stats?.aiStats?.SUMMARY || 0)}%` }} />
                    </div>
                  </div>

                  {/* Experience polisher */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-350 mb-1.5">
                      <span>Experience Enhancement</span>
                      <span>{stats?.aiStats?.EXPERIENCE || 0} calls</span>
                    </div>
                    <div className="h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${getAiStatPercentage(stats?.aiStats?.EXPERIENCE || 0)}%` }} />
                    </div>
                  </div>

                  {/* Project enhancer */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-350 mb-1.5">
                      <span>Project Polishings</span>
                      <span>{stats?.aiStats?.PROJECT || 0} calls</span>
                    </div>
                    <div className="h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${getAiStatPercentage(stats?.aiStats?.PROJECT || 0)}%` }} />
                    </div>
                  </div>

                  {/* Skills suggests */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-350 mb-1.5">
                      <span>Skill Suggestion Inquiries</span>
                      <span>{stats?.aiStats?.SKILLS || 0} calls</span>
                    </div>
                    <div className="h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${getAiStatPercentage(stats?.aiStats?.SKILLS || 0)}%` }} />
                    </div>
                  </div>

                  {/* Resumes tailored */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-350 mb-1.5">
                      <span>Tailored Resumes</span>
                      <span>{stats?.aiStats?.TAILOR || 0} calls</span>
                    </div>
                    <div className="h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${getAiStatPercentage(stats?.aiStats?.TAILOR || 0)}%` }} />
                    </div>
                  </div>

                  {/* ATS Insights */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-350 mb-1.5">
                      <span>ATS Deep Insights Audit</span>
                      <span>{stats?.aiStats?.ATS_INSIGHTS || 0} calls</span>
                    </div>
                    <div className="h-2 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${getAiStatPercentage(stats?.aiStats?.ATS_INSIGHTS || 0)}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Account Settings (5/12 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-2xl relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Key className="h-5 w-5 text-indigo-400" />
                Account Settings
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="w-full pl-4 pr-4 py-3 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                    className="w-full pl-4 pr-4 py-3 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                  />
                </div>

                {/* Password Divider */}
                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-slate-800/60"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    Update Password (Optional)
                  </span>
                  <div className="flex-grow border-t border-slate-800/60"></div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-4 pr-4 py-3 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify new password"
                    className="w-full pl-4 pr-4 py-3 rounded-xl text-sm text-white bg-slate-950/80 border border-slate-800 placeholder-slate-650 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                  />
                </div>

                {/* Save Changes Button */}
                <motion.button
                  whileHover={{ scale: updating ? 1 : 1.02 }}
                  whileTap={{ scale: updating ? 1 : 0.98 }}
                  disabled={updating}
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/10 transition-all"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Account Settings
                    </>
                  )}
                </motion.button>

              </form>

            </div>
          </div>

        </div>

      </PageWrapper>
    </div>
  );
}
