import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  User,
  FileText,
  Cpu,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', path: '/resumes', icon: FileText },
    { name: 'ATS Analyzer', path: '/ats', icon: Cpu },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 font-bold text-white text-base">
                  R
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:opacity-90">
                Resume
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-slate-900 text-blue-400 border border-slate-800/60 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Profile Dropdown / Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold text-sm shadow-md shadow-blue-500/10">
                  {getInitials(user?.name)}
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium text-slate-300">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="px-3 py-2 border-b border-slate-800/60 mb-1.5">
                      <p className="text-sm font-semibold text-white truncate">
                        {user?.name || 'Full Name'}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {user?.email || 'email@example.com'}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Manage Profile
                    </Link>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-slate-900 text-blue-400 border border-slate-800'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                );
              })}

              <div className="border-t border-slate-800/60 my-3 pt-3">
                <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold text-base shadow-md">
                    {getInitials(user?.name)}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-white truncate leading-none">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-1 leading-none">
                      {user?.email || 'email@example.com'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
