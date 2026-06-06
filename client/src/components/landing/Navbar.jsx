import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Cpu className="h-5.5 w-5.5 animate-pulse" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent">
              Resume<span className="text-cyan-400">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('features')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('templates')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Templates
            </button>
            <button
              onClick={() => handleNavClick('ats-demo')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              ATS Showroom
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              FAQ
            </button>
          </div>

          {/* Desktop Call To Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/10 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-850 bg-slate-950/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <button
                onClick={() => handleNavClick('features')}
                className="text-left text-sm font-bold text-slate-455 hover:text-white py-2 uppercase tracking-wide"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('templates')}
                className="text-left text-sm font-bold text-slate-455 hover:text-white py-2 uppercase tracking-wide"
              >
                Templates
              </button>
              <button
                onClick={() => handleNavClick('ats-demo')}
                className="text-left text-sm font-bold text-slate-455 hover:text-white py-2 uppercase tracking-wide"
              >
                ATS Showroom
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="text-left text-sm font-bold text-slate-455 hover:text-white py-2 uppercase tracking-wide"
              >
                FAQ
              </button>

              <div className="border-t border-slate-850 pt-4 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/10"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
