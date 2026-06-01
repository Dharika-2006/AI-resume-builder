import { motion } from 'framer-motion';
import {
  PlusCircle,
  FileText,
  Cpu,
  UserCog,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';
import PageWrapper from '../components/PageWrapper';
import FeatureCard from '../components/FeatureCard';
import { dashboardStats, quickActions } from '../constants/dashboardData';

// Map icon strings from constant data to actual components
const iconMap = {
  PlusCircle,
  FileText,
  Cpu,
  UserCog,
};

export default function Dashboard() {
  const { user } = useAuthStore();

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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Stat: Total Resumes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-xl flex items-center justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <p className="text-sm text-slate-400 font-medium">
                  Total Resumes
                </p>
                <p className="text-2xl font-black mt-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {dashboardStats.resumes}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
            </motion.div>

            {/* Stat: ATS Scan Count */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-xl flex items-center justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <p className="text-sm text-slate-400 font-medium">
                  ATS Analyses
                </p>
                <p className="text-2xl font-black mt-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {dashboardStats.analyses}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Cpu className="h-5 w-5" />
              </div>
            </motion.div>

            {/* Stat: AI Operations */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-xl flex items-center justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
              <div>
                <p className="text-sm text-slate-400 font-medium">
                  AI Generations
                </p>
                <p className="text-2xl font-black mt-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {dashboardStats.generations}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <PlusCircle className="h-5 w-5" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature Actions Hub Grid */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, idx) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx + 0.1 }}
              >
                <FeatureCard
                  title={action.title}
                  description={action.description}
                  icon={iconMap[action.iconName]}
                  badgeText={action.badgeText}
                  badgeType={action.badgeType}
                  linkTo={action.linkTo}
                  actionText={action.actionText}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
