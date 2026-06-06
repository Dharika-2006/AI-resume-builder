import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/10">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-black tracking-tight text-white">
              Resume<span className="text-cyan-400">AI</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#ats-demo" className="hover:text-white transition-colors">ATS Showroom</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider text-center md:text-right">
            &copy; {currentYear} ResumeAI. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
